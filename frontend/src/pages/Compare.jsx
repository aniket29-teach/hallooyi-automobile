import { useState } from 'react';
import api from '../utils/api';
import { Search } from 'lucide-react';

export default function Compare() {
  const [ids, setIds] = useState('');
  const [cars, setCars] = useState([]);

  const handleCompare = async () => {
    const carIds = ids.split(',').map(s => s.trim()).filter(Boolean);
    if (carIds.length < 2 || carIds.length > 4) return alert('Enter 2 to 4 car IDs separated by commas');
    const { data } = await api.post('/compare/data', { car_ids: carIds });
    setCars(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compare Cars</h1>
      <div className="flex gap-2 mb-6">
        <input placeholder="Enter car IDs: 1,2,3" className="border p-3 rounded-lg flex-grow" value={ids} onChange={e => setIds(e.target.value)} />
        <button onClick={handleCompare} className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Search size={18}/> Compare</button>
      </div>
      {cars.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Feature</th>
                {cars.map(c => <th key={c.id} className="p-4 text-left">{c.make} {c.model}</th>)}
              </tr>
            </thead>
            <tbody>
              {['make','model','year','price','location','car_condition','fuel_type','transmission','color'].map(field => (
                <tr key={field} className="border-t">
                  <td className="p-4 font-semibold capitalize">{field.replace('_',' ')}</td>
                  {cars.map(c => <td key={c.id} className="p-4">{c[field]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}