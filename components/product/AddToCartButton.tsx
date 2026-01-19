"use client";

import { useCartStore } from "@/store/useCartStore";

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product);
    alert("Added to cart!"); // Simple feedback for now
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-black text-white px-8 py-4 rounded-lg text-lg hover:bg-gray-800 transition w-full md:w-auto"
    >
      Add to Cart
    </button>
  );
}