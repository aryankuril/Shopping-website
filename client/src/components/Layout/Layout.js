import React, { useState, useEffect } from "react";
// import React from "react";
import axios from "axios";

import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
const Layout = ({ children, title, description, keywords, author }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/category/get-category")
      .then(res => setCategories(res.data.category))
      .catch(err => console.error("Error fetching categories", err));
  }, []);
 

  return (
    <div className="main-content">  
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />

        {children}
      </main>
      <Footer categories={categories}/>
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "aryan kuril",
};

export default Layout;
