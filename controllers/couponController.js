// server/controllers/couponController.js

// const Coupon = require("../models/Coupon");
// const Product = require("../models/Product");

// server/controllers/couponController.js

import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";



export const createCoupon = async (req, res) => {
  const { code, discount, expiry } = req.body;

  try {
    // Create a new coupon with expiry date
    const newCoupon = new Coupon({
      code,
      discount,
      expiry: new Date(expiry), // Ensure expiry is converted to a Date object
    });

    // Save the coupon to the database
    await newCoupon.save();
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ success: false, message: "Error creating coupon" });
  }
};


export const assignCouponsToProduct = async (req, res) => {
  const { coupons } = req.body;
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    product.coupons = coupons;
    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ message: "Failed to assign coupons" });
  }
};

// Ensure this function is exported too!
export const applyCoupon = async (req, res) => {
    const { couponCode, cartItems } = req.body;
    try {
      // Check if the coupon exists
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).json({ success: false, message: "Invalid coupon code" });
      }
  
      // Optional: Check if the coupon has expired
      if (new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ success: false, message: "Coupon has expired" });
      }
  
      // Apply the discount
      const discount = coupon.discount; // Assuming the discount is a fixed amount or percentage
  
      // You could also add additional logic here to check the cart items and ensure they match
      // the products the coupon applies to.
  
      res.status(200).json({ success: true, discount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to apply coupon" });
    }
  };
  



  // Fetch all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find(); // ✅ Fetch all coupons from the database
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch coupons" });
  }
};

// Delete coupon by ID
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the coupon by ID
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

