import React, { useEffect, useState } from "react";
import { supabase } from '../../supabase/client'
import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import User from "./User";

const UserContainer = () => {
    const [userList, setUserList] = useState([]);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoader(true);
                const { data, error } = await supabase.auth.admin.listUsers();
    
                if (error) {
                    console.error('Error fetching users:', error);
                } else {
                    console.info(data.users, 'All users');
                    setUserList(data.users); // assuming you want to display or store this
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoader(false);
            }
        };
    
        fetchAllUsers();
    }, []);
    

    const columns = [
        {
            title: 'Menu',
            dataIndex: 'Menu',
            key: 'Menu',
            render: (_, record) => {
                return (
                    <Dropdown overlay={getMenu(record)} trigger={['click']}>
                        <Button type="text" icon={<EllipsisOutlined style={{ fontSize: '20px' }} />} />
                    </Dropdown>
                );
            },
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (x) => x ?? '-',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price?.toFixed(2)}`,
        },
        {
            title: 'GST Rate (%)',
            dataIndex: 'gst_rate',
            key: 'gst_rate',
            render: (rate) => rate != null ? `${rate.toFixed(2)}%` : '-',
        },
        {
            title: 'HSN Code',
            dataIndex: 'hsn_code',
            key: 'hsn_code',
            render: (code) => code || '-',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
        },

    ];

    return <User userList={userList} columns={columns} loader={loader} />
}

export default UserContainer;