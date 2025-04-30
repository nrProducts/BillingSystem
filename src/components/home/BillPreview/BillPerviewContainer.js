import React, { useEffect } from "react";
import Bill from "./BillPerview";
import { createBillItems } from "../../../api/billItems";
import { createBills } from "../../../api/bills";

const BillContainer = (props) => {

    const {selectedItems, setSelectedItems, handleRemove} = props;    
    const userId = sessionStorage.getItem('userId');

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const gstAmount = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity * ((item.gst_rate || 0) / 100),
        0
    );

    const grandTotal = subtotal + gstAmount;

    const handleGenerateBill = async () => {
        if (selectedItems.length === 0) return;

        const billDetails = {
            total_gst: gstAmount,
            grand_total: grandTotal,
            user_id: userId,
        };
        const { data: bill, error: billError } = await createBills(billDetails)
        debugger;
        if (billError) {
            console.error("Error creating bill:", billError);
            return;
        }

        const billItems = selectedItems.map((item) => {
            const itemTotal = item.price * item.quantity;
            const gstAmount = itemTotal * (item.gst_rate / 100);
            return {
                bill_id: bill.id,
                item_id: item.id,
                quantity: item.quantity,
                price: item.price,
                gst_rate: item.gst_rate,
                gst_amount: gstAmount,
                total_amount: itemTotal + gstAmount,
            };
        });

        const { error: itemError } = await createBillItems(billItems)

        if (itemError) {
            console.error("Error adding bill items:", itemError);
            return;
        }

        // message.success("Bill generated successfully!");
        setSelectedItems([]);
    };

    const billingDetails = {
        subtotal: subtotal,
        gstAmount: gstAmount,
        total: grandTotal
    }

    return <Bill selectedItems={selectedItems} billingDetails={billingDetails} handleRemove={handleRemove} handleGenerateBill={handleGenerateBill} />
}

export default BillContainer