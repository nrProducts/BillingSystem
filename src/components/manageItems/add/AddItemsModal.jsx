import React, { useState } from "react";
import { Modal, Input, InputNumber, Select, Button, Table, message, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

const AddItemsModal = (props) => {

  const userId = sessionStorage.getItem('userId');
  const [saveDisable, setSaveDisable] = useState(false);


  const handleAddRow = () => {
    props?.setFormItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        user_id: userId,
        category_id: "",
        name: "",
        price: null,
        gst_rate: null,
        hsn_code: "",
        error: {},
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    props?.setFormItems((prev) => prev.filter((item) => item.id !== id));
  };


  const handleChange = (id, field, value) => {
    props?.setFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // Start with existing errors
        const updatedError = { ...item.error };

        // Field-specific validation logic
        switch (field) {
          case "category_id":
            updatedError.category_id = value ? null : "Required";
            break;
          case "name":
            updatedError.name = value?.trim() ? null : "Required";
            break;
          case "price":
            const hasLetters = /[a-zA-Z]/.test(value);
            const isNumber = value !== null && !isNaN(value);
            if (hasLetters) {
              updatedError.price = "Only numbers";
            } else if (!isNumber) {
              updatedError.price = "Required";
            } else {
              updatedError.price = null;
            }
            break;
          case "gst_rate":
            const num = parseFloat(value);
            if (value === "") {
              updatedError.gst_rate = null;
            } else if (isNaN(num) || num < 0 || num > 100) {
              updatedError.gst_rate = "Please enter a valid GST rate (0–100%)";
            } else {
              updatedError.gst_rate = null;
            }
            break;
          // Add more field-level validations here if needed
          default:
            break;
        }

        return {
          ...item,
          [field]: value,
          error: updatedError,
        };
      })
    );
    setSaveDisable(true);
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
      if (!item.price) {
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
    if (isEdit) {
      const cleanedForEdit = props?.formItems.map(({ error, category, isEdit, ...rest }) => rest);
      props?.handleUpdate(cleanedForEdit?.[0]);
      setSaveDisable(false)
    } else {
      const cleanedForAdd = props?.formItems.map(({ id, error, category, ...rest }) => rest);
      props?.handleAdd(cleanedForAdd);
      setSaveDisable(false)
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      width: 200,
      render: (_, record) => (
        <div style={{ display: "flex", fontSize: 12, flexDirection: "column" }}>
          <Select
            value={record?.category || undefined}
            placeholder="Select category"
            className="custom-select"
            style={{ width: "100%", height: 40, margin: '10px 0' }}
            onChange={(val, opt) => handleChange(record?.id, "category_id", opt?.key)}
            allowClear
          >
            {props?.categoryList?.map((cat) => (
              <Option key={cat?.id} value={cat?.name}>
                {cat?.name}
              </Option>
            ))}
          </Select>
          {record?.error && Object.values(record?.error)?.filter(Boolean).length > 0 ? (
            record?.error?.category_id ? (
              <div style={{ color: "red", fontSize: 10 }}>{record?.error?.category_id}</div>
            ) : (
              <div style={{ height: 20 }}> </div>
            )
          ) : null}
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
            value={record?.name}
            placeholder="Enter item name"
            style={{ height: 40 }}
            onChange={(e) => handleChange(record?.id, "name", e.target.value)}
          />
          {record?.error && Object.values(record?.error)?.filter(Boolean)?.length > 0 ? record?.error?.name ? (
            <div style={{ color: "red", fontSize: 10 }}>{record?.error.name}</div>
          ) : <div style={{ height: 20 }}> </div> : null}
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
            value={record?.price}
            placeholder="Enter price"
            style={{ height: 40 }}
            onChange={(e) => handleChange(record?.id, "price", e.target.value)}
          />
          {record?.error && Object.values(record?.error)?.filter(Boolean)?.length > 0 ? record?.error?.price ? (
            <div style={{ color: "red", fontSize: 10 }}>{record?.error.price}</div>
          ) : <div style={{ height: 20 }}> </div> : null}
        </div>
      ),
    },
    {
      title: "GST Rate (%)",
      dataIndex: "gst_rate",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Input
            value={record?.gst_rate}
            placeholder="Enter GST Rate"
            style={{ height: 40 }}
            onChange={(e) => handleChange(record?.id, "gst_rate", e.target.value)}
          />
          {record?.error && Object.values(record?.error)?.filter(Boolean)?.length > 0 ? record?.error?.gst_rate ? (
            <div style={{ color: "red", fontSize: 10 }}>{record?.error.gst_rate}</div>
          ) : <div style={{ height: 20 }}> </div> : null}
        </div>
      ),
    },
    {
      title: "HSN Code",
      dataIndex: "hsn_code",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Input
            value={record?.hsn_code}
            placeholder="Enter HSN Code"
            style={{ height: 40 }}
            onChange={(e) => handleChange(record?.id, "hsn_code", e.target.value)}
          />
          {record?.error?.hsn_code && (
            <div style={{ color: "red", fontSize: 10 }}>{record?.error.hsn_code}</div>
          )}
          {record?.error && Object.values(record?.error)?.filter(Boolean)?.length > 0 ? record?.error?.hsn_code ? (
            <div style={{ color: "red", fontSize: 10 }}>{record?.error.hsn_code}</div>
          ) : <div style={{ height: 20 }}> </div> : null}
        </div>
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={props?.formItems?.length === 1}
            onClick={() => handleRemoveRow(record?.id)}
            style={{
              height: 40,
              width: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
            }}
          />
          {record?.error && Object.values(record?.error)?.filter(Boolean)?.length > 0 ? <div style={{ height: 20 }}> </div> : null}
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
        width={1200}
        okText="Submit"
        okButtonProps={{
          disabled: !saveDisable, 
          style: {
            backgroundColor: !saveDisable ? '' : '#d6085e', // Set the desired background color
            color: !saveDisable ? '' : 'white', // Set the text color (optional)
          },
        }}
      >
        <Spin spinning={props?.loader} tip={"Loading..."}>
          <Table
            dataSource={props?.formItems}
            columns={columns}
            pagination={false}
            rowKey="id"
            className="add"
          />
          {props?.formItems?.[0]?.isEdit ? <></> : <Button
            onClick={handleAddRow}
            type="dashed"
            icon={<PlusOutlined />}
            block
            style={{ marginTop: 20, backgroundColor: "#a6a9aa", color: 'white' }}
          >
            Add Item Row
          </Button>}

        </Spin>
      </Modal>
    </>
  );
};

export default AddItemsModal;
