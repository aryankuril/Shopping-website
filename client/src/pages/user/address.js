import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import { FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const Address = () => {
  const [auth, setAuth] = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    setAddresses(auth?.user?.addresses || []);
    setSelectedAddress(auth?.user?.selectedAddress || "");
  }, [auth]);

  const handleAddAddress = () => {
    if (!newAddress.trim()) return toast.error("Address cannot be empty");
    setAddresses([...addresses, newAddress.trim()]);
    setNewAddress("");
  };

  const handleDeleteAddress = (index) => {
    const updated = [...addresses];
    const deleted = updated.splice(index, 1);
    setAddresses(updated);
    if (selectedAddress === deleted[0]) {
      setSelectedAddress("");
    }

    
  };

  const handleSaveAddresses = async () => {
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        ...auth.user,
        addresses,
        selectedAddress,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data.updatedUser });
        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Addresses updated successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Address"}>
      <div className="col-md-3">
        <UserMenu />
      </div>
      <div className="address-page container">
        <div className="card p-4">
          <h4 className="mb-4 fw-bold">My Addresses</h4>

          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
            >
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <input
                  type="radio"
                  checked={selectedAddress === addr}
                  onChange={() => setSelectedAddress(addr)}
                />
                <FaMapMarkerAlt size={16} color="black" />
                <span>{addr}</span>
              </div>
              <button
                className="edit-btn text-danger"
                onClick={() => handleDeleteAddress(idx)}
              >
                Delete
              </button>
            </div>
          ))}

          <div className="input-group my-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter new address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <button className="btn btn-dark" onClick={handleAddAddress}>
              Add
            </button>
          </div>

          <button className="btn btn-danger mt-3" onClick={handleSaveAddresses}>
            Save Addresses
          </button>
        </div>

        <style>{`
          .col-md-3 {
            margin-top: 100px;
          }
          .address-page {
            margin-top: 200px;
            margin-right: -100px;
          }
          .card {
            margin-top: 100px;
            max-width: 700px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .form-control {
            flex: 1;
            min-width: 300px;
          }
          .edit-btn {
            background: none;
            border: none;
            color: black;
            font-size: 18px;
            cursor: pointer;
          }
          .btn-danger {
            background-color: rgb(0, 0, 0);
            border-color: rgb(0, 0, 0);
            border-radius: 6px;
            padding: 8px 20px;
            font-weight: 500;
          }
          @media (max-width: 768px) {
            .address-page {
              margin-top: 50px;
              margin-right: 300px;
            }
            .card {
              margin-top: 30px;
            }
            .address-box {
              flex-direction: column;
              align-items: flex-start !important;
            }
            .edit-btn {
              align-self: flex-end;
              margin-top: 10px;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Address;
