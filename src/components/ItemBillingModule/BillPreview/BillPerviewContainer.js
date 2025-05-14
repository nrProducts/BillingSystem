import React, { useEffect, useState } from "react";
import Bill from "./BillPerview";
import { createBillItems } from "../../../api/billItems";
import { createBills, updateBills } from "../../../api/bills";
import { notification } from 'antd';
import { addStageBillItems, getStageBillItemsByTableId, saveStageBillItems } from "../../../api/stage_bill_items";
import { useNavigate } from 'react-router-dom';
import { deleteStageBillItemsByTable, deleteStageBillItemsByBill } from "../../../api/stage_bill_items";
import { updateTable } from "../../../api/tables";

const BillContainer = (props) => {

    const { selectedItems, setSelectedItems, handleRemove, tableDetails, setExistedItems, navState } = props;

    const userId = sessionStorage.getItem('userId');
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

    // Function to call the backend to print the bill
    const printBillFromBackend = async (bill, items) => {
        try {
            const response = await fetch('http://localhost:5000/print', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bill, items }),
            });

            if (!response.ok) {
                throw new Error('Failed to print bill');
            }

            const data = await response.text();
            console.log(data); // Print the response from the backend
        } catch (error) {
            console.error('Error during print request:', error);
        }
    };

    // Generate bill content for printing
    const printBillWindow = (bill, selectedItems, gstAmount, grandTotal) => {
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        if (!newWindow) return;

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
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    };
                </script>
            </body>
            </html>
        `;

        newWindow.document.open();
        newWindow.document.write(billHtml);
        newWindow.document.close();
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

            console.info(bill, 'bill')
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


            // printBillWindow(bill, selectedItems, gstAmount, grandTotal)
            // setSelectedItems([]);
            if (!isTakeAway) {
                printBillWindow(bill, selectedItems, gstAmount, grandTotal)
                setShowPopConfirm(true);
            }
            else{
                await handleKot(true, bill);
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
    };

    const handleKot = async (isTakeAway = false, bill = null) => {
        console.info('test')
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

            const stageBillItemsPayload = selectedItems.map((item) => {
                const itemTotal = item?.price * item?.quantity;
                const gstAmount = item?.gst_rate ? itemTotal * (item?.gst_rate / 100) : 0;

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

        if (tableDetails) {
            await deleteStageBillItemsByTable(tableDetails?.id)
            const updatedtableDetails = {
                ...tableDetails,
                is_active: false,
                status: 'open'
            };
            await updateTable(updatedtableDetails?.id, updatedtableDetails)
        }
        navigate('/tableManager');
    };


    const billingDetails = {
        subtotal: subtotal,
        gstAmount: gstAmount,
        total: grandTotal
    }

    console.info(navState?.source, "navState")

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