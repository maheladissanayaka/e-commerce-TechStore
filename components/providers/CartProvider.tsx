"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();

  // 1. Load Cart on Login / User Change
  useEffect(() => {
    const userId = session?.user?.email || "guest"; // Use email as unique ID
    const storageKey = `cart-${userId}`;

    // Reset store first to prevent flashing old user data
    useCartStore.setState({ items: [] });

    const savedCart = localStorage.getItem(storageKey);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const now = Date.now();
        
        // Filter out items older than 24 hours
        const validItems = parsedCart.filter((item: any) => {
           return item.addedAt && (now - item.addedAt < EXPIRATION_MS);
        });

        useCartStore.setState({ items: validItems });
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, [session?.user?.email]);

  // 2. Save Cart whenever items change
  useEffect(() => {
    const userId = session?.user?.email || "guest";
    const storageKey = `cart-${userId}`;
    
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, session?.user?.email]);

  return <>{children}</>;
}