import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { FaUser, FaMapMarkerAlt, FaHistory, FaSignOutAlt } from "react-icons/fa";

const UserMenu = () => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth({ user: null, token: "" });
    navigate("/login");
  };

  return (
    <>
      <div className="user-sidebar">
        <h4 className="menu-title">My Account</h4>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/dashboard/user/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FaUser className="icon" /> My Details
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/address"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
               <FaMapMarkerAlt className="icon" /> My address
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user/orders"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FaHistory className="icon" /> My Order History
            </NavLink>
          </li>
          <li>
            <button className="nav-link logout-btn" onClick={() => setShowLogoutPopup(true)}>
              <FaSignOutAlt className="icon" /> Logout
            </button>
          </li>
        </ul>
      </div>

      {showLogoutPopup && (
        <div className="logout-popup-backdrop">
          <div className="logout-popup">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png"
              alt="logout-icon"
              width="50"
            />
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-buttons">
              <button className="btn btn-logout" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button className="btn btn-cancel" onClick={() => setShowLogoutPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .user-sidebar {
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
        .menu-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .nav-links {
          list-style: none;
          padding: 0;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 12px;
          border-radius: 6px;
          color: #000;
          text-decoration: none;
          background-color: #f9f9f9;
          transition: background 0.2s;
        }
        .nav-link:hover {
          background-color: #fcebea;
        }
        
        .nav-link .icon {
          font-size: 16px;
        }
        .logout-btn {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
        }

        .logout-popup-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .logout-popup {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
        .logout-buttons {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .btn {
          padding: 8px 20px;
          font-weight: 500;
          border-radius: 6px;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .btn-logout {
          background-color: #000;
          color: white;
        }
        .btn-cancel {
          background-color: white;
          color: #000;
          border: 1px solid #000;
        }

        @media (max-width: 768px) {
          .user-sidebar {
            position: relative;
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid #ddd;
          }
        }
      `}</style>
    </>
  );
};

export default UserMenu;
