// src/pages/ProductPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductPage = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`/api/v1/product/${productId}`);
        setProduct(productResponse.data);
        setCoupons(productResponse.data.coupons);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <div>
      <h2>{product?.name}</h2>
      <p>{product?.description}</p>
      <h4>Available Coupons:</h4>
      <ul>
        {coupons.map((coupon) => (
          <li key={coupon._id}>
            {coupon.code} - {coupon.discount}% Off
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;
