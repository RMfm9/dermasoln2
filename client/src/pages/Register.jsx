import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();
  const toast = useRef(null);
  const API = import.meta.env.VITE_API_URL;
  const handleRegister = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!emailRegex.test(form.email)) {
      toast.current.show({ severity: 'error', summary: 'Invalid Email', detail: 'Please use a valid @example.com email', life: 3000 });
      return;
    }

    try {
      await axios.post(`${API}/api/auth/register`, form);
      toast.current.show({ severity: 'success', summary: 'Registered', detail: 'Registration successful', life: 2000 });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Registration Failed',
        detail: err.response?.data?.msg || 'Something went wrong',
        life: 3000,
      });
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center min-h-screen">
      <Toast ref={toast} />
      <div className="p-shadow-4 p-p-4 border-round md:w-5 w-11 surface-card">
        <h2 className="text-green-600 text-center mb-4">Register</h2>

        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            placeholder="Your name"
            className="w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="field mt-3">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            placeholder="Email (e.g. user@example.com)"
            className="w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="field mt-3">
          <label htmlFor="password">Password</label>
          <Password
            id="password"
            placeholder="Password"
            toggleMask
            className="w-full"
            feedback={false}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <Button
          label="Register"
          icon="pi pi-user-plus"
          className="p-button-success mt-4 w-full"
          onClick={handleRegister}
        />
      </div>
    </div>
  );
};

export default Register;
