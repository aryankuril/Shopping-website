import React, { useState ,useEffect} from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);  // ✅ Added this line
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/api/v1/coupons"; // Use full backend URL

  const getCoupons = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/coupons"); // Ensure correct backend URL
      console.log("Coupons fetched:", data); // ✅ Debug log
      setCoupons(data.coupons); // ✅ Update state
    } catch (error) {
      console.error("Failed to fetch coupons:", error); // ✅ Log errors
      toast.error("Failed to fetch coupons");
    }
  };
  useEffect(() => {
    getCoupons();
  }, []);  // ✅ Runs when the component mounts
    
  

  
  const handleAddCoupon = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/add`, {
        code,
        discount,
        expiry,
        products: selectedProducts,
      });
  
      if (data.success) {
        toast.success("Coupon added!");
        setCoupons([...coupons, data.coupon]);
        setCode("");
        setDiscount("");
        setExpiry("");
        setSelectedProducts([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding coupon");
      console.error("Add error:", error);
    }
  };
  

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${API_URL}/${id}`);
       console.log(data); // Add this line to inspect the API response
      if (data.success) {
        setCoupons(coupons.filter((c) => c._id !== id));
        toast.success("Coupon deleted!");
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      toast.error("Error deleting coupon");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    // Ensure the date is in the correct format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Return a user-friendly message
    }
    return date.toLocaleDateString("en-US"); // Or you can specify other locales
  };
  
  

  return (
    <Layout>
      <div className="row dashboard"></div>
      <div className="admin-slider-container">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <hr />
       <div className="container " >
        <h2>Manage Coupons</h2>
        {/* Add Coupon Form */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="number"
            placeholder="Discount %"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="form-control mb-2"
          />
          <button className="btn btn-success" onClick={handleAddCoupon}>
            Add Coupon
          </button>
        </div>

        {/* List of Coupons */}
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.code}</td>
                  <td>{c.discount}%</td>
                  {/* Format the expiry date */}
                  <td>{formatDate(c.expiry)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCoupon(c._id)}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No coupons available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     </div>
       
    </Layout>
  );
};

export default AdminCoupons;
