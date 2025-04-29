import { useState, useEffect } from 'react'

const ItemForm = ({ onSubmit, initialData = {}, isEditing, onCancel }) => {
  const [name, setName] = useState('')
  // const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      // setCategory(initialData.category || '')
      setPrice(initialData.price || '')
      setStock(initialData.stock || '')
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      user_id: '3bd07f92-0010-4147-a9e2-291a9a4259b6',
      category_id: 1,
      price: price // parseFloat(price),
      // stock: parseInt(stock),
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{isEditing ? '✏️ Edit Item' : '➕ Add Item'}</h3>
      <input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} required />
      {/* <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required /> */}
      <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      {/* <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} /> */}
      <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      {isEditing && <button onClick={onCancel} type="button" style={{ marginLeft: '10px' }}>Cancel</button>}
    </form>
  )
}

export default ItemForm
