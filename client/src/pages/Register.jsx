import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!emailRegex.test(form.email)) {
      return alert("❌ Email is not valid");
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert("✅ Registration successful");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Registration failed');
    }
  };


  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email (must end with @example.com)"
        pattern="^[a-zA-Z0-9._%+-]+@example\.com$"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      
      {/* Optional: Uncomment this if you want to register admins from UI */}
      {false && (
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}
      
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
