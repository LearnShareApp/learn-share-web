"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeadline}>
            <h1>
              <span className={styles.highlight}>Learn&Share,</span>
              <span>Grow Together</span>
            </h1>

            <p>
              Become a part of our community of knowledge and experience
              sharing, whether you want to learn or share your skills.
            </p>

            <div className={styles.heroButtons}>
              <Link href="/auth?role=student" className={styles.primaryButton}>
                <span>I want to learn</span>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"
                  />
                </svg>
              </Link>
              <Link
                href="/auth?role=teacher"
                className={styles.secondaryButton}
              >
                <span>I want to teach</span>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/images/hero-image.jpg"
              alt="Learn&Share Platform"
              className={styles.heroImage}
              width={500}
              height={400}
              priority
            />
          </div>
        </div>

        {/* <div className={styles.keyFeatures}>
          <div className={styles.keyFeature}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
              />
            </svg>
            <span>Learn from anywhere</span>
          </div>

          <div className={styles.keyFeature}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
            <span>Flexible schedule</span>
          </div>

          <div className={styles.keyFeature}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
              />
            </svg>
            <span>Safe learning</span>
          </div>

          <div className={styles.keyFeature}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
              />
            </svg>
            <span>Real knowledge</span>
          </div>
        </div> */}
      </section>

      <section className={styles.howItWorks}>
        <h2>How it works</h2>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Registration</h3>
              <p>
                Create an account, fill out your profile, and specify your
                interests
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Choose your role</h3>
              <p>Decide who you want to be today: a student or a teacher</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Start learning</h3>
              <p>Find the perfect teacher or students for your knowledge</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <h2>Learn&Share Benefits</h2>

        <div className={styles.benefitCards}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  fill="currentColor"
                  d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
            <h3>For everyone</h3>
            <p>No restrictions on education level or specialization</p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  fill="currentColor"
                  d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"
                />
              </svg>
            </div>
            <h3>Quick results</h3>
            <p>Learn at your own pace with focus on practical skills</p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  fill="currentColor"
                  d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"
                />
              </svg>
            </div>
            <h3>Monetize knowledge</h3>
            <p>Earn money by teaching others your skills</p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7c.39-.39.39-1.02 0-1.41-.39-.39-1.03-.39-1.42 0z"
                />
              </svg>
            </div>
            <h3>Easy to use</h3>
            <p>Convenient interface and built-in video communication system</p>
          </div>
        </div>
      </section>

      <section className={styles.statistics}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10,000+</span>
          <span className={styles.statLabel}>Active users</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>5,000+</span>
          <span className={styles.statLabel}>Completed lessons</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>50+</span>
          <span className={styles.statLabel}>Skills and categories</span>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2>User Testimonials</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>
                &ldquo;The platform has completely transformed my approach to
                learning. Now I can not only gain knowledge but also share my
                experience with others. An excellent opportunity for
                professional growth!&rdquo;
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <Image
                src="/images/person1.jpg"
                alt="Alexander K."
                width={80}
                height={80}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <p className={styles.authorName}>Alexander K.</p>
                <p className={styles.authorRole}>JavaScript Instructor</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>
                &ldquo;Thanks to Learn&Share, I found the perfect design
                instructor. The convenient interface, flexible schedule, and
                individual approach made learning extremely effective.&rdquo;
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <Image
                src="/images/person1.jpg"
                alt="Maria S."
                width={80}
                height={80}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <p className={styles.authorName}>Maria S.</p>
                <p className={styles.authorRole}>Student, Web Designer</p>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>
                &ldquo;As an English teacher, I appreciate the opportunity to
                work with motivated students. The platform provides all the
                necessary tools for effective teaching.&rdquo;
              </p>
            </div>
            <div className={styles.testimonialAuthor}>
              <Image
                src="/images/person1.jpg"
                alt="Elena M."
                width={80}
                height={80}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <p className={styles.authorName}>Elena M.</p>
                <p className={styles.authorRole}>English Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.callToAction}>
        <h2>Start your journey today</h2>
        <p>Choose your role and join our community of learners and teachers</p>

        <div className={styles.ctaButtons}>
          <Link href="/auth?role=student" className={styles.primaryButton}>
            Start learning
          </Link>
          <Link href="/auth?role=teacher" className={styles.secondaryButton}>
            Start teaching
          </Link>
        </div>
      </section>
    </div>
  );
}
