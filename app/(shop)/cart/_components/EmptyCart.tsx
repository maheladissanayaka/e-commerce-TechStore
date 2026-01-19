"use client";

import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-lg min-h-[300px]">
      <div className="text-6xl mb-4">🛒</div>
      <p className="text-xl md:text-2xl text-gray-600 mb-6 font-medium">
        Your cart is empty.
      </p>
      <Link 
        href="/" 
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
      >
        Start Shopping
      </Link>
    </div>
  );
}