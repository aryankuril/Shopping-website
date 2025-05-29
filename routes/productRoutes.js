import express from "express";
import multer from "multer";  
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  addReviewController,
  placeOrder,
  // deleteReviewController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";



const router = express.Router();
// configure multer to keep files in memory so you can push them into Mongo
const storage = multer.memoryStorage();
const uploadImages = multer({ storage }).array("images", 10);  // up to 10 images



router.post("/orders", placeOrder);
 
//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  uploadImages, 
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  uploadImages, 
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

// Review
router.post("/add-review", requireSignIn, addReviewController);

// // deletereview
// router.delete("/delete-review/:productId/:reviewId", requireSignIn, deleteReviewController);


export default router;
