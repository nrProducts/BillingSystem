import React, { useState } from "react";
import { Modal, Input, InputNumber, Select, Button, Table, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

const AddItemsModal = (props) => {

  const userId = sessionStorage.getItem('userId');

  const handleAddRow = () => {
    props?.setFormItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        user_id : userId,
        category_id : "",
        name : "",
        price : null,
        error : {},
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    props?.setFormItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    props?.setFormItems((prev) => //props?.formItems
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
    const validated = props?.formItems.map((item) => {
      const error = {};
      if (!item.category_id) {
        error.category_id = "Required";
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
    props?.setFormItems(validated);
    return isValid;
  };

  const handleSubmit = () => {

    if (!validateItems()) {
      message.error("Please correct the errors before submitting.");
      return;
    }

    const isEdit = props?.formItems?.[0]?.isEdit ?? false;
    if(isEdit){
      const cleanedForEdit = props?.formItems.map(({ error, category, isEdit, ...rest }) => rest);
      props?.handleUpdate(cleanedForEdit?.[0]);
    }else{
      const cleanedForAdd = props?.formItems.map(({ id, error, category, ...rest }) => rest);
      props?.handleAdd(cleanedForAdd);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      width: 200,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Select
            value={record.category || undefined}
            placeholder="Select category"
            style={{ width: "100%", height: 40 }}
            onChange={(val,opt) => handleChange(record.id, "category_id", opt?.key)}
            
          >
            {props?.category.map((cat) => (
              <Option key={cat.id} value={cat.name}>
                {cat.name}
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
      width: 400,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
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
      width: 200,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Input
            value={record.price}
            placeholder="Enter price"
            style={{ height: 40 }}
            onChange={(e) => handleChange(record.id, "price", e.target.value)}
          />
          {record.error?.price && (
            <div style={{ color: "red", fontSize: 12 }}>{record.error.price}</div>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={props?.formItems?.length === 1}
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
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={props?.formItems?.[0]?.isEdit ? 'Edit Item' : 'Bulk Add Items'}
        open={props?.visibleForm}
        onCancel={() => props?.setVisibleForm(false)}
        onOk={handleSubmit}
        width={900}
        okText="Submit"
      >
        <Table
          dataSource={props?.formItems}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
        {props?.formItems?.[0]?.isEdit ? <></> : <Button
          onClick={handleAddRow}
          type="dashed"
          icon={<PlusOutlined />}
          block
          style={{ marginTop: 20 }}
        >
          Add Item Row
        </Button>}

      </Modal>
    </>
  );
};

export default AddItemsModal;
