import { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my-orders').then(r => setOrders(r.data));
  }, []);

  const payNow = async (orderId, amount) => {
    try {
      await api.post('/payments/process', { order_id: orderId, amount, method: 'card' });
      toast.success('Payment successful!');
      window.location.reload();
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{o.make} {o.model} ({o.year})</h3>
              <p className="text-gray-500">Order #{o.id} &bull; {o.status}</p>
              <p className="text-red-600 font-bold mt-1">₦{Number(o.amount).toLocaleString()}</p>
            </div>
            {o.status === 'pending' && (
              <button onClick={() => payNow(o.id, o.amount)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Pay Now</button>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
}