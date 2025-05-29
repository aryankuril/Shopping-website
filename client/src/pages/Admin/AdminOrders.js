import React, { useState, useEffect } from "react";
import axios from "axios";
// import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, Dropdown, Menu, Button } from "antd";
import * as XLSX from "xlsx";
const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, { status: value });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const exportToExcel = (timeFrame) => {
    let filteredOrders = orders.filter(order => {
      const orderDate = moment(order.createdAt);  // ✅ Corrected the key
      const now = moment();  // Don't mutate this
  
      switch (timeFrame) {
        case "1year":
          return orderDate.isSameOrAfter(moment().subtract(1, "year"));
        case "6months":
          return orderDate.isSameOrAfter(moment().subtract(6, "months"));
        case "1month":
          return orderDate.isSameOrAfter(moment().subtract(1, "month"));
        case "1week":
          return orderDate.isSameOrAfter(moment().subtract(1, "week"));
        case "1day":
          return orderDate.isSameOrAfter(moment().subtract(1, "day"), 'day');  // Compare only date
        default:
          return true;
      }
    }).map(order => ({
      id_: order._id,
      buyer_name: order.buyer?.name,
      buyer_phone: order.buyer?.phone || "N/A",
      buyer_address: order.buyer?.address || "N/A",
      order_date: moment(order.createdAt).format("DD-MM-YYYY"),
      payment_method: order.payment?.method || "Not Available",
      payment_status: order.payment?.success ? "Success" : "Failed",
      products: order.products?.map(p => ({
        product_id: p._id,
        product_name: p.name,
        product_price: p.price,
        product_length: p.length || 1,
      })) || []
    }));
  
    // ✅ Flatten the products
    const flattenedOrders = filteredOrders.flatMap(order =>
      order.products.map(product => ({
        order_id: order.id_,
        buyer_name: order.buyer_name,
        buyer_phone: order.buyer_phone,
        buyer_address: order.buyer_address,
        order_date: order.order_date,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        product_id: product.product_id,
        product_name: product.product_name,
        product_length: product.product_length,
        product_price: product.product_price,
      }))
    );

      // ✅ Add this check here!
  if (flattenedOrders.length === 0) {
    alert("No orders found for the selected time range.");
    return;
  }
  
    // ✅ Export
    const worksheet = XLSX.utils.json_to_sheet(flattenedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders_${timeFrame}.xlsx`);
  };
  
  const getPaymentStatus = (o) => {
    if (o?.payment?.method === "cod") return "Pending (COD)";
    return o?.payment?.success ? "Success" : "Failed";
  };

  // Put this ABOVE your return statement
const exportMenu = (
  <Menu>
    <Menu.Item onClick={() => exportToExcel("1year")}>Export 1 Year</Menu.Item>
    <Menu.Item onClick={() => exportToExcel("6months")}>Export 6 Months</Menu.Item>
    <Menu.Item onClick={() => exportToExcel("1month")}>Export 1 Month</Menu.Item>
    <Menu.Item onClick={() => exportToExcel("1week")}>Export 1 Week</Menu.Item>
    <Menu.Item onClick={() => exportToExcel("1day")}>Export 1 Day</Menu.Item>
  </Menu>
);
  return (
    <Layout title={"All Orders Data"}>
    <div className="container-fluid dashboard">
      <div className="row">
        <div className="col-12 col-md-3 mb-3">
          <AdminMenu />
        </div>
        <div className="col-12 col-md-9">
          <h1 className="text-center">All Orders</h1>

          <div className="my-3 d-flex justify-content-between align-items-center flex-wrap">
            <h5 className="mb-2">Export Orders</h5>
            <Dropdown overlay={exportMenu}>
              <Button className="btn btn-success">Export Orders</Button>
            </Dropdown>
          </div>

          {orders.map((o, i) => (
            <div key={o._id} className="border shadow mb-4 p-3 rounded bg-light">
              <div className="table-responsive">
                <table className="table table-bordered text-nowrap">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Method</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          defaultValue={o?.status}
                          onChange={(value) => handleChange(o._id, value)}
                          size="small"
                          style={{ width: "100%" }}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>{s}</Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).format("DD-MM-YYYY")}</td>
                      <td>{getPaymentStatus(o)}</td>
                      <td>{o?.payment?.method?.toUpperCase() || "COD"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="container-fluid">
              <strong className="me-2">Phone:  {o?.buyer?.phone || "N/A"}</strong>
              <br />
              <strong className="me-2">Address: {o?.buyer?.address || "N/A"}</strong>
     
                {o?.products?.map((p, i) => (
                  <div className="row mb-3 p-2 bg-white rounded shadow-sm align-items-center" key={p._id}>
                    <div className="col-12 col-sm-4 text-center mb-2 mb-sm-0">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="img-fluid"
                        alt={p.name}
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-12 col-sm-8">
                      <p className="mb-1"><strong>{p.name}</strong></p>
                      <p className="mb-1 text-muted">{p.description?.substring(0, 30)}...</p>
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

export default AdminOrders;
