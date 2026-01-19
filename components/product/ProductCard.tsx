"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore"; // 1. Import the store

interface ProductProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  // 2. Get the addItem function from the store
  const addItem = useCartStore((state) => state.addItem);

  // 3. Create a handle function
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the Link from clicking through to the product page
    addItem(product);   // Actually adds the item
    // Optional: You can remove the alert if you want it to be silent, 
    // or keep it to confirm action.
    // alert("Added to cart!"); 
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      <Link href={`/product/${product._id}`}>
        <div className="relative w-full h-48 bg-gray-200 cursor-pointer">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product._id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-black">
            ${product.price}
          </span>
          {/* 4. Attach the real click handler */}
          <button 
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}