"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import Loader from "@/components/loader/Loader";
import { apiService, TeacherLesson } from "@/utilities/api";
import { useTeacher } from "@/hooks/useTeacher";

export default function LessonRequestsPage() {
  const { teacher } = useTeacher();
  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "cancelled">(
    "pending"
  );

  useEffect(() => {
    const fetchLessons = async () => {
      if (!teacher) return;

      try {
        setLoading(true);
        const response = await apiService.getTeacherLessons();
        // Filter lessons by status
        setLessons(response);
        setError(null);
      } catch (err) {
        console.error("Error loading lessons:", err);
        setError("Failed to load lesson requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [teacher]);

  // Filter lessons based on active tab
  const filteredLessons = lessons.filter((lesson) => {
    if (activeTab === "pending") return lesson.status === "verification";
    if (activeTab === "cancelled") return lesson.status === "cancelled";
    return true; // "all" tab
  });

  // Handle request approval
  const handleApprove = async (lessonId: number) => {
    try {
      await apiService.lessonApprove(lessonId);
      // Update lessons list after approval
      setLessons(
        lessons.map((lesson) =>
          lesson.lesson_id === lessonId
            ? { ...lesson, status: "approved" }
            : lesson
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    }
  };

  // Handle request rejection
  const handleReject = async (lessonId: number) => {
    try {
      await apiService.lessonCancel(lessonId);
      // Update lessons list after rejection
      setLessons(
        lessons.map((lesson) =>
          lesson.lesson_id === lessonId
            ? { ...lesson, status: "cancelled" }
            : lesson
        )
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Count lessons by status
  const pendingCount = lessons.filter(
    (lesson) => lesson.status === "verification"
  ).length;
  const cancelledCount = lessons.filter(
    (lesson) => lesson.status === "cancelled"
  ).length;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lesson Requests</h1>
        <Link href="/for-teachers" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "pending" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "cancelled" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({cancelledCount})
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "all" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Requests ({lessons.length})
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12H16L14 15H10L8 12H2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>No Lesson Requests</h3>
            <p>
              {activeTab === "pending"
                ? "You don't have any pending lesson requests."
                : activeTab === "cancelled"
                ? "You don't have any cancelled lesson requests."
                : "You don't have any lesson requests yet."}
            </p>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {filteredLessons.map((lesson) => (
              <div key={lesson.lesson_id} className={styles.requestCard}>
                <div className={styles.requestInfo}>
                  <h3 className={styles.studentName}>
                    {lesson.student_name} {lesson.student_surname}
                  </h3>
                  <p className={styles.categoryName}>{lesson.category_name}</p>
                  <p className={styles.dateTime}>
                    {formatDateTime(lesson.datetime.toString())}
                  </p>
                  <div
                    className={styles.statusBadge}
                    data-status={
                      lesson.status === "verification"
                        ? "pending"
                        : lesson.status
                    }
                  >
                    {lesson.status === "verification" && "Pending Confirmation"}
                    {lesson.status === "cancelled" && "Cancelled"}
                    {lesson.status === "approved" && "Approved"}
                    {!["verification", "cancelled", "approved"].includes(
                      lesson.status
                    ) && lesson.status}
                  </div>
                </div>

                {lesson.status === "verification" && (
                  <div className={styles.requestActions}>
                    <button
                      className={styles.approveButton}
                      onClick={() => handleApprove(lesson.lesson_id)}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleReject(lesson.lesson_id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
