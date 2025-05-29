import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {
      method: {
        type: String,
        enum: ["online", "cod"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Paid", "Pending"],
        default: "Pending",
      },
      success: {
        type: Boolean,
        default: false,
      },
      details: {
        type: Object, // for online payments (e.g., Razorpay, Stripe)
        default: {},
      },
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
