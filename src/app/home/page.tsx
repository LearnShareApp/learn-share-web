"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import useProfile from "../../hooks/useProfile";
import { useAvatar } from "../../hooks/avatar-hook";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import { useEffect, useState } from "react";
import { apiService, TeacherProfile, Lesson } from "../../utilities/api";
import TeacherItem from "@/components/teacher-item/TeacherItem";
import LessonItem from "@/components/lesson-item/LessonItem";

export default function HomePage() {
  const { profile, loadingProfile } = useProfile();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar || null);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersData = await apiService.getTeachers(true);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchNextLesson = async () => {
      setLoadingLessons(true);
      try {
        const lessonsData = await apiService.getLessons();
        const upcomingLessons = lessonsData.filter(
          (lesson) => new Date(lesson.datetime) > new Date()
        );
        const sortedLessons = upcomingLessons.sort(
          (a, b) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );
        setNextLesson(sortedLessons[0] || null);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchNextLesson();
  }, []);

  if (loadingProfile || loadingAvatar) return <Loader />;

  return (
    <div className={styles.columns}>
      <div className={styles.leftColumn}>
        <section className="card">
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              <Avatar src={avatarSource} size={80} />
            </div>
            <div className={styles.details}>
              <h1 className={styles.userName}>
                {profile ? `${profile.name} ${profile.surname}` : "User Name"}
              </h1>
              <p className={styles.userRole}>Student</p>
            </div>
          </div>
        </section>
        <section className="card balance">
          <h2>Balance (inDev)</h2>
          <div className={styles.balanceWrapper}>
            <p>$1000 USD</p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="6"
                x2="12"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="6"
                y1="12"
                x2="18"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </section>
        <section className="card">
          <div className={styles.mobileAppBanner}>
            <div>
              <h3>Try the mobile version</h3>
              <Link href="/download" className={styles.downloadButton}>
                Download the App
              </Link>
            </div>
            <Image
              className={styles.appLogo}
              src="/app-logo.png"
              alt="Download the App"
              width={100}
              height={100}
            />
          </div>
        </section>
      </div>
      <div className={styles.rightColumn}>
        <section className="card">
          <h2 className={styles.sectionTitle}>Next Lesson</h2>
          {loadingLessons ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Loader />
            </div>
          ) : nextLesson ? (
            <LessonItem lesson={nextLesson} />
          ) : (
            <div className={styles.noLessonsMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>You don&apos;t have any upcoming lessons</p>
              <Link href="/teachers" className={styles.findTeacherButton}>
                Find a Teacher
              </Link>
            </div>
          )}
        </section>
        <section className="card">
          <h2 className={styles.sectionTitle}>Previous Teachers</h2>
          <div className={styles.teachersList}>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TeacherItem key={teacher.teacher_id} teacher={teacher} />
              ))
            ) : (
              <div className={styles.noLessonsMessage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p>You haven&apos;t had any lessons yet</p>
                <Link href="/teachers" className={styles.findTeacherButton}>
                  Find a Teacher
                </Link>
              </div>
            )}
          </div>
        </section>
        <Link href="/teachers">
          <section className={`card ${styles["search-teacher"]}`}>
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Find a New Teacher
            </h3>
          </section>
        </Link>
      </div>
    </div>
  );
}
