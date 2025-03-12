import React from "react";
import styles from "./page.module.scss";

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1>Learn&amp;Share Application Privacy Policy</h1>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Introduction</h2>
        <p>
          This Privacy Policy describes how the Learn&amp;Share application
          collects, uses, and protects information obtained from users. We value
          your privacy and strive to provide maximum protection for your
          personal data.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Collected Information</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>Personal data (name, email address, phone number)</li>
          <li>Information about skills and interests</li>
          <li>Profile data (photo, biography)</li>
          <li>Information about user interactions</li>
          <li>Technical data (IP address, device type, operating system)</li>
        </ul>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Use of Information</h2>
        <p>The collected information is used for:</p>
        <ul>
          <li>Creating and managing user accounts</li>
          <li>Ensuring the functioning of the skills exchange platform</li>
          <li>Connecting students with teachers</li>
          <li>Improving service quality and user experience</li>
          <li>Ensuring platform security</li>
        </ul>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Data Sharing with Third Parties</h2>
        <p>
          We do not sell or transfer your personal data to third parties without
          your consent, except in cases:
        </p>
        <ul>
          <li>When necessary to ensure service operation</li>
          <li>In cases provided by law</li>
          <li>To protect user rights and safety</li>
        </ul>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Data Storage and Protection</h2>
        <p>
          We take all necessary measures to protect your data from unauthorized
          access, alteration, disclosure, or destruction. Data is stored only
          for the period necessary to ensure service operation.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>User Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Delete your data from the system</li>
          <li>Withdraw your consent to data processing</li>
        </ul>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Changes to Privacy Policy</h2>
        <p>
          We reserve the right to make changes to this Privacy Policy. Users
          will be notified of significant changes through the application or by
          email.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>Contact Information</h2>
        <p>
          For questions regarding this Privacy Policy, you can contact us by
          email: learnandshareapp@gmail.com.
        </p>
      </div>

      <p>Last updated: March 12, 2025</p>
    </div>
  );
}
