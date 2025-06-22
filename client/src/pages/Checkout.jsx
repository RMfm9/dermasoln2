import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart, updateQty } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    // Quantity Validation
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

      await axios.post('http://localhost:5000/api/orders', {
        items,
        totalAmount,
        shippingAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Order placed!');
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      console.error(err);
      alert('Order failed');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item._id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
              <p><strong>{item.name}</strong></p>
              <p>Price: ₹{item.price}</p>
              <p>Stock: {item.stock}</p>
              <div>
                <button
                  onClick={() => updateQty(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >−</button>

                <span style={{ margin: '0 10px' }}>{item.quantity}</span>

                <button
                  onClick={() => updateQty(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >+</button>
              </div>
              <p>Subtotal: ₹{item.price * item.quantity}</p>
            </div>
          ))}

          <p><strong>Total Amount:</strong> ₹{totalAmount}</p>

          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter your shipping address"
            rows="4"
            cols="40"
          />
          <br />
          <button onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
};

export default Checkout;
