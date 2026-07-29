import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function MyListings() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get('/sellers/my-listings').then(r => setCars(r.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100"><tr><th className="p-4 text-left">Car</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Orders</th></tr></thead>
          <tbody>
            {cars.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-4">{c.make} {c.model} ({c.year})</td>
                <td className="p-4 text-center">₦{Number(c.price).toLocaleString()}</td>
                <td className="p-4 text-center capitalize"><span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span></td>
                <td className="p-4 text-center">{c.order_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}