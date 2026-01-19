"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // ✅ Added "Coupons" to this list so it gets the active style automatically
  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Coupons", href: "/admin/coupons" }, 
  ];

  return (
    <>
      {/* MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-50 relative">
        <h2 className="font-bold text-xl text-blue-600">AdminPanel</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 focus:outline-none"
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* OVERLAY (Background dimming on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b hidden md:block">
          <h2 className="text-2xl font-bold text-blue-600">AdminPanel</h2>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile click
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-10">
            <Link
              href="/"
              className="block px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Exit to Store
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}