"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSummary({ discount = 0 }: { discount?: number }) {
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Payzy"); // Default to Payzy
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
          paymentMethod, // Will send "Payzy", "Card", or "COD"
        }),
      });

      const data = await res.json();

      // If the backend returns a URL (for Payzy or a Card processor like Stripe)
      if (data.url) {
        window.location.href = data.url;
      } 
      // If it's COD, there is no URL, so we just clear cart and redirect to success
      else if (paymentMethod === "COD") {
        clearCart();
        router.push("/orders"); 
      } 
      else {
        console.error("Failed to initialize checkout:", data);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-sm text-gray-700">Payment Method</h3>
        <div className="space-y-2">
          
          {/* Option 1: Payzy */}
          <label className={`flex items-center space-x-2 border p-3 rounded cursor-pointer ${paymentMethod === 'Payzy' ? 'bg-black/5 border-black' : 'bg-white'}`}>
            <input
              type="radio"
              name="payment"
              value="Payzy"
              checked={paymentMethod === "Payzy"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-black"
            />
            <span>Payzy</span>
          </label>

          {/* Option 2: Credit/Debit Card */}
          <label className={`flex items-center space-x-2 border p-3 rounded cursor-pointer ${paymentMethod === 'Card' ? 'bg-black/5 border-black' : 'bg-white'}`}>
            <input
              type="radio"
              name="payment"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-black"
            />
            <span>Credit / Debit Card</span>
          </label>

          {/* Option 3: Cash on Delivery */}
          <label className={`flex items-center space-x-2 border p-3 rounded cursor-pointer ${paymentMethod === 'COD' ? 'bg-black/5 border-black' : 'bg-white'}`}>
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
        disabled={loading || total <= 0}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
      >
        {loading ? "Processing..." : `Place Order (${paymentMethod})`}
      </button>
    </div>
  );
}