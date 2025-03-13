"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import useProfile from "../../hooks/useProfile";
import { useAvatar } from "../../hooks/avatar-hook";
import Loader from "@/components/loader/Loader";

export default function HomePage() {
  const { profile, loadingProfile } = useProfile();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar || null);

  if (loadingProfile || loadingAvatar) return <Loader />;

  return (
    <div className={styles.columns}>
      <div className={styles.leftColumn}>
        <section className="card">
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              <Image
                src={avatarSource}
                alt="Profile Photo"
                width="80"
                height="80"
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className={styles.details}>
              <h1 className={styles.userName}>
                {profile ? `${profile.name} ${profile.surname}` : "User Name"}
              </h1>
              <p className={styles.userRole}>Student</p>
            </div>
          </div>
        </section>
        <section className="card balance">
          <h2>Balance</h2>
          <div className={styles.balanceWrapper}>
            <p>$1000 USD</p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="6"
                x2="12"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="6"
                y1="12"
                x2="18"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </section>
        <section className="card">
          <div className={styles.mobileAppBanner}>
            <div>
              <h3>Try the mobile version</h3>
              <Link href="/download" className={styles.downloadButton}>
                Download the App
              </Link>
            </div>
            <Image
              className={styles.appLogo}
              src="/app-logo.png"
              alt="Download the App"
              width={100}
              height={100}
            />
          </div>
        </section>
      </div>
      <div className={styles.rightColumn}>
        <section className="card">
          <h2 className={styles.sectionTitle}>Next Lesson</h2>
          <div className={styles.lessonDetails}>
            <p>Date and Time: December 25, 15:00</p>
            <p>Teacher: Ivan Ivanov</p>
          </div>
        </section>
        <section className="card">
          <h2 className={styles.sectionTitle}>Previous Teachers</h2>
          <ul className={styles.teachersList}>
            <li>Maria Petrova</li>
            <li>Alexey Smirnov</li>
            <li>Olga Kuznetsova</li>
          </ul>
        </section>
        <Link href="/teachers">
          <section className="card search-teacher">
            <h3 style={{ textAlign: "center" }}>Find a New Teacher</h3>
          </section>
        </Link>
      </div>
    </div>
  );
}
