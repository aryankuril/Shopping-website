import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";


import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  // DEBUG: ensure Multer parsed your files
  console.log("🔍 Multer files:", req.files);

  try {
    // 1) Destructure all text fields from req.body
    const { name, description, price, category, quantity, shipping } = req.body;

    // 2) Basic validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 3) Build your new product document
    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping: shipping === "1" || shipping === true, // if you store as Boolean
    });

    // 4) Multer puts all uploaded files into req.files (an array)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        product.images.push({
          data: file.buffer,
          contentType: file.mimetype,
        });
      });
    }

    // 5) Save and respond
    await product.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("💥 CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      message: error.message,
      stack: error.stack, // you can remove stack in production
    });
  }
};



//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("images");

    if (product?.images?.length > 0) {
      res.set("Content-type", product.images[0].contentType); // Send the first image
      return res.send(product.images[0].data);
    } else {
      return res.status(404).send("No image found");
    }
  } catch (error) {
    console.error("Error fetching product photo:", error);
    res.status(500).send("Error while fetching image");
  }
};




//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { images } = req.files;

    const product = await productModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.slug = slugify(name) || product.slug;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.shipping = shipping || product.shipping;

    // Handle new images if provided
    if (images) {
      const imageArray = Array.isArray(images) ? images : [images];
      product.images = []; // Clear existing images if you want to replace them

      for (const image of imageArray) {
        const imgData = fs.readFileSync(image.path);
        product.images.push({
          data: imgData,
          contentType: image.type,
        });
      }
    }

    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.forEach((i) => {
      total += i.price;
    });

    gateway.transaction.sale(
      {
        amount: total.toFixed(2),
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (result?.success) {
          // Create a new order
          const order = new orderModel({
            products: cart.map((p) => p._id),
            payment: {
              method: "online",
              status: "Paid",
              success: true,
              details: result,
            },
            
            buyer: req.user._id,
            status: "Not Process",
          });

          await order.save();
          res.json({ success: true });
        } else {
          console.error("Braintree error:", error || result?.message);
          res.status(500).send({
            success: false,
            error: error || result?.message || "Transaction failed",
          });
        }
      }
    );
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).send({
      success: false,
      error: "Something went wrong while processing payment",
    });
  }
};


// review
export const addReviewController = async (req, res) => {
  try {
    console.log("Review Request Body:", req.body);

    const { productId, description, rating } = req.body;

    if (!productId) {
      console.log("Missing Product ID!");
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log("Invalid Product ID:", productId);
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product Not Found:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = { user: req.user._id, description, rating };
    product.reviews.push(newReview);
    await product.save();

    console.log("Review Added Successfully:", newReview);
    res.json({ message: "Review added successfully", product });
  } catch (error) {
    console.error("Server Error in addReviewController:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
 
// // deletetriview/
// export const deleteReviewController = async (req, res) => {
//   try {
//     const { productId, reviewId } = req.params;
//     const userId = req.user._id; // Get the logged-in user ID

//     // Find the product
//     const product = await Product.findById(productId).populate("reviews.user", "name _id");
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Find the review
//     const reviewIndex = product.reviews.findIndex(
//       (review) => review._id.toString() === reviewId && review.user.toString() === userId.toString()
//     );

//     if (reviewIndex === -1) {
//       return res.status(403).json({ error: "You can only delete your own reviews" });
//     }

//     // Remove the review
//     product.reviews.splice(reviewIndex, 1);
//     await product.save();

//     res.status(200).json({ message: "Review deleted successfully" });
//   } catch (error) {
//     console.log("Error in deleteReviewController:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


export const placeOrder = async (req, res) => {
  try {
    const { products, buyer, paymentMethod } = req.body;

    if (!products || !buyer || !paymentMethod) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const newOrder = new Order({
      products,
      buyer,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "Pending" : "Paid", // ✅ Correct
        success: paymentMethod === "cod" ? false : true,      // ✅ Correct
        details: {}, // Optional: empty object for COD
      },
      
      status: "Not Process",
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



