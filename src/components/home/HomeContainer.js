import { useEffect, useState } from "react"
import { Button, Dropdown, Menu } from 'antd';
import Home from "./Home"
import { fetchItems, updateItem } from "../../api/items"
import { EllipsisOutlined  } from '@ant-design/icons'; // Import the icon

const HomeContainer = () => {

    const [items, setItems] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        try {
            setLoader(true);
            const data = await fetchItems()
            setItems(data)
            setLoader(false);
        } catch (err) {
            setLoader(false);
            alert('Error loading items')
        }
    }

    const editItems = async(record, value) =>{
        try {
            setLoader(true);
            const updatedData = {...record, is_active : value}
            const result = await updateItem(record?.id,updatedData);
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
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter(i => i.quantity > 0) // Remove item if quantity becomes 0
        );
    };


    const total = selectedItems.reduce(
        (sum, i) => sum + i?.price * i?.quantity,
        0
    );

    const filteredItems = items?.filter(i =>
        i?.name.toLowerCase().includes(search?.toLowerCase())
    );

    const menuItems = [
        { key: '1', label: 'Sold Out', value : false },
        { key: '2', label: 'Active', value : true },
    ];
    
    const getMenu = (records) => (
        <Menu
            onClick={(e) => editItems(records, menuItems?.find(x=>x?.key == e?.key)?.value)}
            items={menuItems}
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
                        <Button type="text" icon={<EllipsisOutlined  style={{fontSize : '20px'}}/>} />
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
            title: 'Action',
            key: 'Action',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleAddToBill(record)}
                        className="bounce-button"
                        disabled={record.is_active === false} // Disable button if inactive
                    >
                        Add to Bill
                    </Button>
                </>
            ),
        },
    ];

    return <div>
        <h2>Home</h2>
        <Home items={items}
            itemColumns={itemColumns}
            total={total}
            filteredItems={filteredItems}
            handleRemove={handleRemove}
            setSearch={setSearch}
            selectedItems={selectedItems}
            loader = {loader}
        />
    </div>

}

export default HomeContainer;