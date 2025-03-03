import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>⚫ We respect your privacy and protect your personal information with strict security measures.</p>
          <p>⚫ Your data is used only for order processing, delivery, and customer support.</p>
          <p>⚫ We do not sell, trade, or share your personal information with third parties without consent.</p>
          <p>⚫ Secure payment gateways ensure safe transactions for all purchases.</p>
          <p>⚫ Cookies are used to enhance your browsing experience, but you can manage them anytime.</p>
          <p>⚫ By using our website, you agree to our privacy policy and data protection practices.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
