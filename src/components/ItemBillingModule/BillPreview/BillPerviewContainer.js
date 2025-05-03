import React, { useState } from "react";
import Bill from "./BillPerview";
import { createBillItems } from "../../../api/billItems";
import { createBills } from "../../../api/bills";
import { notification } from 'antd';

const BillContainer = (props) => {

    const [loader, setLoader] = useState(false);
    const { selectedItems, setSelectedItems, handleRemove } = props;
    const userId = sessionStorage.getItem('userId');

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
                <h2>Bill ID: ${bill.id}</h2>
                <p><strong>Total GST:</strong> ₹${gstAmount.toFixed(2)}</p>
                <p><strong>Grand Total:</strong> ₹${grandTotal.toFixed(2)}</p>
    
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
            const itemTotal = item.price * item.quantity;
            const gstAmt = item.gst_rate ? itemTotal * (item.gst_rate / 100) : 0;
            const totalAmt = itemTotal + gstAmt;
            return `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.price.toFixed(2)}</td>
                                    <td>${item.gst_rate ?? 0}%</td>
                                    <td>₹${gstAmt.toFixed(2)}</td>
                                    <td>₹${totalAmt.toFixed(2)}</td>
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


    const handleGenerateBill = async () => {
        if (selectedItems.length === 0) return;

        try {
            setLoader(true);

            const billPayload = {
                total_gst: gstAmount,
                grand_total: grandTotal,
                user_id: userId,
            };

            const { data: bill, error: billError } = await createBills(billPayload);
            if (billError) throw new Error(billError || "Failed to create bill");

            const billItemsPayload = selectedItems.map((item) => {
                const itemTotal = item.price * item.quantity;
                const gstAmount = item.gst_rate ? itemTotal * (item.gst_rate / 100) : 0;

                return {
                    bill_id: bill.id,
                    item_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    gst_rate: item.gst_rate ?? 0,
                    gst_amount: gstAmount,
                    total_amount: itemTotal + gstAmount,
                };
            });

            const { error: itemError } = await createBillItems(billItemsPayload);
            if (itemError) throw new Error(itemError);

            notification.success({
                message: "Success",
                description: "Bill has been generated successfully.",
                placement: "topRight",
            });


            printBillWindow(bill, selectedItems, gstAmount, grandTotal)
            setSelectedItems([]);
        } catch (error) {
            console.error("Billing Error:", error);
            notification.error({
                message: "Error",
                description: error.message || "Something went wrong during billing.",
                placement: "topRight",
            });
        } finally {
            setLoader(false);
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
        />
    );
}

export default BillContainer