"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import Badge from "@/components/badge/Badge";
import { useRouter } from "next/navigation";
import { apiService } from "@/utilities/api";
import { Complaint as ApiComplaint, Category } from "@/types/types";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Eye,
  Mail,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  ShieldAlert,
  UserCog,
  UserX,
  CheckCircle,
  XCircle,
  ListFilter,
} from "lucide-react";

interface Complaint extends ApiComplaint {
  status: "pending" | "resolved" | "rejected";
  reported_type: "teacher" | "student";
}

interface TeacherSkillDisplay {
  skill_id: number;
  teacher_id: number;
  teacher_name: string;
  teacher_surname: string;
  teacher_avatar: string;
  about: string;
  category_id: number;
  category_name: string;
  rate: number;
  video_card_link: string;
  is_active: boolean;
  reviews_count: number;
  created_at?: string;
}

export default function AdminPage() {
  const [teacherSkillsDisplay, setTeacherSkillsDisplay] = useState<
    TeacherSkillDisplay[]
  >([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "applications" | "complaints" | "users" | "settings"
  >("dashboard");
  const [applicationTab, setApplicationTab] = useState<
    "pending" | "approved" | "all"
  >("pending");
  const [complaintTab, setComplaintTab] = useState<
    "pending" | "resolved" | "rejected" | "all"
  >("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedTeacherSkillId, setSelectedTeacherSkillId] = useState<
    number | null
  >(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const selectedTeacherSkill = teacherSkillsDisplay.find(
    (skill) => skill.skill_id === selectedTeacherSkillId
  );

  const selectedComplaint = complaints.find(
    (complaint) => complaint.complaint_id === selectedComplaintId
  );

  const goToNextApplication = () => {
    if (!selectedTeacherSkillId || teacherSkillsDisplay.length === 0) return;
    const filteredSkills = teacherSkillsDisplay.filter((skill) => {
      if (applicationTab === "pending") return !skill.is_active;
      if (applicationTab === "approved") return skill.is_active;
      return true;
    });
    const filteredIndex = filteredSkills.findIndex(
      (skill) => skill.skill_id === selectedTeacherSkillId
    );
    if (filteredIndex < filteredSkills.length - 1) {
      setSelectedTeacherSkillId(filteredSkills[filteredIndex + 1].skill_id);
    } else if (filteredSkills.length > 0) {
      setSelectedTeacherSkillId(filteredSkills[0].skill_id);
    } else {
      setSelectedTeacherSkillId(null);
    }
  };

  const goToNextComplaint = () => {
    if (!selectedComplaintId || complaints.length === 0) return;
    const currentComplaintsFiltered = complaints.filter((complaint) => {
      if (complaintTab === "all") return true;
      return complaint.status === complaintTab;
    });
    const filteredIndex = currentComplaintsFiltered.findIndex(
      (complaint) => complaint.complaint_id === selectedComplaintId
    );
    if (filteredIndex < currentComplaintsFiltered.length - 1) {
      setSelectedComplaintId(
        currentComplaintsFiltered[filteredIndex + 1].complaint_id
      );
    } else if (currentComplaintsFiltered.length > 0) {
      setSelectedComplaintId(currentComplaintsFiltered[0].complaint_id);
    } else {
      setSelectedComplaintId(null);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories first
      const categoriesResponse: Category[] = await apiService.getCategories();

      const adminSkillsResponse = await apiService.getAdminSkills();
      const processedTeacherSkills: TeacherSkillDisplay[] =
        adminSkillsResponse.skills
          .map((skill) => {
            const teacher = adminSkillsResponse.teachers.find(
              (t) => t.teacher_id === skill.teacher_id
            );
            const category = categoriesResponse.find(
              (cat) => cat.id === skill.category_id
            );

            if (!teacher) {
              console.warn(
                `Teacher with id ${skill.teacher_id} not found for skill id ${skill.skill_id}`
              );
              return null;
            }
            if (!category) {
              console.warn(
                `Category with id ${skill.category_id} not found for skill id ${skill.skill_id}`
              );
              // return null; // Or handle as needed, maybe set a default category name
            }

            return {
              ...skill,
              teacher_name: teacher.name,
              teacher_surname: teacher.surname,
              teacher_avatar: teacher.avatar,
              category_name: category ? category.name : "Unknown Category", // Use fetched category name
              created_at: new Date().toISOString().split("T")[0],
            };
          })
          .filter((skill) => skill !== null) as TeacherSkillDisplay[];
      setTeacherSkillsDisplay(processedTeacherSkills);
      const complaintsResponse = await apiService.getComplaints();
      const processedComplaints: Complaint[] = complaintsResponse.map(
        (cFromApi) => ({
          ...cFromApi,
          reported_type: cFromApi.reported_id > 200 ? "student" : "teacher",
          status: cFromApi.status || "pending",
        })
      );
      setComplaints(processedComplaints);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("An error occurred while loading data. Please try again later.");
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    try {
      setIsAdminLoading(true);
      const isAdminResponse = await apiService.getIsAdmin();
      setIsAdmin(isAdminResponse);
      setIsAdminLoading(false);
      if (isAdminResponse) {
        fetchData();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setIsAdminLoading(false);
      router.push("/");
    }
  };

  useEffect(() => {
    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (skillId: number) => {
    try {
      setProcessingId(skillId);
      await apiService.approveTeacherSkill(skillId);
      setTeacherSkillsDisplay((prev) =>
        prev.map((skill) =>
          skill.skill_id === skillId ? { ...skill, is_active: true } : skill
        )
      );
      goToNextApplication();
    } catch (error) {
      console.error("Error approving teacher skill:", error);
      setError("Failed to approve application. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (skillId: number) => {
    try {
      setProcessingId(skillId);
      console.warn("apiService.rejectTeacherSkill is not implemented yet.");
      setTeacherSkillsDisplay((prev) =>
        prev.map((skill) =>
          skill.skill_id === skillId ? { ...skill, is_active: false } : skill
        )
      );
      goToNextApplication();
    } catch (error) {
      console.error("Error rejecting teacher skill:", error);
      setError("Failed to reject application. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSkip = () => {
    goToNextApplication();
  };

  const handleResolveComplaint = async (complaintId: number) => {
    try {
      setProcessingId(complaintId);
      console.warn("apiService.resolveComplaint is not implemented yet.");
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === complaintId ? { ...c, status: "resolved" } : c
        )
      );
      goToNextComplaint();
    } catch (error) {
      console.error("Error resolving complaint:", error);
      setError("Failed to resolve complaint. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectComplaint = async (complaintId: number) => {
    try {
      setProcessingId(complaintId);
      console.warn("apiService.rejectComplaint is not implemented yet.");
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === complaintId ? { ...c, status: "rejected" } : c
        )
      );
      goToNextComplaint();
    } catch (error) {
      console.error("Error rejecting complaint:", error);
      setError("Failed to reject complaint. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleBlockUserFromComplaint = async (userId: number) => {
    try {
      setProcessingId(userId);
      console.warn("apiService.blockUser is not implemented yet.");
      if (selectedComplaint && selectedComplaint.reported_id === userId) {
        handleResolveComplaint(selectedComplaint.complaint_id);
      }
      alert(`User ${userId} block action simulated.`);
    } catch (error) {
      console.error("Error blocking user:", error);
      setError("Failed to block user. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const filteredApplications = teacherSkillsDisplay.filter((skill) => {
    if (applicationTab === "pending" && skill.is_active) return false;
    if (applicationTab === "approved" && !skill.is_active) return false;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const fullName =
        `${skill.teacher_name} ${skill.teacher_surname}`.toLowerCase();
      return (
        fullName.includes(lowerQuery) ||
        skill.category_name.toLowerCase().includes(lowerQuery)
      );
    }
    return true;
  });

  const filteredComplaints = complaints.filter((complaint) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesTab =
      complaintTab === "all" || complaint.status === complaintTab;
    if (!matchesTab) return false;

    if (searchQuery) {
      return (
        complaint.complainer_name.toLowerCase().includes(lowerQuery) ||
        complaint.complainer_surname.toLowerCase().includes(lowerQuery) ||
        complaint.reported_name.toLowerCase().includes(lowerQuery) ||
        complaint.reported_surname.toLowerCase().includes(lowerQuery) ||
        complaint.reason.toLowerCase().includes(lowerQuery) ||
        complaint.description.toLowerCase().includes(lowerQuery)
      );
    }
    return true;
  });

  const dashboardStats = {
    pending: teacherSkillsDisplay.filter((skill) => !skill.is_active).length,
    approved: teacherSkillsDisplay.filter((skill) => skill.is_active).length,
    complaints: complaints.filter((complaint) => complaint.status === "pending")
      .length,
    total: teacherSkillsDisplay.length,
  };

  const ITEMS_PER_PAGE = 10;
  const getCurrentPageData = <T,>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const displayedApplications = getCurrentPageData(filteredApplications);
  const displayedComplaints = getCurrentPageData(filteredComplaints);

  if (isAdminLoading) {
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
      <div
        className={`${styles.sidebar} ${
          sidebarCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>
            <UserCog size={28} />
          </span>
          <h1>Admin Panel</h1>
        </div>

        <div className={styles.sectionSelector}>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "dashboard" ? styles.activeSection : ""
            }`}
            onClick={() => {
              setActiveSection("dashboard");
              setCurrentPage(1);
              setSearchQuery("");
            }}
          >
            <span className={styles.sectionIcon}>
              <LayoutDashboard size={20} />
            </span>
            <span>Dashboard</span>
          </button>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "applications" ? styles.activeSection : ""
            }`}
            onClick={() => {
              setActiveSection("applications");
              setCurrentPage(1);
              setSearchQuery("");
            }}
          >
            <span className={styles.sectionIcon}>
              <ClipboardList size={20} />
            </span>
            <span>Teacher Applications</span>
          </button>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "complaints" ? styles.activeSection : ""
            }`}
            onClick={() => {
              setActiveSection("complaints");
              setCurrentPage(1);
              setSearchQuery("");
            }}
          >
            <span className={styles.sectionIcon}>
              <ShieldAlert size={20} />
            </span>
            <span>Complaints</span>
          </button>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "users" ? styles.activeSection : ""
            }`}
            onClick={() => {
              setActiveSection("users");
              setCurrentPage(1);
              setSearchQuery("");
            }}
          >
            <span className={styles.sectionIcon}>
              <Users size={20} />
            </span>
            <span>Users</span>
          </button>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "settings" ? styles.activeSection : ""
            }`}
            onClick={() => {
              setActiveSection("settings");
              setCurrentPage(1);
              setSearchQuery("");
            }}
          >
            <span className={styles.sectionIcon}>
              <Settings size={20} />
            </span>
            <span>Settings</span>
          </button>
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {sidebarCollapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {activeSection === "dashboard" && (
          <>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Dashboard</h1>
            </div>

            <div className={styles.dashboardGrid}>
              <div className={styles.statCard}>
                <div className={styles.statTitle}>
                  <span>
                    <FileText size={20} />
                  </span>{" "}
                  Pending Applications
                </div>
                <div className={styles.statValue}>{dashboardStats.pending}</div>
                <div className={`${styles.statChange} ${styles.neutral}`}>
                  Total applications: {dashboardStats.total}
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statTitle}>
                  <span>
                    <CheckCircle size={20} />
                  </span>{" "}
                  Approved Applications{" "}
                </div>
                <div className={styles.statValue}>
                  {dashboardStats.approved}
                </div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  {dashboardStats.total > 0
                    ? Math.round(
                        (dashboardStats.approved / dashboardStats.total) * 100
                      )
                    : 0}
                  % of total
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statTitle}>
                  <span>
                    <AlertTriangle size={20} />
                  </span>{" "}
                  Active Complaints
                </div>
                <div className={styles.statValue}>
                  {dashboardStats.complaints}
                </div>
                <div
                  className={`${styles.statChange} ${
                    dashboardStats.complaints > 5
                      ? styles.negative
                      : styles.positive
                  }`}
                >
                  {dashboardStats.complaints > 5 ? "Needs Attention" : "Normal"}
                </div>
              </div>
            </div>

            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Recent Applications</h2>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Category</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherSkillsDisplay.slice(0, 5).map((skill) => (
                      <tr key={skill.skill_id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <Avatar avatarId={skill.teacher_avatar} size={36} />
                            <span>
                              {skill.teacher_name} {skill.teacher_surname}
                            </span>
                          </div>
                        </td>
                        <td>{skill.category_name}</td>
                        <td>{skill.created_at || "N/A"}</td>
                        <td>
                          <Badge
                            title={skill.is_active ? "Approved" : "Pending"}
                          />
                        </td>
                        <td>
                          <button
                            className={styles.actionIcon}
                            onClick={() => {
                              setActiveSection("applications");
                              setSelectedTeacherSkillId(skill.skill_id);
                            }}
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === "applications" && (
          <>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Teacher Applications</h1>
              <div className={styles.headerActions}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Search by name, surname or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button>
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.contentCard}>
              <div className={styles.tabsContainer}>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "pending" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setApplicationTab("pending");
                    setCurrentPage(1);
                  }}
                >
                  Pending (
                  {
                    teacherSkillsDisplay.filter((skill) => !skill.is_active)
                      .length
                  }
                  )
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "approved" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setApplicationTab("approved");
                    setCurrentPage(1);
                  }}
                >
                  Approved (
                  {
                    teacherSkillsDisplay.filter((skill) => skill.is_active)
                      .length
                  }
                  )
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setApplicationTab("all");
                    setCurrentPage(1);
                  }}
                >
                  All Applications ({teacherSkillsDisplay.length})
                </button>
              </div>

              <div className={styles.cardContent}>
                {loading ? (
                  <div className={styles.loaderContainer}>
                    <Loader />
                  </div>
                ) : displayedApplications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <ClipboardList size={48} />
                    </div>
                    <p>No applications found</p>
                    <div className={styles.emptySubtitle}>
                      {searchQuery
                        ? "Adjust your search or filter criteria."
                        : "There are currently no applications matching the selected criteria."}
                    </div>
                  </div>
                ) : (
                  <div className={styles.applicationsList}>
                    {displayedApplications.map((application) => (
                      <div
                        key={application.skill_id}
                        className={`${styles.applicationListItem} ${
                          selectedTeacherSkillId === application.skill_id
                            ? styles.activeApplication
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedTeacherSkillId(application.skill_id)
                        }
                      >
                        <Avatar
                          avatarId={application.teacher_avatar}
                          size={50}
                        />

                        <div className={styles.applicationContent}>
                          <div className={styles.applicationMeta}>
                            <div className={styles.applicationListItemName}>
                              {application.teacher_name}{" "}
                              {application.teacher_surname}
                            </div>

                            <div className={styles.applicationDate}>
                              {application.created_at || "N/A"}
                            </div>
                          </div>

                          <div className={styles.applicationListItemSkill}>
                            {application.category_name}
                          </div>
                        </div>

                        <div
                          className={styles.statusBadgeSmall}
                          data-status={
                            application.is_active ? "approved" : "pending"
                          }
                        >
                          {application.is_active ? "Approved" : "Pending"}
                        </div>

                        <div className={styles.applicationActions}>
                          <button className={styles.actionIcon}>
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {filteredApplications.length > ITEMS_PER_PAGE && (
                <div className={styles.paginationContainer}>
                  <div className={styles.paginationInfo}>
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredApplications.length
                    )}{" "}
                    of {filteredApplications.length} applications
                  </div>
                  <div className={styles.paginationControls}>
                    <button
                      className={styles.pageButton}
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <ArrowLeft size={16} />
                    </button>
                    {[
                      ...Array(
                        Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)
                      ).keys(),
                    ].map((num) => (
                      <button
                        key={num + 1}
                        onClick={() => setCurrentPage(num + 1)}
                        className={`${styles.pageButton} ${
                          currentPage === num + 1 ? styles.activePage : ""
                        }`}
                      >
                        {num + 1}
                      </button>
                    ))}
                    <button
                      className={styles.pageButton}
                      disabled={
                        currentPage * ITEMS_PER_PAGE >=
                        filteredApplications.length
                      }
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedTeacherSkill && (
              <div className={styles.applicationDetails}>
                <div className={styles.detailsHeader}>
                  <Avatar
                    avatarId={selectedTeacherSkill.teacher_avatar}
                    size={72}
                  />

                  <div className={styles.applicationInfo}>
                    <h3 className={styles.applicationName}>
                      {selectedTeacherSkill.teacher_name}{" "}
                      {selectedTeacherSkill.teacher_surname}
                      <Badge
                        title={
                          selectedTeacherSkill.is_active
                            ? "Approved"
                            : "Pending"
                        }
                      />
                    </h3>

                    <p className={styles.applicationEmail}>
                      <Mail size={16} style={{ marginRight: "8px" }} />{" "}
                      email@example.com
                    </p>
                  </div>
                </div>

                <div className={styles.detailsContent}>
                  <div className={styles.detailsSection}>
                    <h3>Teacher Information</h3>
                    <div className={styles.applicationCategory}>
                      {selectedTeacherSkill.category_name}
                    </div>
                    <div className={styles.applicationAbout}>
                      {selectedTeacherSkill.about}
                    </div>
                  </div>

                  <div className={styles.videoSection}>
                    <h3>Video Introduction</h3>
                    <div className={styles.videoContainer}>
                      {selectedTeacherSkill.video_card_link ? (
                        (() => {
                          if (selectedTeacherSkill.video_card_link) {
                            return (
                              <iframe
                                className={styles.video}
                                src={`https://www.youtube-nocookie.com/embed/${selectedTeacherSkill.video_card_link}`}
                                title="Teacher Introduction Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            );
                          } else {
                            return (
                              <div className={styles.videoPlaceholder}>
                                <p>Invalid YouTube link provided.</p>
                              </div>
                            );
                          }
                        })()
                      ) : (
                        <div className={styles.videoPlaceholder}>
                          <p>No video link provided.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.detailsActions}>
                  <button
                    className={`${styles.actionButton} ${styles.skipButton}`}
                    onClick={handleSkip}
                  >
                    Skip
                  </button>
                  {!selectedTeacherSkill.is_active && (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                        onClick={() =>
                          handleReject(selectedTeacherSkill.skill_id)
                        }
                        disabled={
                          processingId === selectedTeacherSkill.skill_id || true
                        }
                      >
                        {processingId === selectedTeacherSkill.skill_id ? (
                          "Rejecting..."
                        ) : (
                          <>
                            <XCircle size={16} style={{ marginRight: "8px" }} />
                            Reject
                          </>
                        )}
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.approveButton}`}
                        onClick={() =>
                          handleApprove(selectedTeacherSkill.skill_id)
                        }
                        disabled={
                          processingId === selectedTeacherSkill.skill_id
                        }
                      >
                        {processingId === selectedTeacherSkill.skill_id ? (
                          "Approving..."
                        ) : (
                          <>
                            <CheckCircle
                              size={16}
                              style={{ marginRight: "8px" }}
                            />
                            Approve
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === "complaints" && (
          <>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Complaints</h1>
              <div className={styles.headerActions}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button>
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.contentCard}>
              <div className={styles.tabsContainer}>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "pending" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setComplaintTab("pending");
                    setCurrentPage(1);
                  }}
                >
                  Pending (
                  {complaints.filter((c) => c.status === "pending").length})
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "resolved" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setComplaintTab("resolved");
                    setCurrentPage(1);
                  }}
                >
                  Resolved (
                  {complaints.filter((c) => c.status === "resolved").length})
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "rejected" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setComplaintTab("rejected");
                    setCurrentPage(1);
                  }}
                >
                  Rejected (
                  {complaints.filter((c) => c.status === "rejected").length})
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setComplaintTab("all");
                    setCurrentPage(1);
                  }}
                >
                  All ({complaints.length})
                </button>
              </div>

              <div className={styles.cardContent}>
                {loading ? (
                  <div className={styles.loaderContainer}>
                    <Loader />
                  </div>
                ) : displayedComplaints.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <ListFilter size={48} />
                    </div>
                    <p>No complaints found</p>
                    <div className={styles.emptySubtitle}>
                      {searchQuery
                        ? "Adjust your search or filter criteria."
                        : "There are currently no complaints matching the selected criteria."}
                    </div>
                  </div>
                ) : (
                  <div className={styles.complaintsList}>
                    {displayedComplaints.map((complaint) => (
                      <div
                        key={complaint.complaint_id}
                        className={`${styles.complaintListItem} ${
                          selectedComplaintId === complaint.complaint_id
                            ? styles.activeComplaint
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedComplaintId(complaint.complaint_id)
                        }
                      >
                        <div className={styles.complaintHeader}>
                          <Avatar
                            avatarId={complaint.complainer_avatar}
                            size={40}
                          />
                          <div className={styles.complaintSubmitterInfo}>
                            <strong>
                              {complaint.complainer_name}{" "}
                              {complaint.complainer_surname}
                            </strong>{" "}
                            reported
                            <strong>
                              {complaint.reported_name}{" "}
                              {complaint.reported_surname}
                            </strong>
                          </div>
                          <Badge
                            title={
                              complaint.status.charAt(0).toUpperCase() +
                              complaint.status.slice(1)
                            }
                          />
                        </div>
                        <div className={styles.complaintReason}>
                          <strong>Reason:</strong> {complaint.reason}
                        </div>
                        <div className={styles.complaintDate}>
                          {new Date(complaint.date).toLocaleString()}
                        </div>
                        <div className={styles.complaintActions}>
                          <button className={styles.actionIcon}>
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {filteredComplaints.length > ITEMS_PER_PAGE && (
                <div className={styles.paginationContainer}>
                  <div className={styles.paginationInfo}>
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredComplaints.length
                    )}{" "}
                    of {filteredComplaints.length} complaints
                  </div>
                  <div className={styles.paginationControls}>
                    <button
                      className={styles.pageButton}
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <ArrowLeft size={16} />
                    </button>
                    {[
                      ...Array(
                        Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE)
                      ).keys(),
                    ].map((num) => (
                      <button
                        key={num + 1}
                        onClick={() => setCurrentPage(num + 1)}
                        className={`${styles.pageButton} ${
                          currentPage === num + 1 ? styles.activePage : ""
                        }`}
                      >
                        {num + 1}
                      </button>
                    ))}
                    <button
                      className={styles.pageButton}
                      disabled={
                        currentPage * ITEMS_PER_PAGE >=
                        filteredComplaints.length
                      }
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedComplaint && (
              <div className={styles.complaintDetails}>
                <div className={styles.detailsHeader}>
                  <h3>
                    Complaint Details (ID: {selectedComplaint.complaint_id})
                  </h3>
                  <Badge
                    title={
                      selectedComplaint.status.charAt(0).toUpperCase() +
                      selectedComplaint.status.slice(1)
                    }
                  />
                </div>
                <div className={styles.detailsContent}>
                  <div className={styles.complaintParticipants}>
                    <div className={styles.participantCard}>
                      <h4>Complainer</h4>
                      <Link
                        href={`/users/${selectedComplaint.complainer_id}`}
                        target="_blank"
                      >
                        <Avatar
                          avatarId={selectedComplaint.complainer_avatar}
                          size={60}
                        />
                      </Link>
                      <p>
                        <strong>
                          {selectedComplaint.complainer_name}{" "}
                          {selectedComplaint.complainer_surname}
                        </strong>
                      </p>
                      <p>
                        <Mail size={14} /> {selectedComplaint.complainer_email}
                      </p>
                    </div>
                    <div className={styles.participantCard}>
                      <h4>Reported User</h4>
                      <Link
                        href={`/users/${selectedComplaint.reported_id}`}
                        target="_blank"
                      >
                        <Avatar
                          avatarId={selectedComplaint.reported_avatar}
                          size={60}
                        />
                      </Link>
                      <p>
                        <strong>
                          {selectedComplaint.reported_name}{" "}
                          {selectedComplaint.reported_surname}
                        </strong>
                      </p>
                      <p>
                        <Mail size={14} /> {selectedComplaint.reported_email}
                      </p>
                    </div>
                  </div>
                  <div className={styles.complaintInfo}>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedComplaint.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {selectedComplaint.reason}
                    </p>
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <div className={styles.complaintDescription}>
                      {selectedComplaint.description}
                    </div>
                  </div>
                </div>
                <div className={styles.detailsActions}>
                  {selectedComplaint.status === "pending" && (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.skipButton}`}
                        onClick={goToNextComplaint}
                      >
                        Skip
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                        onClick={() =>
                          handleRejectComplaint(selectedComplaint.complaint_id)
                        }
                        disabled={
                          processingId === selectedComplaint.complaint_id ||
                          true
                        }
                      >
                        {processingId === selectedComplaint.complaint_id ? (
                          "Rejecting..."
                        ) : (
                          <>
                            <XCircle size={16} style={{ marginRight: "8px" }} />
                            Reject
                          </>
                        )}
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.approveButton}`}
                        onClick={() =>
                          handleResolveComplaint(selectedComplaint.complaint_id)
                        }
                        disabled={
                          processingId === selectedComplaint.complaint_id ||
                          true
                        }
                      >
                        {processingId === selectedComplaint.complaint_id ? (
                          "Resolving..."
                        ) : (
                          <>
                            <CheckCircle
                              size={16}
                              style={{ marginRight: "8px" }}
                            />
                            Resolve
                          </>
                        )}
                      </button>
                    </>
                  )}
                  <button
                    className={`${styles.actionButton} ${styles.dangerButton}`}
                    onClick={() =>
                      handleBlockUserFromComplaint(
                        selectedComplaint.reported_id
                      )
                    }
                    disabled={
                      processingId === selectedComplaint.reported_id || true
                    }
                  >
                    {processingId === selectedComplaint.reported_id ? (
                      "Blocking..."
                    ) : (
                      <>
                        <UserX size={16} style={{ marginRight: "8px" }} />
                        Block User
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === "users" && (
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Users</h1>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Users size={48} />
              </div>
              <p>This section is under development</p>
              <div className={styles.emptySubtitle}>
                User management functionality will be available here soon.
              </div>
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Settings</h1>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Settings size={48} />
              </div>
              <p>This section is under development</p>
              <div className={styles.emptySubtitle}>
                Platform settings will be available here soon.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
