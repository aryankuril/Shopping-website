import express from "express";
const router = express.Router();

// Importing functions from the couponController
import { createCoupon, assignCouponsToProduct, applyCoupon, getCoupons, deleteCoupon } from "../controllers/couponController.js"; // Add deleteCoupon to imports

// Route to fetch all coupons (NEW ✅)
router.get("/", getCoupons);  // This is needed for the frontend to fetch coupons

// Add a new coupon (createCoupon function)
router.post("/add", createCoupon);

// Add coupons to a product (assignCouponsToProduct function)
router.put("/add-to-product/:productId", assignCouponsToProduct);

// Route for applying a coupon to cart items
router.post("/apply", applyCoupon);

// Delete coupon by ID (deleteCoupon function)
router.delete("/:id", deleteCoupon);  // Add DELETE route

export default router;
