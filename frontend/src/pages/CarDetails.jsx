import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Fuel, Settings, Calendar, Gauge, Palette } from 'lucide-react';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/cars/${id}`).then(r => setCar(r.data));
  }, [id]);

  const addToWishlist = async () => {
    if (!user) return toast.error('Please login first');
    try {
      await api.post('/wishlist', { car_id: id });
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const placeOrder = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/orders', { car_id: id, amount: car.price, payment_method: 'card', shipping_address: car.location });
      toast.success('Order placed! Proceed to payment.');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    await api.post('/reviews', { car_id: id, ...review });
    toast.success('Review submitted');
    window.location.reload();
  };

  if (!car) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-96 bg-gray-200 rounded-xl overflow-hidden">
            <img src={`http://localhost:5000${car.images?.[0]?.image_url || ''}`} alt={car.model} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {car.images?.map((img, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg overflow-hidden">
                <img src={`http://localhost:5000${img.image_url}`} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{car.make} {car.model} ({car.year})</h1>
          <p className="text-red-600 text-3xl font-bold mt-2">₦{Number(car.price).toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-gray-600"><Calendar size={18} /> Year: {car.year}</div>
            <div className="flex items-center gap-2 text-gray-600"><Gauge size={18} /> Mileage: {car.mileage?.toLocaleString()} km</div>
            <div className="flex items-center gap-2 text-gray-600"><Fuel size={18} /> Fuel: {car.fuel_type}</div>
            <div className="flex items-center gap-2 text-gray-600"><Settings size={18} /> Transmission: {car.transmission}</div>
            <div className="flex items-center gap-2 text-gray-600"><Palette size={18} /> Color: {car.color}</div>
            <div className="flex items-center gap-2 text-gray-600"><MapPin size={18} /> Location: {car.location}</div>
          </div>
          <p className="mt-6 text-gray-700 leading-relaxed">{car.description}</p>
          <div className="flex gap-4 mt-8">
            <button onClick={placeOrder} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">Place Order</button>
            <button onClick={addToWishlist} className="flex-1 border-2 border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50">Add to Wishlist</button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="bg-white p-4 rounded-xl shadow mb-6">
            <select className="border p-2 rounded mb-2" value={review.rating} onChange={e => setReview({...review, rating: e.target.value})}>
              {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} Stars</option>)}
            </select>
            <textarea className="w-full border p-2 rounded mb-2" placeholder="Write a review..." onChange={e => setReview({...review, comment: e.target.value})} required />
            <button className="bg-red-600 text-white px-4 py-2 rounded">Submit Review</button>
          </form>
        )}
        <div className="space-y-4">
          {car.reviews?.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between">
                <span className="font-bold">{r.reviewer_name}</span>
                <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-gray-600 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}