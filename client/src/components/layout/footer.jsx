import React from 'react';
import './layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Billing System</span>
      <span className="footer-links">
        <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms & Conditions</a>
      </span>
    </footer>
  );
};

export default Footer;
