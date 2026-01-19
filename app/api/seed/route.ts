import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // 1. Delete existing products (optional, keeps DB clean for testing)
    await Product.deleteMany({});

    // 2. Define sample products
    const sampleProducts = [
      {
        name: "Wireless Headphones",
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        category: "Electronics",
        image: "https://placehold.co/600x400/png?text=Headphones",
        stock: 50,
      },
      {
        name: "Ergonomic Office Chair",
        description: "Comfortable chair with lumbar support for long hours.",
        price: 199.99,
        category: "Furniture",
        image: "https://placehold.co/600x400/png?text=Office+Chair",
        stock: 20,
      },
      {
        name: "Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard with blue switches.",
        price: 79.99,
        category: "Electronics",
        image: "https://placehold.co/600x400/png?text=Keyboard",
        stock: 35,
      },
      {
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitor and GPS.",
        price: 149.99,
        category: "Wearables",
        image: "https://placehold.co/600x400/png?text=Smart+Watch",
        stock: 15,
      },
      {
        name: "Gaming Mouse",
        description: "Precision gaming mouse with programmable buttons.",
        price: 49.99,
        category: "Electronics",
        image: "https://placehold.co/600x400/png?text=Mouse",
        stock: 100,
      },
    ];

    // 3. Insert them into MongoDB
    await Product.create(sampleProducts);

    return NextResponse.json({ message: "✅ Database seeded with products!" });
  } catch (error) {
    return NextResponse.json({ message: "❌ Seeding failed", error }, { status: 500 });
  }
}