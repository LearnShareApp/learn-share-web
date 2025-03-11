"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <section className={styles.userInfoSection}>
            <div className={styles.userInfo}>
              <div className={styles.avatarWrapper}>
                <Image
                  src="/default-avatar.png"
                  alt="Фото профиля"
                  width={80}
                  height={80}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.details}>
                <h1 className={styles.userName}>Имя Пользователя</h1>
                <p className={styles.userRole}>Ученик</p>
              </div>
            </div>
          </section>
          <section className={styles.balanceCard}>
            <h2>Баланс</h2>
            <p>Баланс: 1000 руб</p>
          </section>
          <section className={styles.mobileAppBanner}>
            <h2>Скачайте наше мобильное приложение</h2>
            <Link href="/download" className={styles.downloadButton}>
              Скачать приложение
            </Link>
          </section>
        </div>
        <div className={styles.rightColumn}>
          <section className={styles.nextLessonSection}>
            <h2 className={styles.sectionTitle}>Следующий урок</h2>
            <div className={styles.lessonDetails}>
              <p>Дата и время: 25 декабря, 15:00</p>
              <p>Учитель: Иван Иванов</p>
            </div>
          </section>
          <section className={styles.previousTeachersSection}>
            <h2 className={styles.sectionTitle}>Предыдущие учителя</h2>
            <ul className={styles.teachersList}>
              <li>Мария Петрова</li>
              <li>Алексей Смирнов</li>
              <li>Ольга Кузнецова</li>
            </ul>
          </section>
          <section className={styles.findTeacherSection}>
            <h2 className={styles.sectionTitle}>Найти нового учителя</h2>
            <Link href="/teachers" className={styles.findTeacherButton}>
              Поиск учителей
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
