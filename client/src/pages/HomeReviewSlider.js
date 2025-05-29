// src/pages/HomeReviewSlider.js
import React from "react";
import Slider from "react-slick";
import "../styles/ReviewSlider.css"; // You can rename this too if needed

const homePageReviewData = [
  {
    name: "Aarav Mehta",
    rating: 5,
    review: "Absolutely amazing! Battery backup is solid and the design is premium.",
  },
  {
    name: "Fatima Sheikh",
    rating: 4,
    review: "Charges well and looks nice, but slightly bulky for my purse.",
  },
  {
    name: "Rajiv Nair",
    rating: 3,
    review: "Average product. It does the job but nothing special.",
  },
  {
    name: "Simran Kaur",
    rating: 5,
    review: "Love this product! Sleek, reliable and charges my phone super fast.",
  },
  {
    name: "Arjun Reddy",
    rating: 2,
    review: "Not very durable. Stopped working after 2 months.",
  },
  {
    name: "Priya Desai",
    rating: 4,
    review: "Compact and works great. Just wish it had dual USB ports.",
  },
  {
    name: "Imran Khan",
    rating: 5,
    review: "Best power bank I’ve used. Long-lasting and fast charging.",
  },
  {
    name: "Anjali Sharma",
    rating: 3,
    review: "Looks stylish but heats up when charging multiple devices.",
  },
  {
    name: "Karan Patel",
    rating: 1,
    review: "Completely disappointed. It stopped working in just a week!",
  },
  {
    name: "Sneha Iyer",
    rating: 4,
    review: "Good value for money. Suitable for daily use.",
  },
];

const HomeStarRating = ({ count }) => (
  <div className="stars">
    {"★".repeat(count)}
    {"☆".repeat(5 - count)}
  </div>
);

const HomeReviewSlider = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="review-slider-container">
      <h2 className="text-center mt-5">What Our Customers Say</h2>
      <Slider {...sliderSettings}>
        {homePageReviewData.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-text">"{review.review}"</div>
            <HomeStarRating count={review.rating} />
            <div className="review-name">- {review.name}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeReviewSlider;
