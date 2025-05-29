import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
// import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState(""); // Store coupon code input
  const [discount, setDiscount] = useState(0); // Store discount percentage
  const navigate = useNavigate();





  const handleCODOrder = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const auth = JSON.parse(localStorage.getItem("auth")) || {};
      const user = auth?.user;
  
      console.log("Cart Items:", cart);
      console.log("User Info:", user);
  
      if (!cart.length || !user) {
        alert("Missing cart items or user info");
        return;
      }
  
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: cart.map((item) => item._id),
          buyer: user._id,
          paymentMethod: "cod",
        }),
      });
  
      const data = await res.json();
      console.log("Order Response:", data);
  
      if (data.success) {
        alert("Order placed successfully with Cash on Delivery");
        localStorage.removeItem("cart");
        window.location.href = "/dashboard/user/orders";
      } else {
        alert("Failed to place COD order: " + data.error);
      }
    } catch (err) {
      console.error("COD Order Failed", err);
      alert("Failed to place COD order");
    }
  };
  
  
  
  // total price with discount applied
  // total price with discount applied
const totalPrice = () => {
  try {
    let total = 0;
    cart?.forEach((item) => {
      total += item.price;
    });
    
    total -= discount; // Subtract the discount amount from the total price
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  } catch (error) {
    console.log(error);
  }
};


  // delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  // Apply coupon to the cart
 // Apply coupon to the cart
const applyCoupon = async () => {
  if (!couponCode) {
    toast.error("Please enter a coupon code.");
    return;
  }
  try {
    const { data } = await axios.post("/api/v1/coupons/apply", {
      couponCode,
      cartItems: cart,
    });
    if (data.success) {
      const discountPercentage = data.discount; // Assume the discount is a percentage
      const discountAmount = calculateDiscountAmount(discountPercentage); // Calculate discount based on percentage
      setDiscount(discountAmount); // Set the discount amount to subtract from the total price
      toast.success(`Coupon applied! You get ${discountPercentage}% off.`);
    } else {
      toast.error(data.message || "Invalid coupon code.");
    }
  } catch (error) {
    console.log(error);
    toast.error("Error applying coupon.");
  }
};

// Calculate discount amount based on the percentage
const calculateDiscountAmount = (discountPercentage) => {
  let total = 0;
  cart?.forEach((item) => {
    total += item.price;
  });
  
  const discountAmount = (total * discountPercentage) / 100; // Calculate the discount based on the percentage
  return discountAmount;
};

  

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // handle payments
  const handlePayment = async () => {
    try {                            
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout >
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>Name : {p.name.substring(0, 30)}</p>
                    <p>Description : {p.description.substring(0, 100)}</p>
                    <p>Price : {p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>

              {/* Coupon Input */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={applyCoupon}
                  disabled={!couponCode || loading}
                >
                  {loading ? "Applying..." : "Apply Coupon"}
                </button>
              </div>

              {auth?.user?.selectedAddress ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.selectedAddress}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/address")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}

<button onClick={handleCODOrder}>
  Cash on Delivery (COD)
</button>

              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
