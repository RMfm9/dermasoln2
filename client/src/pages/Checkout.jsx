import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';

const Checkout = () => {
  const { cartItems, clearCart, updateQty } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    for (let item of cartItems) {
      if (item.quantity > item.stock) {
        return alert(`Stock insufficient for "${item.name}". Only ${item.stock} available.`);
      }
    }

    try {
      const token = localStorage.getItem('token');
      const items = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      await axios.post(`${API}/api/products`, {
        items,
        totalAmount,
        shippingAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Order placed successfully!');
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      console.error(err);
      alert('❌ Order failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-green-700 mb-4">Checkout</h2>

      {cartItems.length === 0 ? (
        <Message severity="info" text="Your cart is empty" />
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item._id} title={item.name} className="mb-3">
              <p><strong>Price:</strong> ₹{item.price}</p>
              <p><strong>Stock:</strong> {item.stock}</p>

              <div className="flex align-items-center gap-2 mt-2">
                <Button
                  icon="pi pi-minus"
                  className="p-button-rounded p-button-sm p-button-secondary"
                  onClick={() => updateQty(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                />
                <span>{item.quantity}</span>
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-sm p-button-success"
                  onClick={() => updateQty(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                />
              </div>

              <p className="mt-2"><strong>Subtotal:</strong> ₹{item.price * item.quantity}</p>
            </Card>
          ))}

          <Divider />

          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>

          <div className="mt-3">
            <label htmlFor="address" className="block mb-2">Shipping Address:</label>
            <InputTextarea
              id="address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
              cols={50}
              placeholder="Enter full delivery address"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <Button label="Place Order" icon="pi pi-check" className="p-button-success" onClick={placeOrder} />
            <Button label="Clear Cart" icon="pi pi-times" className="p-button-danger" onClick={clearCart} />
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
