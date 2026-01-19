import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await connectDB();

  const user = await User.findById(session.user.id);
  const isInWishlist = user.wishlist.includes(productId);

  if (isInWishlist) {
    // Remove
    user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
  } else {
    // Add
    user.wishlist.push(productId);
  }

  await user.save();
  return NextResponse.json({ isInWishlist: !isInWishlist });
}