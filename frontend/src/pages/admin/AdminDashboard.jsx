import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Users, Car, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data.stats));
  }, []);

  if (!stats) return <div className="text-center py-20">Loading...</div>;

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, link: '/admin/users' },
    { label: 'Total Cars', value: stats.cars, icon: Car, link: '/admin/listings' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, link: '/admin/listings' },
    { label: 'Revenue', value: `₦${Number(stats.revenue).toLocaleString()}`, icon: DollarSign },
    { label: 'Pending Listings', value: stats.pending, icon: AlertCircle, link: '/admin/listings' },
    { label: 'Today Orders', value: stats.todayOrders, icon: ShoppingBag },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((c, i) => (
          <Link key={i} to={c.link || '#'} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{c.label}</p>
                <p className="text-2xl font-bold mt-1">{c.value}</p>
              </div>
              <c.icon className="text-red-600" size={32} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex gap-4">
        <Link to="/admin/categories" className="bg-red-600 text-white px-6 py-3 rounded-lg">Manage Categories</Link>
        <Link to="/admin/users" className="bg-gray-800 text-white px-6 py-3 rounded-lg">Manage Users</Link>
      </div>
    </div>
  );
}