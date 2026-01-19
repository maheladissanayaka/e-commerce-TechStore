import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";

export async function POST(req: Request) {
  const { code } = await req.json();
  await connectDB();

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return NextResponse.json({ error: "Invalid Coupon" }, { status: 400 });
  }

  // Check Expiry
  if (new Date() > new Date(coupon.expiryDate)) {
    return NextResponse.json({ error: "Coupon Expired" }, { status: 400 });
  }

  return NextResponse.json({ discount: coupon.discountPercent });
}