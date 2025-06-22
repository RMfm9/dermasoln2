import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [form, setForm] = useState({ name: '', price: '' });

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product added!");
      setForm({ name: '', price: '' });
    } catch (err) {
      alert("Failed to add product");
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default AddProduct;
