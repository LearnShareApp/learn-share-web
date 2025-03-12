"use client";

import styles from "./page.module.scss";
import Link from "next/link";

export default function ForTeachersPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>For Teachers</h1>
      <div className={styles.content}>
        <div className={styles.description}>
          Become part of our community of teachers and share your knowledge with
          students from all over the world.
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/for-teachers/add-time">
            <button className={styles.button}>Add Time</button>
          </Link>
          <Link href="/for-teachers/lesson-requests">
            <button className={styles.button}>Handle Lesson Requests</button>
          </Link>
          <Link href="/for-teachers/statistics">
            <button className={styles.button}>Statistics</button>
          </Link>
        </div>
        <div className={styles.lessonsList}>
          <h2>Upcoming Lessons</h2>
          <ul>
            <li>Mathematics Lesson - 10:00</li>
            <li>Chemistry Lesson - 11:00</li>
            <li>Physics Lesson - 12:00</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
