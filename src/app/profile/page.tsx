"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useProfileContext } from "../../providers/ProfileProvider";
import { useAvatar } from "../../hooks/avatar-hook";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import { format } from "date-fns";

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
    className={styles.sectionIcon}
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
    className={styles.sectionIcon}
  >
    <rect x="2" y="2" width="20" height="20" rx="2"></rect>
    <line x1="8" y1="8" x2="8" y2="16"></line>
    <line x1="12" y1="12" x2="12" y2="16"></line>
    <line x1="16" y1="6" x2="16" y2="16"></line>
  </svg>
);

const ProgressIcon = () => (
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
    className={styles.sectionIcon}
  >
    <line x1="2" y1="12" x2="7" y2="12"></line>
    <polyline points="7 5 14 12 7 19"></polyline>
    <line x1="14" y1="12" x2="22" y2="12"></line>
  </svg>
);

// Иконки для кнопок
const LessonsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
    <circle cx="10" cy="8" r="2"></circle>
    <path d="M20 11.08V8a2 2 0 0 0-2-2h-2"></path>
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
    <path d="m15 5 4 4"></path>
  </svg>
);

const ProfilePage = () => {
  const router = useRouter();
  const { profile, loadingProfile } = useProfileContext();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar || null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const memberSince = profile?.registration_date
    ? formatDate(profile.registration_date.toString())
    : "...";

  const birthdate = profile?.birthdate
    ? formatDate(profile.birthdate)
    : "Not specified";

  const totalLearningHours = profile?.finished_lessons
    ? (profile.finished_lessons * 1.5).toFixed(1)
    : "0";

  const completionRate =
    profile?.finished_lessons &&
    profile.finished_lessons + profile.waiting_lessons > 0
      ? Math.round(
          (profile.finished_lessons /
            (profile.finished_lessons + profile.waiting_lessons)) *
            100
        )
      : 0;

  const daysActive = profile?.registration_date
    ? Math.floor(
        (new Date().getTime() - new Date(profile.registration_date).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  const navigateToLessons = () => {
    router.push("/lessons");
  };

  if (loadingProfile || loadingAvatar) return <Loader />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <Avatar src={avatarSource} size={120} />
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>
              {profile ? `${profile.name} ${profile.surname}` : "User Name"}
              <span className={styles.userId}>ID: {profile?.id || "..."}</span>
            </h1>
            <p className={styles.userRole}>Student</p>
            <p className={styles.userMeta}>Member since {memberSince}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.lessonsButton} onClick={navigateToLessons}>
            <LessonsIcon />
            View My Lessons
          </button>
          <button
            className={styles.editButton}
            onClick={() => router.push("/profile/edit")}
          >
            <EditIcon />
            Edit Profile
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <section className={`${styles.section} card`}>
            <h2 className={styles.sectionTitle}>
              Personal Information
              <PersonIcon />
            </h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>
                  {profile?.email || "Not specified"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Full Name</span>
                <span className={styles.value}>
                  {profile
                    ? `${profile.name} ${profile.surname}`
                    : "Not specified"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Date of Birth</span>
                <span className={styles.value}>{birthdate}</span>
              </div>
            </div>
          </section>

          <section className={`${styles.section} card`}>
            <h2 className={styles.sectionTitle}>
              Learning Statistics
              <StatsIcon />
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {profile?.finished_lessons || 0}
                </span>
                <span className={styles.statLabel}>Completed Lessons</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {profile?.count_of_teachers || 0}
                </span>
                <span className={styles.statLabel}>Teachers</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {profile?.waiting_lessons || 0}
                </span>
                <span className={styles.statLabel}>Upcoming Lessons</span>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <section className={`${styles.section} card`}>
            <h2 className={styles.sectionTitle}>
              Learning Progress
              <ProgressIcon />
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
                        (profile?.finished_lessons || 0) * 10,
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
