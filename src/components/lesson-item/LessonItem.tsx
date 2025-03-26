import React, { useState } from "react";
import { Lesson, TeacherLesson, apiService } from "../../utilities/api";
import { useAvatar } from "../../hooks/avatar-hook";
import Avatar from "../avatar/Avatar";
import styles from "./LessonItem.module.scss";
import { useRouter } from "next/navigation";

interface LessonItemProps {
  lesson: Lesson | TeacherLesson;
  isTeacher?: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  isTeacher = false,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { avatarSource } = useAvatar(
    isTeacher
      ? (lesson as TeacherLesson).student_avatar
      : (lesson as Lesson).teacher_avatar
  );
  const lessonDate = new Date(lesson.datetime);

  // Check if the lesson is in the past
  const isPastLesson = lesson.status === "finished";

  // Check if lesson is starting soon (less than 5 minutes)
  const lessonStartingSoon =
    !isPastLesson && lessonDate.getTime() - Date.now() < 5 * 60 * 1000;

  // Format date and time
  const formattedDate = lessonDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = lessonDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate time remaining until the lesson
  const timeLeft = Math.max(0, lessonDate.getTime() - Date.now());
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  // Format time remaining in a readable format
  let timeLeftString = "";
  if (days > 0) {
    timeLeftString = `${days} day${days > 1 ? "s" : ""} ${hours} hour${
      hours > 1 ? "s" : ""
    }`;
  } else if (hours > 0) {
    timeLeftString = `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  } else if (minutes > 0) {
    timeLeftString = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    timeLeftString = "Starting soon";
  }

  // Determine participant name
  const participantName = isTeacher
    ? `${(lesson as TeacherLesson).student_name} ${
        (lesson as TeacherLesson).student_surname
      }`
    : `${(lesson as Lesson).teacher_name} ${
        (lesson as Lesson).teacher_surname
      }`;

  // Функция для перехода к уроку
  const joinLesson = async () => {
    try {
      setIsLoading(true);
      // Получаем токен для подключения к уроку
      const token = await apiService.getLessonToken(lesson.lesson_id);
      console.log("Received token for lesson:", token);

      if (!token) {
        throw new Error("Failed to get token for the lesson");
      }

      // Переход на страницу урока с токеном
      router.push(`/lessons/${token}`);
    } catch (error) {
      console.error("Error joining lesson:", error);
      alert("Failed to join the lesson. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для начала урока учителем
  const startLesson = async () => {
    try {
      setIsLoading(true);
      console.log("Starting lesson with ID:", lesson.lesson_id);

      // Проверяем, находится ли урок уже в статусе "started"
      if (lesson.status !== "ongoing") {
        // Запускаем урок на сервере только если он еще не запущен
        try {
          await apiService.lessonStart(lesson.lesson_id);
          console.log("Lesson successfully started on server");
        } catch (startError: unknown) {
          // Проверяем, не является ли ошибка 403, что может означать, что урок уже запущен
          const error = startError as { response?: { status?: number } };
          if (error?.response?.status === 403) {
            console.log("Lesson is already started or not allowed to start, proceeding to join");
            // Продолжаем выполнение и пытаемся присоединиться
          } else {
            // Если ошибка не 403, пробрасываем её дальше
            throw startError;
          }
        }
      } else {
        console.log("Lesson already in started status, proceeding to join");
      }

      // Получаем токен для подключения к уроку
      const token = await apiService.getLessonToken(lesson.lesson_id);
      console.log("Received token for started lesson:", token);

      if (!token) {
        throw new Error("Failed to get token for the lesson");
      }

      // Перенаправляем учителя на страницу урока с токеном
      router.push(`/lessons/${token}`);
    } catch (error) {
      console.error("Error starting lesson:", error);
      alert("Failed to start the lesson. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.lessonItem} ${
        isPastLesson ? styles.pastLesson : ""
      }`}
    >
      <div className={styles.avatarWrapper}>
        <Avatar src={avatarSource} size={60} />
      </div>
      <div className={styles.lessonInfo}>
        <h3>{participantName}</h3>
        <div>
          <span className={styles.categoryBadge}>{lesson.category_name}</span>
        </div>
        <div className={styles.timeInfo}>
          <p>
            {formattedDate} at {formattedTime}
          </p>
        </div>

        {!isPastLesson && <p>Remaining: {timeLeftString}</p>}
      </div>

      <div className={styles.actionWrapper}>
        {!isPastLesson ? (
          isTeacher ? (
            // For teachers, show "Start lesson" button if the lesson is starting soon (less than 5 minutes)
            lessonStartingSoon ? (
              <button
                className={`${styles.joinButton} ${
                  isLoading ? styles.loading : ""
                }`}
                onClick={startLesson}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Start lesson"}
              </button>
            ) : (
              <span className={styles.waitingTime}>
                Waiting: {timeLeftString}
              </span>
            )
          ) : (
            // For students, simply show "Join lesson" button
            <button
              className={`${styles.joinButton} ${
                isLoading ? styles.loading : ""
              }`}
              onClick={joinLesson}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Join lesson"}
            </button>
          )
        ) : (
          <span className={styles.completedStatus}>Completed</span>
        )}
      </div>
    </div>
  );
};

export default LessonItem;
