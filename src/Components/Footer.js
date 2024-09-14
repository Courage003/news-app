import React, { useState, useEffect } from 'react';
import './Footer.css'; // Import CSS for styling

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  const controlFooterVisibility = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 10) {
      // Show footer if scrolled to bottom of the page
      setShowFooter(true);
    } else {
      // Hide footer if not at the bottom
      setShowFooter(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlFooterVisibility);
    return () => {
      window.removeEventListener("scroll", controlFooterVisibility);
    };
  }, []);

  return (
    <footer className={`footer ${showFooter ? 'visible' : 'hidden'}`}>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Made with ❤️ by Riddhika Sharma. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
