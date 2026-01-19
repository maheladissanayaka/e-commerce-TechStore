import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4">TechStore.</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            We are a premium e-commerce platform dedicated to providing the best tech gadgets and accessories. 
            Quality products, fast shipping, and excellent customer support.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/orders" className="hover:text-white">My Orders</Link></li>
            <li><Link href="/profile" className="hover:text-white">Profile</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition">
              <span>📘</span> {/* Facebook Placeholder */}
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-pink-600 transition">
              <span>📷</span> {/* Instagram Placeholder */}
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-blue-400 transition">
              <span>🐦</span> {/* Twitter Placeholder */}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} TechStore. All rights reserved.
      </div>
    </footer>
  );
}