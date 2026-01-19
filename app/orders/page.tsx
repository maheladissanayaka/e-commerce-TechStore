import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserOrders } from "@/services/orderService";
import Order from "@/models/Order"; // This is the Database Model
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrderCard from "./_components/OrderCard";
import EmptyOrders from "./_components/EmptyOrders";

// 1. Define the shape of an Order Item
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 2. RENAME this interface to avoid conflict with the import above
interface OrderType {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch User ID
  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  
  // Fetch Orders
  const orders = await getUserOrders(user._id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline font-medium">
          ← Continue Shopping
        </Link>
      </div>

      {/* Content Section */}
      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-6">
          {/* 3. Use the new name 'OrderType' here */}
          {orders.map((order: OrderType) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}