"use client";

import styles from "./page.module.scss";

export default function ForTeachersPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Для учителей</h1>
      <div className={styles.content}>
        <div className={styles.description}>
          Станьте частью нашего сообщества преподавателей и делитесь своими
          знаниями с учениками со всего мира.
        </div>
        {/* Здесь будет контент страницы */}
      </div>
    </div>
  );
}
