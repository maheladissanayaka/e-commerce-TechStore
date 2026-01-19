"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewSection({ productId, reviews }: { productId: string, reviews: any[] }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });

    if (res.ok) {
      alert("Review Submitted!");
      setComment("");
      router.refresh(); // Reloads page to show new review
    } else {
      const data = await res.json();
      alert(data.error || "Error submitting review");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews ({reviews.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: List of Reviews */}
        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="text-gray-500 italic p-4 bg-gray-50 rounded">
              No reviews yet. Be the first to review!
            </div>
          )}
          {reviews.map((review: any) => (
            <div key={review._id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900">{review.name}</span>
                <span className="text-yellow-500 text-sm">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: Add Review Form */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit border">
          <h3 className="font-bold text-lg mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select 
                aria-label="Rating"
                className="w-full border p-2 rounded bg-white"
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                aria-label="Review Comment"
                className="w-full border p-2 rounded bg-white"
                rows={4}
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-black text-white px-4 py-3 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}