"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTeacher } from "../../hooks/useTeacher";
import { apiService, TeacherLesson } from "../../utilities/api";
import Footer from "../../components/footer/Footer";
import LessonItem from "../../components/lesson-item/LessonItem";
import styles from "./page.module.scss";
import Link from "next/link";

const TeachingPage = () => {
  const { loadingTeacher, refetch } = useTeacher();

  const [pastLessons, setPastLessons] = useState<TeacherLesson[]>([]);
  const [upcomingLessons, setUpcomingLessons] = useState<TeacherLesson[]>([]);

  const fetchLessons = useCallback(async () => {
    try {
      refetch();
      const response = await apiService.getTeacherLessons();
      const sortedLessons = response.sort((a, b) => {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return dateA.getTime() - dateB.getTime();
      });

      const now = new Date();
      setPastLessons(
        sortedLessons.filter((lesson) => new Date(lesson.datetime) < now)
      );
      setUpcomingLessons(
        sortedLessons.filter((lesson) => new Date(lesson.datetime) >= now)
      );
    } catch (err) {
      console.error("Error details:", err);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        {loadingTeacher ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.buttonContainer}>
              <Link href="/for-teachers/add-time" className={styles.button}>
                Add Time
              </Link>
              <Link
                href="/for-teachers/lesson-requests"
                className={styles.button}
              >
                Handle Lesson Requests
              </Link>
              <Link href="/for-teachers/statistics" className={styles.button}>
                Statistics
              </Link>
            </div>
            <section className={styles.lessonsSection}>
              <h2>Upcoming Lessons</h2>
              <div className={styles.lessonsList}>
                {upcomingLessons.map((lesson) => (
                  <LessonItem key={lesson.lesson_id} lesson={lesson} />
                ))}
              </div>
            </section>
            <section className={styles.lessonsSection}>
              <h2>Previous Lessons</h2>
              <div className={styles.lessonsList}>
                {pastLessons.map((lesson) => (
                  <LessonItem key={lesson.lesson_id} lesson={lesson} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TeachingPage;
