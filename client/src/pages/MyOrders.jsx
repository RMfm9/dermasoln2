import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("⚠️ No token found. User may not be logged in.");
      return;
    }

    axios.get('http://localhost:5000/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("🧾 Orders received:", res.data);
        setOrders(res.data);
      })
      .catch(err => {
        console.error("❌ Failed to load orders:", err.response?.data || err.message);
      });
  }, []);

  const handleCancelRequest = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel-request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Cancellation request sent.");
      // Refresh orders
      const updated = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(updated.data);
    } catch (err) {
      alert("Failed to request cancellation");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.status || 'Pending'}</p>
            <p><strong>Shipping:</strong> {order.shippingAddress}</p>

            {order.cancelApproved ? (
              <p style={{ color: 'green' }}>✅ Cancelled</p>
            ) : order.cancelRequest ? (
              <p style={{ color: 'orange' }}>🕒 Cancel Requested</p>
            ) : (
              <button onClick={() => handleCancelRequest(order._id)}>
                Request Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
