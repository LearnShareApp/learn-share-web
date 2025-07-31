"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { apiService } from "../../utilities/api";
import { Lesson } from "../../types/types";
import LessonItem from "@/features/lesson-item/LessonItem";
import { PageHeader, ButtonGroup, Loader, EmptyState } from "@/components";
import { Calendar } from "lucide-react";

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
      <PageHeader title="My Lessons" />
      <div className={styles.content}>
        <div className={styles.filters}>
          <ButtonGroup
            options={[
              { value: "upcoming", label: "Upcoming" },
              { value: "past", label: "Past" },
              { value: "all", label: "All" },
            ]}
            value={activeFilter}
            onChange={(value) =>
              setActiveFilter(value as "upcoming" | "past" | "all")
            }
          />
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
          <EmptyState
            icon={<Calendar size={48} />}
            title={`No ${activeFilter} lessons available`}
            description="When you book lessons, they will appear here."
            actionText="Find Teachers"
            actionHref="/teachers"
          />
        )}
      </div>
    </>
  );
}
