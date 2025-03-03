import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import CouponRoutes from "./routes/couponRoutes.js"; // ✅ Import coupon routes

// Configure env
dotenv.config();

// Connect database
connectDB();

// Initialize Express
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Static file serving for uploads folder
app.use(express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/slider", sliderRoutes);
app.use("/api/v1/coupons", CouponRoutes ); // ✅ Added coupon routes

// Default Route
app.get("/", (req, res) => { 
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// PORT
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
