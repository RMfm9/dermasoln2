import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRef } from 'react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders", err);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelRequest = async (orderId) => {
    const API = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API}/api/orders/${orderId}/cancel-request`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
      toast.current.show({ severity: 'info', summary: 'Requested', detail: 'Cancellation sent' });
      fetchOrders();
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Failed', detail: 'Cancel request failed' });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-green-700 mb-3">My Orders</h2>

      {loading ? (
        <ProgressSpinner />
      ) : orders.length === 0 ? (
        <Message severity="warn" text="No orders yet." />
      ) : (
        <div className="grid">
          {orders.map(order => (
            <div key={order._id} className="col-12 md:col-6 lg:col-4">
              <Card title={`Order ID: ${order._id}`} className="mb-3 shadow-2">
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                <p><strong>Shipping:</strong> {order.shippingAddress}</p>

                {order.cancelApproved ? (
                  <Message severity="success" text="✅ Cancelled" />
                ) : order.cancelRequest ? (
                  <Message severity="info" text="🕒 Cancel Requested" />
                ) : (
                  <Button
                    label="Request Cancel"
                    icon="pi pi-times-circle"
                    className="p-button-danger p-button-sm mt-2"
                    onClick={() => handleCancelRequest(order._id)}
                  />
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
