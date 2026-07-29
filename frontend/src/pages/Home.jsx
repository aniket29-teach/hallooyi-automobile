import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import CarCard from '../components/CarCard';
import { Search, Shield, Truck, Headphones } from 'lucide-react';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/cars/featured/list').then(r => setFeatured(r.data));
    api.get('/admin/categories').then(r => setCategories(r.data));
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Car</h1>
          <p className="text-xl mb-8 text-red-100">Nigeria's most trusted automobile marketplace</p>
          <Link to="/search" className="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition">
            <Search size={20} /> Browse Cars
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(c => (
            <Link key={c.id} to={`/search?category=${c.name}`} className="bg-white p-4 rounded-xl shadow text-center hover:shadow-md transition border">
              <h3 className="font-semibold text-gray-800">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-100 rounded-3xl mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(car => <CarCard key={car.id} car={car} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/search" className="text-red-600 font-semibold hover:underline">View All Cars &rarr;</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
        <div className="p-6">
          <Shield className="mx-auto text-red-600 mb-4" size={40} />
          <h3 className="font-bold text-lg mb-2">Verified Listings</h3>
          <p className="text-gray-500 text-sm">Every car is inspected and approved by our moderators.</p>
        </div>
        <div className="p-6">
          <Truck className="mx-auto text-red-600 mb-4" size={40} />
          <h3 className="font-bold text-lg mb-2">Nationwide Delivery</h3>
          <p className="text-gray-500 text-sm">We deliver to any location across Nigeria.</p>
        </div>
        <div className="p-6">
          <Headphones className="mx-auto text-red-600 mb-4" size={40} />
          <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
          <p className="text-gray-500 text-sm">Our team is always ready to assist you.</p>
        </div>
      </div>
    </div>
  );
}