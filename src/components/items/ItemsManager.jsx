import { useEffect, useState } from 'react'
import { fetchItems, addItem, updateItem, deleteItem } from '../../api/items'
import ItemForm from '../items/ItemForm'

const ItemsManager = () => {
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)

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

  return (
    <div className="items-manager">
      <h2>Manage Your Items</h2>
      <ItemForm
        onSubmit={editingItem ? handleUpdate : handleAdd}
        initialData={editingItem}
        isEditing={!!editingItem}
        onCancel={() => setEditingItem(null)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            {/* <th>Stock</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price}</td>
              {/* <td>{item.stock}</td> */}
              <td>
                <button onClick={() => setEditingItem(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ItemsManager
