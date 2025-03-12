import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a href="/about">О нас</a>
        <a href="/support">Поддержка</a>
        <a href="/privacy">Политика</a>
        <a href="/contacts">Контакты</a>
      </div>
      <div className={styles.social}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
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
      <div className={styles.copy}>
        © {currentYear} Learn&Share. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
