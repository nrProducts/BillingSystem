import React, { useEffect, useState } from "react";
import { fetchStageBillItems, deleteStageBillItems, updateStageBillItems } from "../../api/stage_bill_items";
import "./kitchen.css";
import { Spin, Modal, Button, Checkbox, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const Kitchen = () => {
    const [kitchenItems, setKitchenItems] = useState({});
    const [loader, setLoader] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalItems, setModalItems] = useState([]);
    const [currentGroupKey, setCurrentGroupKey] = useState('');

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

    const handleItemRemovalConfirm = async (item, isFrom) => {
        let result;

        if (isFrom === 'Takeaway') {
            result = await removeItem(item);
        } else {
            result = await updateStagedItems(item);
        }

        if (result?.error) {
            notification.error({
                message: "Error",
                description: result?.error?.message || "Something went wrong during billing.",
                placement: "topRight",
            });
        } else {
            notification.success({
                message: 'Success',
                description: `Removed "${item?.name}".`,
                placement: 'topRight',
            });
        }

        fetchStagedItems();
    };

    const showRemoveConfirm = (item, isFrom) => {
        Modal.confirm({
            title: "Item Served?",
            content: `Remove "${item.name}" from kitchen list?`,
            okText: "Yes",
            cancelText: "Cancel",
            okButtonProps: { style: { backgroundColor: "#d6085e", color: "#fff" } },
            onOk() { handleItemRemovalConfirm(item, isFrom); },
        });
    };

    const handleGroupRemoveClick = (groupKey, items) => {
        console.info("remove all", groupKey, items)
        setCurrentGroupKey(groupKey);
        setModalItems(items);
        setSelectedItems([]);
        setShowGroupModal(true);
    };

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const updateStagedItems = async (item) => {        
        const updatedItem = { ...item, status: 'served' };        
        await updateStageBillItems(item?.id, updatedItem);
    }


    const handleGroupRemovalConfirm = async () => {
        const itemsToRemove = modalItems.filter(item => selectedItems.includes(item.id));
        let hasError = false;

        for (let item of itemsToRemove) {
            let result;
            if (item.table_id !== null) {
                result = await updateStagedItems(item);
            } else {
                result = await removeItem(item);
            }

            if (result?.error) {
                hasError = true;
                notification.error({
                    message: "Error",
                    description: result.error.message || "Failed to process some items.",
                    placement: "topRight",
                });
            }
        }

        setShowGroupModal(false);
        setSelectedItems([]);
        fetchStagedItems();

        if (!hasError) {
            notification.success({
                message: "Success",
                description: "Selected items processed successfully.",
                placement: "topRight",
            });
        }
    };


    const removeItem = async (item) => {
        console.log("Removing", item);
        await deleteStageBillItems(item?.id)
    };

    const dineInItems = {};
    const takeawayItems = {};
    Object.entries(kitchenItems).forEach(([key, value]) => {
        if (key.startsWith("Dine In")) dineInItems[key] = value;
        else takeawayItems[key] = value;
    });

    return (
        <Spin spinning={loader}>
            <div className="kitchen-split-container">
                <div className="kitchen-column">
                    <h3>Dine In</h3>
                    {Object.entries(dineInItems).map(([groupKey, items]) => (
                        <div key={groupKey} className="kitchen-group">
                            <div className="kitchen-group-header">
                                <h4 className="kitchen-group-title">{groupKey}</h4>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => handleGroupRemoveClick(groupKey, items)}
                                    style={{ backgroundColor: "#d6085e", color: "#fff" }}
                                >
                                    Remove Items
                                </Button>
                            </div>
                            <div className="kitchen-items-grid">
                                {items.map((item) => (
                                    <div
                                        key={item?.id}
                                        className="kitchen-item-card"
                                        onMouseEnter={() => setHoveredItem(item?.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <div className="kitchen-item-details">
                                            <span className="item-quantity">{item?.quantity} x</span>
                                            <span className="item-name">{item?.name}</span>
                                            {hoveredItem === item?.id && (
                                                <CloseOutlined
                                                    className="remove-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showRemoveConfirm(item, 'DineIn');
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="kitchen-column">
                    <h3>Takeaway</h3>
                    {Object.entries(takeawayItems).map(([groupKey, items]) => (
                        <div key={groupKey} className="kitchen-group">
                            <div className="kitchen-group-header">
                                <h4 className="kitchen-group-title">{groupKey}</h4>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => handleGroupRemoveClick(groupKey, items)}
                                    style={{ backgroundColor: "#d6085e", color: "#fff" }}
                                >
                                    Remove Items
                                </Button>
                            </div>
                            <div className="kitchen-items-grid">
                                {items.map((item) => (
                                    <div
                                        key={item?.id}
                                        className="kitchen-item-card"
                                        onMouseEnter={() => setHoveredItem(item?.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <div className="kitchen-item-details">
                                            <span className="item-quantity">{item?.quantity} x</span>
                                            <span className="item-name">{item?.name}</span>
                                            {hoveredItem === item?.id && (
                                                <CloseOutlined
                                                    className="remove-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showRemoveConfirm(item, 'Takeaway');
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                title={`Mark items in ${currentGroupKey} as served?`}
                open={showGroupModal}
                onCancel={() => setShowGroupModal(false)}
                onOk={handleGroupRemovalConfirm}
                okText="Remove Selected"
                cancelText="Cancel"
                okButtonProps={{ style: { backgroundColor: "#d6085e", color: "#fff" } }}
            >
                <p>Select the items you want to remove:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {modalItems.map((item) => (
                        <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                            <span>{item.quantity} x {item.name}</span>
                        </label>
                    ))}
                </div>
            </Modal>

        </Spin>
    );
};

export default Kitchen;
