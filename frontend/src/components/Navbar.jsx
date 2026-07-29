import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Search, Heart, ShoppingCart, User, Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) api.get('/notifications/unread-count').then(r => setUnread(r.data.count));
  }, [user]);

  return (
    <nav className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Car size={28} />
            <span>HALLOOYI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="flex items-center space-x-1 hover:text-red-200">
              <Search size={18} /><span>Search</span>
            </Link>
            <Link to="/compare" className="hover:text-red-200">Compare</Link>
            <Link to="/wishlist" className="hover:text-red-200"><Heart size={18} /></Link>
            {user ? (
              <>
                <Link to="/orders" className="hover:text-red-200"><ShoppingCart size={18} /></Link>
                <Link to="/notifications" className="relative hover:text-red-200">
                  <Bell size={18} />
                  {unread > 0 && <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs rounded-full px-1">{unread}</span>}
                </Link>
                {user.role === 'admin' && <Link to="/admin" className="hover:text-red-200">Admin</Link>}
                {(user.role === 'seller' || user.role === 'admin') && <Link to="/seller" className="hover:text-red-200">Seller</Link>}
                <button onClick={() => { logout(); navigate('/'); }} className="hover:text-red-200 flex items-center gap-1">
                  <User size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-200">Login</Link>
                <Link to="/register" className="bg-white text-red-700 px-4 py-1 rounded-full font-semibold hover:bg-red-100">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-red-800 px-4 pb-4 space-y-2">
          <Link to="/search" className="block py-1">Search</Link>
          <Link to="/compare" className="block py-1">Compare</Link>
          {user ? (
            <>
              <Link to="/orders" className="block py-1">Orders</Link>
              {user.role === 'admin' && <Link to="/admin" className="block py-1">Admin</Link>}
              {(user.role === 'seller' || user.role === 'admin') && <Link to="/seller" className="block py-1">Seller</Link>}
              <button onClick={() => { logout(); navigate('/'); }} className="block py-1">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-1">Login</Link>
              <Link to="/register" className="block py-1">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}