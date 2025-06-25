import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQty } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQty(item._id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    if (item.quantity < item.stock) {
      updateQty(item._id, item.quantity + 1);
    } else {
      alert('Cannot exceed available stock');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-green-700">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <Message severity="info" text="Cart is empty" />
      ) : (
        <div className="grid">
          {cartItems.map((item, i) => (
            <div key={i} className="col-12 md:col-6 lg:col-4">
              <Card title={item.name} subTitle={`₹${item.price}`} className="mb-3">
                <div className="flex align-items-center mb-2">
                  <Button icon="pi pi-minus" onClick={() => handleDecrease(item)} disabled={item.quantity <= 1} className="p-button-rounded p-button-sm p-button-text" />
                  <span className="mx-3 font-bold">{item.quantity}</span>
                  <Button icon="pi pi-plus" onClick={() => handleIncrease(item)} disabled={item.quantity >= item.stock} className="p-button-rounded p-button-sm p-button-text" />
                </div>
                <p>Subtotal: ₹{item.price * item.quantity}</p>
                <Button label="Remove" icon="pi pi-trash" severity="danger" onClick={() => removeFromCart(item._id)} className="p-button-sm" />
              </Card>
            </div>
          ))}

          <Divider />
          <div className="p-3 bg-green-50 border-round shadow-2">
            <h3 className="text-green-700">Total: ₹{total}</h3>
            <div className="flex gap-2 mt-2">
              <Link to="/checkout">
                <Button label="Proceed to Checkout" icon="pi pi-credit-card" className="p-button-success" />
              </Link>
              <Button label="Clear Cart" icon="pi pi-times" severity="danger" onClick={clearCart} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
