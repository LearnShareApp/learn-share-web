import React from "react";
import styles from "./page.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1>About Us</h1>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Who We Are?</h2>
        <p>
          Learn&amp;Share is a knowledge-sharing platform where everyone can
          become both a student and a teacher. We create a safe and dynamic
          community where users exchange experiences and support each other in
          development.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Our Mission</h2>
        <p>
          We strive to make learning accessible to everyone by providing a
          platform where everyone can share their knowledge and skills, develop
          personal potential, and discover new horizons.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>What We Offer?</h2>
        <ul>
          <li>Convenient and intuitive interface</li>
          <li>Verified users to ensure security</li>
          <li>Support from a community of like-minded people and experts</li>
          <li>Opportunity to share knowledge in any direction</li>
        </ul>
      </div>

      <p>
        Join us to discover the world of knowledge and exchange experiences with
        thousands of users around the world!
      </p>
    </div>
  );
}
