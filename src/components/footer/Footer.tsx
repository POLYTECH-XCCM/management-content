import React from "react";
import "./Footer.css";
import Image from "next/image";
import { FaXTwitter, FaFacebookF, FaWhatsapp, FaInstagram, FaLinkedin, FaRegCopyright } from "react-icons/fa6";
import { useTheme } from "next-themes";

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`footer-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="footer-content">
        <div className="footer-section">
          <Image
            src="/images/logo.png"
            height={50}
            width={100}
            alt="logo"
            className="footer-logo"
          />
          <div className="social-icons">
            <a href="https://twitter.com/i/flow/login" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
            <a href="https://web.facebook.com/?_rdc=1&_rdr" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">About</h3>
          <p>XCCM helps you create useful content</p>
          <p>XCCM helps you create useful content</p>
          <p>XCCM helps you create useful content</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Help</h3>
          <p>Do you have any questions?</p>
          <p>Do you have any questions?</p>
          <p>Do you have any questions?</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <div className="contact-info">
            <FaWhatsapp />
            <p>+237____________</p>
          </div>
          <div className="contact-info">
            <FaWhatsapp />
            <p>+237____________</p>
          </div>
          <p>ENSPY</p>
          <p>Yaoundé Cmr</p>
        </div>
      </div>

      <div className="footer-bottom">
        <FaRegCopyright />
        <p>2024 XCCM, All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;