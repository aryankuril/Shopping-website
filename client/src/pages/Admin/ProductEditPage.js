// src/pages/Admin/ProductEditPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductEditPage = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchProductAndCoupons = async () => {
      try {
        const productResponse = await axios.get(`/api/v1/product/${productId}`);
        const couponResponse = await axios.get("/api/v1/admin/get-coupons");
        setProduct(productResponse.data);
        setCoupons(couponResponse.data.coupons);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductAndCoupons();
  }, [productId]);

  const handleCouponAssign = async (selectedCoupons) => {
    try {
      await axios.post(`/api/v1/admin/assign-coupons-to-product/${productId}`, { coupons: selectedCoupons });
      alert("Coupons assigned successfully!");
    } catch (error) {
      console.error("Error assigning coupons", error);
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form>
        {/* Product form fields here */}
        <h3>Assign Coupons</h3>
        <select multiple onChange={(e) => handleCouponAssign([...e.target.selectedOptions].map(option => option.value))}>
          {coupons.map((coupon) => (
            <option key={coupon._id} value={coupon._id}>
              {coupon.code}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default ProductEditPage;
