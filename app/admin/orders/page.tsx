import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../_components/AdminSidebar";
import DashboardHeader from "../_components/DashboardHeader";
import AdminOrderRow from "./_components/AdminOrderRow";

// Helper to fetch orders directly via API logic or DB
// Since we are server-side, we can fetch from API endpoint (if absolute URL) 
// OR just use DB logic directly. Let's use the fetch method for consistency.
// NOTE: In server components, relative URLs like "/api/..." don't work easily.
// Let's import the logic directly from DB to avoid URL issues.
import connectDB from "@/lib/mongodb";
import {Order} from "@/models/Order";
import User from "@/models/User"; // Needed for population

async function getOrders() {
  await connectDB();
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const orders = await getOrders();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <DashboardHeader title="Order Management" />

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <AdminOrderRow key={order._id} order={order} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}