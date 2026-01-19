import mongoose, { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Processing" },
    // 👇 NEW FIELD: Payment Method
    paymentMethod: { type: String, required: true }, 
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", orderSchema);