"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductRowProps {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    stock: number;
  };
}

export default function ProductRow({ product }: ProductRowProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product Deleted!");
        router.refresh(); // Reloads the page data without full refresh
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      alert("Error deleting product.");
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
      </td>
      <td className="p-4 font-medium">{product.name}</td>
      <td className="p-4 text-gray-500">{product.category}</td>
      <td className="p-4">${product.price}</td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="p-4 text-right">
        <button 
          onClick={handleDelete}
          className="text-red-600 hover:text-red-900 font-medium text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}