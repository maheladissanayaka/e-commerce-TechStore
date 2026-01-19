"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUI } from "@/context/UIContext";

export default function Header() {
  const { toggleSidebar } = useUI();
  const { data: session } = useSession();
  const { items } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Hydration Fix: Ensure component is mounted before showing cart count
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search Logic
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("q", search);
    else params.delete("q");
    router.push(`/?${params.toString()}`);
  };

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50 h-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full gap-4">
          
          {/* 1. LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="text-2xl font-bold text-black tracking-tight flex-shrink-0">
              TechStore<span className="text-blue-600">.</span>
            </Link>
          </div>

          {/* 2. CENTER: Search Bar (AliExpress Style) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-auto">
            <div className="flex w-full border-2 border-black rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-black transition-all">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-white focus:outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-black text-white px-6 flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 3. RIGHT: Icons & Menu */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            <Link href="/cart" className="relative text-gray-700 hover:text-black transition">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-xs font-bold text-gray-500">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-20">
                      <div className="px-4 py-2 border-b bg-gray-50">
                        <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      {session.user?.role === "admin" && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-gray-100">
                          ⚡ Admin Panel
                        </Link>
                      )}
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">📦 My Orders</Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">⚙️ Profile Settings</Link>
                      <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t">Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-3 text-sm">
                 <Link href="/login" className="hover:underline pt-2">Login</Link>
                 <Link href="/register" className="bg-black text-white px-3 py-2 rounded hover:bg-gray-800">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}