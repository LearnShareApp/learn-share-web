"use client";

import Image from "next/image";
// import Link from "next/link";
import styles from "./page.module.scss";
import { useProfileContext } from "../../providers/ProfileProvider";
import {
  Card,
  Loader,
  Avatar,
  EmptyState,
  SectionTitle,
  Button,
} from "@/components";
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
        <Card>
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
        </Card>
        <Card className="balance">
          <SectionTitle level={3}>Balance (inDev)</SectionTitle>
          <div className={styles.balanceWrapper}>
            <p>$1000 USD</p>
            <PlusCircle size={16} />
          </div>
        </Card>
        <Card>
          <div className={styles.mobileAppBanner}>
            <div>
              <SectionTitle level={4}>Try the mobile version</SectionTitle>
              <Button variant="primary" href="/download">
                Download the App
              </Button>
            </div>
            <Image
              className={styles.appLogo}
              src="/app-logo.png"
              alt="Download the App"
              width={100}
              height={100}
            />
          </div>
        </Card>
      </div>
      <div className={styles.rightColumn}>
        <Card>
          <SectionTitle level={3}>Next Lesson</SectionTitle>
          {loadingLessons ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Loader />
            </div>
          ) : nextLesson ? (
            <LessonItem lesson={nextLesson} />
          ) : (
            <EmptyState
              icon={<Info size={48} />}
              title="No upcoming lessons yet"
              description="When you book lessons, they will appear here."
              actionText="Find Teachers"
              actionHref="/teachers"
            />
          )}
        </Card>
        <Card>
          <SectionTitle level={3}>Previous Teachers</SectionTitle>
          <div className={styles.teachersList}>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TeacherItem key={teacher.teacher_id} teacher={teacher} />
              ))
            ) : (
              <EmptyState
                icon={<Users size={48} />}
                title="No previous teachers yet"
                description="After your first lesson, your teachers will appear here."
                actionText="Find Teachers"
                actionHref="/teachers"
              />
            )}
          </div>
        </Card>
        <Card
          className={styles["search-teacher"]}
          onClick={() => (window.location.href = "/teachers")}
        >
          <SectionTitle level={4}>
            <Search size={20} className={styles.searchIcon} />
            Find a New Teacher
          </SectionTitle>
        </Card>
      </div>
    </div>
  );
}
