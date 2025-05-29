import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/v1/auth/all-users");
        setUsers(data.users || []);
      } catch (error) {
        setError(error.response ? error.response.data.message : "Something went wrong!");
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout title={"All Users"}>
      <div className="container-fluid dashboard">
        <div className="row">
          <div className="col-5 col-md-3 ">
            <AdminMenu />
          </div>
          <div className="col-10 col-md-9">
            <h1 className="text-center mb-4">All Users</h1>

            {error && <p className="text-danger text-center">{error}</p>}

            {users.length === 0 ? (
              <p className="text-center">No users found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Address</th>
                      <th scope="col">Signup Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || "N/A"}</td>
                        <td>{user.address || "N/A"}</td>
                        <td>{moment(user.createdAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
