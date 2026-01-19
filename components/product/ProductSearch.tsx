"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state with current URL params
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category && category !== "All") params.set("category", category);

    router.push(`/?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center"
      role="search" // Helps accessibility tools identify this as a search region
    >
      {/* Search Input */}
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="Search products..."
          aria-label="Search products" // <--- FIXED: Added accessible name
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Dropdown */}
      <div className="w-full md:w-48">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category" // <--- FIXED: Added accessible name
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
          <option value="Wearables">Wearables</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
      >
        Search
      </button>
    </form>
  );
}