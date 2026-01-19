import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET: Fetch current user details
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById((session.user as any).id).select("-password");
  return NextResponse.json(user);
}

// PUT: Update user details
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, image, currentPassword, newPassword } = await req.json();
    await connectDB();

    const user = await User.findById((session.user as any).id).select("+password");

    // 1. Update Basic Info
    user.name = name || user.name;
    user.image = image || user.image;

    // 2. Handle Password Change (Optional)
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Please enter your current password to set a new one" }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Return the updated user (without password)
    const { password, ...updatedUser } = user.toObject();
    return NextResponse.json(updatedUser);

  } catch (error) {
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}