"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import { useProfileContext } from "../../providers/ProfileProvider";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import { useEffect, useState } from "react";
import { apiService } from "../../utilities/api";
import { TeacherProfile, Lesson } from "../../types/types";
import TeacherItem from "@/features/teacher-item/TeacherItem";
import LessonItem from "@/features/lesson-item/LessonItem";
import { PlusCircle, Info, Users, Search } from "lucide-react";

export default function HomePage() {
  const { profile, loadingProfile } = useProfileContext();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersData = await apiService.getTeachers({ is_mine: true });
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

  if (loadingProfile) return <Loader />;

  return (
    <div className={styles.columns}>
      <div className={styles.leftColumn}>
        <section className="card">
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              <Avatar avatarId={profile?.avatar} size={80} />
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
            <PlusCircle size={16} />
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
              <Info size={24} />
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
                <Users size={24} />
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
              <Search size={20} className={styles.searchIcon} />
              Find a New Teacher
            </h3>
          </section>
        </Link>
      </div>
    </div>
  );
}
