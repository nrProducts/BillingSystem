import { useEffect, useState } from 'react'
import { fetchItems, addItem, updateItem, deleteItem } from '../../api/items'
import { Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import ManageItems from './ManageItems';

const ManageItemsContainer = () => {
    const [items, setItems] = useState([])
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);
    const [editingItem, setEditingItem] = useState(null)

    useEffect(() => {
        loadItems()
    }, [])


    const handleAdd = async (item) => {
        await addItem(item)
        await loadItems()
    }

    const handleUpdate = async (item) => {
        await updateItem(editingItem.id, item)
        setEditingItem(null)
        await loadItems()
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            await deleteItem(id)
            await loadItems()
        }
    }


    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        try {
            setLoader(true);
            const data = await fetchItems()
            setItems(data?.data ?? '')
            setLoader(false);
        } catch (err) {
            setLoader(false);
            alert('Error loading items')
        }
    }

    const editItems = async (record, value) => {
        console.info(value)
        try {
            setLoader(true);
            const updatedData = { ...record, is_active: value }
            const result = await updateItem(record?.id, updatedData);
            await loadItems();
        } catch (err) {
            setLoader(false);
            alert('Error loading items')
        }
    }

    const filteredItems = items?.filter(i =>
        i?.name.toLowerCase().includes(search?.toLowerCase())
    );

    const menuItems = (record) => {
        return [
            record?.is_active && { key: '1', label: 'Edit', value: false },
            record?.is_active && { key: '1', label: 'Remove', value: false },
            !record?.is_active && { key: '2', label: 'Active', value: true },
        ].filter(Boolean);
    }

    const getMenu = (record) => (
        <Menu
            // onClick={(e) => editItems(record, menuItems(record)?.find(x => x?.key == e?.key)?.value)}
            items={menuItems(record)}
        />
    );

    const itemColumns = [
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
    ];

    return (
        <div className="items-manager">
            <h2>Manage Your Items</h2>
            <ManageItems
                itemColumns={itemColumns}
                filteredItems={filteredItems}
                search={search}
                setSearch={setSearch}                
                loader={loader}
                editingItem={editingItem}
                handleUpdate={handleUpdate}
                handleAdd={handleAdd}
                setEditingItem={setEditingItem}
            />
        </div>
    )

}
export default ManageItemsContainer;