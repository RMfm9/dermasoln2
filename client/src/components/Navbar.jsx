import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const goLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
    ...(!user ? [
      { label: 'Login', icon: 'pi pi-sign-in', command: () => navigate('/login') },
      { label: 'Register', icon: 'pi pi-user-plus', command: () => navigate('/register') },
    ] : [
      ...(user.role === 'user' ? [
        { label: 'Cart', icon: 'pi pi-shopping-cart', command: () => navigate('/cart') },
        { label: 'Checkout', icon: 'pi pi-credit-card', command: () => navigate('/checkout') },
        { label: 'My Orders', icon: 'pi pi-list', command: () => navigate('/my-orders') },
      ] : []),
      ...(user.role === 'admin' ? [
        { label: 'Admin Dashboard', icon: 'pi pi-cog', command: () => navigate('/admin') },
      ] : []),
      {
        label: 'Logout', icon: 'pi pi-sign-out', command: goLogout
      }
    ])
  ];

  const start = <img alt="logo" src="/logo.png" height="40" className="mr-2" />;
  const end = user ? <span style={{ marginRight: '1rem' }}>Hi, {user.name}</span> : null;

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} style={{ background: '#d6f5d6', border: 'none' }} />
    </div>
  );
};

export default Navbar;
