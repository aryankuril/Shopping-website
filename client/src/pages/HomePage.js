import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import Slider from "../components/Routes/Slider";
 import HomeReviewSlider from "./HomeReviewSlider";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [ setError] = useState("");


  // latest product
  useEffect(() => {
    // Fetch products from your API (replace with your actual API)
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const latestProducts = products.slice(0, 5);

  // Fetch all categories and slider images in parallel for better performance
  const fetchData = async () => {
    try {
      const [categoryResponse, sliderResponse] = await Promise.all([
        axios.get("/api/v1/category/get-category"),
        axios.get("/api/v1/slider"),
      ]);
      
      if (categoryResponse.data?.success) {
        setCategories(categoryResponse.data?.category);
      }
      setSliderImages(sliderResponse.data.images || []);
    } catch (error) {
      setError("Error fetching categories or slider images.");
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);


  //loadmore
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <Layout title={"ALl Products - Best offers "}categories={categories}>
      <Slider images={sliderImages} />
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id} >
                <img
                   src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name.substring(0, 40)}...</h5>
                    
                   
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 100)}...
                  </p>
                  <h5 className="card-title card-price">
                  <h5 className="card-title">₹{p.price}</h5>
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
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

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

{/* latest product  */}

    <div className="latest-arrivals-section">
      <div className="arrival-left">
        <h2>
          Our <br /> <strong>Latest Arrivals</strong>
        </h2>
        <p>
          Discover cutting-edge designs and innovative products that just
          landed. Stay ahead of the trends.
        </p>
        <Link to="/categories">
          <button className="explore-btn">Explore Now</button>
        </Link>
        
      </div>

      <div className="arrival-right">
      {latestProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="image-container">
              <img src={`/api/v1/product/product-photo/${product._id}`}
                alt={product.name} />
              
            </div>
            <h4>{product.name.substring(0, 30)}...</h4>
            <p>{product.description.substring(0, 30)}...</p>
            <p className="price">₹{product.price.toFixed(2)}</p>
            
            <div className="card-actions">
              {/* <button className="buy-btn">Buy Now</button> */}
              <button
                      className="buy-btn "
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      Buy Now
                    </button>
            </div>
          </div>
        ))}
      </div>
    </div>





    
    <HomeReviewSlider />


<div class="whatsapp_float">
        {/* <a href="https://wa.me/918879961503" target="_blank"> */}
        <a href="https://chat.whatsapp.com/Gi1kjslgyfbEQxbRzoWDsE" target="_blank" rel="noreferrer">
        <img src="images/whatsapp.png" width="50px" alt="whatsapp.png"  />
        <i class="fa fa-whatsapp whatsapp-icon"></i>
        </a>
      
      </div>

    </Layout>
  );
};

export default HomePage;
