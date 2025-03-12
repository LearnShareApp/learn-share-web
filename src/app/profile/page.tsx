"use client";

import Image from "next/image";
import styles from "./page.module.scss";

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <Image
              src="/default-avatar.png"
              alt="Фото профиля"
              width={120}
              height={120}
              className={styles.avatar}
            />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>Имя Пользователя</h1>
            <p className={styles.userRole}>Ученик</p>
          </div>
        </div>
        <button className={styles.editButton}>Редактировать профиль</button>
      </div>

      <div className={styles.content}>
        <section className="card">
          <h2 className={styles.sectionTitle}>Личная информация</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>user@example.com</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Телефон</span>
              <span className={styles.value}>+7 (999) 123-45-67</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Часовой пояс</span>
              <span className={styles.value}>Москва (GMT+3)</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className={styles.sectionTitle}>Статистика</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>12</span>
              <span className={styles.statLabel}>Пройдено уроков</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>4</span>
              <span className={styles.statLabel}>Учителей</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>24</span>
              <span className={styles.statLabel}>Часа обучения</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
