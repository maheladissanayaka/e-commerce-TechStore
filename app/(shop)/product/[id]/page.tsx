import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/services/productService";
import AddToCartButton from "@/components/product/AddToCartButton";
// 👇 Import the new components (Make sure you created these files!)
import WishlistButton from "@/components/product/WishlistButton";
import ReviewSection from "@/components/product/ReviewSection";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await getProductById(params.id);

  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* LEFT: Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>

        {/* RIGHT: Product Details */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-gray-500 mt-1">{product.category}</p>
            </div>
            {/* 👇 Wishlist Heart Button */}
            <WishlistButton productId={product._id} />
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold">${product.price}</p>
            {/* Show Average Rating if it exists */}
            {product.rating > 0 && (
              <span className="text-yellow-600 font-medium">
                ★ {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            )}
          </div>

          <div className="prose max-w-none text-gray-700">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Stock Status */}
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* 👇 Reviews Section at the bottom */}
      <div className="border-t pt-10">
        <ReviewSection productId={product._id} reviews={product.reviews || []} />
      </div>
    </div>
  );
}