import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
          Welcome to our Shop, your trusted destination for high-quality electronics and gadgets. We take pride in offering a wide range of products, from the latest smartphones and laptops to essential home appliances and accessories, all at competitive prices.
          </p>
          <p className="text-justify mt-2">
          With years of experience in the electronics industry, we understand the needs of our customers and strive to provide the best products with exceptional customer service. Our e-commerce platform is designed to make your shopping experience seamless, secure, and convenient, ensuring fast delivery and easy payment options.
          </p>
          <p className="text-justify mt-2">
          At our Shop, customer satisfaction is our priority. We are committed to bringing you the latest technology and innovations while maintaining affordability and quality. Whether you're looking for everyday essentials or high-end gadgets, we’ve got you covered.
          </p>
          <p className="text-justify mt-2">
          Shop with confidence and stay ahead with the best in electronics!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
