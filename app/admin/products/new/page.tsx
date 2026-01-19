import Link from "next/link";
import ProductForm from "./_components/ProductForm";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-start">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-2xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Add New Product
          </h1>
          <Link
            href="/admin/products"
            className="text-sm text-gray-500 hover:text-red-500 hover:underline transition"
          >
            Cancel
          </Link>
        </div>

        {/* Form Section */}
        <ProductForm />
      </div>
    </div>
  );
}