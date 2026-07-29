import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = async () => {
    const { data } = await api.get('/admin/categories');
    setCats(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/admin/categories', form);
    toast.success('Category added');
    setForm({ name: '', description: '' });
    fetchCats();
  };

  const deleteCat = async (id) => {
    await api.delete(`/admin/categories/${id}`);
    toast.success('Deleted');
    fetchCats();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 flex gap-4">
        <input placeholder="Name" required className="border p-2 rounded flex-1" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Description" className="border p-2 rounded flex-1" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button className="bg-red-600 text-white px-6 py-2 rounded">Add</button>
      </form>
      <div className="bg-white rounded-xl shadow">
        {cats.map(c => (
          <div key={c.id} className="p-4 border-b flex justify-between items-center">
            <div><span className="font-bold">{c.name}</span> <span className="text-gray-500 text-sm ml-2">{c.description}</span></div>
            <button onClick={() => deleteCat(c.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}