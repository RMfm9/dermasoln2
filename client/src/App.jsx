import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminPage from './pages/AdminPage';
import AddProduct from './pages/AddProduct';
import AdminOrders from './pages/AdminOrders';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        {!user && <Route path="/login" element={<Login />} />}
        {!user && <Route path="/register" element={<Register />} />}

        {/* User Routes */}
        {user?.role === 'user' && (
          <>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </>
        )}

        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/add" element={<AddProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </>
        )}

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
