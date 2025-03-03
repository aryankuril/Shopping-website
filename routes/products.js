const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Add Product (For Testing)
router.post("/add-product", async (req, res) => {
  const { name, price } = req.body;
  const newProduct = new Product({ name, price });
  await newProduct.save();
  res.json({ message: "Product Added Successfully" });
});

// Get All Products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
