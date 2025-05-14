import React, { useEffect, useState } from "react";
import { fetchStageBillItems } from "../../api/stage_bill_items";
import './kitchen.css'
import { Spin } from "antd";


const Kitchen = () => {
    const [kitchenItems, setKitchenItems] = useState({});
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchStagedItems();
        }, 10000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchStagedItems();
    }, []);

    const groupByTableOrBill = (items) => {
        return items.reduce((acc, item) => {
            const key = item.table_id !== null ? `Dine In - Table ${item.table_id}` : `Takeaway - Bill ${item.bill_id}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    };

    const fetchStagedItems = async () => {
        try {
            setLoader(true);
            const { data, error } = await fetchStageBillItems();

            if (error) {
                console.error('Error fetching staged items:', error);
            } else {
                const groupedItems = groupByTableOrBill(data);
                setKitchenItems(groupedItems);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoader(false);
        }
    };

    return (
        <Spin spinning={loader}>
            <div className="shared-layout-container kitchen-container">
                <div className="shared-table-section">
                    <h3 style={{ margin: 0, paddingBottom: 10, borderBottom: '1px solid rgba(206, 206, 206, 0.5)' }}>Kitchen</h3>

                    {Object.entries(kitchenItems).map(([groupKey, items]) => (
                        <div key={groupKey} className="kitchen-group">
                            <h3 className="kitchen-group-title">{groupKey}</h3>
                            <div className="kitchen-items-grid">
                                {items.map(item => (
                                    <div key={item?.id} className="kitchen-item-card">
                                        <div className="kitchen-item-details">
                                            <span className="item-quantity">{item?.quantity} x</span>
                                            <span className="item-name">{item?.name}</span>
                                            <span className="item-price">₹{item?.total_amount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Spin>



    );
};

export default Kitchen;
