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
      const orderDate = moment(order.createAt);
      const now = moment();
      switch (timeFrame) {
        case "1year": return orderDate.isAfter(now.subtract(1, "year"));
        case "6months": return orderDate.isAfter(now.subtract(6, "months"));
        case "1month": return orderDate.isAfter(now.subtract(1, "month"));
        case "1week": return orderDate.isAfter(now.subtract(1, "week"));
        case "1day": return orderDate.isAfter(now.subtract(1, "day"));
        default: return true;
      }
    }).map(order => ({
      id_: order._id,
      buyer_name: order.buyer?.name,
      order_date: moment(order.createAt).format("YYYY-MM-DD"),  // Exact order date
      // payment_method: order.payment?.method || "Not Available",  // Payment method (card, UPI, COD, etc.)
      payment_status: order.payment?.success ? "Success" : "Failed",
      products: order.products?.map(p => ({
        product_id: p._id,  // Product ID
        product_name: p.name,  // Product Name
        product_price: p.price,  // Product Price (assumed to be part of the product object)
        // product_length: p.length || "N/A",  // Product Length (with fallback to "N/A" if not available)
      })) || []
    }));
  
    // Flatten the products array to include each product on a new row in the Excel file
    const flattenedOrders = filteredOrders.flatMap(order => 
      order.products.map(product => ({
        order_id: order.id_,
        buyer_name: order.buyer_name,
        order_date: order.order_date,
        payment_status: order.payment_status,
        product_id: product.product_id,
        product_name: product.product_name,
        product_price: product.product_price,
        // product_length: product.product_length,
      }))
    );
  
    const worksheet = XLSX.utils.json_to_sheet(flattenedOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders_${timeFrame}.xlsx`);
  };
  
  
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
      <div className="row dashboard">
      <div className="admin-slider-container">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders.map((o, i) => (
            <div key={o._id} className="border shadow">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <Select defaultValue={o?.status} onChange={(value) => handleChange(o._id, value)}>
                        {status.map((s, i) => (
                          <Option key={i} value={s}>{s}</Option>
                        ))}
                      </Select>
                    </td>
                    <td>{o?.buyer?.name}</td>
                    <td>{moment(o?.createAt).format("YYYY-MM-DD")}</td>
                    <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                    <td>{o?.products?.length}</td>
                  </tr>
                </tbody>
              </table>
              <div className="container">
                  {o?.products?.map((p, i) => (
                    <div className="row mb-2 p-3 card flex-row" key={p._id}>
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="100px"
                          height={"100px"}
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>Price : {p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          ))}
          <div className="mt-3">
            <h3>Export Orders</h3>
            <Dropdown overlay={exportMenu}>
              <Button className="btn btn-success">Export Orders</Button>
            </Dropdown>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
