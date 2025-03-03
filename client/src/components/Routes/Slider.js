import React, { useEffect, useState } from "react";
import axios from "axios";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch images from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/slider")
      .then((res) => {
        if (res.data.success) {
          setImages(res.data.images);
        } else {
          console.error("No images found");
        }
      })
      .catch((err) => console.error("Error fetching slider images.", err));
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  // Manual navigation functions
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slider-container">
      <button className="slider-btn left" onClick={prevSlide}>
        ❮
      </button>
      <div className="slider-wrapper">
        {images.length > 0 ? (
          <img
            src={`http://localhost:3000${images[currentIndex].imagePath}`}
            alt={`Slide ${currentIndex}`}
            className="slider-image"
          />
        ) : (
          <p>No slider images available</p>
        )}
      </div>
      <button className="slider-btn right" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default Slider;




