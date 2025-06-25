import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminPage = () => {
  
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', stock: 0 });

  const toast = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('❌ Error fetching products:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Product deleted' });
      fetchProducts();
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setForm({ name: prod.name, price: prod.price, description: prod.description, image: prod.image, stock: prod.stock || 0 });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Product updated' });
      setEditingId(null);
      setForm({ name: '', price: '', description: '', image: '', stock: 0 });
      fetchProducts();
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Update Failed', detail: err.message });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <h2 className="text-green-700">Admin Dashboard</h2>
      <div className="my-2">
        <Button label="➕ Add Product" className="mr-2" severity="success" onClick={() => navigate("/admin/add")} />
        <Button label="📦 View All Orders" onClick={() => navigate("/admin/orders")} />
      </div>

      <h3 className="mt-4 mb-3">📋 Product List</h3>
      <div className="grid">
        {products.map((prod) => (
          <div className="col-12 md:col-4" key={prod._id}>
            <Card title={prod.name} subTitle={`₹${prod.price}`} className="mb-3">
              <p>{prod.description}</p>
              <img src={prod.image} alt={prod.name} width="100%" style={{ objectFit: 'cover' }} />
              <p className="mt-2">
                Stock: 
                <span className={`font-bold ml-1 ${prod.stock <= 2 ? 'text-red-500' : 'text-green-600'}`}>
                  {prod.stock}
                </span>
                {prod.stock <= 2 && <Message severity="warn" text="Low Stock!" className="mt-1" />}
              </p>
              <div className="flex justify-content-between mt-3">
                <Button label="Edit" icon="pi pi-pencil" onClick={() => handleEdit(prod)} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => handleDelete(prod._id)} />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="mt-5">
          <h3>Edit Product</h3>
          <div className="p-fluid">
            <div className="field">
              <label>Name</label>
              <InputText value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Price</label>
              <InputNumber value={form.price} onValueChange={(e) => setForm({ ...form, price: e.value })} mode="currency" currency="INR" locale="en-IN" />
            </div>
            <div className="field">
              <label>Description</label>
              <InputText value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field">
              <label>Image URL</label>
              <InputText value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="field">
              <label>Stock</label>
              <InputNumber value={form.stock} onValueChange={(e) => setForm({ ...form, stock: e.value })} />
            </div>
            <Button label="✅ Update Product" className="mt-2" onClick={handleUpdate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
