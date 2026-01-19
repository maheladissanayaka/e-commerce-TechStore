"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";

export default function Sidebar() {
  const { isSidebarOpen } = useUI();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  // Apply filters function
  const applyFilters = (newMin?: string, newMax?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category && category !== "All") params.set("category", category);
    else params.delete("category");

    // Use provided values or state values
    const finalMin = newMin !== undefined ? newMin : minPrice;
    const finalMax = newMax !== undefined ? newMax : maxPrice;

    if (finalMin) params.set("min", finalMin);
    else params.delete("min");

    if (finalMax) params.set("max", finalMax);
    else params.delete("max");

    router.push(`/?${params.toString()}`);
  };

  const handleManualPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handlePriceRangeClick = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    applyFilters(min, max);
  };

  const priceRanges = [
    { label: "Under-1000", min: "0", max: "1000" },
    { label: "1000-5000", min: "1000", max: "5000" },
    { label: "5000-10000", min: "5000", max: "10000" },
    { label: "10000-50000", min: "10000", max: "50000" },
    { label: "50000-Over", min: "50000", max: "" },
  ];

  const sidebarClass = `fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 z-40 ${
    isSidebarOpen ? "w-64 px-6 py-6" : "w-0 px-0 overflow-hidden border-none"
  }`;

  return (
    <aside className={sidebarClass}>
      <div className={`${!isSidebarOpen && "hidden"} space-y-8`}>
        
        {/* 1. Category Section */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Category</h3>
          <select
            id="category-select"
            aria-label="Filter by Category" // 👈 Added Fix: Accessible Name
            value={category}
            onChange={(e) => {
                setCategory(e.target.value);
            }}
            className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:ring-2 focus:ring-black outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
          </select>
        </div>

        {/* 2. Price Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900">Price</h3>
            <button 
              type="button"
              className="text-gray-400 text-xs cursor-pointer hover:text-black"
              onClick={() => { setMinPrice(""); setMaxPrice(""); applyFilters("",""); }}
            >
              Reset
            </button>
          </div>

          {/* Manual Inputs Row */}
          <form onSubmit={handleManualPriceSubmit} className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="LKR"
              aria-label="Minimum Price" // 👈 Added Fix: Accessible Name
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-black"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-gray-400 self-center">-</span>
            <input
              type="number"
              placeholder="LKR"
              aria-label="Maximum Price" // 👈 Added Fix: Accessible Name
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-black"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button 
                type="submit" 
                className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
            >
                OK
            </button>
          </form>

          {/* Radio Buttons for Ranges */}
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                    <input 
                        type="radio" 
                        name="price_range" 
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-black transition-all"
                        checked={minPrice === range.min && maxPrice === range.max}
                        onChange={() => handlePriceRangeClick(range.min, range.max)}
                        aria-label={range.label} // 👈 Added Fix: Accessible Name
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></span>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-black">
                    {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button 
            onClick={() => applyFilters()} 
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition"
        >
          Apply Filters
        </button>

      </div>
    </aside>
  );
}