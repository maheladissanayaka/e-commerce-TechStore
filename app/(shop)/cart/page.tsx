"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import EmptyCart from "./_components/EmptyCart";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";

export default function CartPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // This is the % (e.g., 10 for 10%)

  const applyCoupon = async () => {
    // Basic validation
    if (!couponCode) return;
    
    const res = await fetch("/api/coupons/verify", {
      method: "POST",
      body: JSON.stringify({ code: couponCode }),
    });
    const data = await res.json();
    if (res.ok) {
      setDiscount(data.discount);
      alert(`Coupon applied! ${data.discount}% off`);
    } else {
      alert(data.error);
      setDiscount(0);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <button
              onClick={clearCart}
              className="text-gray-500 text-sm hover:text-black underline mt-4"
            >
              Clear Cart
            </button>
          </div>

          {/* RIGHT COLUMN: Coupon + Summary */}
          <div className="h-fit space-y-6">
            
            {/* 👇 NEW: Coupon Input Section */}
            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Have a coupon?</h3>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="border p-2 rounded w-full uppercase"
                    />
                    <button 
                        onClick={applyCoupon}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* 👇 Pass the discount prop to Summary */}
            <CartSummary discount={discount} />
          </div>
        </div>
      )}
    </div>
  );
}