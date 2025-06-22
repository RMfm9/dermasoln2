import React from 'react';

const OrderCard = ({ order }) => (
  <div>
    <p>Order ID: {order._id}</p>
    <p>Address: {order.shippingAddress}</p>
    <p>Total: ₹{order.totalAmount}</p>
    <ul>
      {order.items.map(i => (
        <li key={i.productId}>{i.productId} x {i.quantity}</li>
      ))}
    </ul>
  </div>
);

export default OrderCard;
