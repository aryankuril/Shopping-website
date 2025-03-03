import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";  // import the custom hook

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [cart, setCart] = useCart(); // useCart hook to manage cart state
  
  // Add to Cart function
  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);  // Update cart state immediately
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Persist cart in localStorage
    toast.success("Item Added to Cart!");
  };

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="star-rating">
        {Array(fullStars).fill().map((_, i) => (
          <span key={i} className="star full">★</span>
        ))}
        {halfStar && <span className="star half">★</span>}
        {Array(emptyStars).fill().map((_, i) => (
          <span key={i} className="star empty">☆</span>
        ))}
      </div>
    );
  };

  // Fetch product details inside useEffect
  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
        if (!data?.product) {
          toast.error("Product not found!");
          return;
        }
        setProduct(data.product);

        // Fetch related products when the product is fetched
        if (data.product?.category?._id) {
          getSimilarProduct(data.product._id, data.product.category._id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  // Fetch related products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit Review
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
    } catch (error) {
      toast.error("Error submitting review");
    }
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-india", {
              style: "currency",
              currency: "india",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button 
            className="btn btn-secondary ms-1" 
            onClick={() => addToCart(product)} // Add to cart handler
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Review Section */}
      <hr />
      <div className="row container">
        <h4>Leave a Review</h4>
        <textarea
          className="form-control"
          placeholder="Write a review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <select
          className="form-control mt-2"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="5">★★★★★(5)</option>
          <option value="4">★★★★ (4)</option>
          <option value="3">★★★ (3)</option>
          <option value="2">★★ (2)</option>
          <option value="1">★ (1)</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={submitReview}>
          Submit Review
        </button>
      </div>

      {/* Display Reviews */}
      <div className="row container mt-4">
        <h4>Reviews</h4>
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review-card p-2 mb-2 border rounded">
               <StarRating rating={review.rating} />
              <p>{review.description}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Similar Products */}
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && <p className="text-center">No Similar Products found</p>}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </h5>
                </div>
                <p className="card-text">{p.description.substring(0, 60)}...</p>
                <button className="btn btn-info" onClick={() => navigate(`/product/${p.slug}`)}>
                  More Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
