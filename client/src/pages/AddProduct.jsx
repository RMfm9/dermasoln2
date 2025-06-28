import React, { useState, useRef } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AddProduct = () => {
  const [form, setForm] = useState({ name: '', price: null, stock: null });
  const toast = useRef(null);

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product added!' });
      setForm({ name: '', price: null, stock: null });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.msg || 'Failed to add product'
      });
    }
  };

  const isDisabled = !form.name || !form.price || !form.stock;

  return (
    <div className="p-4 surface-0 border-round shadow-1" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <Toast ref={toast} />
      <h2 className="text-green-600 mb-4">Add Product</h2>

      <div className="field mb-3">
        <label htmlFor="name" className="block mb-2">Product Name</label>
        <InputText
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter product name"
          className="w-full"
        />
      </div>

      <div className="field mb-3">
        <label htmlFor="price" className="block mb-2">Price (₹)</label>
        <InputNumber
          id="price"
          value={form.price}
          onValueChange={(e) => setForm({ ...form, price: e.value })}
          mode="currency"
          currency="INR"
          locale="en-IN"
          className="w-full"
        />
      </div>

      <div className="field mb-4">
        <label htmlFor="stock" className="block mb-2">Stock Count</label>
        <InputNumber
          id="stock"
          value={form.stock}
          onValueChange={(e) => setForm({ ...form, stock: e.value })}
          showButtons
          min={1}
          className="w-full"
        />
      </div>

      <Button
        label="Add Product"
        icon="pi pi-check"
        className="p-button-success w-full"
        onClick={handleAdd}
        disabled={isDisabled}
      />
    </div>
  );
};

export default AddProduct;
