import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check: Only Admins can add products
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, category, image, stock } = body;

    // 2. Validation
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Create Product
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock: stock || 0,
    });

    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}