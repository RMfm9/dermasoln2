import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrders(res.data);
    })
    .catch(err => {
      console.error("❌ Error loading admin orders:", err.response?.data || err.message);
    });
  }, []);

  const approveCancel = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/orders/${id}/cancel-approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Cancel approved");
      setOrders(prev => prev.map(order =>
      order._id === id ? { ...order, status: 'cancelled' } : order
      ));

    } catch (err) {
      alert("❌ Failed to approve cancel");
    }
  };

  return (
    <div>
      <h2>All Orders (Admin View)</h2>

      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map(order => (
          <div key={order._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>User:</strong> {order.user?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Shipping:</strong> {order.shippingAddress}</p>
            <p><strong>Status:</strong> {order.cancelApproved ? '❌ Cancelled' : order.cancelRequest ? '🕒 Cancel Requested' : '✅ Active'}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.product?.name || 'Unknown Product'} - Qty: {item.quantity}
                </li>
              ))}
            </ul>

            {/* Show Approve button only if cancelRequest is true and not yet approved */}
            {order.cancelRequest && !order.cancelApproved && (
              <button onClick={() => approveCancel(order._id)} style={{ marginTop: '10px' }}>
                ✅ Approve Cancel
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AdminOrders;
