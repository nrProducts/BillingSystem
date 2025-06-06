import React, { useEffect, useState } from "react";
import Bill from "./BillPerview";
import { createBillItems } from "../../../api/billItems";
import { createBills, updateBills } from "../../../api/bills";
import { notification, message } from 'antd';
import { addStageBillItems, getStageBillItemsByTableId, saveStageBillItems } from "../../../api/stage_bill_items";
import { useNavigate } from 'react-router-dom';
import { deleteStageBillItemsByTable, deleteStageBillItemsByBill } from "../../../api/stage_bill_items";
import { updateTable } from "../../../api/tables";
import { useUser } from "../../../context/UserContext";
import { printBill } from "../../../api/printerService";

const BillContainer = (props) => {

    const { selectedItems, setSelectedItems, handleRemove, tableDetails, setExistedItems, navState } = props;

    const { user } = useUser();
    const userId = user?.id;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [enableSave, setEnableSave] = useState(false);
    const [showPopConfirm, setShowPopConfirm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [generatedBill, setGeneratedBill] = useState(null);

    const paymentOptions = [
        { value: 'Cash', label: 'Cash' },
        { value: 'Card', label: 'Card' },
        { value: 'UPI', label: 'UPI' },
    ]

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const gstAmount = selectedItems.reduce((sum, item) => {
        if (item.gst_rate != null) {
            const itemTotal = item.price * item.quantity;
            return sum + itemTotal * (item.gst_rate / 100);
        }
        return sum;
    }, 0);

    const grandTotal = subtotal + gstAmount;

    useEffect(() => {
        if (tableDetails?.id) {
            fetchBillByTableId(tableDetails?.id);
        }
    }, [tableDetails])

    const fetchBillByTableId = async (id) => {
        try {
            setLoader(true);
            const { data, error } = await getStageBillItemsByTableId(id);

            if (error) {
                console.error('Error fetching table:', error);
            } else {
                const updatedData = data?.map(item => ({
                    ...item,
                    isStagedData: true
                }));
                setSelectedItems(updatedData);
                setExistedItems(updatedData);
                setEnableSave(updatedData?.length > 0)
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoader(false);
        }
    };

    const printBillWindow = async (bill, selectedItems, gstAmount, grandTotal) => {
        const billHtml = `
        <html>
        <head>
            <title>Bill Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f0f0f0; }
            </style>
        </head>
        <body>
            <h2>Bill ID: ${bill?.id}</h2>
            <p><strong>Total GST:</strong> ₹${gstAmount?.toFixed(2)}</p>
            <p><strong>Grand Total:</strong> ₹${grandTotal?.toFixed(2)}</p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>GST %</th>
                        <th>GST Amt</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedItems.map(item => {
            const itemTotal = item?.price * item?.quantity;
            const gstAmt = item.gst_rate ? itemTotal * (item.gst_rate / 100) : 0;
            const totalAmt = itemTotal + gstAmt;
            return `
                            <tr>
                                <td>${item?.name}</td>
                                <td>${item?.quantity}</td>
                                <td>₹${item?.price?.toFixed(2)}</td>
                                <td>${item?.gst_rate ?? 0}%</td>
                                <td>₹${gstAmt?.toFixed(2)}</td>
                                <td>₹${totalAmt?.toFixed(2)}</td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

        try {
            const result = await printBill(billHtml, bill?.id);
            if (result?.success) {
                notification.success({ message: 'Bill sent to printer' });
            } else {
                notification.error({ message: 'Print failed', description: result?.error });
            }
        } catch (err) {
            notification.error({ message: 'Print error', description: err.message });
        }
    };


    const handleGenerateBill = async (isTakeAway = false) => {
        if (selectedItems?.length === 0) return;

        try {
            setLoader(true);

            const billPayload = {
                total_gst: gstAmount,
                grand_total: grandTotal,
                user_id: userId,
                table_id: tableDetails?.id ? tableDetails?.id : null
            };

            const { data: bill, error: billError } = await createBills(billPayload);
            if (billError) throw new Error(billError || "Failed to create bill");
            setGeneratedBill(bill)

            const billItemsPayload = selectedItems.map((item) => {
                const itemTotal = item?.price * item?.quantity;
                const gstAmount = item?.gst_rate ? itemTotal * (item?.gst_rate / 100) : 0;

                return {
                    bill_id: bill?.id,
                    item_id: item?.isStagedData ? item?.item_id : item?.id,
                    quantity: item?.quantity,
                    price: item?.price,
                    gst_rate: item?.gst_rate ?? 0,
                    gst_amount: gstAmount,
                    total_amount: itemTotal + gstAmount,
                };
            });

            const { error: itemError, success } = await createBillItems(billItemsPayload);
            if (itemError) throw new Error(itemError);

            notification.success({
                message: "Success",
                description: "Bill has been generated successfully.",
                placement: "topRight",
            });

            if (!isTakeAway) {
                //printBillWindow(bill, selectedItems, gstAmount, grandTotal)
                setShowPopConfirm(true);
            }
            else {
                await handleKot(true, bill);
            }
            printBillWindow(bill, selectedItems, gstAmount, grandTotal)

        } catch (error) {
            console.error("Billing Error:", error);
            notification.error({
                message: "Error",
                description: error?.message || "Something went wrong during billing.",
                placement: "topRight",
            });
        } finally {
            setLoader(false);
        }
    };

    const handleKot = async (isTakeAway = false, bill = null) => {
        if (selectedItems?.length === 0) return;
        try {
            setLoader(true);

            const stageBillItemsPayload = selectedItems.map((item) => {
                const itemTotal = item?.price * item?.quantity;
                const gstAmount = item?.gst_rate ? itemTotal * (item?.gst_rate / 100) : 0;

                return {
                    id: 0,
                    item_id: item?.id,
                    name: item?.name,
                    quantity: item?.quantity,
                    user_id: userId,
                    table_id: tableDetails?.id ? tableDetails?.id : null,
                    bill_id: isTakeAway ? bill?.id : null,
                    price: item?.price,
                    gst_rate: item?.gst_rate ?? 0,
                    gst_amount: gstAmount,
                    total_amount: itemTotal + gstAmount,
                    pending_quantity: item?.quantity
                };

            });

            const { data, error, success } = await saveStageBillItems(stageBillItemsPayload);
            if (error) throw new Error(error || "Failed to create bill");

            if (isTakeAway) {
                setShowPopConfirm(true);
            }

            if (!isTakeAway) {
                console.info('test2')
                notification.success({
                    message: "Success",
                    description: "Item has been added successfully.",
                    placement: "topRight",
                });
                setSelectedItems([]);
                // navigate('/tableManager');
                if (tableDetails?.id)
                    fetchBillByTableId(tableDetails?.id);
            }

            if (tableDetails?.id) {
                const updatedtableDetails = {
                    ...tableDetails,
                    is_active: true,
                    status: 'occupied'
                };
                await updateTable(updatedtableDetails?.id, updatedtableDetails)
            }
        } catch (error) {
            console.error("Billing Error:", error);
            notification.error({
                message: "Error",
                description: error?.message || "Something went wrong during billing.",
                placement: "topRight",
            });
        } finally {
            setLoader(false);
        }
    }

    const handleSaveStagedItems = async () => {
        if (selectedItems?.length === 0) return;
        try {
            setLoader(true);

            const oldStagedItems = await getStageBillItemsByTableId(tableDetails?.id);

            const stageBillItemsPayload = selectedItems.map((item) => {
                const itemTotal = item?.price * item?.quantity;
                const gstAmount = item?.gst_rate ? itemTotal * (item?.gst_rate / 100) : 0;

                const oldItem = oldStagedItems?.data?.find(
                    (old) => old.id === item?.id
                );

                let status = item?.status ?? "pending";

                if (oldItem && item?.quantity > oldItem?.quantity) {
                    status = "pending";
                }

                return {
                    id: item?.isStagedData ? item?.id : 0,
                    item_id: item?.isStagedData ? item?.item_id : item?.id,
                    name: item?.name,
                    quantity: item?.quantity,
                    user_id: userId,
                    table_id: tableDetails.id,
                    price: item?.price,
                    gst_rate: item?.gst_rate ?? 0,
                    gst_amount: gstAmount,
                    total_amount: itemTotal + gstAmount,
                    pending_quantity: item?.pending_quantity ?? item?.quantity,
                    status,
                };
            });

            console.log('stageBillItemsPayload', stageBillItemsPayload)
            const { data, error } = await saveStageBillItems(stageBillItemsPayload);
            if (error) throw new Error(error || "Failed to create bill");

            if (tableDetails?.id)
                fetchBillByTableId(tableDetails?.id);

            notification.success({
                message: "Success",
                description: "Item has been saved successfully.",
                placement: "topRight",
            });
        } catch (error) {
            console.error("Billing Error:", error);
            notification.error({
                message: "Error",
                description: error?.message || "Something went wrong during billing.",
                placement: "topRight",
            });
        } finally {
            setLoader(false);
        }
    }

    const onChoosePayment = (e) => {
        console.info(e?.target?.value, 'value');
        setPaymentMethod(e?.target?.value);
    };

    const savePaymentMethod = async () => {
        if (!paymentMethod) {
            message.warning("Please select a payment method before saving.");
            return;
        }

        if (generatedBill) {
            console.info(generatedBill, 'billing');

            const updatedBill = {
                ...generatedBill,
                payment_mood: paymentMethod,
            };

            await updateBills(updatedBill.id, updatedBill);
        }
        setSelectedItems([]);
        setShowPopConfirm(false);
        setLoader(false);
        setPaymentMethod('');

        if (tableDetails) {
            await deleteStageBillItemsByTable(tableDetails?.id)
            const updatedtableDetails = {
                ...tableDetails,
                is_active: false,
                status: 'open'
            };
            await updateTable(updatedtableDetails?.id, updatedtableDetails)
        }

        if (tableDetails || navState?.source === 'TakeAway') {
            navigate('/tableManager');
        }
    };


    const billingDetails = {
        subtotal: subtotal,
        gstAmount: gstAmount,
        total: grandTotal
    }

    return (
        <Bill
            selectedItems={selectedItems}
            billingDetails={billingDetails}
            handleRemove={handleRemove}
            handleGenerateBill={handleGenerateBill}
            loader={loader}
            handleKot={handleKot}
            handleSaveStagedItems={handleSaveStagedItems}
            enableSave={enableSave}
            setEnableSave={setEnableSave}
            showPopConfirm={showPopConfirm}
            setShowPopConfirm={setShowPopConfirm}
            onChoosePayment={onChoosePayment}
            paymentMethod={paymentMethod}
            paymentOptions={paymentOptions}
            savePaymentMethod={savePaymentMethod}
            tableDetails={tableDetails}
            navState={navState}
        />
    );
}

export default BillContainer