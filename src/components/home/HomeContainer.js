import { useEffect, useState } from "react"
import { Button } from 'antd';
import Home from "./Home"
import { fetchItems } from "../../api/items"

const HomeContainer = () => {

    const [items, setItems] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        try {
            const data = await fetchItems()
            setItems(data)
        } catch (err) {
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


    const itemColumns = [
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
            title: 'Add',
            key: 'add',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleAddToBill(record)}
                    className="bounce-button"
                >
                    Add to Bill
                </Button>

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
        />
    </div>

}

export default HomeContainer;