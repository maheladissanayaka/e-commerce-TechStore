import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";

// GET: Fetch all coupons
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "admin") return NextResponse.json({}, { status: 401 });

    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching coupons" }, { status: 500 });
  }
}

// POST: Create a new coupon
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "admin") return NextResponse.json({}, { status: 401 });

    const { code, discountPercent, expiryDate } = await req.json();
    await connectDB();

    const newCoupon = await Coupon.create({
      code,
      discountPercent,
      expiryDate,
    });

    return NextResponse.json(newCoupon);
  } catch (error) {
    return NextResponse.json({ error: "Error creating coupon" }, { status: 500 });
  }
}

// DELETE: Delete a coupon
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "admin") return NextResponse.json({}, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectDB();
    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting coupon" }, { status: 500 });
  }
}