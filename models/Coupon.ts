import mongoose, { Schema, model, models } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true }, // e.g., 10 for 10%
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = models.Coupon || model("Coupon", couponSchema);