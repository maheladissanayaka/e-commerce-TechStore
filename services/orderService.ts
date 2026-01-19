import connectDB from "@/lib/mongodb";
import {Order} from "@/models/Order";
import { Product } from "@/models/Product"; // Required to populate product details

export async function getUserOrders(userId: string) {
  try {
    await connectDB();
    
    // Find orders belonging to this user
    // .populate() replaces the product ID with the actual product details
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) // Newest first
      .populate("items.product");

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}