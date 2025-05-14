"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { apiService } from "../../utilities/api";
import { Lesson } from "../../types/types";
import LessonItem from "@/features/lesson-item/LessonItem";
import Loader from "@/components/loader/Loader";

export default function SchedulePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"upcoming" | "past" | "all">(
    "upcoming"
  );

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const lessonsData = await apiService.getLessons();

        // Sort lessons by date and time (newest first)
        const sortedLessons = lessonsData.sort((a, b) => {
          const dateA = new Date(a.datetime);
          const dateB = new Date(b.datetime);
          return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
        });

        setLessons(sortedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Filter lessons based on active filter
  const filteredLessons = lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.datetime);
    const now = new Date();

    if (activeFilter === "upcoming") return lessonDate >= now;
    if (activeFilter === "past") return lessonDate < now;
    return true; // "all" filter
  });

  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <div className={styles.content}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "upcoming" ? styles.activeFilter : ""
            }`}
            onClick={() => setActiveFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "past" ? styles.activeFilter : ""
            }`}
            onClick={() => setActiveFilter("past")}
          >
            Past
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "all" ? styles.activeFilter : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
        </div>

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className={styles.lessonsList}>
            {filteredLessons.map((lesson) => (
              <LessonItem key={lesson.lesson_id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className={styles.noLessons}>
            <p>No {activeFilter} lessons available</p>
          </div>
        )}
      </div>
    </>
  );
}
