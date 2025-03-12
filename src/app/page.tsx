"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";
import { useLanguage } from "@/providers/LanguageProvider";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            {t.title}
            {` `}
            <span className={styles.highlight}>{t.highlight}</span>
          </h1>
          <p>{t.subtitle}</p>
          <div className={styles.heroButtons}>
            <Link href="/signup" className={styles.primaryButton}>
              {t.buttonPrimary}
            </Link>
            <Link href="/home" className={styles.secondaryButton}>
              {t.buttonSecondary}
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero-image.jpg"
            alt="Учимся вместе"
            width={600}
            height={400}
          />
        </div>
      </section>
      <section className={styles.about}>
        <h2>{t.aboutTitle}</h2>
        <p>{t.aboutText}</p>
      </section>
      <section className={styles.features}>
        <h2>{t.featuresTitle}</h2>
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
            <h3 className={styles.featureTitle}>{t.feature1Title}</h3>
            <p className={styles.featureDescription}>{t.feature1Text}</p>
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
            <h3 className={styles.featureTitle}>{t.feature2Title}</h3>
            <p className={styles.featureDescription}>{t.feature2Text}</p>
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
            <h3 className={styles.featureTitle}>{t.feature3Title}</h3>
            <p className={styles.featureDescription}>{t.feature3Text}</p>
          </div>
        </div>
      </section>
      <section className={styles.testimonials}>
        <h2>{t.testimonialsTitle}</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p>{t.testimonial1Text}</p>
            <span>{t.testimonial1Name}</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>{t.testimonial2Text}</p>
            <span>{t.testimonial2Name}</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>{t.testimonial3Text}</p>
            <span>{t.testimonial3Name}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
