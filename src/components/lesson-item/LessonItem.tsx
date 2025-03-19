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

  // Check if the lesson is in the past
  const isPastLesson = lessonDate < new Date();

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
          <button className={styles.joinButton}>Join Lesson</button>
        ) : (
          <span className={styles.completedStatus}>Completed</span>
        )}
      </div>
    </div>
  );
};

export default LessonItem;
