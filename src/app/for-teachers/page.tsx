"use client";

import React, { useEffect, useState } from "react";
import { useTeacher } from "../../hooks/useTeacher";
import { apiService } from "../../utilities/api";
import { TeacherLesson } from "../../types/types";
import LessonItem from "@/features/lesson-item/LessonItem";
import styles from "./page.module.scss";
import Link from "next/link";
import Loader from "@/components/loader/Loader";
import { useProfileContext } from "@/providers/ProfileProvider";
import { CalendarPlus, ClipboardList, BarChartBig } from "lucide-react";

const TeachingPage = () => {
  const { profile, loadingProfile } = useProfileContext();

  const { teacher, loadingTeacher } = useTeacher({
    skipProfileCheck: true,
  });

  const [pastLessons, setPastLessons] = useState<TeacherLesson[]>([]);
  const [upcomingLessons, setUpcomingLessons] = useState<TeacherLesson[]>([]);
  const [newRequests, setNewRequests] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.is_teacher && teacher && !loadingTeacher) {
      const fetchLessons = async () => {
        try {
          setLoading(true);
          const response = await apiService.getTeacherLessons();
          const sortedLessons = response.sort((a, b) => {
            const dateA = new Date(a.datetime);
            const dateB = new Date(b.datetime);
            return dateB.getTime() - dateA.getTime();
          });

          setPastLessons(
            sortedLessons.filter((lesson) => lesson.status === "finished")
          );
          setUpcomingLessons(
            sortedLessons.filter(
              (lesson) =>
                lesson.status !== "finished" && lesson.status !== "cancelled"
            )
          );
          setNewRequests(
            sortedLessons.filter((lesson) => lesson.status === "waiting")
          );
          setError(null);
        } catch (err) {
          console.error("Error loading lessons:", err);
          setError("Failed to load lesson data");
        } finally {
          setLoading(false);
        }
      };

      fetchLessons();
    }
  }, [teacher, profile, loadingTeacher]);

  if (loadingProfile || (profile?.is_teacher && loadingTeacher))
    return <Loader />;

  if (!teacher || !profile?.is_teacher || error)
    return (
      <div className={styles.becomeTeacherCard}>
        <h1 className={styles.title}>Become a Teacher</h1>
        <p className={styles.description}>
          Share your knowledge and skills, teach others, and earn money.
        </p>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Create a Demonstration</h3>
              <p>
                Record a video demonstrating your skill and upload it to
                YouTube.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Submit an Application</h3>
              <p>
                Fill out an application form to add your skill to the platform.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Wait for Approval</h3>
              <p>
                Our moderators will check your skill and approve your
                application.
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/for-teachers/add-skill"
          className={styles.becomeTeacherButton}
        >
          Become a Teacher
        </Link>
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      <header className={styles.teacherHeader}>
        <h1 className={styles.title}>Teacher Dashboard</h1>
        <div className={styles.statistics}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{teacher.finished_lessons}</span>
            <span className={styles.statLabel}>Lessons Completed</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {teacher.count_of_students}
            </span>
            <span className={styles.statLabel}>Students</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {teacher.common_rate.toFixed(1)}
            </span>
            <span className={styles.statLabel}>Rating</span>
          </div>
        </div>
      </header>

      <div className={styles.buttonContainer}>
        <Link href="/for-teachers/add-time" className={styles.button}>
          <span className={styles.buttonIcon}>
            <CalendarPlus width={20} height={20} />
          </span>
          Add Time
        </Link>
        <Link href="/for-teachers/requests" className={styles.button}>
          <span className={styles.buttonIcon}>
            <ClipboardList width={20} height={20} />
          </span>
          Lesson Requests
          {newRequests.length > 0 && (
            <span className={styles.newRequestsBadge}>
              {newRequests.length}
            </span>
          )}
        </Link>
        <Link href="/for-teachers/statistics" className={styles.button}>
          <span className={styles.buttonIcon}>
            <BarChartBig width={20} height={20} />
          </span>
          Statistics
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className={styles.dashboardLayout}>
          {/* Основной контент (левая колонка с соотношением 2:1) */}
          <div className={styles.mainColumn}>
            <section className={styles.lessonsSection}>
              <h2>Upcoming Lessons</h2>
              {upcomingLessons.length > 0 ? (
                <div className={styles.lessonsList}>
                  {upcomingLessons.map((lesson) => (
                    <LessonItem
                      key={lesson.lesson_id}
                      lesson={lesson}
                      isTeacher={true}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyListMessage}>
                  You don`&apos;`t have any scheduled lessons yet.
                  <Link href="/for-teachers/add-time">
                    {" "}
                    Add available time
                  </Link>{" "}
                  so students can book lessons with you.
                </p>
              )}
            </section>

            <section className={styles.lessonsSection}>
              <h2>Past Lessons</h2>
              {pastLessons.length > 0 ? (
                <div className={styles.lessonsList}>
                  {pastLessons.map((lesson) => (
                    <LessonItem
                      key={lesson.lesson_id}
                      lesson={lesson}
                      isTeacher={true}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyListMessage}>
                  You don`&apos;`t have any completed lessons yet
                </p>
              )}
            </section>
          </div>

          {/* Боковая панель (правая колонка с соотношением 1:2) */}
          <div className={styles.sideColumn}>
            <div className={styles.skillsSection}>
              <h2>Your Skills</h2>
              <div className={styles.skillsList}>
                {teacher.skills.map((skill) => (
                  <div key={skill.skill_id} className={styles.skillCard}>
                    <h3>{skill.category_name}</h3>
                    <p>
                      {skill.about.length > 100
                        ? `${skill.about.substring(0, 100)}...`
                        : skill.about}
                    </p>
                    <div className={styles.skillRating}>
                      <span className={styles.ratingValue}>
                        {skill.rate.toFixed(1)}
                      </span>
                      <span className={styles.star}>★</span>
                    </div>
                  </div>
                ))}
                <Link
                  href="/for-teachers/add-skill"
                  className={styles.addSkillCard}
                >
                  <div className={styles.addIcon}>+</div>
                  <p>Add New Skill</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingPage;
