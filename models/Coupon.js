import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date, // Add this line to store the expiry date as a Date type
    required: true, // Optional: You can decide if the expiry should be required
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
