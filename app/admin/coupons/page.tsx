"use client";
import { useState, useEffect } from "react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
  });

  // Fetch coupons on load
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Coupon Created!");
      setForm({ code: "", discountPercent: "", expiryDate: "" });
      fetchCoupons(); // Refresh list
    } else {
      alert("Error creating coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchCoupons();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Coupons</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: Create Form */}
        <div className="bg-white p-6 rounded-lg shadow border h-fit">
          <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* INPUT 1: COUPON CODE */}
            <div>
              {/* Added htmlFor */}
              <label htmlFor="couponCode" className="block text-sm font-medium">
                Coupon Code
              </label>
              <input
                id="couponCode" /* Added ID to match label */
                type="text"
                placeholder="e.g. SUMMER25"
                className="w-full border p-2 rounded uppercase"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
              />
            </div>
            
            {/* INPUT 2: DISCOUNT */}
            <div>
              {/* Added htmlFor */}
              <label htmlFor="discount" className="block text-sm font-medium">
                Discount Percentage (%)
              </label>
              <input
                id="discount" /* Added ID to match label */
                type="number"
                placeholder="e.g. 10"
                className="w-full border p-2 rounded"
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                required
                min="1"
                max="100"
              />
            </div>

            {/* INPUT 3: EXPIRY DATE */}
            <div>
              {/* Added htmlFor */}
              <label htmlFor="expiryDate" className="block text-sm font-medium">
                Expiry Date
              </label>
              <input
                id="expiryDate" /* Added ID to match label */
                type="date"
                className="w-full border p-2 rounded"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                required
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Create Coupon
            </button>
          </form>
        </div>

        {/* RIGHT: List of Coupons */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Active Coupons</h2>
          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Expires</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No coupons found.</td>
                  </tr>
                )}
                {coupons.map((coupon: any) => (
                  <tr key={coupon._id} className="border-b">
                    <td className="p-3 font-bold text-blue-600">{coupon.code}</td>
                    <td className="p-3">{coupon.discountPercent}%</td>
                    <td className="p-3 text-sm">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}