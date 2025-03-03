import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import "/Aryan IT/Shopping website/client/src/styles/AdminSliderUpload.css"; // Import CSS file


const AdminSliderUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [sliderImages, setSliderImages] = useState([]);

  // Fetch all slider images
  const fetchSliderImages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/slider");
      setSliderImages(res.data.images);
    } catch (err) {
      setError("Error fetching slider images.");
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchSliderImages(); // Load images on component mount
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/slider/upload",
        formData
      );
      console.log("Upload Successful", res.data);
      fetchSliderImages(); // Refresh image list after upload
      setFile(null); // Reset file input
      toast.success("Image uploaded successfully");
    } catch (err) {
      setError("Upload Error: " + (err.response?.data?.message || err.message));
      console.error("Upload Error:", err);
    }
  };

  // Handle image delete
  const handleDelete = async (sliderId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/slider/${sliderId}`
      );

      if (response.data.success) {
        // ✅ Immediately update UI without refresh
        setSliderImages((prevImages) =>
          prevImages.filter((img) => img._id !== sliderId)
        );
        toast.success("Image deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting image:", err.response?.data || err);
      toast.error("Failed to delete image");
    }
  };

  return (
    <Layout title={"Admin - Manage Slider"}>
      <div className="row dashboard"></div>
      <div className="admin-slider-container">
       <div className="col-md-3">
          <AdminMenu />
        </div>
        
        <div className="admin-slider-content">
        <hr />
          <h2>Manage Slider</h2>
          <div className="upload-section">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
            <button onClick={handleUpload} className="upload-btn">
              Upload Image
            </button>
            {error && <p className="error-text">{error}</p>}
          </div>

          {/* Slider Images List */}
          <h3>Uploaded Images</h3>
          {sliderImages.length === 0 ? (
            <p className="no-images-text">No slider images available.</p>
          ) : (
            <div className="image-gallery">
              {sliderImages.map((img) => (
                <div key={img._id} className="image-card">
                  <img
                    src={`http://localhost:8080${img.imagePath}`}
                    alt="Slider"
                    className="slider-img"
                  />
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminSliderUpload;
