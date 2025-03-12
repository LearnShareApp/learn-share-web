"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <section className="card">
            <div className={styles.userInfo}>
              <div className={styles.avatarWrapper}>
                <Image
                  src="/default-avatar.png"
                  alt="Фото профиля"
                  width="80"
                  height="80"
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <div className={styles.details}>
                <h1 className={styles.userName}>Имя Пользователя</h1>
                <p className={styles.userRole}>Ученик</p>
              </div>
            </div>
          </section>
          <section className="card balance">
            <h2>Баланс</h2>
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
                <h3>Попробуйте мобильную версию</h3>
                <Link href="/download" className={styles.downloadButton}>
                  Скачать приложение
                </Link>
              </div>
              <Image
                className={styles.appLogo}
                src="/app-logo.png"
                alt="Скачать приложение"
                width={100}
                height={100}
              />
            </div>
          </section>
        </div>
        <div className={styles.rightColumn}>
          <section className="card">
            <h2 className={styles.sectionTitle}>Следующий урок</h2>
            <div className={styles.lessonDetails}>
              <p>Дата и время: 25 декабря, 15:00</p>
              <p>Учитель: Иван Иванов</p>
            </div>
          </section>
          <section className="card">
            <h2 className={styles.sectionTitle}>Предыдущие учителя</h2>
            <ul className={styles.teachersList}>
              <li>Мария Петрова</li>
              <li>Алексей Смирнов</li>
              <li>Ольга Кузнецова</li>
            </ul>
          </section>
          <Link href="/teachers">
            <section className="card search-teacher">
              <h3 style={{ textAlign: "center" }}>Найти нового учителя</h3>
            </section>
          </Link>
        </div>
      </div>
    </div>
  );
}
