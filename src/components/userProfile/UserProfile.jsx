import React, { useEffect } from "react";
import { Modal, Input, Button, Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./UserProfile.css";

const UserProfile = ({
    isOpen,
    formData,
    handleChange,
    handleFileChange,
    handleSave,
    setOpenUserPopup
}) => {
    const [form] = Form.useForm();

    // Update form values when formData changes
    useEffect(() => {
        if (formData) {
            form.setFieldsValue({
                name: formData?.name || '',
                contact: formData?.contact || '',
                location: formData?.location || '',
            });
        }
    }, [formData, form]);

    return (
        <Modal
            title={formData?.id ? "Edit Your Profile" : "Complete Your Profile"}
            open={isOpen}
            footer={null}
            closable={formData?.id}
            maskClosable={formData?.id}
            onCancel={() => setOpenUserPopup(false)}
            className="user-profile-modal"
            width={400}
        >
            <Form
                layout="vertical"
                form={form}
                className="user-profile-form"
                onFinish={handleSave}
            >
                <Form.Item
                    label="Display Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your display name' }]}
                >
                    <Input
                        name="name"
                        onChange={handleChange}
                        className="custom-input"
                    />
                </Form.Item>
                <Form.Item
                    label="Contact"
                    name="contact"
                    rules={[
                        { required: true, message: 'Please enter your contact number' },
                        { pattern: /^\d{10}$/, message: 'Contact number must be 10 digits' },
                    ]}
                >
                    <Input
                        name="contact"
                        onChange={handleChange}
                        className="custom-input"
                    />
                </Form.Item>
                <Form.Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: 'Please enter your location' }]}
                >
                    <Input
                        name="location"
                        onChange={handleChange}
                        className="custom-input"
                    />
                </Form.Item>
                <Form.Item label="Upload Bill Format">
                    <Upload
                        beforeUpload={() => false}
                        showUploadList={{ showRemoveIcon: true }}
                        onChange={(info) => {
                            if (info.fileList.length > 0) {
                                handleFileChange({
                                    target: {
                                        name: "billImage",
                                        files: [info.fileList[0].originFileObj],
                                    },
                                });
                            }
                        }}
                        className="custom-upload"
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block className="save-button">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserProfile;
