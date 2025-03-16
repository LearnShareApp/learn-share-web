"use client";

import styles from "./page.module.scss";

export default function SchedulePage() {
  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <div className={styles.content}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>Upcoming</button>
          <button className={styles.filterButton}>Past</button>
        </div>
        <div className={styles.calendar}>{/* Calendar will be here */}</div>
        <div className={styles.lessonsList}>
          {/* Lessons list will be here */}
        </div>
      </div>
    </>
  );
}
