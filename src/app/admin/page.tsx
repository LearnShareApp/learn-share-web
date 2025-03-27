"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import Badge from "@/components/badge/Badge";

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

  // Получаем выбранную заявку
  const selectedApplication = applications.find(
    (app) => app.id === selectedApplicationId
  );

  // Получаем выбранную жалобу
  const selectedComplaint = complaints.find(
    (complaint) => complaint.id === selectedComplaintId
  );

  // Функция для перехода к следующей заявке
  const goToNextApplication = () => {
    if (!selectedApplicationId || applications.length === 0) return;

    const filteredApps = applications.filter((app) => {
      if (applicationTab === "pending") return app.status === "pending";
      if (applicationTab === "approved") return app.status === "approved";
      if (applicationTab === "rejected") return app.status === "rejected";
      return true; // Для вкладки "all"
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

  // Функция для перехода к следующей жалобе
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

  // Эта функция будет вызываться в useEffect
  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальные вызовы API
      // const [applicationsResponse, complaintsResponse] = await Promise.all([
      //   apiService.getTeacherApplications(),
      //   apiService.getComplaints()
      // ]);

      // Временные тестовые данные
      const mockApplications: TeacherApplication[] = [
        {
          id: 1,
          user_id: 101,
          name: "Иван",
          surname: "Петров",
          email: "ivan@example.com",
          avatar: null,
          skill: {
            category_id: 1,
            category_name: "Программирование",
            about: "Опытный разработчик с 5-летним стажем в React и JavaScript",
            video_card_link: "dQw4w9WgXcQ",
          },
          created_at: "2023-10-15T14:30:00Z",
          status: "pending",
        },
        {
          id: 2,
          user_id: 102,
          name: "Анна",
          surname: "Смирнова",
          email: "anna@example.com",
          avatar: null,
          skill: {
            category_id: 2,
            category_name: "Английский язык",
            about:
              "Сертифицированный преподаватель английского с опытом работы более 3 лет",
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
          reporter_name: "Алексей",
          reporter_surname: "Иванов",
          reporter_email: "alex@example.com",
          reported_id: 101,
          reported_name: "Иван",
          reported_surname: "Петров",
          reported_email: "ivan@example.com",
          reported_type: "teacher",
          reason: "Некорректное поведение",
          description:
            "Преподаватель грубо отвечал на вопросы и не выполнял свои обязательства",
          status: "pending",
          created_at: "2024-03-27T10:30:00Z",
        },
        {
          id: 2,
          reporter_id: 202,
          reporter_name: "Мария",
          reporter_surname: "Сидорова",
          reporter_email: "maria@example.com",
          reported_id: 301,
          reported_name: "Петр",
          reported_surname: "Смирнов",
          reported_email: "petr@example.com",
          reported_type: "student",
          reason: "Спам",
          description: "Студент отправляет нежелательные сообщения",
          status: "pending",
          created_at: "2024-03-27T11:15:00Z",
        },
      ];

      setApplications(mockApplications);
      setComplaints(mockComplaints);

      // Устанавливаем первый элемент как выбранный при загрузке
      if (mockApplications.length > 0) {
        setSelectedApplicationId(mockApplications[0].id);
      }
      if (mockComplaints.length > 0) {
        setSelectedComplaintId(mockComplaints[0].id);
      }
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Устанавливаем первый элемент в отфильтрованном списке как выбранный при изменении фильтра
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
        return true; // Для вкладки "all"
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

  // Фильтрация заявок по активной вкладке
  const filteredApplications = applications.filter((app) => {
    if (applicationTab === "pending") return app.status === "pending";
    if (applicationTab === "approved") return app.status === "approved";
    if (applicationTab === "rejected") return app.status === "rejected";
    return true; // Для вкладки "all"
  });

  // Фильтрация жалоб по активной вкладке
  const filteredComplaints = complaints.filter((complaint) => {
    if (complaintTab === "pending") return complaint.status === "pending";
    if (complaintTab === "resolved") return complaint.status === "resolved";
    if (complaintTab === "rejected") return complaint.status === "rejected";
    return true;
  });

  // Обработка одобрения заявки
  const handleApprove = async (applicationId: number) => {
    try {
      setProcessingId(applicationId);
      // TODO: Заменить на реальный вызов API
      // await apiService.approveTeacherApplication(applicationId);

      // Обновляем состояние локально
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: "approved" } : app
        )
      );

      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Переходим к следующей заявке
      goToNextApplication();
    } catch (err) {
      console.error("Ошибка при одобрении заявки:", err);
      setError("Не удалось одобрить заявку");
    } finally {
      setProcessingId(null);
    }
  };

  // Обработка отклонения заявки
  const handleReject = async (applicationId: number) => {
    try {
      setProcessingId(applicationId);
      // TODO: Заменить на реальный вызов API
      // await apiService.rejectTeacherApplication(applicationId);

      // Обновляем состояние локально
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: "rejected" } : app
        )
      );

      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Переходим к следующей заявке
      goToNextApplication();
    } catch (err) {
      console.error("Ошибка при отклонении заявки:", err);
      setError("Не удалось отклонить заявку");
    } finally {
      setProcessingId(null);
    }
  };

  // Обработка пропуска заявки
  const handleSkip = () => {
    goToNextApplication();
  };

  // Обработка разрешения жалобы
  const handleResolveComplaint = async (complaintId: number) => {
    try {
      setProcessingId(complaintId);
      // TODO: Заменить на реальный вызов API
      // await apiService.resolveComplaint(complaintId);

      // Обновляем состояние локально
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: "resolved" }
            : complaint
        )
      );

      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Переходим к следующей жалобе
      goToNextComplaint();
    } catch (err) {
      console.error("Ошибка при разрешении жалобы:", err);
      setError("Не удалось разрешить жалобу");
    } finally {
      setProcessingId(null);
    }
  };

  // Обработка отклонения жалобы
  const handleRejectComplaint = async (complaintId: number) => {
    try {
      setProcessingId(complaintId);
      // TODO: Заменить на реальный вызов API
      // await apiService.rejectComplaint(complaintId);

      // Обновляем состояние локально
      setComplaints(
        complaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: "rejected" }
            : complaint
        )
      );

      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Переходим к следующей жалобе
      goToNextComplaint();
    } catch (err) {
      console.error("Ошибка при отклонении жалобы:", err);
      setError("Не удалось отклонить жалобу");
    } finally {
      setProcessingId(null);
    }
  };

  // Обработка пропуска жалобы
  const handleSkipComplaint = () => {
    goToNextComplaint();
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
              Заявки на преподавателей
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
              Жалобы пользователей
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
                  Ожидают рассмотрения
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "resolved" ? styles.activeTab : ""
                  }`}
                  onClick={() => setComplaintTab("resolved")}
                >
                  Разрешенные
                </button>
                <button
                  className={`${styles.tabButton} ${
                    complaintTab === "rejected" ? styles.activeTab : ""
                  }`}
                  onClick={() => setComplaintTab("rejected")}
                >
                  Отклоненные
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
                        Жалоба на{" "}
                        {complaint.reported_type === "teacher"
                          ? "преподавателя"
                          : "студента"}
                      </div>
                    </div>
                    <div
                      className={styles.statusBadgeSmall}
                      data-status={complaint.status}
                    >
                      {complaint.status === "pending" && "Ожидает"}
                      {complaint.status === "resolved" && "Разрешено"}
                      {complaint.status === "rejected" && "Отклонено"}
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
                  Ожидают
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "approved" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("approved")}
                >
                  Одобренные
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "rejected" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("rejected")}
                >
                  Отклоненные
                </button>
                <button
                  className={`${styles.tabButton} ${
                    applicationTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => setApplicationTab("all")}
                >
                  Все
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
                      {application.status === "pending" && "Ожидает"}
                      {application.status === "approved" && "Одобрено"}
                      {application.status === "rejected" && "Отклонено"}
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
                    {selectedComplaint.status === "pending" &&
                      "На рассмотрении"}
                    {selectedComplaint.status === "resolved" && "Разрешено"}
                    {selectedComplaint.status === "rejected" && "Отклонено"}
                  </div>
                </div>

                <div className={styles.complaintInfo}>
                  <div className={styles.complaintSection}>
                    <h3>На кого подана жалоба</h3>
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
                            ? "Преподаватель"
                            : "Студент"
                        }
                        isSkill={false}
                      />
                    </div>
                  </div>

                  <div className={styles.complaintSection}>
                    <h3>Причина жалобы</h3>
                    <p>{selectedComplaint.reason}</p>
                  </div>

                  <div className={styles.complaintSection}>
                    <h3>Описание</h3>
                    <p>{selectedComplaint.description}</p>
                  </div>
                </div>

                <div className={styles.videoAndActions}>
                  <div className={styles.actionsSection}>
                    <button
                      className={`${styles.actionButton} ${styles.resolveButton}`}
                      onClick={() =>
                        handleResolveComplaint(selectedComplaint.id)
                      }
                      disabled={processingId === selectedComplaint.id}
                    >
                      Разрешить
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.rejectButton}`}
                      onClick={() =>
                        handleRejectComplaint(selectedComplaint.id)
                      }
                      disabled={processingId === selectedComplaint.id}
                    >
                      Отклонить
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.skipButton}`}
                      onClick={handleSkipComplaint}
                      disabled={processingId === selectedComplaint.id}
                    >
                      Пропустить
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <p>Выберите жалобу для просмотра</p>
                <p className={styles.emptySubtitle}>
                  {filteredComplaints.length === 0
                    ? "Нет жалоб для отображения"
                    : "Выберите жалобу из списка слева"}
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
                  {selectedApplication.status === "pending" &&
                    "На рассмотрении"}
                  {selectedApplication.status === "approved" && "Одобрено"}
                  {selectedApplication.status === "rejected" && "Отклонено"}
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
                    Одобрить
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={processingId === selectedApplication.id}
                  >
                    Отклонить
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.skipButton}`}
                    onClick={handleSkip}
                    disabled={processingId === selectedApplication.id}
                  >
                    Пропустить
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <p>Выберите заявку для просмотра</p>
              <p className={styles.emptySubtitle}>
                {filteredApplications.length === 0
                  ? "Нет заявок для отображения"
                  : "Выберите заявку из списка слева"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
