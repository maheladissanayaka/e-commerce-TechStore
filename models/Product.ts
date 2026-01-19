import mongoose, { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    // New Feature: Reviews
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 }, // Average rating
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", productSchema);