import { useEffect, useState } from "react"
import { Button, Dropdown, Menu, Tag } from 'antd';
import { fetchItems, updateItem } from "../../api/items"
import { EllipsisOutlined } from '@ant-design/icons'; // Import the icon
import ItemBilling from "./ItemBilling";

const ItemBillingContainer = () => {

    const [items, setItems] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);
    const [viewMode, setViewMode] = useState('table');

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        try {
            setLoader(true);
            const result = await fetchItems()
            if (result.success) {
                setItems(result?.data ?? [])
            }
            setLoader(false);
        } catch (err) {
            setLoader(false);
            alert('Error loading items')
        }
    }

    const editItems = async (record, value) => {
        try {
            setLoader(true);
            const updatedData = { ...record, is_active: value }
            const { category, ...sanitizedData } = updatedData
            const result = await updateItem(record?.id, sanitizedData);
            await loadItems();
        } catch (err) {
            setLoader(false);
            alert('Error loading items')
        }
    }

    const handleAddToBill = (item) => {
        const existing = selectedItems.find(i => i?.id === item?.id);
        if (existing) {
            setSelectedItems(prev =>
                prev.map(i =>
                    i?.id === item?.id ? { ...i, quantity: i?.quantity + 1 } : i
                )
            );
        } else {
            setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
        }
    };

    const handleRemove = (id) => {
        setSelectedItems(prev =>
            prev
                ?.map(i =>
                    i?.id === id
                        ? { ...i, quantity: i?.quantity - 1 }
                        : i
                )
                .filter(i => i?.quantity > 0) // Remove item if quantity becomes 0
        );
    };



    const filteredItems = items?.filter(i =>
        i?.name?.toLowerCase().includes(search?.toLowerCase())
    );

    const menuItems = (record) => {
        return [
            record?.is_active && { key: '1', label: 'Sold Out', value: false },
            !record?.is_active && { key: '2', label: 'Active', value: true },
        ].filter(Boolean);
    }

    const getMenu = (record) => (
        <Menu
            onClick={(e) => editItems(record, menuItems(record)?.find(x => x?.key == e?.key)?.value)}
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
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Tag
                    color={isActive ? '#d4edda' : '#f8d7da'} // Light background colors
                    style={{
                        color: isActive ? '#155724' : '#721c24',
                        fontSize: '12px',
                        padding: '0 8px',
                        borderRadius : '50px'
                        // width: '100px',  // Fixed width
                        //textAlign: 'center'  // To center the text within the tag
                    }}
                >
                    {isActive ? 'Active' : 'Sold Out'}
                </Tag>


            ),
        },
        {
            title: 'Action',
            key: 'Action',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleAddToBill(record)}
                        className="bounce-button"
                        disabled={record?.is_active === false} // Disable button if inactive
                    >
                        Add to Bill
                    </Button>
                </>
            ),
        },
    ];

    return <div>
        <ItemBilling items={items}
            itemColumns={itemColumns}
            setSelectedItems={setSelectedItems}
            filteredItems={filteredItems}
            handleRemove={handleRemove}
            setSearch={setSearch}
            selectedItems={selectedItems}
            loader={loader}
            setViewMode={setViewMode}
            viewMode={viewMode}
            getMenu={getMenu}
        />
    </div>

}

export default ItemBillingContainer;