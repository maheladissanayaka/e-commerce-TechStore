import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";

// Update this function signature to accept filters
export async function getProducts(searchParams?: { q?: string; category?: string }) {
  await connectDB();

  // 1. Build the Query Object
  const query: any = {};

  // If there is a search term, look for it in the Name OR Description
  if (searchParams?.q) {
    query.$or = [
      { name: { $regex: searchParams.q, $options: "i" } }, // 'i' means case-insensitive
      { description: { $regex: searchParams.q, $options: "i" } },
    ];
  }

  // If there is a category, filter by it
  if (searchParams?.category && searchParams.category !== "All") {
    query.category = searchParams.category;
  }

  // 2. Fetch with the query
  const products = await Product.find(query).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}

// Add this to existing imports if needed, or just ensure Product is imported
// import { Product } from "@/models/Product";

export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    return null;
  }
}

