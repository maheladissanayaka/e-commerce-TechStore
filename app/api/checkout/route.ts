import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ url: "/login" });
    }

    // 👇 Get paymentMethod from the request
    const { items, totalAmount, paymentMethod } = await req.json();
    await connectDB();

    // Fail-Safe: Find User ID
    let userId = (session.user as any).id;
    if (!userId) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) userId = dbUser._id;
    }

    // Create the Order
    await Order.create({
      user: userId,
      items: items.map((item: any) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      status: "Processing",
      paymentMethod, // 👈 Save "COD" or "Card" here
    });

    return NextResponse.json({ url: "/orders" });
    
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}