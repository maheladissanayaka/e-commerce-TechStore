"use client";

import Image from "next/image";

interface OrderProps {
  order: {
    _id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
  };
}

export default function OrderCard({ order }: OrderProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Responsive Header: 
        - Mobile: 2 columns (2x2 grid)
        - Desktop: 4 columns (1 row) 
      */}
      <div className="bg-gray-50 p-4 border-b grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
        <div>
          <p className="text-xs uppercase font-bold text-gray-400">Order ID</p>
          <p className="font-mono text-black truncate">#{order._id.slice(-6)}</p>
        </div>
        <div>
          <p className="text-xs uppercase font-bold text-gray-400">Date</p>
          <p className="text-black">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase font-bold text-gray-400">Total</p>
          <p className="font-bold text-black">${order.totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex items-end md:items-start md:justify-end">
          <span
            className={`px-3 py-1 rounded-full text-xs uppercase font-bold ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* Image */}
            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Details */}
            <div className="flex-grow">
              <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-gray-900">
                  ${item.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}