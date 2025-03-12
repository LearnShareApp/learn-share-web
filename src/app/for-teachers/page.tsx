"use client";

import styles from "./page.module.scss";
import Link from "next/link";

export default function ForTeachersPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Для учителей</h1>
      <div className={styles.content}>
        <div className={styles.description}>
          Станьте частью нашего сообщества преподавателей и делитесь своими
          знаниями с учениками со всего мира.
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/for-teachers/add-time">
            <button className={styles.button}>Добавить время</button>
          </Link>
          <Link href="/for-teachers/lesson-requests">
            <button className={styles.button}>
              Обработка запросов на уроки
            </button>
          </Link>
          <Link href="/for-teachers/statistics">
            <button className={styles.button}>Статистика</button>
          </Link>
        </div>
        <div className={styles.lessonsList}>
          <h2>Ближайшие уроки</h2>
          <ul>
            <li>Урок по математике - 10:00</li>
            <li>Урок по химии - 11:00</li>
            <li>Урок по физике - 12:00</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
