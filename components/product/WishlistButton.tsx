"use client";
import { useState } from "react";

export default function WishlistButton({ productId }: { productId: string }) {
  const [liked, setLiked] = useState(false);

  const toggleWishlist = async () => {
    // Optimistic UI update (changes instantly before server replies)
    setLiked(!liked); 

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Ensure state matches server reality
        setLiked(data.isInWishlist);
      } else {
        // Revert if error (e.g., user not logged in)
        setLiked(!liked);
        alert("Please login to save items to your wishlist.");
      }
    } catch (error) {
      setLiked(!liked);
    }
  };

  return (
    <button 
      onClick={toggleWishlist} 
      className="text-2xl hover:scale-110 transition-transform p-2 rounded-full hover:bg-gray-100"
      title="Add to Wishlist"
    >
      {liked ? "❤️" : "🤍"}
    </button>
  );
}