import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false, // ✅ now optional
    },
    address: {
      type: String,
      required: false,
    },
    addresses: {
      type: [String],
      default: [],
    },
    selectedAddress: {
      type: String,
      default: "",
    },
    answer: {
      type: String,
      required: false,  // ✅ now optional
    },
    
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
