"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Welcome to
            {` `}
            <span className={styles.highlight}>Learn&Share</span>
          </h1>
          <p>Learning has never been so simple and accessible!</p>
          <div className={styles.heroButtons}>
            <Link href="/auth" className={styles.primaryButton}>
              Start Learning
            </Link>
            <Link href="/auth" className={styles.secondaryButton}>
              Sign In
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/globe.svg"
            alt="Learn Together"
            width={600}
            height={400}
          />
        </div>
      </section>
      <section className={styles.about}>
        <h2>About Us</h2>
        <p>
          We are building a community of like-minded individuals where everyone
          can learn, share experiences, and explore new possibilities. Our
          mission is to make learning accessible for all.
        </p>
      </section>
      <section className={styles.features}>
        <h2>Our Advantages</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-book"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v19H6.5A2.5 2.5 0 0 1 4 18.5z"></path>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Innovative Learning Methods</h3>
            <p className={styles.featureDescription}>
              We use modern approaches for effective knowledge acquisition.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-layout"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>
              User-friendly and Modern Interface
            </h3>
            <p className={styles.featureDescription}>
              Simple and intuitive design for a comfortable learning experience.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-users"
              >
                <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M9 21v-2a4 4 0 0 1 3-3.87"></path>
                <path d="M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M8 3.13a4 4 0 0 0 0 7.75"></path>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Community Support</h3>
            <p className={styles.featureDescription}>
              We foster a friendly community for sharing experiences and mutual
              help.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.testimonials}>
        <h2>Student Testimonials</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p>This is the best educational platform I have ever attended!</p>
            <span>Anna</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>Thanks to Learn & Share, I found my calling in life.</p>
            <span>John</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>An excellent platform that helps you grow every day.</p>
            <span>Mary</span>
          </div>
        </div>
      </section>
      <section className={styles.gettingStarted}>
        <h2>Getting Started</h2>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <h3>Learn</h3>
            <ul>
              <li>Create a profile</li>
              <li>Browse teacher profiles and choose the right one</li>
              <li>Book a lesson with them</li>
              <li>Gain new knowledge!</li>
            </ul>
          </div>
          <div className={styles.rightColumn}>
            <h3>Share</h3>
            <ul>
              <li>Create a profile</li>
              <li>
                Record a video on YouTube where you talk about your skill and
                yourself
              </li>
              <li>Add a new category to your profile</li>
              <li>Choose a convenient time for your lessons</li>
              <li>Share your skills with everyone!</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
