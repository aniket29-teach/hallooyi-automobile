import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import CarCard from '../components/CarCard';
import SearchFilters from '../components/SearchFilters';

export default function Search() {
  const [cars, setCars] = useState([]);
  const [searchParams] = useSearchParams();

  const fetchCars = async (filters = {}) => {
    const params = new URLSearchParams({ ...filters, status: 'approved' });
    const { data } = await api.get(`/cars?${params.toString()}`);
    setCars(data);
  };

  useEffect(() => {
    const category = searchParams.get('category');
    fetchCars(category ? { category } : {});
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Car</h1>
      <SearchFilters onSearch={fetchCars} />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cars.map(car => <CarCard key={car.id} car={car} />)}
      </div>
      {cars.length === 0 && <p className="text-center text-gray-500 py-12">No cars found matching your criteria.</p>}
    </div>
  );
}