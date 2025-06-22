import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

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
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>
              <div>
                <button onClick={() => handleDecrease(item)} disabled={item.quantity <= 1}>−</button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <button onClick={() => handleIncrease(item)} disabled={item.quantity >= item.stock}>+</button>
              </div>
              <p>Subtotal: ₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
          <Link to="/checkout"><button>Proceed to Checkout</button></Link>
          <button onClick={clearCart}>Clear Cart</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
