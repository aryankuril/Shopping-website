import React, { useState, useEffect, useRef } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/ProductDetailsStyles.css";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [cart, setCart] = useCart();
  const [showModal, setShowModal] = useState(false);
  const [ setReviews] = useState(product.reviews || []);
  // Inside your component
const [selectedImage, setSelectedImage] = useState(null); 


  // Reference for full description section
  const fullDescRef = useRef(null);

    // Helper to convert buffer data to base64 string for image src
    const bufferToBase64 = (image) => {
      if (!image || !image.data) return "";
      const bytes = new Uint8Array(image.data.data || image.data);
      let binary = "";
      for (let b of bytes) binary += String.fromCharCode(b);
      return window.btoa(binary);
    };

  // Function to add product to cart
  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added to Cart!");
  };

  // Star rating for product reviews
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <span key={i} className="star full">★</span>
          ))}
        {halfStar && <span className="star half">★</span>}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <span key={i} className="star empty">☆</span>
          ))}
      </div>
    );
  };

  // Get product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit review to backend
  const submitReview = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/add-review", {
        productId: product._id,
        description: reviewText,
        rating,
      });
      toast.success("Review submitted!");
      setProduct(data.product); // Update product state with new reviews
      setReviewText("");
      setRating(5);
      setShowModal(false);
    } catch (error) {
      toast.error("Error submitting review");
    }
  };

  // Show a short snippet of the product description (limit to 150 characters)
  const snippetLength = 150;
  const shortDescription =
    product.description && product.description.length > snippetLength
      ? product.description.substring(0, snippetLength) + "..."
      : product.description;

  // Scroll smoothly to the full description section
  const handleViewMore = () => {
    if (fullDescRef.current) {
      fullDescRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* Product Details Section */}
      <div className="container product-details-page">
        <div className="product-wrapper">
        <div className="product-gallery">
  {product.images && product.images.length > 0 ? (
    product.images.map((image, idx) => {
      const base64 = bufferToBase64(image);
      const imageUrl = `data:${image.contentType};base64,${base64}`;
      return (
        <img
          key={idx}
          className="thumbnail-img"
          src={imageUrl}
          alt={`${product.name}-${idx}`}
          onClick={() => setSelectedImage(imageUrl)} // <-- Set on click
          style={{ cursor: "pointer" }}
        />
      );
    })
  ) : (
    <img
      className="thumbnail-img"
      src={`/api/v1/product/product-photo/${product._id}`}
      alt={product.name}
      onClick={() => setSelectedImage(`/api/v1/product/product-photo/${product._id}`)}
      style={{ cursor: "pointer" }}
    />
  )}
</div>

<div className="main-product-image">
  {selectedImage ? (
    <img
      src={selectedImage}
      alt={product.name}
      className="zoomable-image"
    />
  ) : product.images && product.images.length > 0 ? (
    (() => {
      const image = product.images[0];
      const base64 = bufferToBase64(image);
      return (
        <img
          src={`data:${image.contentType};base64,${base64}`}
          alt={product.name}
          className="zoomable-image"
        />
      );
    })()
  ) : (
    <img
      src={`/api/v1/product/product-photo/${product._id}`}
      alt={product.name}
      className="zoomable-image"
    />
  )}
</div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="category">{product?.category?.name}</p>
            <p className="price">₹{product?.price?.toLocaleString("en-IN")}</p>
            <hr />
            <p className="description">
              {shortDescription}{" "}
              {product.description &&
                product.description.length > snippetLength && (
                  <button className="view-more-btn" onClick={handleViewMore}>
                    View More
                  </button>
                )}
            </p>
            <hr />
            <div className="button-group">
              <button
                className="btn-buy"
                onClick={() => {
                  addToCart(product);
                  navigate("/cart");
                }}
              >
                Buy Now
              </button>
              <button className="btn-cart" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {/* Existing Features and Similar Products Sections */}
      <div className="features-section">
  <div className="feature-box">
    <img src="/images/delivery-truck.png" alt="Fast Delivery" />
    <h4>Fast Delivery</h4>
    <p>Get your products delivered to your doorstep in record time, wherever you are.</p>
  </div>
  <div className="feature-box">
    <img src="/images/credit-card.png" alt="Secure Payments" />
    <h4>Secure Payments</h4>
    <p>Enjoy hassle-free transactions with our trusted and secure payment gateways.</p>
  </div>
  <div className="feature-box">
    <img src="/images/ranking.png" alt="Top Quality Products" />
    <h4>Top-Quality Products</h4>
    <p>We offer only the best, tested, and certified products to ensure customer satisfaction.</p>
  </div>
  <div className="feature-box">
    <img src="/images/cash-on-delivery.png" alt="Easy Returns" />
    <h4>Cash on Delivery</h4>
  <p>Pay only when your product is delivered. Safe and simple shopping experience.</p>
  </div>
</div>

      {/* Full Product Description Section */}
      <section
        ref={fullDescRef}
        id="full-description-section"
        className="full-description"
      >
        <h3>Product Description</h3>
        <p>{product.description}</p>
      </section>

      <hr />

      {/* Review Section */}
      <div className="review-section-wrapper container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Add Review</h4>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowModal(true)}
          >
            Write a Review
          </button>
        </div>

        {/* Modal Popup for adding a review */}
        {showModal && (
          <div className="review-modal">
            <div className="modal-content-ui">
              <h5 className="mb-3">Leave a Review</h5>
              <textarea
                className="form-control mb-3"
                placeholder="Write your review..."
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="star-rating mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                  >
                    {star <= rating ? "★" : "☆"}
                  </span>
                ))}
                <span className="rating-number ms-2">({rating})</span>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitReview}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        <hr />

        <div className="product-reviews-box">
          <h4 className="mb-3">Customer Reviews</h4>
          {product.reviews?.length > 0 ? (
            <div className="product-reviews-grid">
              {product.reviews.map((review, index) => (
                <div key={index} className="review-card-ui">
                  <div className="stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="review-text-ui">{review.description}</p>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p className="no-review-msg">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>

      <hr />

      {/* Similar Products Section */}
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                // src={`/api/v1/product/product-photo/${p._id}`}
                src={`/api/v1/product/product-photo/${p._id}`}

                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                 
                </div>
                <p className="card-text">
                  {p.description.substring(0, 100)}...
                </p>
                <h5 className="card-title card-price">
                    ₹{p.price.toLocaleString("en-US")}
                  </h5>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-dark ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;















