import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          <h2 className={styles.logo}>Learn&Share</h2>
          <p className={styles.tagline}>
            Democratizing education through community-driven learning.
          </p>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkColumn}>
            <h3>Platform</h3>
            <ul>
              <li>
                <a href="/features">Features</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/become-teacher">Become a Teacher</a>
              </li>
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3>Company</h3>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3>Legal</h3>
            <ul>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/cookie">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.copy}>
          © {currentYear} Learn&Share. All rights reserved.
        </div>
        <div className={styles.social}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
