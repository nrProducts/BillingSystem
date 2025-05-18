import React, { useEffect, useState } from "react";
import { fetchStageBillItems, updateStageBillItems, deleteStageBillItemsByTable, deleteStageBillItemsByBill } from "../../api/stage_bill_items";
import "./kitchen.css";
import { Spin, Modal, notification, Checkbox } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const Kitchen = () => {
    const [kitchenItems, setKitchenItems] = useState({});
    const [loader, setLoader] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [currentGroupKey, setCurrentGroupKey] = useState('');
    const [orderFrom, setOrderFrom] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            fetchStagedItems();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchStagedItems();
    }, []);

    const groupByTableOrBill = (items) => {
        return items.reduce((acc, item) => {
            const key = item.table_id !== null ? `Dine In - Table ${item.table_id}` : `Takeaway - Bill ${item.bill_id}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    };

    const fetchStagedItems = async () => {
        try {
            setLoader(true);
            const { data, error } = await fetchStageBillItems();
            if (error) console.error("Error fetching staged items:", error);
            else setKitchenItems(groupByTableOrBill(data));
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoader(false);
        }
    };

    const handleMarkServed = async (item) => {
        const result = await updateStagedItems(item, 'served');
        if (result?.error) {
            notification.error({
                message: "Error",
                description: result?.error?.message || "Something went wrong during billing.",
                placement: "topRight",
            });
        } else {
            notification.success({
                message: 'Success',
                description: `"${item?.name}" - Item updated to served`,
                placement: 'topRight',
            });
        }
        await fetchStagedItems();
    };


    const handleGroupRemoveClick = (groupKey, items, isFrom) => {
        setCurrentGroupKey(groupKey);
        setModalItems(items);
        setOrderFrom(isFrom);
        console.info(items, 'items')
        const allServed = items.every(item => item?.status === "served");
        console.info(allServed, 'all')
        if (allServed) {
            handleGroupRemovalConfirm(items, isFrom);
        } else {
            setShowGroupModal(true);
        }
    };

    const updateStagedItems = async (item, status) => {
        const updatedItem = {
            ...item,
            status: status,
            pending_quantity: item?.quantity
        };
        await updateStageBillItems(item?.id, updatedItem);
    }


    const handleGroupRemovalConfirm = async (items, isFrom) => {
        setLoader(true);
        let hasError = false;

        for (let item of items) {
            let result = isFrom === "Takeaway"
                ? await deleteStageBillItemsByBill(item?.bill_id)
                : await updateStagedItems(item, "ready_for_billing"); // both should await

            if (result?.error) {
                hasError = true;
                notification.error({
                    message: "Error",
                    description: result.error.message || "Failed to process some items.",
                    placement: "topRight",
                });
            }
        }

        if (!hasError) {
            const groupType = isFrom === "Takeaway" ? "Takeaway" : "Dine In";
            notification.success({
                message: "Success",
                description: `The ${groupType} items successfully closed`,
                placement: "topRight",
            });
        }
        setShowGroupModal(false);
        await fetchStagedItems();
        setLoader(false);
    };

    const dineInItems = {};
    const takeawayItems = {};
    Object.entries(kitchenItems).forEach(([key, value]) => {
        if (key.startsWith("Dine In")) dineInItems[key] = value;
        else takeawayItems[key] = value;
    });

    return (
        <Spin spinning={loader}>
            <div className="shared-layout-container">
                <div className="shared-table-section-k">
                    <h3>Dine In</h3>
                    {Object.entries(dineInItems).map(([groupKey, items]) => (
                        <div key={groupKey} className="kitchen-group">
                            <div className="kitchen-group-header">
                                <h4 className="kitchen-group-title">{groupKey}</h4>
                                <div
                                    size="small"
                                    danger
                                    onClick={() => handleGroupRemoveClick(groupKey, items, "DineIn")}
                                    class="btn-remove"
                                >
                                    Close
                                </div>
                            </div>
                            <div className="kitchen-items-grid">
                                {items.map((item) => {
                                    const isHovered = hoveredItem === item?.id;
                                    const isServed = item?.status == "served";
                                    return (
                                        <div
                                            key={item?.id}
                                            className="kitchen-item-card"
                                            onMouseEnter={() => setHoveredItem(item?.id)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            style={{
                                                backgroundColor: isServed ? "#f6ffed" : undefined,
                                            }}
                                        >
                                            <div className="kitchen-item-details">
                                                <span className="item-quantity">{
                                                    item?.quantity === item?.pending_quantity
                                                        ? item?.quantity
                                                        : Math.abs((item?.quantity || 0) - (item?.pending_quantity || 0))
                                                } x</span>
                                                <span className="item-name">{item?.name}</span>
                                                {isServed ? (
                                                    <CheckOutlined className="served-icon" />
                                                ) : isHovered && (
                                                    <Checkbox

                                                        className="served-checkbox"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkServed(item);
                                                        }}
                                                    />
                                                )}

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="shared-side-section-k">
                    <h3>Takeaway</h3>
                    {Object.entries(takeawayItems).map(([groupKey, items]) => (
                        <div key={groupKey} className="kitchen-group">
                            <div className="kitchen-group-header">
                                <h4 className="kitchen-group-title">{groupKey}</h4>
                                <div
                                    size="small"
                                    danger
                                    onClick={() => handleGroupRemoveClick(groupKey, items, "Takeaway")}
                                    class="btn-remove"
                                >
                                    Close
                                </div>
                            </div>
                            <div className="kitchen-items-grid">
                                {items.map((item) => {
                                    const isHovered = hoveredItem === item?.id;
                                    const isServed = item?.status == "served";
                                    return (
                                        <div
                                            key={item?.id}
                                            className="kitchen-item-card"
                                            onMouseEnter={() => setHoveredItem(item?.id)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            style={{
                                                backgroundColor: isServed ? "#f6ffed" : undefined,
                                            }}
                                        >
                                            <div className="kitchen-item-details">
                                                <span className="item-quantity">{
                                                    item?.quantity === item?.pending_quantity
                                                        ? item?.quantity
                                                        : Math.abs((item?.quantity || 0) - (item?.pending_quantity || 0))
                                                } x</span>
                                                <span className="item-name">{item?.name}</span>

                                                {isServed ? (
                                                    <CheckOutlined className="served-icon" />
                                                ) : isHovered && (
                                                    <Checkbox
                                                        className="served-checkbox"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkServed(item);
                                                        }}
                                                    />
                                                )}

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                title={`Still some items in ${currentGroupKey} are not served`}
                open={showGroupModal}
                onCancel={() => setShowGroupModal(false)}
                onOk={() => setShowGroupModal(false)}
                okText="Ok"
                cancelText="Cancel"
                okButtonProps={{ style: { backgroundColor: "#d6085e", color: "#fff" } }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {modalItems.map((item) =>
                        item?.status === "pending" ? (
                            <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span>{item.quantity} x {item.name}</span>
                            </label>
                        ) : null
                    )}
                </div>
            </Modal>

        </Spin>
    );
};

export default Kitchen;
