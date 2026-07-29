import { Link } from 'react-router-dom';
import { MapPin, Fuel, Settings, Calendar } from 'lucide-react';
import { BASE_URL } from '../config';

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
      <div className="h-48 bg-gray-200 relative">
        {car.car_image || car.images?.[0]?.image_url ? (
          <img src={`${BASE_URL}${car.car_image || car.images?.[0]?.image_url}`} alt={car.model} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-bold ${car.car_condition === 'new' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
          {car.car_condition?.toUpperCase()}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{car.make} {car.model}</h3>
        <p className="text-red-600 font-bold text-xl mt-1">₦{Number(car.price).toLocaleString()}</p>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Calendar size={14} /> {car.year}</span>
          <span className="flex items-center gap-1"><Fuel size={14} /> {car.fuel_type}</span>
          <span className="flex items-center gap-1"><Settings size={14} /> {car.transmission}</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> {car.location}</span>
        </div>
        <Link to={`/car/${car.id}`} className="block mt-4 text-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          View Details
        </Link>
      </div>
    </div>
  );
}