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
import {
  CalendarPlus,
  ClipboardList,
  BarChartBig,
  Bell,
  Clock,
  Users,
  Star,
  Settings,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("upcoming");

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
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Панель управления преподавателя</h1>
          <div className={styles.headerActions}>
            <Link href="/for-teachers/settings" className={styles.iconButton}>
              <Settings size={20} />
            </Link>
            <Link
              href="/for-teachers/notifications"
              className={styles.iconButton}
            >
              <Bell size={20} />
              {newRequests.length > 0 && (
                <span className={styles.notificationBadge}>
                  {newRequests.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className={styles.statistics}>
          <div className={styles.statItem}>
            <Clock className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {teacher.finished_lessons}
              </span>
              <span className={styles.statLabel}>Проведено уроков</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Users className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {teacher.count_of_students}
              </span>
              <span className={styles.statLabel}>Студентов</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Star className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {teacher.common_rate.toFixed(1)}
              </span>
              <span className={styles.statLabel}>Рейтинг</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.quickActions}>
        <Link href="/for-teachers/add-time" className={styles.actionButton}>
          <CalendarPlus size={20} />
          <span>Добавить время</span>
        </Link>
        <Link href="/for-teachers/requests" className={styles.actionButton}>
          <ClipboardList size={20} />
          <span>Запросы на уроки</span>
          {newRequests.length > 0 && (
            <span className={styles.badge}>{newRequests.length}</span>
          )}
        </Link>
        <Link href="/for-teachers/statistics" className={styles.actionButton}>
          <BarChartBig size={20} />
          <span>Статистика</span>
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className={styles.dashboardLayout}>
          <div className={styles.mainColumn}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "upcoming" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Предстоящие уроки
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "past" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("past")}
              >
                Прошедшие уроки
              </button>
            </div>

            {activeTab === "upcoming" ? (
              <section className={styles.lessonsSection}>
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
                  <div className={styles.emptyState}>
                    <CalendarPlus size={48} />
                    <p>У вас пока нет запланированных уроков</p>
                    <Link
                      href="/for-teachers/add-time"
                      className={styles.primaryButton}
                    >
                      Добавить доступное время
                    </Link>
                  </div>
                )}
              </section>
            ) : (
              <section className={styles.lessonsSection}>
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
                  <div className={styles.emptyState}>
                    <Clock size={48} />
                    <p>У вас пока нет завершенных уроков</p>
                  </div>
                )}
              </section>
            )}
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.skillsSection}>
              <div className={styles.sectionHeader}>
                <h2>Ваши навыки</h2>
                <Link
                  href="/for-teachers/add-skill"
                  className={styles.addButton}
                >
                  <span>+</span>
                </Link>
              </div>
              <div className={styles.skillsList}>
                {teacher.skills.map((skill) => (
                  <div key={skill.skill_id} className={styles.skillCard}>
                    <div className={styles.skillHeader}>
                      <h3>{skill.category_name}</h3>
                      <div className={styles.skillRating}>
                        <span className={styles.ratingValue}>
                          {skill.rate.toFixed(1)}
                        </span>
                        <span className={styles.star}>★</span>
                      </div>
                    </div>
                    <p className={styles.skillDescription}>
                      {skill.about.length > 100
                        ? `${skill.about.substring(0, 100)}...`
                        : skill.about}
                    </p>
                    <div className={styles.skillActions}>
                      <Link
                        href={`/for-teachers/skills/${skill.skill_id}/edit`}
                        className={styles.editButton}
                      >
                        Редактировать
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingPage;
