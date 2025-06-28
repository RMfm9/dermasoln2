import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const Login = () => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;

      setAuth(token, user); // ✅ use setAuth instead of setUser/setToken

      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
  <div className="p-fluid p-formgrid grid">
    <div className="field col-12">
      <label htmlFor="email">Email</label>
      <InputText id="email" value={email} onChange={e => setEmail(e.target.value)} />
    </div>
    <div className="field col-12">
      <label htmlFor="password">Password</label>
      <Password id="password" value={password} onChange={e => setPassword(e.target.value)} toggleMask />
    </div>
    <div className="col-12">
      <Button label="Login" icon="pi pi-sign-in" onClick={handleLogin} />
    </div>
  </div>
  );
};

export default Login;
//await axios.post('http://localhost:5000/api/auth/login', { email, password });