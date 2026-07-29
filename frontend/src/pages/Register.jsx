import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Full Name" required className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
        <input type="email" placeholder="Email" required className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Phone" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, phone: e.target.value})} />
        <input type="password" placeholder="Password" required className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, password: e.target.value})} />
        <select className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, role: e.target.value})}>
          <option value="customer">I want to buy</option>
          <option value="seller">I want to sell</option>
        </select>
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">Register</button>
      </form>
      <p className="text-center mt-4 text-sm">Already have an account? <Link to="/login" className="text-red-600 font-semibold">Login</Link></p>
    </div>
  );
}