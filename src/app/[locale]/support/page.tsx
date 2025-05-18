import React from "react";
import styles from "./page.module.scss";

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <h1>Support Our Project</h1>
      <div className="card">
        <p>We need your help to keep this project alive and growing!</p>
        <p>There are two main ways you can support us:</p>
        <ul>
          <li>
            <strong>Development Help:</strong> We welcome contributions from
            developers of all skill levels. Whether it&apos;s fixing bugs,
            adding new features, or improving documentation, your code
            contributions are valuable.
          </li>
          <li>
            <strong>Financial Support:</strong> Your donations help cover server
            costs, development tools, and allow us to dedicate more time to the
            project. Every contribution, no matter how small, makes a
            difference.
          </li>
        </ul>
        <p>
          Together, we can make this project even better. Thank you for your
          support!
        </p>
      </div>
    </div>
  );
}
