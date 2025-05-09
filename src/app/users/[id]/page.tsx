"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.scss";
import { useProfileContext } from "../../../providers/ProfileProvider";
import useUserProfile from "@/hooks/useUserProfile";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import { format } from "date-fns";
import Link from "next/link";
import {
  User,
  BarChart3,
  TrendingUp,
  BookOpen,
  FilePenLine,
  GraduationCap,
  Eye,
} from "lucide-react";

const UserProfileOrOwnPage = () => {
  const router = useRouter();
  const params = useParams();
  const routeUserId = params.id as string;
  const routeUserIdAsNumber = parseInt(routeUserId, 10);

  const { profile: ownProfile, loadingProfile: loadingOwnProfile } =
    useProfileContext();
  const {
    userProfile: otherUserProfile,
    loadingUserProfile: loadingOtherUserProfile,
    errorUserProfile: errorOtherUserProfile,
  } = useUserProfile({
    userId: routeUserId,
  });

  const isOwnProfile = ownProfile?.id === routeUserIdAsNumber;
  const profileToDisplay = isOwnProfile ? ownProfile : otherUserProfile;
  const loading = isOwnProfile ? loadingOwnProfile : loadingOtherUserProfile;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const memberSince = profileToDisplay?.registration_date
    ? formatDate(profileToDisplay.registration_date.toString())
    : "...";

  const birthdate = profileToDisplay?.birthdate
    ? formatDate(profileToDisplay.birthdate)
    : "Not specified";

  const totalLearningHours =
    isOwnProfile && ownProfile?.finished_lessons
      ? (ownProfile.finished_lessons * 1.5).toFixed(1)
      : "0";

  const completionRate =
    isOwnProfile &&
    ownProfile?.finished_lessons &&
    ownProfile.finished_lessons + (ownProfile.waiting_lessons || 0) > 0
      ? Math.round(
          (ownProfile.finished_lessons /
            (ownProfile.finished_lessons + (ownProfile.waiting_lessons || 0))) *
            100
        )
      : 0;

  const daysActive =
    isOwnProfile && ownProfile?.registration_date
      ? Math.floor(
          (new Date().getTime() -
            new Date(ownProfile.registration_date).getTime()) /
            (1000 * 3600 * 24)
        )
      : 0;

  const navigateToLessons = () => {
    router.push("/lessons");
  };

  const navigateToEditProfile = () => {
    if (ownProfile?.id) {
      router.push(`/settings`);
    }
  };

  if (loading) return <Loader />;

  if (!isOwnProfile && errorOtherUserProfile) {
    return (
      <div className={styles.errorContainer}>
        <h1>Ошибка загрузки профиля</h1>
        <p>{errorOtherUserProfile}</p>
        <Link href="/" className={styles.backLink}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  if (!profileToDisplay) {
    if (isOwnProfile && !ownProfile && !loadingOwnProfile) {
      return (
        <div className={styles.errorContainer}>
          <h1>Профиль не найден</h1>
          <p>Не удалось загрузить данные вашего профиля.</p>
          <Link href="/" className={styles.backLink}>
            Вернуться на главную
          </Link>
        </div>
      );
    }
    if (
      !isOwnProfile &&
      !otherUserProfile &&
      !loadingOtherUserProfile &&
      !errorOtherUserProfile
    ) {
      return (
        <div className={styles.errorContainer}>
          <h1>Профиль не найден</h1>
          <p>
            Не удалось загрузить данные профиля пользователя с ID: {routeUserId}
            .
          </p>
          <Link href="/" className={styles.backLink}>
            Вернуться на главную
          </Link>
        </div>
      );
    }
    return <Loader />;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <Avatar avatarId={profileToDisplay?.avatar} size={120} />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>
              {profileToDisplay
                ? `${profileToDisplay.name} ${profileToDisplay.surname}`
                : "User Name"}
              <span className={styles.userId}>
                ID: {profileToDisplay?.id || "..."}
              </span>
            </h1>
            <p className={styles.userRole}>
              {isOwnProfile
                ? "Student"
                : profileToDisplay?.is_teacher
                ? "Преподаватель и Студент"
                : "Студент"}
            </p>
            <p className={styles.userMeta}>
              {isOwnProfile ? "Member since" : "На платформе с"} {memberSince}
            </p>
          </div>
        </div>
        {isOwnProfile && (
          <div className={styles.actions}>
            <button
              className={styles.lessonsButton}
              onClick={navigateToLessons}
            >
              <BookOpen width={18} height={18} />
              View My Lessons
            </button>
            <button
              className={styles.editButton}
              onClick={navigateToEditProfile}
            >
              <FilePenLine width={18} height={18} />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          {isOwnProfile && (
            <section className={`${styles.section} card`}>
              <h2 className={styles.sectionTitle}>
                {isOwnProfile ? "Personal Information" : "Личная информация"}
                <User className={styles.sectionIcon} />
              </h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>
                    {profileToDisplay?.email || "Not specified"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Full Name</span>
                  <span className={styles.value}>
                    {profileToDisplay
                      ? `${profileToDisplay.name} ${profileToDisplay.surname}`
                      : "Not specified"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    {isOwnProfile ? "Date of Birth" : "Дата рождения"}
                  </span>
                  <span className={styles.value}>{birthdate}</span>
                </div>
              </div>
            </section>
          )}

          {!isOwnProfile && (
            <section className={`${styles.section} card`}>
              <h2 className={styles.sectionTitle}>
                Оценка пользователя
                <Eye className={styles.sectionIcon} />
              </h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <User className={styles.itemIcon} size={16} /> Дружелюбный
                  </span>
                  <span className={styles.value}>15 человек</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <BookOpen className={styles.itemIcon} size={16} />{" "}
                    Общительный
                  </span>
                  <span className={styles.value}>12 человек</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <Eye className={styles.itemIcon} size={16} /> Открытый
                  </span>
                  <span className={styles.value}>10 человек</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <GraduationCap className={styles.itemIcon} size={16} />{" "}
                    Полезный
                  </span>
                  <span className={styles.value}>8 человек</span>
                </div>
              </div>
            </section>
          )}

          <section className={`${styles.section} card`}>
            <h2 className={styles.sectionTitle}>
              {isOwnProfile ? "Learning Statistics" : "Статистика обучения"}
              <BarChart3 className={styles.sectionIcon} />
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {profileToDisplay?.finished_lessons || 0}
                </span>
                <span className={styles.statLabel}>
                  {isOwnProfile ? "Completed Lessons" : "Завершенных уроков"}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {profileToDisplay?.count_of_teachers || 0}
                </span>
                <span className={styles.statLabel}>
                  {isOwnProfile ? "Teachers" : "Преподавателей"}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {profileToDisplay?.waiting_lessons || 0}
                </span>
                <span className={styles.statLabel}>
                  {isOwnProfile ? "Upcoming Lessons" : "Предстоящих уроков"}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          {isOwnProfile && (
            <section className={`${styles.section} card`}>
              <h2 className={styles.sectionTitle}>
                Learning Progress
                <TrendingUp className={styles.sectionIcon} />
              </h2>
              <div className={styles.progressSection}>
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressTitle}>
                      Total Learning Hours
                    </span>
                    <span className={styles.progressValue}>
                      {totalLearningHours}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(
                          (ownProfile?.finished_lessons || 0) * 10,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressTitle}>
                      Lessons Completion Rate
                    </span>
                    <span className={styles.progressValue}>
                      {completionRate}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${completionRate}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressTitle}>Days as Member</span>
                    <span className={styles.progressValue}>{daysActive}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(daysActive / 2, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {!isOwnProfile && otherUserProfile && (
            <section className={`${styles.section} card`}>
              <h2 className={styles.sectionTitle}>
                Статус преподавателя
                <GraduationCap className={styles.sectionIcon} />
              </h2>
              <div className={styles.teacherStatusSection}>
                {otherUserProfile?.is_teacher ? (
                  <>
                    <p className={styles.teacherStatusText}>
                      Этот пользователь является преподавателем на платформе.
                    </p>
                    <Link
                      href={`/teachers/${otherUserProfile.id}`}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileOrOwnPage;
