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

export default function AdminPage() {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "pending" | "all" | "approved" | "rejected"
  >("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  // Получаем выбранную заявку
  const selectedApplication = applications.find(
    (app) => app.id === selectedApplicationId
  );

  // Функция для перехода к следующей заявке
  const goToNextApplication = () => {
    if (!selectedApplicationId || applications.length === 0) return;

    const filteredApps = applications.filter((app) => {
      if (activeTab === "pending") return app.status === "pending";
      if (activeTab === "approved") return app.status === "approved";
      if (activeTab === "rejected") return app.status === "rejected";
      return true; // Для вкладки "all"
    });

    const filteredIndex = filteredApps.findIndex(
      (app) => app.id === selectedApplicationId
    );

    if (filteredIndex < filteredApps.length - 1) {
      // Есть следующая заявка в текущем фильтре
      setSelectedApplicationId(filteredApps[filteredIndex + 1].id);
    } else if (filteredApps.length > 0) {
      // Если это последняя заявка, вернемся к первой
      setSelectedApplicationId(filteredApps[0].id);
    } else {
      // Нет заявок в текущем фильтре
      setSelectedApplicationId(null);
    }
  };

  // Эта функция будет вызываться в useEffect
  // В реальной реализации она бы вызывала API для получения заявок
  const fetchApplications = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальный вызов API
      // const response = await apiService.getTeacherApplications();
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

      setApplications(mockApplications);

      // Устанавливаем первую заявку как выбранную при загрузке
      if (mockApplications.length > 0) {
        setSelectedApplicationId(mockApplications[0].id);
      }
    } catch (err) {
      console.error("Ошибка при получении заявок:", err);
      setError("Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Устанавливаем первую заявку в отфильтрованном списке как выбранную при изменении фильтра
  useEffect(() => {
    const filteredApps = applications.filter((app) => {
      if (activeTab === "pending") return app.status === "pending";
      if (activeTab === "approved") return app.status === "approved";
      if (activeTab === "rejected") return app.status === "rejected";
      return true; // Для вкладки "all"
    });

    if (filteredApps.length > 0) {
      // Проверяем, есть ли текущая выбранная заявка в отфильтрованном списке
      const currentIsInFiltered = filteredApps.some(
        (app) => app.id === selectedApplicationId
      );

      if (!currentIsInFiltered) {
        setSelectedApplicationId(filteredApps[0].id);
      }
    } else {
      setSelectedApplicationId(null);
    }
  }, [activeTab, applications, selectedApplicationId]);

  // Фильтрация заявок по активной вкладке
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "pending") return app.status === "pending";
    if (activeTab === "approved") return app.status === "approved";
    if (activeTab === "rejected") return app.status === "rejected";
    return true; // Для вкладки "all"
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

  // Обработка пропуска заявки (переход к следующей без изменения статуса)
  const handleSkip = () => {
    goToNextApplication();
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
      <h2 className={styles.sectionTitle}>
        Заявки на становление преподавателями
      </h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.adminLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "pending" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Ожидают
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "approved" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("approved")}
            >
              Одобренные
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "rejected" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("rejected")}
            >
              Отклоненные
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "all" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("all")}
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
        </div>

        <div className={styles.rightColumn}>
          {selectedApplication ? (
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
