import React from "react";
import { Lesson, TeacherLesson } from "../../utilities/api";
import { useAvatar } from "../../hooks/avatar-hook";
import Avatar from "../avatar/Avatar";
import styles from "./LessonItem.module.scss";

interface LessonItemProps {
  lesson: Lesson | TeacherLesson;
  isTeacher?: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  isTeacher = false,
}) => {
  const { avatarSource } = useAvatar(lesson.category_name); //TODO: add lesson.student-avatar or lesson.teacher-avatar
  const lessonDate = new Date(lesson.datetime);

  // Форматирование даты и времени
  const formattedDate = lessonDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = lessonDate.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Вычисление оставшегося времени до урока
  const timeLeft = Math.max(0, lessonDate.getTime() - Date.now());
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  // Форматирование оставшегося времени в удобочитаемом виде
  let timeLeftString = "";
  if (days > 0) {
    timeLeftString = `${days} д. ${hours} ч.`;
  } else if (hours > 0) {
    timeLeftString = `${hours} ч. ${minutes} мин.`;
  } else if (minutes > 0) {
    timeLeftString = `${minutes} мин.`;
  } else {
    timeLeftString = "Скоро начнется";
  }

  // Определение имени участника урока
  const participantName = isTeacher
    ? `${(lesson as TeacherLesson).student_name} ${
        (lesson as TeacherLesson).student_surname
      }`
    : `${(lesson as Lesson).teacher_name} ${
        (lesson as Lesson).teacher_surname
      }`;

  return (
    <div className={styles.lessonItem}>
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
            {formattedDate} в {formattedTime}
          </p>
        </div>
        <p>Осталось: {timeLeftString}</p>
        <button className={styles.joinButton}>Присоединиться к уроку</button>
      </div>
    </div>
  );
};

export default LessonItem;
