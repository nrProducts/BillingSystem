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

    const handleGenerateBill = async () => {
        if (selectedItems.length === 0) return;
        setLoader(true);

        const billDetails = {
            total_gst: gstAmount,
            grand_total: grandTotal,
            user_id: userId,
        };
        const { data: bill, error: billError } = await createBills(billDetails)
        if (billError) {
            console.error("Error creating bill:", billError);
            setLoader(false);
            return;
        }

        const billItems = selectedItems.map((item) => {
            const itemTotal = item.price * item.quantity;
            const gstAmount = item.gst_rate != null ? itemTotal * (item.gst_rate / 100) : 0;
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

        const { error: itemError } = await createBillItems(billItems)

        if (itemError) {
            console.error("Error adding bill items:", itemError);
            setLoader(false);
            return;
        }

        notification.success({
            message: "Success",
            description: "Bill has been generated successfully.",
            placement: "topRight", // or "bottomRight", "bottomLeft", etc.
        });
        setLoader(false);
        setSelectedItems([]);
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