import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import CarDetails from './pages/CarDetails';
import Compare from './pages/Compare';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageListings from './pages/admin/ManageListings';
import ManageUsers from './pages/admin/ManageUsers';
import Categories from './pages/admin/Categories';
import SellerDashboard from './pages/seller/SellerDashboard';
import MyListings from './pages/seller/MyListings';
import AddCar from './pages/seller/AddCar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/listings" element={<ManageListings />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/listings" element={<MyListings />} />
              <Route path="/seller/add" element={<AddCar />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;