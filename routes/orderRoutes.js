import express from "express";
import { placeOrder } from "../controllers/orderController.js";

const router = express.Router();

// This should match /api/orders
router.post("/", placeOrder);

export default router;
