"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";
import useProfile from "../../hooks/useProfile";
import { useAvatar } from "../../hooks/avatar-hook";

const ProfilePage = () => {
  const router = useRouter();
  const { profile } = useProfile();
  const { avatarSource } = useAvatar(profile?.avatar || null);

  const handleLogout = () => {
    // Удаляем jwt токен из localStorage
    localStorage.removeItem("userToken");
    // Перенаправляем пользователя на страницу авторизации
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <Image
              src={avatarSource}
              alt="Profile Photo"
              width={120}
              height={120}
              className={styles.avatar}
            />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>
              {profile ? `${profile.name} ${profile.surname}` : "User Name"}
            </h1>
            <p className={styles.userRole}>Student</p>
          </div>
        </div>
        <button
          className={styles.editButton}
          onClick={() => router.push("/profile/edit")}
        >
          Edit Profile
        </button>
      </div>

      <div className={styles.content}>
        <section className="card">
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>
                {profile ? profile.email : "user@example.com"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>+7 (999) 123-45-67</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Time Zone</span>
              <span className={styles.value}>Moscow (GMT+3)</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className={styles.sectionTitle}>Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>12</span>
              <span className={styles.statLabel}>Completed Lessons</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>4</span>
              <span className={styles.statLabel}>Teachers</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>24</span>
              <span className={styles.statLabel}>Learning Hours</span>
            </div>
          </div>
        </section>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px",
          background: "#ccc",
          border: "none",
          cursor: "pointer",
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default ProfilePage;
