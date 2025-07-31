import React from "react";
import { PageHeader, Card, SectionTitle } from "@/components";
import styles from "./page.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <PageHeader
        title="About Us"
        subtitle="Learn more about our mission and what we offer"
      />

      <Card>
        <SectionTitle level={3}>Who We Are?</SectionTitle>
        <p>
          Learn&Share is a knowledge-sharing platform where everyone can become
          both a student and a teacher. We create a safe and dynamic community
          where users exchange experiences and support each other in
          development.
        </p>
      </Card>

      <Card>
        <SectionTitle level={3}>Our Mission</SectionTitle>
        <p>
          We strive to make learning accessible to everyone by providing a
          platform where everyone can share their knowledge and skills, develop
          personal potential, and discover new horizons.
        </p>
      </Card>

      <Card>
        <SectionTitle level={3}>What We Offer?</SectionTitle>
        <ul>
          <li>Convenient and intuitive interface</li>
          <li>Verified users to ensure security</li>
          <li>Support from a community of like-minded people and experts</li>
          <li>Opportunity to share knowledge in any direction</li>
        </ul>
      </Card>

      <Card>
        <p>
          Join us to discover the world of knowledge and exchange experiences
          with thousands of users around the world!
        </p>
      </Card>
    </div>
  );
}
