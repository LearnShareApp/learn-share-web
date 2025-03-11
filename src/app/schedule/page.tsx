"use client";

import styles from "./page.module.scss";

export default function SchedulePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои уроки</h1>
      <div className={styles.content}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>Предстоящие</button>
          <button className={styles.filterButton}>Прошедшие</button>
        </div>
        <div className={styles.calendar}>{/* Здесь будет календарь */}</div>
        <div className={styles.lessonsList}>
          {/* Здесь будет список уроков */}
        </div>
      </div>
    </div>
  );
}
