"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import Loader from "@/components/loader/Loader";

interface LessonRequest {
  request_id: number;
  student_name: string;
  student_surname: string;
  student_avatar: string;
  category_name: string;
  datetime: string;
  status: "pending" | "approved" | "rejected";
}

export default function LessonRequestsPage() {
  const [requests, setRequests] = useState<LessonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  // Loading lesson requests (mock data, as API is not implemented yet)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // TODO: Replace with real API call when available
        // const response = await apiService.getLessonRequests();

        // Mocking data
        const mockData: LessonRequest[] = [
          {
            request_id: 1,
            student_name: "John",
            student_surname: "Smith",
            student_avatar: "",
            category_name: "Programming",
            datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: "pending",
          },
          {
            request_id: 2,
            student_name: "Mary",
            student_surname: "Johnson",
            student_avatar: "",
            category_name: "English",
            datetime: new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "pending",
          },
          {
            request_id: 3,
            student_name: "Alex",
            student_surname: "Williams",
            student_avatar: "",
            category_name: "Mathematics",
            datetime: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "approved",
          },
        ];

        setTimeout(() => {
          setRequests(mockData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error loading requests:", err);
        setError("Failed to load lesson requests");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on active tab
  const filteredRequests =
    activeTab === "pending"
      ? requests.filter((req) => req.status === "pending")
      : requests;

  // Handle request approval
  const handleApprove = async (requestId: number) => {
    try {
      // TODO: Replace with real API call
      // await apiService.approveLesson(requestId);

      // Mock successful update
      setRequests(
        requests.map((req) =>
          req.request_id === requestId
            ? { ...req, status: "approved" as const }
            : req
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    }
  };

  // Handle request rejection
  const handleReject = async (requestId: number) => {
    try {
      // TODO: Replace with real API call
      // await apiService.rejectLesson(requestId);

      // Mock successful update
      setRequests(
        requests.map((req) =>
          req.request_id === requestId
            ? { ...req, status: "rejected" as const }
            : req
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
            Pending ({requests.filter((req) => req.status === "pending").length}
            )
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "all" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Requests ({requests.length})
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : filteredRequests.length === 0 ? (
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
                : "You don't have any lesson requests from students yet."}
            </p>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {filteredRequests.map((request) => (
              <div key={request.request_id} className={styles.requestCard}>
                <div className={styles.requestInfo}>
                  <h3 className={styles.studentName}>
                    {request.student_name} {request.student_surname}
                  </h3>
                  <p className={styles.categoryName}>{request.category_name}</p>
                  <p className={styles.dateTime}>
                    {formatDateTime(request.datetime)}
                  </p>
                  <div
                    className={styles.statusBadge}
                    data-status={request.status}
                  >
                    {request.status === "pending" && "Pending Confirmation"}
                    {request.status === "approved" && "Confirmed"}
                    {request.status === "rejected" && "Rejected"}
                  </div>
                </div>

                {request.status === "pending" && (
                  <div className={styles.requestActions}>
                    <button
                      className={styles.approveButton}
                      onClick={() => handleApprove(request.request_id)}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleReject(request.request_id)}
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
