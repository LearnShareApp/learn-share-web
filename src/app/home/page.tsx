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

  useEffect(() => {
    const fetchTeachers = async () => {
      const teachersData = await apiService.getTeachers(true);
      setTeachers(teachersData);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchNextLesson = async () => {
      const lessonsData = await apiService.getLessons();
      const upcomingLessons = lessonsData.filter(
        (lesson) => new Date(lesson.datetime) > new Date()
      );
      const sortedLessons = upcomingLessons.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
      setNextLesson(sortedLessons[0] || null);
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
          {nextLesson ? (
            <LessonItem lesson={nextLesson} />
          ) : (
            <p>No upcoming lessons</p>
          )}
        </section>
        <section className="card">
          <h2 className={styles.sectionTitle}>Previous Teachers</h2>
          <div className={styles.teachersList}>
            {teachers.map((teacher) => (
              <TeacherItem key={teacher.teacher_id} teacher={teacher} />
            ))}
          </div>
        </section>
        <Link href="/teachers">
          <section className="card search-teacher">
            <h3 style={{ textAlign: "center" }}>Find a New Teacher</h3>
          </section>
        </Link>
      </div>
    </div>
  );
}
