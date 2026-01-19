"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image for preview

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // New state for image upload

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    image: "", // This will store the Cloudinary URL
    stock: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW: Handle File Selection & Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true); // Start loading spinner

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (res.ok) {
        // Set the Cloudinary URL into our formData
        setFormData((prev) => ({ ...prev, image: json.url }));
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setUploading(false); // Stop loading spinner
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Product Created Successfully!");
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("❌ Failed to create product.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... Name, Description, Price, Stock fields remain the same ... */}
      
      {/* KEEP THESE FIELDS (Just copying Name for context) */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input id="name" type="text" name="name" value={formData.name} required className="w-full border rounded-lg px-4 py-2 outline-none" onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" name="description" value={formData.description} required rows={4} className="w-full border rounded-lg px-4 py-2 outline-none" onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
           <input id="price" type="number" name="price" value={formData.price} required step="0.01" className="w-full border rounded-lg px-4 py-2 outline-none" onChange={handleChange} />
        </div>
        <div>
           <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
           <input id="stock" type="number" name="stock" value={formData.stock} required className="w-full border rounded-lg px-4 py-2 outline-none" onChange={handleChange} />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select id="category" name="category" value={formData.category} className="w-full border rounded-lg px-4 py-2 bg-white outline-none" onChange={handleChange}>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
          <option value="Wearables">Wearables</option>
        </select>
      </div>

      {/* --- NEW IMAGE UPLOAD SECTION (Fixed) --- */}
      <div>
        <label 
          htmlFor="image-upload" // <--- 1. Link this
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Image
        </label>
        
        {/* File Input */}
        <input
          id="image-upload" // <--- 2. To this ID
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />

        {/* Loading Indicator */}
        {uploading && <p className="text-sm text-blue-600 mt-2">Uploading image...</p>}

        {/* Preview the uploaded image */}
        {formData.image && (
          <div className="mt-4 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
            <Image 
              src={formData.image} 
              alt="Product Preview" 
              fill 
              className="object-cover" 
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || uploading} // Disable if submitting OR uploading image
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}