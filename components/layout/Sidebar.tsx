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

  // Update local state when URL params change
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  // Function to push new params to URL
  const applyFilters = (newMin?: string, newMax?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Category Logic
    if (category && category !== "All") params.set("category", category);
    else params.delete("category");

    // Price Logic (Use passed values or current state)
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

  // ✅ Updated Ranges to match your Screenshot
  const priceRanges = [
    { label: "Under-1471", min: "0", max: "1471" },
    { label: "1471-5799", min: "1471", max: "5799" },
    { label: "5799-31240", min: "5799", max: "31240" },
    { label: "31240-40068", min: "31240", max: "40068" },
    { label: "40068-Over", min: "40068", max: "" },
  ];

  // Sidebar visibility logic
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
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">Price</h3>
            <button 
              type="button"
              className="text-xs text-gray-400 hover:text-black underline"
              onClick={() => { setMinPrice(""); setMaxPrice(""); applyFilters("", ""); }}
            >
              Reset
            </button>
          </div>

          {/* Manual Input Row (Matches Screenshot Layout) */}
          <form onSubmit={handleManualPriceSubmit} className="flex items-center gap-2 mb-4">
            <div className="flex-1">
              <input
                type="number"
                placeholder="LKR"
                aria-label="Min Price"
                className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-black text-center"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="LKR"
                aria-label="Max Price"
                className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-black text-center"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            {/* OK Button */}
            <button 
                type="submit" 
                className="bg-black text-white px-3 py-2 text-sm font-bold hover:bg-gray-800 transition"
            >
                OK
            </button>
          </form>

          {/* Radio Buttons List */}
          <div className="space-y-3">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                    <input 
                        type="radio" 
                        name="price_range" 
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-black transition-all"
                        checked={minPrice === range.min && maxPrice === range.max}
                        onChange={() => handlePriceRangeClick(range.min, range.max)}
                        aria-label={range.label}
                    />
                    {/* Inner dot for radio button */}
                    <span className="absolute w-2.5 h-2.5 bg-black rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></span>
                </div>
                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                    {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}