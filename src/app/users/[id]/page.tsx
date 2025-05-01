"use client";

import React from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.scss";
import profileStyles from "../../profile/page.module.scss";
import useUserProfile from "@/hooks/useUserProfile";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import { format } from "date-fns";
import Link from "next/link";

// SVG иконки для разделов
const PersonIcon = () => (
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
    className={profileStyles.sectionIcon}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const StatsIcon = () => (
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
    className={profileStyles.sectionIcon}
  >
    <rect x="2" y="2" width="20" height="20" rx="2"></rect>
    <line x1="8" y1="8" x2="8" y2="16"></line>
    <line x1="12" y1="12" x2="12" y2="16"></line>
    <line x1="16" y1="6" x2="16" y2="16"></line>
  </svg>
);

const TeacherIcon = () => (
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
    className={profileStyles.sectionIcon}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ViewProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UserProfilePage = () => {
  const params = useParams();
  const userId = params.id as string;

  const { userProfile, loadingUserProfile, errorUserProfile } = useUserProfile({
    userId,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Не указано";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return "Неверная дата";
    }
  };

  const memberSince = userProfile?.registration_date
    ? formatDate(userProfile.registration_date.toString())
    : "...";

  const birthdate = userProfile?.birthdate
    ? formatDate(userProfile.birthdate)
    : "Не указано";

  if (loadingUserProfile) return <Loader />;

  if (errorUserProfile) {
    return (
      <div className={styles.errorContainer}>
        <h1>Ошибка загрузки профиля</h1>
        <p>{errorUserProfile}</p>
        <Link href="/" className={styles.backLink}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className={profileStyles.profileContainer}>
      <div className={profileStyles.profileHeader}>
        <div className={profileStyles.profileInfo}>
          <div className={profileStyles.avatarWrapper}>
            <Avatar avatarId={userProfile?.avatar} size={120} />
          </div>
          <div className={profileStyles.userInfo}>
            <h1 className={profileStyles.userName}>
              {userProfile
                ? `${userProfile.name} ${userProfile.surname}`
                : "Имя пользователя"}
              <span className={profileStyles.userId}>
                ID: {userProfile?.id || "..."}
              </span>
            </h1>
            <p className={profileStyles.userRole}>
              {userProfile?.is_teacher ? "Преподаватель и Студент" : "Студент"}
            </p>
            <p className={profileStyles.userMeta}>
              На платформе с {memberSince}
            </p>
          </div>
        </div>
      </div>

      <div className={profileStyles.content}>
        <div className={profileStyles.leftColumn}>
          <section className={`${profileStyles.section} card`}>
            <h2 className={profileStyles.sectionTitle}>
              Личная информация
              <PersonIcon />
            </h2>
            <div className={profileStyles.infoGrid}>
              <div className={profileStyles.infoItem}>
                <span className={profileStyles.label}>Email</span>
                <span className={profileStyles.value}>
                  {userProfile?.email || "Не указано"}
                </span>
              </div>
              <div className={profileStyles.infoItem}>
                <span className={profileStyles.label}>Полное имя</span>
                <span className={profileStyles.value}>
                  {userProfile
                    ? `${userProfile.name} ${userProfile.surname}`
                    : "Не указано"}
                </span>
              </div>
              <div className={profileStyles.infoItem}>
                <span className={profileStyles.label}>Дата рождения</span>
                <span className={profileStyles.value}>{birthdate}</span>
              </div>
            </div>
          </section>

          <section className={`${profileStyles.section} card`}>
            <h2 className={profileStyles.sectionTitle}>
              Статистика обучения
              <StatsIcon />
            </h2>
            <div className={profileStyles.statsGrid}>
              <div className={profileStyles.statCard}>
                <span className={profileStyles.statValue}>
                  {userProfile?.finished_lessons || 0}
                </span>
                <span className={profileStyles.statLabel}>
                  Завершенных уроков
                </span>
              </div>
              <div className={profileStyles.statCard}>
                <span className={profileStyles.statValue}>
                  {userProfile?.count_of_teachers || 0}
                </span>
                <span className={profileStyles.statLabel}>Преподавателей</span>
              </div>
              <div className={profileStyles.statCard}>
                <span className={profileStyles.statValue}>
                  {userProfile?.waiting_lessons || 0}
                </span>
                <span className={profileStyles.statLabel}>
                  Предстоящих уроков
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className={profileStyles.rightColumn}>
          <section className={`${profileStyles.section} card`}>
            <h2 className={profileStyles.sectionTitle}>
              Статус преподавателя
              <TeacherIcon />
            </h2>
            <div className={styles.teacherStatusSection}>
              {userProfile?.is_teacher ? (
                <>
                  <p className={styles.teacherStatusText}>
                    Этот пользователь является преподавателем на платформе.
                  </p>
                  <Link
                    href={`/teachers/${userProfile.id}`}
                    className={styles.teacherButton}
                  >
                    <ViewProfileIcon />
                    <span>Посмотреть профиль преподавателя</span>
                  </Link>
                </>
              ) : (
                <p className={styles.teacherStatusText}>
                  Этот пользователь не является преподавателем на платформе.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
