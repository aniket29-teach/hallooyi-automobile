import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AddCar() {
  const [form, setForm] = useState({ make: '', model: '', year: '', price: '', location: '', car_condition: 'used', description: '', category_id: 1, mileage: '', fuel_type: 'petrol', transmission: 'automatic', color: '' });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    Array.from(images).forEach(file => data.append('images', file));

    try {
      await api.post('/cars', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Car submitted for approval');
      navigate('/seller');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="make" placeholder="Make" required className="border p-3 rounded-lg" onChange={handleChange} />
          <input name="model" placeholder="Model" required className="border p-3 rounded-lg" onChange={handleChange} />
          <input name="year" placeholder="Year" type="number" required className="border p-3 rounded-lg" onChange={handleChange} />
          <input name="price" placeholder="Price" type="number" required className="border p-3 rounded-lg" onChange={handleChange} />
          <input name="location" placeholder="Location" required className="border p-3 rounded-lg" onChange={handleChange} />
          <input name="mileage" placeholder="Mileage (km)" type="number" className="border p-3 rounded-lg" onChange={handleChange} />
          <select name="car_condition" className="border p-3 rounded-lg" onChange={handleChange}>
            <option value="new">New</option><option value="used">Used</option><option value="certified">Certified</option>
          </select>
          <select name="fuel_type" className="border p-3 rounded-lg" onChange={handleChange}>
            <option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option>
          </select>
          <select name="transmission" className="border p-3 rounded-lg" onChange={handleChange}>
            <option value="automatic">Automatic</option><option value="manual">Manual</option>
          </select>
          <input name="color" placeholder="Color" className="border p-3 rounded-lg" onChange={handleChange} />
        </div>
        <textarea name="description" placeholder="Description" rows="4" className="w-full border p-3 rounded-lg" onChange={handleChange}></textarea>
        <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="w-full border p-3 rounded-lg" />
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">Submit Listing</button>
      </form>
    </div>
  );
}