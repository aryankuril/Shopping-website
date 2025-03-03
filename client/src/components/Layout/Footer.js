import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter,FaLinkedin} from "react-icons/fa";
//  import { IoLogoTelegram } from 'react-icons/io5'; 
import "/Aryan IT/Shopping website/client/src/styles/Footer.css"; 
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
         <h1 className="text-center">All Right Reserved &copy; Aryan Kuril</h1>
        <p className="text-center mt-3">
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
        </p>
       <div className="social-icons">
         <a href="https://www.facebook.com/share/1H3Fs4DgPz/" target="_blank" rel="noopener noreferrer">
           <FaFacebookF />
         </a>
         <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
           <FaTwitter />
                    </a>
         <a href="https://www.instagram.com/aryansunilkuril?igsh=MnoxcGdiMWc5OWxp" target="_blank" rel="noopener noreferrer">
           <FaInstagram />
         </a>
         <a href="https://www.linkedin.com/in/aryankuril?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
           <FaLinkedin />
         </a>
        </div>
       </div>
    </div>
  );
};

export default Footer;



































