// File: AboutUs.js
import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import Slider from "../components/Routes/Slider";
import "../styles/AboutUs.css";
import HomeReviewSlider from "./HomeReviewSlider";

const About = () => {
  const [sliderImages, setSliderImages] = useState([]);

  return (
    <Layout title={"About us - Ecommerce App"}>
      {/* Slider Banner */}
      <div className="about-slider-wrapper">
        <Slider images={sliderImages} />
      </div>

      {/* Company Overview */}
      <div className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h4><strong>Our Company Overview</strong></h4>
            <p>
            At our electronics store, we specialize in professional mobile phone repair services. Whether it's a broken screen, battery issue, or software problem, our skilled technicians are here to fix it quickly and reliably.
Along with repairs, we also offer a selection of quality mobile phones, smartwatches, speakers, and accessories. Our goal is to provide trusted repair solutions and genuine products — all under one roof. Your device’s health is our priority!
            </p>
          </div>
          <div className="about-image-wrapper">
            <img
              src="/images/aboutus-1.jpg"
              alt="Company"
              className="about-image"
            />
          </div>
        </div>
      </div>

      {/* GAP of 20px */}
      <div style={{ height: "20px" }}></div>

      {/* Vision & Mission */}
      <div className="about-section">
        <div className="about-content reverse">
          <div className="about-text reverse">
            <h4><strong>Our Vision & Mission</strong></h4>
            <p>
            Our Vision
               To be the most trusted and reliable mobile phone repair and electronics store in our community, known for quality service, honest advice, and customer satisfaction.
               Our Mission To provide fast, affordable, and expert mobile phone repair services.
                To offer the latest and most reliable electronics, including phones, smartwatches, speakers, and accessories.
               To build long-term relationships with our customers through honesty, quality, and care.
            </p>
          </div>
          <div className="about-image-wrapper">
            <img
              src="/images/aboutus-2.jpg"
              alt="Vision and Mission"
              className="about-image"
            />
          </div>
        </div>
      </div>
  
      {/* feature secltion */}
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


{/* why choose us */}
<div className="why-container">
      <div className="why-content">
        <div className="why-text">
        <h4><strong>Why Shop With Us?</strong></h4>
<p>
  At our store, we believe in delivering more than just products — we offer solutions that elevate 
  your lifestyle. From unbeatable quality to seamless compatibility and lightning-fast service, 
  everything we do is designed with *you* in mind.
</p>
<ul>
<li>
  <strong>Latest Gadgets, Trusted Brands:</strong> From smartphones to smartwatches and speakers, 
  we stock the newest tech from brands you know and love — all in one place.
</li>
<li>
  <strong>Repair Experts You Can Rely On:</strong> Cracked screen? Battery issues? Our skilled 
  technicians bring your devices back to life with quick, affordable, and reliable repairs.
</li>
  <li>
    <strong>Speed That Delivers Smiles:</strong> Experience ultra-fast shipping that keeps up 
    with your pace, along with safe packaging and real-time tracking.
  </li>
</ul>

        </div>
        <div className="why-image">
          <img src="/images/aboutus-3.avif" alt="Why Choose Us" />
        </div>
      </div>
    </div>


   <div className="newslider">
       
   <HomeReviewSlider />
   </div>
    </Layout>
  );
};

export default About;
