// import React from "react";
// import { Link } from "react-router-dom";
// import { FaFacebookF, FaInstagram, FaTwitter,FaLinkedin} from "react-icons/fa";
// //  import { IoLogoTelegram } from 'react-icons/io5'; 
// import "/Aryan IT/Shopping website/client/src/styles/Footer.css"; 
// const Footer = () => {
//   return (
//     <div className="footer">
//       <div className="footer-content">
//          <h1 className="text-center">All Right Reserved &copy; Aryan Kuril</h1>
//         <p className="text-center mt-3">
//         <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
//         <Link to="/policy">Privacy Policy</Link>
//         </p>
//        <div className="social-icons">
//          <a href="https://www.facebook.com/share/1H3Fs4DgPz/" target="_blank" rel="noopener noreferrer">
//            <FaFacebookF />
//          </a>
//          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
//            <FaTwitter />
//                     </a>
//          <a href="https://www.instagram.com/aryansunilkuril?igsh=MnoxcGdiMWc5OWxp" target="_blank" rel="noopener noreferrer">
//            <FaInstagram />
//          </a>
//          <a href="https://www.linkedin.com/in/aryankuril?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
//            <FaLinkedin />
//          </a>
//         </div>
//        </div>
//     </div>
//   );
// };

// export default Footer;
 
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
// import "/Aryan IT/Shopping website/client/src/styles/Footer.css";
import "../styles/Footer.css";


const Footer = ({ categories = [] }) => {
  const chunkSize = 5;
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += chunkSize) {
    chunkedCategories.push(categories.slice(i, i + chunkSize));
  }

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Left */}
        <div className="footer-left">
          <img src="/images/logo.png" alt="Cross Logo" className="footer-logo" />
          <p className="footer-desc">
            Cross delivers high-quality tech accessories like headphones, earbuds, 
            power banks, and speakers. We’re dedicated to keeping you connected with 
            innovative, reliable products designed for every lifestyle.
          </p>
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/share/1H3Fs4DgPz/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://www.instagram.com/aryansunilkuril" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/aryankuril" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>

        {/* Categories */}
        <div className="footer-categories">
          <h4>Categories</h4>
          <div className="category-columns">
            {chunkedCategories.map((group, index) => (
              <ul key={index}>
                {group.map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/policy">Privacy Policy</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p><strong>Email:</strong> <span className="highlight">support@yourdomain.com</span></p>
          <p><strong>Phone:</strong> <span className="highlight">+91-XXXXXXXXXX</span></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Aryan Kuril. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


































