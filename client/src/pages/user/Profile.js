import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  // context
  const [auth, setAuth] = useAuth();

  // state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    const nameParts = name?.split(" ") || [];
    setFirstName(nameParts[0] || "");
    setLastName(nameParts[1] || "");
    setPhone(phone || "");
    setEmail(email || "");
    setAddress(address || "");
  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`;
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name: fullName,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Your Profile"}>
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
  
        <div className="col-md-9">
          <div className="card p-4">
            <h4 className="mb-4">My details</h4>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div className="col-md-6">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              </div>
  
              <div className="mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  disabled
                />
              </div>
  
              <div className="mb-3">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                />
              </div>
               <div className="mb-3">
    <label>New Password</label>
    <input
      type="password"
      className="form-control"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Leave blank to keep existing password"
    />
  </div>
  
              <button type="submit" className="btn btn-danger">
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
  
      <style>{`
      .col-md-3{
      margin-top: 100px;
      
      }
        .card {
          margin-top: 100px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        label {
          font-weight: 500;
          margin-bottom: 5px;
          display: block;
        }
        .form-control {
          border-radius: 6px;
          padding: 10px;
          border: 1px solid #ccc;
        }
        .btn-danger {
          background-color:rgb(0, 0, 0);
          border-color:rgb(0, 0, 0);
          border-radius: 6px;
          padding: 8px 20px;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .col-md-6 {
            width: 100%;
          }
        }
      `}</style>
    </div>
  </Layout>
  
  );
};

export default Profile;
