import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import AdminSidebar from "../_components/AdminSidebar";
import Link from "next/link";
import ProductRow from "./_components/ProductRow";

// Helper to fetch raw data
async function getAdminProducts() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const products = await getAdminProducts();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add New Product
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm text-gray-500 uppercase">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <ProductRow key={product._id} product={product} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}