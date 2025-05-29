import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import {
  FiPackage,
  FiShoppingCart,
  FiList,
  FiImage,
  FiTag,
  FiLogOut,
  FiPlusSquare,
  FiUsers,
} from "react-icons/fi";

const AdminMenu = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    // Remove from localStorage
    localStorage.removeItem("auth");
  
    // Clear from context
    setAuth({
      user: null,
      token: "",
    });
  
    // Navigate to login
    navigate("/login");
  };

  return (
    <>
      <div className="admin-sidebar">
        <h3 className="logo">Admin Panel</h3>
        <nav className="menu">
          <NavLink to="/dashboard/admin/create-category" className="menu-item">
            <FiList className="icon" />
            Create Category
          </NavLink>
          <NavLink to="/dashboard/admin/create-product" className="menu-item">
            <FiPlusSquare className="icon" />
            Create Product
          </NavLink>
          <NavLink to="/dashboard/admin/products" className="menu-item">
            <FiPackage className="icon" />
            Products
          </NavLink>
          <NavLink to="/dashboard/admin/orders" className="menu-item">
            <FiShoppingCart className="icon" />
            Orders
          </NavLink>
          <NavLink to="/dashboard/admin/slider" className="menu-item">
            <FiImage className="icon" />
            Slider
          </NavLink>
          <NavLink to="/dashboard/admin/coupons" className="menu-item">
            <FiTag className="icon" />
            Manage Coupons
          </NavLink>
          <NavLink to="/dashboard/admin/users" className="menu-item">
            <FiUsers className="icon" />
            users
          </NavLink>

          <button className="menu-item logout-btn" onClick={() => setShowLogoutPopup(true)}>
            <FiLogOut className="icon" />
            Logout
          </button>
        </nav>
      </div>

      {/* Logout Confirmation */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="popup-box">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png"
              alt="logout-icon"
              width="50"
            />
            <p>Are you sure you want to log out of your account?</p>
            <div className="btn-group">
              <button className="btn yes" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button className="btn no" onClick={() => setShowLogoutPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar CSS */}
      <style>{`
        .admin-sidebar {
          margin-top: 60px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 300px;
          height: 80vh;
          background: #f9f9f9;
          border-right: 1px solid #ddd;
          padding: 30px 20px;
          display: flex;
          overflow-y: auto;
          flex-direction: column;
          z-index: 1000;
        }
        .logo {
          margin-bottom: 40px;
          font-size: 22px;
          font-weight: bold;
        }
        .menu {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .menu-item {
          padding: 10px 15px;
          border-radius: 6px;
          text-decoration: none;
          color: #333;
          background-color: #fff;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .menu-item:hover,
        .menu-item.active {
          background-color: #e8e8e8;
        }
        .logout-btn {
          border: none;
          background: #fff;
          text-align: left;
          cursor: pointer;
        }

        .logout-popup {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .popup-box {
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .popup-box p {
          margin: 20px 0;
          font-size: 16px;
        }
        .btn-group {
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        .btn {
          padding: 8px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          border: none;
        }
        .btn.yes {
          background:rgb(0, 0, 0);
          color: white;
        }
        .btn.no {
          background: transparent;
          color:rgb(0, 0, 0);
          border: 1px solidrgb(0, 0, 0);
        }
      `}</style>
    </>
  );
};

export default AdminMenu;
