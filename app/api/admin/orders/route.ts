import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import User from "@/models/User"; // Required to populate user details

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    // Fetch all orders, sort by newest, and populate User details (name/email)
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();
    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Error updating order" }, { status: 500 });
  }
}