import { useEffect, useState } from 'react'
import { fetchItems } from '../../api/items'
import Navbar from '../Navbar' 
import './Home.css'

const Home = () => {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  // Fetch items on load
  useEffect(() => {
    const loadItems = async () => {
    //   const data = await fetchItems()
    const data = [
        {
          "id": "1",
          "name": "Wireless Mouse",
          "category": "Electronics",
          "price": 15.99,
          "vendor_id": "user-uuid-123",
          "stock": 50,
          "created_at": "2025-04-25T10:30:00Z"
        },
        {
          "id": "2",
          "name": "Notebook",
          "category": "Stationery",
          "price": 3.49,
          "vendor_id": "user-uuid-123",
          "stock": 120,
          "created_at": "2025-04-25T11:00:00Z"
        },
        {
          "id": "3",
          "name": "USB-C Charger",
          "category": "Electronics",
          "price": 22.99,
          "vendor_id": "user-uuid-123",
          "stock": 30,
          "created_at": "2025-04-25T11:15:00Z"
        },
        {
          "id": "4",
          "name": "Ball Pen",
          "category": "Stationery",
          "price": 0.99,
          "vendor_id": "user-uuid-123",
          "stock": 300,
          "created_at": "2025-04-25T12:00:00Z"
        },
        {
          "id": "5",
          "name": "Coffee Mug",
          "category": "Kitchenware",
          "price": 5.99,
          "vendor_id": "user-uuid-123",
          "stock": 80,
          "created_at": "2025-04-25T12:30:00Z"
        }
      ]       
      setItems(data)
    }
    loadItems()
  }, [])

  const handleAddToBill = (item) => {
    const existing = selectedItems.find(i => i.id === item.id)
    if (existing) {
      setSelectedItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }])
    }
  }

  const handleRemove = (id) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id))
  }

  const total = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="home-container">
      <Navbar />
      <h2>📦 Item Catalog</h2>

      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price}</td>
              <td>
                <button onClick={() => handleAddToBill(item)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>🧾 Bill Preview</h3>
      {selectedItems.length === 0 ? (
        <p>No items added.</p>
      ) : (
        <table className="bill-preview">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>${i.price}</td>
                <td>${(i.price * i.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleRemove(i.id)}>❌</button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td colSpan="2"><strong>${total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      )}

      <button
        disabled={selectedItems.length === 0}
        onClick={() => alert('Bill generated!')}
      >
        ✅ Generate Bill
      </button>
    </div>
  )
}

export default Home
