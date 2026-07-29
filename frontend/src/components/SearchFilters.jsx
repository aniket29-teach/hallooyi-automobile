import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({ make: '', model: '', year: '', minPrice: '', maxPrice: '', location: '', condition: '', category: '' });

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input name="search" placeholder="Search make, model..." onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <input name="make" placeholder="Make" onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <input name="model" placeholder="Model" onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <input name="year" placeholder="Year" onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <input name="minPrice" placeholder="Min Price" onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <input name="maxPrice" placeholder="Max Price" onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <input name="location" placeholder="Location" onChange={handleChange} className="border p-2 rounded-lg w-full" />
        <select name="condition" onChange={handleChange} className="border p-2 rounded-lg w-full">
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="certified">Certified</option>
        </select>
      </div>
      <button onClick={() => onSearch(filters)} className="mt-4 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full md:w-auto">
        <Search size={18} /> Search Cars
      </button>
    </div>
  );
}