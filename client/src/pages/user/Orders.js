import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getPaymentStatus = (o) => {
    if (o?.payment?.method === "cod") return "Pending (COD)";
    return o?.payment?.success ? "Success" : "Failed";
  };

  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid p-2 p-md-4 dashboard">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <UserMenu />
          </div>

          {/* Orders Section */}
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Orders</h1>
            {orders?.map((o, i) => (
              <div className="border shadow mb-4 p-3 rounded" key={i}>
                {/* Order Table */}
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Method</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).format("DD-MM-YYYY")}</td>
                        <td>{getPaymentStatus(o)}</td>
                        <td>{o?.payment?.method?.toUpperCase() || "COD"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Product Cards */}
                <div className="container-fluid">
                  {o?.products?.map((p, idx) => (
                    <div
                      className="row mb-3 p-2 border rounded align-items-center"
                      key={p._id}
                    >
                      <div className="col-12 col-sm-4 text-center mb-2 mb-sm-0">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="img-fluid"
                          style={{ maxHeight: "120px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-12 col-sm-8">
                        <h6 className="mb-1">{p.name}</h6>
                        <p className="mb-1">{p.description.substring(0, 50)}...</p>
                        <p className="mb-0">Price: ₹{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
