"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartButton() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Wait until the component runs in the browser before showing the number
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total items (e.g. if you have 2 keyboards, count is 2, not 1)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    return null; // Don't show anything until loaded to prevent errors
  }

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
    >
      <span>🛒</span>
      <span className="font-bold">Cart ({totalItems})</span>
    </Link>
  );
}