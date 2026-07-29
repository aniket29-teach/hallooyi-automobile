import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Car, CheckCircle, DollarSign, Clock } from 'lucide-react';

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/sellers/dashboard').then(r => setStats(r.data));
  }, []);

  if (!stats) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow"><Car className="text-red-600 mb-2" /><p className="text-gray-500 text-sm">My Listings</p><p className="text-2xl font-bold">{stats.listings}</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><CheckCircle className="text-green-600 mb-2" /><p className="text-gray-500 text-sm">Sold</p><p className="text-2xl font-bold">{stats.sold}</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><DollarSign className="text-blue-600 mb-2" /><p className="text-gray-500 text-sm">Earnings</p><p className="text-2xl font-bold">₦{Number(stats.earnings).toLocaleString()}</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><Clock className="text-yellow-600 mb-2" /><p className="text-gray-500 text-sm">Pending</p><p className="text-2xl font-bold">{stats.pending}</p></div>
      </div>
      <div className="flex gap-4">
        <Link to="/seller/add" className="bg-red-600 text-white px-6 py-3 rounded-lg">Add New Car</Link>
        <Link to="/seller/listings" className="bg-gray-800 text-white px-6 py-3 rounded-lg">My Listings</Link>
      </div>
    </div>
  );
}