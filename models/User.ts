import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required if using Google Login
      select: false,   // Prevents password from being returned in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      type: String,
    },
    // 👇 NEW FEATURE: Wishlist
    // This stores an array of Product IDs that the user likes
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// This check is important in Next.js to prevent "OverwriteModelError"
const User = models.User || model("User", UserSchema);

export default User;