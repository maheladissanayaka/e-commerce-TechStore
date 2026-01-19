import { getProducts } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import MainContentWrapper from "@/components/layout/MainContentWrapper";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; min?: string; max?: string };
}) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await searchParams;
  const products = await getProducts(resolvedParams);

  return (
    <main className="bg-gray-50 min-h-screen">
      
      {/* 1. Sidebar (Fixed to left, controlled by UI Context) */}
      <Sidebar />

      {/* 2. Main Content Wrapper (Adjusts padding based on Sidebar state) */}
      <MainContentWrapper>
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {resolvedParams?.q ? `Results for "${resolvedParams.q}"` : "Our Products"}
            </h2>
            <span className="text-sm text-gray-500">
                {products.length} Products Found
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </MainContentWrapper>

    </main>
  );
}