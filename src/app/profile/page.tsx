"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useProfileContext } from "../../providers/ProfileProvider";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import { format } from "date-fns";
import {
  User,
  BarChart3,
  TrendingUp,
  BookOpen,
  FilePenLine,
} from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();
  const { profile, loadingProfile } = useProfileContext();

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

  if (loadingProfile) return <Loader />;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <Avatar avatarId={profile?.avatar} size={120} />
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
            <BookOpen width={18} height={18} />
            View My Lessons
          </button>
          <button
            className={styles.editButton}
            onClick={() => router.push("/profile/edit")}
          >
            <FilePenLine width={18} height={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <section className={`${styles.section} card`}>
            <h2 className={styles.sectionTitle}>
              Personal Information
              <User className={styles.sectionIcon} />
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
              <BarChart3 className={styles.sectionIcon} />
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
