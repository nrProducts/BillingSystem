import React, { useEffect, useState } from "react";
import { supabase } from '../../supabase/client'
import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import User from "./UserManagement";
import { fetchAllUserDetails, updateUserDetails, getUserById } from "../../api/user";

const UserContainer = () => {
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false)
    const [showPopConfirm, setShowPopConfirm] = useState(false)
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoader(true);
            const { data, error } = await fetchAllUserDetails();

            if (error) {
                console.error('Error fetching users:', error);
            } else {
                console.info(data, 'All users');
                setUserList(data); // assuming you want to display or store this
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoader(false);
        }
    };

    const manageItems = async (record, value) => {
        console.info(record, 'record')
        try {
            setLoader(true);
            if (value == 'Remove') {
                setShowPopConfirm(true)
                setUserId(record?.id);
            } else {
                const { data, error } = await getUserById(record?.id)
                const isActive = value !== 'Inactive';
                const updatedData = { ...data, is_active: isActive };                
                
                await updateUserDetails(record?.id, updatedData);
                await fetchAllUsers();
            }
        } catch (err) {
            setLoader(false);
            alert('Error loading user')
        }
    }

    const handleDelete = async (id) => {
        setLoader(true);
        const result = await deleteItem(id)
        if (result?.success) {
            await fetchAllUsers()
            notification.success({
                message: "Success",
                description: "User deleted successfully.",
                placement: "topRight",
            });
            setLoader(false);
            setUserId(null)
            setShowPopConfirm(false)
        } else {
            notification.error({
                message: "Error",
                description: "Failed to delete",
                placement: "topRight",
            });
            setLoader(false);
        }
    }

    const menuItems = (record) => {
        return [
            // record?.is_active && { key: '1', label: 'Edit', value: 'Edit' },
            record?.is_active && { key: '2', label: 'Remove', value: 'Remove' },
            record?.is_active && { key: '3', label: 'Inactive', value: 'Inactive' },
            !record?.is_active && { key: '4', label: 'Active', value: 'Active' },
        ].filter(Boolean);
    }

    const getMenu = (record) => (
        <Menu
            onClick={(e) => manageItems(record, menuItems(record)?.find(x => x?.key == e?.key)?.value)}
            items={menuItems(record)}
        />
    );

    const filteredItems = userList?.filter(i => {
        const s = search?.toLowerCase();
        return (
          i?.name?.toLowerCase().includes(s) ||
          i?.email?.toLowerCase().includes(s) ||
          i?.role?.toLowerCase().includes(s)
        );
      });
      

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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
        },

    ];
    console.info(userList, 'userList')
    return <User
        userList={filteredItems}
        columns={columns}
        loader={loader}
        showPopConfirm={showPopConfirm}
        setShowPopConfirm={setShowPopConfirm}
        setLoader={setLoader}
        userId={userId}
        handleDelete={handleDelete}
        setSearch={setSearch}
    />
}

export default UserContainer;