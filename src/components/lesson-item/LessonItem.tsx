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
  const isPastLesson = lessonDate < new Date();

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
      console.log("Получен токен для урока:", token);

      if (!token) {
        throw new Error("Не удалось получить токен для урока");
      }

      // Переход на страницу урока с токеном
      router.push(`/lessons/${token}`);
    } catch (error) {
      console.error("Ошибка при присоединении к уроку:", error);
      alert("Не удалось присоединиться к уроку. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для начала урока учителем
  const startLesson = async () => {
    try {
      setIsLoading(true);
      console.log("Начинаем урок с ID:", lesson.lesson_id);

      // Запускаем урок на сервере
      await apiService.lessonStart(lesson.lesson_id);
      console.log("Урок успешно запущен на сервере");

      // Получаем токен для подключения к уроку
      const token = await apiService.getLessonToken(lesson.lesson_id);
      console.log("Получен токен для начатого урока:", token);

      if (!token) {
        throw new Error("Не удалось получить токен для урока");
      }

      // Перенаправляем учителя на страницу урока с токеном
      router.push(`/lessons/${token}`);
    } catch (error) {
      console.error("Ошибка при начале урока:", error);
      alert("Не удалось начать урок. Попробуйте позже.");
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
            // Для учителя показываем кнопку "Начать урок", если до начала урока осталось менее 5 минут
            lessonStartingSoon ? (
              <button
                className={`${styles.joinButton} ${
                  isLoading ? styles.loading : ""
                }`}
                onClick={startLesson}
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : "Начать урок"}
              </button>
            ) : (
              <span className={styles.waitingTime}>
                Ожидание: {timeLeftString}
              </span>
            )
          ) : (
            // Для студента просто показываем кнопку "Присоединиться к уроку"
            <button
              className={`${styles.joinButton} ${
                isLoading ? styles.loading : ""
              }`}
              onClick={joinLesson}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Присоединиться к уроку"}
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
