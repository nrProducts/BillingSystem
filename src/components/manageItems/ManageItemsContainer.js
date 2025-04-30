import { useEffect, useState } from 'react'
import { fetchItems, addItem, updateItem, deleteItem } from '../../api/items'
import { fetchCategory, addCategory } from '../../api/category'
import { Button, Dropdown, Menu, Tag } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import ManageItems from './ManageItems';
import { v4 as uuidv4 } from "uuid";

const ManageItemsContainer = () => {

    const userId = sessionStorage.getItem('userId');

    const [items, setItems] = useState([])
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);
    const [formItems, setFormItems] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false)
    const [categoryList, setCategoryList] = useState([]);
    const [addCategoryForm, setAddCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categoryError, SetCategoryError] = useState('');


    useEffect(() => {
        loadItems();
        loadCategory();
    }, [])

    const handleAdd = async (item) => {
        setLoader(true);
        await addItem(item);
        await loadItems();
        setLoader(false);
        setVisibleForm(false);
        setFormItems([]);
    };


    const handleUpdate = async (item) => {
        setLoader(true);
        await updateItem(item.id, item)
        await loadItems()
        setLoader(false);
        setVisibleForm(false);
        setFormItems([]);
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this item?')) {
            setLoader(true);
            await deleteItem(id)
            await loadItems()
            setLoader(false);
        }
    }

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

    const loadCategory = async () => {
        try {
            setLoader(true);
            const data = await fetchCategory()
            setCategoryList(data?.data ?? '')
            setLoader(false);
        } catch (err) {
            setLoader(false);
            alert('Error loading category')
        }
    }

    const manageItems = async (record, value) => {
        try {
            setLoader(true);
            if (value == 'Edit') {
                setVisibleForm(true);
                setFormItems([{ ...record, isEdit: true }]);
                setLoader(false);
            } else if (value == 'Remove') {
                await handleDelete(record?.id);
            } else {
                const isActive = value !== 'Inactive';
                const updatedData = { ...record, is_active: isActive };
                const { category, ...sanitizedData } = updatedData;

                await updateItem(record?.id, sanitizedData);
                await loadItems();
            }
        } catch (err) {
            setLoader(false);
            alert('Error loading items')
        }
    }

    const onAddClicked = () => {
        setVisibleForm(true);
        setFormItems([{ id: uuidv4(), user_id: userId, category_id: "", name: "", price: null, error: {} }]);
    }

    const handleCategory = (value) => {
        setNewCategory(value);
        SetCategoryError('')
    }

    const submitCategory = async () => {
        if (newCategory) {
            const payload = { user_id: userId, name: newCategory }
            await addCategory(payload)
            await loadCategory()
            setAddCategoryForm(false);
            setNewCategory('')
        } else {
            SetCategoryError('required')
        }
    }


    const filteredItems = items?.filter(i =>
        i?.name.toLowerCase().includes(search?.toLowerCase())
    );

    const menuItems = (record) => {
        return [
            record?.is_active && { key: '1', label: 'Edit', value: 'Edit' },
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
            render: (isActive) => (
                <Tag
                    color={isActive ? '#28a745' : '#dc3545'}
                    style={{ color: 'white', fontSize: '14px', padding: '0 8px' }}
                >
                    {isActive ? 'Active' : 'Sold Out'}
                </Tag>
            ),
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
                handleUpdate={handleUpdate}
                handleAdd={handleAdd}
                onAddClicked={onAddClicked}
                visibleForm={visibleForm}
                formItems={formItems}
                setFormItems={setFormItems}
                setVisibleForm={setVisibleForm}
                categoryList={categoryList}
                setAddCategoryForm={setAddCategoryForm}
                addCategoryForm={addCategoryForm}
                newCategory={newCategory}
                handleCategory={handleCategory}
                submitCategory={submitCategory}
                categoryError={categoryError}
                SetCategoryError={SetCategoryError}
            />
        </div>
    )

}
export default ManageItemsContainer;