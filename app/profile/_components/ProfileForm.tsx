"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
          image: data.image || "",
        }));
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        image: formData.image,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Profile updated successfully!");
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      
      await update({
        ...session,
        user: { ...session?.user, name: data.name, image: data.image },
      });
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <ProfileAvatar image={formData.image} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
          <input
            id="email" // Added ID
            type="text"
            value={formData.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">Full Name</label>
          <input
            id="name" // Added ID
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Profile Image URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-bold mb-1">Profile Image URL</label>
          <input
            id="image" // Added ID
            type="text"
            placeholder="https://example.com/my-photo.jpg"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Paste a link to an image on the web.</p>
        </div>

        <hr className="my-6 border-gray-200" />
        <h3 className="font-bold text-lg">Change Password</h3>
        <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change it.</p>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
          <input
            id="newPassword" // Added ID
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Current Password</label>
          <input
            id="currentPassword" // Added ID
            type="password"
            placeholder="Required to set new password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full border p-2 rounded"
            required={formData.newPassword.length > 0}
          />
        </div>

        {message && (
          <div className={`p-3 rounded text-sm ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
}