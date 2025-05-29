import Order from "../models/orderModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { products, buyer, paymentMethod } = req.body;

    // Log the incoming request body for debugging
    console.log("Received order request:", { products, buyer, paymentMethod });

    // Validate that the required fields are present
    if (!products || !buyer || !paymentMethod) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Create a new order
    const newOrder = new Order({
      products,
      buyer,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "Pending" : "Paid",
        details: {},  // Empty object for COD, as no details needed
      },
      status: "Not Process",  // Default status for COD orders
    });

    // Save the new order to the database
    await newOrder.save();

    // Respond with the success message and the saved order
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    // Log the error for debugging
    console.error("Place Order Error:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
