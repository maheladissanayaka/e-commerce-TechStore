"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminOrderRow({ order }: { order: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "text-green-600 bg-green-50 border-green-200";
      case "Shipped": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 font-mono text-xs text-gray-500">
        {order._id.substring(0, 8)}...
      </td>

      <td className="p-4">
        <div className="font-semibold text-sm">{order.user?.name || "Guest"}</div>
        <div className="text-xs text-gray-400">{order.user?.email}</div>
      </td>

      <td className="p-4 text-sm text-gray-600">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>

      <td className="p-4 font-bold text-gray-800">
        ${order.totalAmount?.toFixed(2)}
      </td>

      <td className="p-4">
        {/* 👇 FIXED: Added aria-label="Order Status" */}
        <select
          aria-label="Order Status"
          disabled={isLoading}
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`border rounded px-2 py-1 text-xs font-bold cursor-pointer outline-none ${getStatusColor(order.status)}`}
        >
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {isLoading && <span className="ml-2 text-xs text-gray-400">...</span>}
      </td>

      <td className="p-4">
        <div className="flex -space-x-2 overflow-hidden">
          {order.items?.slice(0, 3).map((item: any, i: number) => (
            <div key={i} className="relative w-8 h-8 rounded-full border border-white shadow-sm bg-gray-200">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-full"
                />
              )}
            </div>
          ))}
          {order.items?.length > 3 && (
            <div className="w-8 h-8 rounded-full border border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}