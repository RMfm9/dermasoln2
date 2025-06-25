import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

const OrderCard = ({ order }) => {
  return (
    <Card title={`Order ID: ${order._id}`} className="mb-4" style={{ background: '#e8f5e9', border: '1px solid #a5d6a7' }}>
      <div>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

        <Divider />
        <h4>Items</h4>
        <ul style={{ paddingLeft: '20px' }}>
          {order.items.map((item, index) => (
            <li key={index}>
              <Tag severity="success" value={`Product ID: ${item.productId}`} style={{ marginRight: '10px' }} />
              Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default OrderCard;
