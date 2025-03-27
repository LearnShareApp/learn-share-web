"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import Badge from "@/components/badge/Badge";
import Link from "next/link";

interface TeacherApplication {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string | null;
  skill: {
    category_id: number;
    category_name: string;
    about: string;
    video_card_link: string;
  };
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

interface Complaint {
  id: number;
  reporter_id: number;
  reporter_name: string;
  reporter_surname: string;
  reporter_email: string;
  reported_id: number;
  reported_name: string;
  reported_surname: string;
  reported_email: string;
  reported_type: "teacher" | "student";
  reason: string;
  description: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "applications" | "complaints"
  >("applications");
  const [applicationTab, setApplicationTab] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");
  const [complaintTab, setComplaintTab] = useState<
    "pending" | "resolved" | "rejected"
  >("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(
    null
  );

  // Get the selected application
  const selectedApplication = applications.find(
    (app) => app.id === selectedApplicationId
  );

  // Get the selected complaint
  const selectedComplaint = complaints.find(
    (complaint) => complaint.id === selectedComplaintId
  );

  // Function to navigate to the next application
  const goToNextApplication = () => {
    if (!selectedApplicationId || applications.length === 0) return;

    const filteredApps = applications.filter((app) => {
      if (applicationTab === "pending") return app.status === "pending";
      if (applicationTab === "approved") return app.status === "approved";
      if (applicationTab === "rejected") return app.status === "rejected";
      return true; // For "all" tab
    });

    const filteredIndex = filteredApps.findIndex(
      (app) => app.id === selectedApplicationId
    );

    if (filteredIndex < filteredApps.length - 1) {
      setSelectedApplicationId(filteredApps[filteredIndex + 1].id);
    } else if (filteredApps.length > 0) {
      setSelectedApplicationId(filteredApps[0].id);
    } else {
      setSelectedApplicationId(null);
    }
  };

  // Function to navigate to the next complaint
  const goToNextComplaint = () => {
    if (!selectedComplaintId || complaints.length === 0) return;

    const filteredComplaints = complaints.filter((complaint) => {
      if (complaintTab === "pending") return complaint.status === "pending";
      return true;
    });

    const filteredIndex = filteredComplaints.findIndex(
      (complaint) => complaint.id === selectedComplaintId
    );

    if (filteredIndex < filteredComplaints.length - 1) {
      setSelectedComplaintId(filteredComplaints[filteredIndex + 1].id);
    } else if (filteredComplaints.length > 0) {
      setSelectedComplaintId(filteredComplaints[0].id);
    } else {
      setSelectedComplaintId(null);
    }
  };

  // This function will be called in useEffect
  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API calls
      // const [applicationsResponse, complaintsResponse] = await Promise.all([
      //   apiService.getTeacherApplications(),
      //   apiService.getComplaints()
      // ]);

      // Temporary test data
      const mockApplications: TeacherApplication[] = [
        {
          id: 1,
          user_id: 101,
          name: "Ivan",
          surname: "Petrov",
          email: "ivan@example.com",
          avatar: null,
          skill: {
            category_id: 1,
            category_name: "Programming",
            about: "Experienced developer with 5 years in React and JavaScript",
            video_card_link: "dQw4w9WgXcQ",
          },
          created_at: "2023-10-15T14:30:00Z",
          status: "pending",
        },
        {
          id: 2,
          user_id: 102,
          name: "Anna",
          surname: "Smirnova",
          email: "anna@example.com",
          avatar: null,
          skill: {
            category_id: 2,
            category_name: "English Language",
            about: "Certified English teacher with over 3 years of experience",
            video_card_link: "dQw4w9WgXcQ",
          },
          created_at: "2023-10-16T09:45:00Z",
          status: "pending",
        },
      ];

      const mockComplaints: Complaint[] = [
        {
          id: 1,
          reporter_id: 201,
          reporter_name: "Alexey",
          reporter_surname: "Ivanov",
          reporter_email: "alex@example.com",
          reported_id: 101,
          reported_name: "Ivan",
          reported_surname: "Petrov",
          reported_email: "ivan@example.com",
          reported_type: "teacher",
          reason: "Inappropriate behavior",
          description:
            "The teacher was rude when answering questions and didn't fulfill their obligations",
          status: "pending",
          created_at: "2024-03-27T10:30:00Z",
        },
        {
          id: 2,
          reporter_id: 202,
          reporter_name: "Maria",
          reporter_surname: "Sidorova",
          reporter_email: "maria@example.com",
          reported_id: 301,
          reported_name: "Peter",
          reported_surname: "Smirnov",
          reported_email: "petr@example.com",
          reported_type: "student",
          reason: "Spam",
          description: "The student is sending unwanted messages",
          status: "pending",
          created_at: "2024-03-27T11:15:00Z",
        },
      ];

      setApplications(mockApplications);
      setComplaints(mockComplaints);

      // Set the first item as selected when loading
      if (mockApplications.length > 0) {
        setSelectedApplicationId(mockApplications[0].id);
      }
      if (mockComplaints.length > 0) {
        setSelectedComplaintId(mockComplaints[0].id);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set the first element in the filtered list as selected when changing the filter
  useEffect(() => {
    if (complaintTab === "pending") {
      const filteredComplaints = complaints.filter(
        (complaint) => complaint.status === "pending"
      );

      if (filteredComplaints.length > 0) {
        const currentIsInFiltered = filteredComplaints.some(
          (complaint) => complaint.id === selectedComplaintId
        );

        if (!currentIsInFiltered) {
          setSelectedComplaintId(filteredComplaints[0].id);
        }
      } else {
        setSelectedComplaintId(null);
      }
    } else {
      const filteredApps = applications.filter((app) => {
        if (applicationTab === "pending") return app.status === "pending";
        if (applicationTab === "approved") return app.status === "approved";
        if (applicationTab === "rejected") return app.status === "rejected";
        return true; // For "all" tab
      });

      if (filteredApps.length > 0) {
        const currentIsInFiltered = filteredApps.some(
          (app) => app.id === selectedApplicationId
        );

        if (!currentIsInFiltered) {
          setSelectedApplicationId(filteredApps[0].id);
        }
      } else {
        setSelectedApplicationId(null);
      }
    }
  }, [
    applicationTab,
    complaintTab,
    applications,
    complaints,
    selectedApplicationId,
    selectedComplaintId,
  ]);

  // Apply complaint and application filtering based on tabs
  const filteredApplications = applications.filter((app) => {
    if (applicationTab === "pending") return app.status === "pending";
    if (applicationTab === "approved") return app.status === "approved";
    if (applicationTab === "rejected") return app.status === "rejected";
    return true; // For "all" tab
  });

  const filteredComplaints = complaints.filter((complaint) => {
    if (complaintTab === "pending") return complaint.status === "pending";
    if (complaintTab === "resolved") return complaint.status === "resolved";
    if (complaintTab === "rejected") return complaint.status === "rejected";
    return true;
  });

  // Handling the approval of a teacher application
  const handleApprove = async (applicationId: number) => {
    try {
      setProcessingId(applicationId);
      // TODO: Replace with a real API call
      // await apiService.approveTeacherApplication(applicationId);

      // Update state locally
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: "approved" } : app
        )
      );

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Move to the next application
      goToNextApplication();
    } catch (err) {
      console.error("Error approving application:", err);
      setError("Failed to approve application");
    } finally {
      setProcessingId(null);
    }
  };

  // Handling the rejection of a teacher application
  const handleReject = async (applicationId: number) => {
    try {
      setProcessingId(applicationId);
      // TODO: Replace with a real API call
      // await apiService.rejectTeacherApplication(applicationId);

      // Update state locally
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: "rejected" } : app
        )
      );

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Move to the next application
      goToNextApplication();
    } catch (err) {
      console.error("Error rejecting application:", err);
      setError("Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  // Handling skipping an application
  const handleSkip = () => {
    goToNextApplication();
  };

  // Handling skipping a complaint
  const handleSkipComplaint = () => {
    goToNextComplaint();
  };

  // Handling rejecting a complaint
  const handleRejectComplaint = async (complaintId: number) => {
    try {
      setProcessingId(complaintId);
      // TODO: Replace with a real API call
      // await apiService.rejectComplaint(complaintId);

      // Update state locally
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: "rejected" }
            : complaint
        )
      );

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Move to the next complaint
      goToNextComplaint();
    } catch (err) {
      console.error("Error rejecting complaint:", err);
      setError("Failed to reject complaint");
    } finally {
      setProcessingId(null);
    }
  };

  // Handling blocking a user
  const handleBlockUser = async (userId: number) => {
    try {
      setProcessingId(userId);
      // TODO: Replace with a real API call
      // await apiService.blockUser(userId);

      console.log(`User ${userId} blocked`);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Move to the next complaint
      goToNextComplaint();
    } catch (err) {
      console.error("Error blocking user:", err);
      setError("Failed to block user");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPageContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.adminLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.sectionSelector}>
            <button
              className={`${styles.sectionButton} ${
                activeSection === "applications" ? styles.activeSection : ""
              }`}
              onClick={() => {
                setActiveSection("applications");
                setSelectedComplaintId(null);
              }}
            >
              Teacher Applications
            </button>
            <button
              className={`${styles.sectionButton} ${
                activeSection === "complaints" ? styles.activeSection : ""
              }`}
              onClick={() => {
                setActiveSection("complaints");
                setSelectedApplicationId(null);
              }}
            >
              User Complaints
            </button>
          </div>

          {activeSection === "complaints" ? (
            <>
              <div className={styles.tabsContainer}>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "pending" ? styles.activeTab : ""
                  }`}
                  onClick={() => setComplaintTab("pending")}
                >
                  Pending
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "resolved" ? styles.activeTab : ""
                  }`}
                  onClick={() => setComplaintTab("resolved")}
                >
                  Resolved
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "rejected" ? styles.activeTab : ""
                  }`}
                  onClick={() => setComplaintTab("rejected")}
                >
                  Rejected
                </button>
              </div>

              <div className={styles.applicationsList}>
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className={`${styles.applicationListItem} ${
                      complaint.id === selectedComplaintId
                        ? styles.activeApplication
                        : ""
                    }`}
                    onClick={() => setSelectedComplaintId(complaint.id)}
                  >
                    <div className={styles.applicationListItemAvatar}>
                      <Avatar src={null} size={40} />
                    </div>
                    <div className={styles.applicationListItemInfo}>
                      <div className={styles.applicationListItemName}>
                        {complaint.reporter_name} {complaint.reporter_surname}
                      </div>
                      <div className={styles.applicationListItemSkill}>
                        Complaint about{" "}
                        {complaint.reported_type === "teacher"
                          ? "teacher"
                          : "student"}
                      </div>
                    </div>
                    <div
                      className={styles.statusBadgeSmall}
                      data-status={complaint.status}
                    >
                      {complaint.status === "pending" && "Pending"}
                      {complaint.status === "resolved" && "Resolved"}
                      {complaint.status === "rejected" && "Rejected"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.tabsContainer}>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "pending" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("pending")}
                >
                  Pending
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "approved" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("approved")}
                >
                  Approved
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "rejected" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("rejected")}
                >
                  Rejected
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("all")}
                >
                  All
                </button>
              </div>

              <div className={styles.applicationsList}>
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className={`${styles.applicationListItem} ${
                      application.id === selectedApplicationId
                        ? styles.activeApplication
                        : ""
                    }`}
                    onClick={() => setSelectedApplicationId(application.id)}
                  >
                    <div className={styles.applicationListItemAvatar}>
                      <Avatar src={application.avatar} size={40} />
                    </div>
                    <div className={styles.applicationListItemInfo}>
                      <div className={styles.applicationListItemName}>
                        {application.name} {application.surname}
                      </div>
                      <div className={styles.applicationListItemSkill}>
                        {application.skill.category_name}
                      </div>
                    </div>
                    <div
                      className={styles.statusBadgeSmall}
                      data-status={application.status}
                    >
                      {application.status === "pending" && "Pending"}
                      {application.status === "approved" && "Approved"}
                      {application.status === "rejected" && "Rejected"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.rightColumn}>
          {activeSection === "complaints" ? (
            selectedComplaint ? (
              <div className={styles.applicationDetails}>
                <div className={styles.applicationHeader}>
                  <div className={styles.applicationAvatar}>
                    <Avatar src={null} size={48} />
                  </div>
                  <div className={styles.applicationInfo}>
                    <div className={styles.applicationName}>
                      {selectedComplaint.reporter_name}{" "}
                      {selectedComplaint.reporter_surname}
                    </div>
                    <div className={styles.applicationEmail}>
                      {selectedComplaint.reporter_email}
                    </div>
                  </div>
                  <div
                    className={styles.statusBadge}
                    data-status={selectedComplaint.status}
                  >
                    {selectedComplaint.status === "pending" && "Under Review"}
                    {selectedComplaint.status === "resolved" && "Resolved"}
                    {selectedComplaint.status === "rejected" && "Rejected"}
                  </div>
                </div>

                <div className={styles.complaintInfo}>
                  <div className={styles.complaintSection}>
                    <h3>Reported User</h3>
                    <div>
                      {selectedComplaint.reported_name}{" "}
                      {selectedComplaint.reported_surname}
                      <br />
                      <span className={styles.complaintEmail}>
                        {selectedComplaint.reported_email}
                      </span>
                      <br />
                      <Badge
                        title={
                          selectedComplaint.reported_type === "teacher"
                            ? "Teacher"
                            : "Student"
                        }
                        isSkill={false}
                      />
                    </div>
                  </div>

                  <div className={styles.complaintSection}>
                    <h3>Reason for Complaint</h3>
                    <p>{selectedComplaint.reason}</p>
                  </div>

                  <div className={styles.complaintSection}>
                    <h3>Description</h3>
                    <p>{selectedComplaint.description}</p>
                  </div>
                </div>

                <div className={styles.videoAndActions}>
                  <div className={styles.complaintActionsSection}>
                    <Link
                      href={`/profile/${selectedComplaint.reporter_id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      target="_blank"
                    >
                      View Reporter Profile
                    </Link>
                    <Link
                      href={`/profile/${selectedComplaint.reported_id}`}
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      target="_blank"
                    >
                      View Reported Profile
                    </Link>
                    <button
                      className={`${styles.actionButton} ${styles.skipButton}`}
                      onClick={handleSkipComplaint}
                      disabled={processingId === selectedComplaint.id}
                    >
                      Skip Complaint
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.rejectButton}`}
                      onClick={() =>
                        handleRejectComplaint(selectedComplaint.id)
                      }
                      disabled={processingId === selectedComplaint.id}
                    >
                      Reject Complaint
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.blockButton}`}
                      onClick={() =>
                        handleBlockUser(selectedComplaint.reported_id)
                      }
                      disabled={processingId === selectedComplaint.reported_id}
                    >
                      Block User
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <p>Select a complaint to view</p>
                <p className={styles.emptySubtitle}>
                  {filteredComplaints.length === 0
                    ? "No complaints to display"
                    : "Select a complaint from the list on the left"}
                </p>
              </div>
            )
          ) : selectedApplication ? (
            <div className={styles.applicationDetails}>
              <div className={styles.applicationHeader}>
                <div className={styles.applicationAvatar}>
                  <Avatar src={selectedApplication.avatar} size={48} />
                </div>
                <div className={styles.applicationInfo}>
                  <div className={styles.applicationName}>
                    {selectedApplication.name} {selectedApplication.surname}
                  </div>
                  <div className={styles.applicationEmail}>
                    {selectedApplication.email}
                  </div>
                </div>
                <div
                  className={styles.statusBadge}
                  data-status={selectedApplication.status}
                >
                  {selectedApplication.status === "pending" && "Under Review"}
                  {selectedApplication.status === "approved" && "Approved"}
                  {selectedApplication.status === "rejected" && "Rejected"}
                </div>
              </div>

              <div className={styles.applicationCategory}>
                <Badge title={selectedApplication.skill.category_name} />
              </div>

              <div className={styles.applicationAbout}>
                {selectedApplication.skill.about}
              </div>

              <div className={styles.videoAndActions}>
                <div className={styles.videoSection}>
                  <div className={styles.videoContainer}>
                    <div className={styles.videoWrapper}>
                      <iframe
                        className={styles.video}
                        src={`https://www.youtube.com/embed/${selectedApplication.skill.video_card_link}`}
                        title="Video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.actionsSection}>
                  <button
                    className={`${styles.actionButton} ${styles.approveButton}`}
                    onClick={() => handleApprove(selectedApplication.id)}
                    disabled={processingId === selectedApplication.id}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={processingId === selectedApplication.id}
                  >
                    Reject
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.skipButton}`}
                    onClick={handleSkip}
                    disabled={processingId === selectedApplication.id}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <p>Select an application to view</p>
              <p className={styles.emptySubtitle}>
                {filteredApplications.length === 0
                  ? "No applications to display"
                  : "Select an application from the list on the left"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
