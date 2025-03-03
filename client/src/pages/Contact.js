import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import "../styles/Contact.css"; 
import emailjs from "@emailjs/browser";

const Contact = () => {
  // State to handle form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading to true to indicate the form is submitting

    // Call emailjs.send with your service and template IDs
    emailjs
      .send(
        'service_ycnmu3f',
      'template_87gvr6g',  // Your EmailJS template ID
        {
          from_name: form.name,
          to_name: "Aryan Kuril", // Your name or recipient's name
          from_email: form.email,
          to_email: "kurilarayn1@gmail.com", // Your email or recipient's email
          message: form.message,
        },
        'G5FLJt34Q-OREA1CP' // Your EmailJS public key
      )
      .then(
        () => {
          setLoading(false); // Turn off loading indicator
          alert("Thank you! I will get back to you as soon as possible."); // Success message

          // Reset the form fields after submission
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false); // Turn off loading indicator
          console.error(error); // Log the error

          // Show an error message to the user
          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };


  return (
    <Layout title={"Contact Us"}>
      <div className="contact-page">
        <div className="contact-box">
          
          <h2>Contact Us</h2>
          <p>
            Have a question, suggestion, or concern? We're here to help! Fill
            out the form below and we'll get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="contact-form">
            {/* Name Field */}
            <div className="input-group">
            <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
            </div>
            {/* Email Field */}
            <div className="input-group">
            <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
            </div>
            {/* Message Field */}
            <div className="input-group">
            <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>
            </div>
            {/* Submit Button */}
            <button type="submit" className="btn-send">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
