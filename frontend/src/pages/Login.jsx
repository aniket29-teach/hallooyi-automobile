import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Login to Hallooyi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" required className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">Login</button>
      </form>
      <p className="text-center mt-4 text-sm">Don't have an account? <Link to="/register" className="text-red-600 font-semibold">Register</Link></p>
    </div>
  );
}