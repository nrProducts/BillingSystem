import React, { useState } from "react";
import { Modal, Input, InputNumber, Select, Button, Table, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "electronics", label: "Electronics" },
  { value: "groceries", label: "Groceries" },
  { value: "clothing", label: "Clothing" },
];

const AddItemsModal = () => {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        category: "",
        name: "",
        price: null,
        error: {},
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              error: { ...item.error, [field]: null },
            }
          : item
      )
    );
  };

  const validateItems = () => {
    let isValid = true;
    const validated = items.map((item) => {
      const error = {};
      if (!item.category) {
        error.category = "Required";
        isValid = false;
      }
      if (!item.name?.trim()) {
        error.name = "Required";
        isValid = false;
      }
      if (item.price === null || isNaN(item.price)) {
        error.price = "Required";
        isValid = false;
      }
      return { ...item, error };
    });
    setItems(validated);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateItems()) {
      message.error("Please correct the errors before submitting.");
      return;
    }

    const cleaned = items.map(({ id, error, ...rest }) => rest);
    console.log("✅ Submitted items:", cleaned);
    setVisible(false);
    setItems([]);
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      render: (_, record) => (
        <div>
          <Select
            value={record.category}
            placeholder="Select category"
            style={{ width: "100%", height: 40 }}
            onChange={(val) => handleChange(record.id, "category", val)}
          >
            {categoryOptions.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
          {record.error?.category && (
            <div style={{ color: "red", fontSize: 12 }}>{record.error.category}</div>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <div>
          <Input
            value={record.name}
            placeholder="Enter item name"
            style={{ height: 40 }}
            onChange={(e) => handleChange(record.id, "name", e.target.value)}
          />
          {record.error?.name && (
            <div style={{ color: "red", fontSize: 12 }}>{record.error.name}</div>
          )}
        </div>
      ),
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      render: (_, record) => (
        <div>
          <InputNumber
            value={record.price}
            placeholder="Enter price"
            style={{ width: "100%", height: 40 }}
            min={0}
            step={0.01}
            onChange={(val) => handleChange(record.id, "price", val)}
            stringMode
            controls={false}
          />
          {record.error?.price && (
            <div style={{ color: "red", fontSize: 12 }}>{record.error.price}</div>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(record.id)}
          style={{
            height: 40,
            width: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => {
        setItems([{ id: uuidv4(), category: "", name: "", price: null, error: {} }]);
        setVisible(true);
      }}>
        Bulk Add Items
      </Button>

      <Modal
        title="Bulk Add Items"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        width={900}
        okText="Submit"
      >
        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
        <Button
          onClick={handleAddRow}
          type="dashed"
          icon={<PlusOutlined />}
          block
          style={{ marginTop: 20 }}
        >
          Add Item Row
        </Button>
      </Modal>
    </>
  );
};

export default AddItemsModal;
