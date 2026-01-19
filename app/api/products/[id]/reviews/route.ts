import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import User from "@/models/User"; // Import User model for the fail-safe

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Please login" }, { status: 401 });
    }

    const { rating, comment } = await req.json();
    await connectDB();

    // 👇 FAIL-SAFE: If session.user.id is missing, find user by Email
    let userId = (session.user as any).id;
    
    if (!userId) {
      console.log("⚠️ ID missing from session. Using Email Fallback...");
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        userId = dbUser._id;
      } else {
        return NextResponse.json({ error: "User account not found" }, { status: 404 });
      }
    }

    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Ensure reviews array exists
    if (!product.reviews) {
      product.reviews = [];
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json({ error: "Product already reviewed" }, { status: 400 });
    }

    const review = {
      name: session.user.name || "User",
      rating: Number(rating),
      comment,
      user: userId, // Now we are 100% sure this exists
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    product.rating =
      product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    return NextResponse.json({ message: "Review added" });
  } catch (error) {
    console.error("REVIEW ERROR:", error);
    return NextResponse.json({ error: "Error adding review" }, { status: 500 });
  }
}