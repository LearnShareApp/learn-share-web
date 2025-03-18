"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { apiService, Lesson } from "../../utilities/api";
import LessonItem from "@/components/lesson-item/LessonItem";

export default function SchedulePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      const lessonsData = await apiService.getLessons();
      setLessons(lessonsData);
    };
    fetchLessons();
  }, []);

  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <div className={styles.content}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>Upcoming</button>
          <button className={styles.filterButton}>Past</button>
        </div>
        {/* <div className={styles.calendar}>Calendar will be here</div> */}
        <div className={styles.lessonsList}>
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonItem key={lesson.lesson_id} lesson={lesson} />
            ))
          ) : (
            <p>No lessons available</p>
          )}
        </div>
      </div>
    </>
  );
}
