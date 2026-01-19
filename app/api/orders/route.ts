import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // Import directly to ensure it's registered

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await connectDB();

    // 1. Find the User
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. TRANSFORM DATA: Map '_id' from the cart to 'product' for the database
    const orderItems = items.map((item: any) => ({
      ...item,
      product: item._id, // <--- THIS FIXES THE ERROR
    }));

    // 3. Create Order
    const newOrder = await Order.create({
      user: user._id,
      items: orderItems, // Use the transformed data
      totalAmount,
      status: "pending",
    });

    return NextResponse.json({ message: "Order placed!", orderId: newOrder._id }, { status: 201 });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ message: "Error placing order", error }, { status: 500 });
  }
}