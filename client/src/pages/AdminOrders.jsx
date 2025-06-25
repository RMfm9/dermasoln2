import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const toast = useRef(null);

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

  const getStatusLabel = (order) => {
    if (order.cancelApproved) return <Tag value="Cancelled" severity="danger" />;
    if (order.cancelRequest) return <Tag value="Cancel Requested" severity="warning" />;
    return <Tag value="Active" severity="success" />;
  };

  const approveCancel = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/orders/${id}/cancel-approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cancel approved ✅', life: 3000 });
      setOrders(prev => prev.map(order =>
        order._id === id ? { ...order, cancelApproved: true } : order
      ));
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Failed', detail: '❌ Failed to approve cancel', life: 3000 });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-green-700 mb-4">📦 All Orders (Admin View)</h2>

      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="grid">
          {orders.map(order => (
            <div className="col-12 md:col-6 lg:col-4" key={order._id}>
              <Card title={`Order by ${order.user?.name || 'Unknown'}`} subTitle={order.user?.email || 'No email'}>
                <p><strong>Shipping:</strong> {order.shippingAddress}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Status:</strong> {getStatusLabel(order)}</p>
                <h5>Items:</h5>
                <ul className="ml-3">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.product?.name || 'Unknown Product'} × {item.quantity}
                    </li>
                  ))}
                </ul>

                {order.cancelRequest && !order.cancelApproved && (
                  <Button
                    label="Approve Cancel"
                    icon="pi pi-check"
                    severity="danger"
                    className="mt-3"
                    onClick={() => approveCancel(order._id)}
                  />
                )}
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AdminOrders;
