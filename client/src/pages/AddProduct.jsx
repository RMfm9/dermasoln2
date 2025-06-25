import React, { useState, useRef } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AddProduct = () => {
  const [form, setForm] = useState({ name: '', price: null });
  const toast = useRef(null);

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product added!' });
      setForm({ name: '', price: null });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
    }
  };

  return (
    <div className="p-m-4">
      <Toast ref={toast} />
      <h2 className="text-green-600">Add Product</h2>

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

      <Button label="Add Product" icon="pi pi-plus" onClick={handleAdd} className="p-button-success" />
    </div>
  );
};

export default AddProduct;
