export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">Hallooyi Automobile</h3>
          <p className="text-sm">Your trusted platform for buying and selling cars in Nigeria.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1">
            <li><a href="/search" className="hover:text-white">Browse Cars</a></li>
            <li><a href="/seller/add" className="hover:text-white">Sell Your Car</a></li>
            <li><a href="/compare" className="hover:text-white">Compare Cars</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p className="text-sm">support@hallooyi.com</p>
          <p className="text-sm">+234 800 123 4567</p>
        </div>
      </div>
      <div className="text-center text-xs mt-8 pt-4 border-t border-gray-800">
        &copy; 2026 Hallooyi Automobile. All rights reserved.
      </div>
    </footer>
  );
}