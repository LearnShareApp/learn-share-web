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
            Welcome to{` `}
            <span className={styles.highlight}>Learn&Share</span>
          </h1>
          <p>Innovative platform for skills and knowledge exchange!</p>
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
            src="/logo.png"
            alt="Learn&Share Logo"
            width={300}
            height={300}
            priority
          />
        </div>
      </section>

      <section className={styles.about}>
        <h2>About Us</h2>
        <p>
          Learn&Share is an innovative skill-sharing platform where anyone can
          be both a student and a teacher, regardless of formal education. We
          create a safe space where people can monetize their skills or share
          them for free as volunteers.
        </p>
        <p>
          Our platform does not limit skill categories — from traditional to
          unusual, each mentor can propose their own teaching area.
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
                className="feather feather-shield"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Safety and Trust</h3>
            <p className={styles.featureDescription}>
              Mandatory video verification for mentors and a review system from
              real students.
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
              User-friendly Modern Interface
            </h3>
            <p className={styles.featureDescription}>
              Simple and intuitive design for comfortable learning.
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
            <h3 className={styles.featureTitle}>
              Community of Like-minded People
            </h3>
            <p className={styles.featureDescription}>
              We are creating a dynamic community focused on developing
              communication and accessible education for everyone.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.workflowSteps}>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Registration</h3>
            <p>Create an account and fill out your profile</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Choose Your Role</h3>
            <p>Decide whether you want to teach or learn</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Find a Teacher/Student</h3>
            <p>Find a suitable teacher or wait for requests from students</p>
          </div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Online Learning</h3>
            <p>Conduct lessons through integrated video communication</p>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>Student Testimonials</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p>This is the best educational platform I have ever studied on!</p>
            <span>Anna</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>Thanks to Learn&Share, I found my calling in life.</p>
            <span>John</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>A great platform that helps you grow every day.</p>
            <span>Maria</span>
          </div>
        </div>
      </section>

      <section className={styles.gettingStarted}>
        <h2>How to Start</h2>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <h3>Learning</h3>
            <ul>
              <li>Create a profile</li>
              <li>Browse teacher profiles and choose a suitable one</li>
              <li>Book a lesson</li>
              <li>Gain new knowledge!</li>
            </ul>
          </div>
          <div className={styles.rightColumn}>
            <h3>Sharing</h3>
            <ul>
              <li>Create a profile</li>
              <li>
                Record a YouTube video where you talk about your skills and
                yourself
              </li>
              <li>Add a new category to your profile</li>
              <li>Choose a convenient time for your lessons</li>
              <li>Share your skills with everyone!</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.callToAction}>
        <h2>Join Today!</h2>
        <p>Become part of a growing community of teachers and students</p>
        <Link href="/auth" className={styles.ctaButton}>
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
