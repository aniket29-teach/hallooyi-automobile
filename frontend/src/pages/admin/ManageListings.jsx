import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function ManageListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    const { data } = await api.get('/admin/pending-listings');
    setListings(data);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/admin/listings/${id}/approve`, { status });
    toast.success(`Listing ${status}`);
    fetchListings();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Listings</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr><th className="p-4 text-left">Car</th><th className="p-4">Seller</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {listings.map(l => (
              <tr key={l.id} className="border-t">
                <td className="p-4">{l.make} {l.model} ({l.year})</td>
                <td className="p-4 text-center">{l.seller_name}</td>
                <td className="p-4 text-center">₦{Number(l.price).toLocaleString()}</td>
                <td className="p-4 text-center"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold uppercase">{l.status}</span></td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => updateStatus(l.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => updateStatus(l.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {listings.length === 0 && <p className="text-center py-8 text-gray-500">No pending listings.</p>}
      </div>
    </div>
  );
}