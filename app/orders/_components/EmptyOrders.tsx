"use client";

import Link from "next/link";

export default function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-lg border border-dashed">
      <div className="text-5xl mb-4">📦</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6">Looks like you haven&apos;t made your first purchase.</p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Start Shopping
      </Link>
    </div>
  );
}