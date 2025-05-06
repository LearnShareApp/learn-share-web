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
import { User, BarChart3, GraduationCap, Eye } from "lucide-react";

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
              <User className={profileStyles.sectionIcon} />
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
              <BarChart3 className={profileStyles.sectionIcon} />
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
              <GraduationCap className={profileStyles.sectionIcon} />
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
                    <Eye width={20} height={20} />
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
