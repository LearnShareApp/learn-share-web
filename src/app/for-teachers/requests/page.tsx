"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import Loader from "@/components/loader/Loader";
import { apiService } from "@/utilities/api";
import { TeacherLesson } from "../../../types/types";
import { useTeacher } from "@/hooks/useTeacher";
import { Archive } from "lucide-react";

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
        setLessons(response || []);
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
              <Archive width={48} height={48} />
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
