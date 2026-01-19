import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import AdminSidebar from "./_components/AdminSidebar";
import StatsCard from "./_components/StatsCard";
import DashboardHeader from "./_components/DashboardHeader";

// 1. Helper Function to Calculate Real Stats
async function getDashboardStats() {
  await connectDB();

  // Count total products
  const productsCount = await Product.countDocuments();

  // Count total orders
  const ordersCount = await Order.countDocuments();

  // Calculate Total Revenue (Sum of 'totalAmount' from all orders)
  // We use MongoDB aggregation for this
  const revenueResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  return {
    products: productsCount,
    orders: ordersCount,
    revenue: totalRevenue,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // 2. Fetch the real data
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <DashboardHeader title="Dashboard Overview" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Revenue" 
            value={`$${stats.revenue.toFixed(2)}`} // Real Revenue
          />
          <StatsCard 
            title="Total Orders" 
            value={stats.orders} // Real Order Count
          />
          <StatsCard 
            title="Active Products" 
            value={stats.products} // Real Product Count
          />
        </div>

        {/* Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">System Status</h2>
          <div className="text-green-600 bg-green-50 p-4 rounded border border-green-100 flex items-center gap-2">
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            All systems operational. Database connected.
          </div>
        </div>
      </main>
    </div>
  );
}