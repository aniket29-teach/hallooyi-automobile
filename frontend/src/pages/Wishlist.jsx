import { useEffect, useState } from 'react';
import api from '../utils/api';
import CarCard from '../components/CarCard';

export default function Wishlist() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get('/cars').then(r => setCars(r.data.slice(0, 4)));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cars.map(car => <CarCard key={car.id} car={car} />)}
      </div>
    </div>
  );
}