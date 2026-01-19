"use client";

import Image from "next/image";
import { useCartStore, CartItem as CartItemType } from "@/store/useCartStore";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm items-start sm:items-center transition-all">
      {/* Product Image - Responsive sizing */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between min-h-[5rem]">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            ${item.price}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-2 sm:mt-0">
          <p className="text-sm text-gray-500">
            Qty: {item.quantity}
          </p>
          
          {/* Touch-friendly remove button area */}
          <button
            onClick={() => removeItem(item._id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 -mr-2"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}