// Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  // other fields...
});

// const Product = mongoose.model("Product", productSchema);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
