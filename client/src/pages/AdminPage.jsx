import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', stock: 0 });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setForm({
      name: prod.name,
      price: prod.price,
      description: prod.description,
      image: prod.image,
      stock: prod.stock || 0,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      setForm({ name: '', price: '', description: '', image: '', stock: 0 });
      fetchProducts();
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/add">Add Product</Link></li>
        <li><Link to="/admin/orders">View All Orders</Link></li>
      </ul>

      <h3>Product List</h3>
      {products.map(prod => (
        <div key={prod._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <strong>{prod.name}</strong> - ₹{prod.price}
          <p>{prod.description}</p>
          <p>Stock: 
            <span style={{ color: prod.stock <= 2 ? 'red' : 'green' }}> {prod.stock}</span>
            {prod.stock <= 2 && <b> ⚠️ Low Stock!</b>}
          </p>
          <button onClick={() => handleEdit(prod)}>Edit</button>
          <button onClick={() => handleDelete(prod._id)}>Delete</button>
        </div>
      ))}

      {editingId && (
        <div style={{ marginTop: '20px' }}>
          <h3>Edit Product</h3>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
          />
          <input
            placeholder="Stock Count"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
          />
          <button onClick={handleUpdate}>Update Product</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
