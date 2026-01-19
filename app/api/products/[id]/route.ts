import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Update type to Promise
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if Admin
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // 2. Await the params to get the ID
    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}