"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSummary({ discount = 0 }: { discount?: number }) {
  const { items, clearCart } = useCartStore(); // Added clearCart to empty it after success
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to COD
  const router = useRouter();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            items, 
            totalAmount: total,
            paymentMethod // 👈 Send "COD" to the server
        }), 
      });
      const data = await res.json();
      
      if (data.url) {
        clearCart(); // Empty the cart because order is placed!
        window.location.href = data.url;
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      {/* 👇 Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-sm text-gray-700">Payment Method</h3>
        <div className="space-y-2">
            <label className="flex items-center space-x-2 border p-3 rounded cursor-pointer bg-white">
                <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-black"
                />
                <span>Cash on Delivery (COD)</span>
            </label>
            {/* You can re-enable this later when you fix Stripe */}
            <label className="flex items-center space-x-2 border p-3 rounded cursor-pointer bg-gray-100 text-gray-400">
                <input 
                    type="radio" 
                    name="payment" 
                    value="Card" 
                    disabled
                />
                <span>Credit Card (Unavailable)</span>
            </label>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
            <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
            </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
      >
        {loading ? "Processing Order..." : "Place Order (COD)"}
      </button>
    </div>
  );
}