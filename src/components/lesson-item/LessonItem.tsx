import React from "react";
import { TeacherLesson } from "../../utilities/api";
import styles from "./LessonItem.module.scss";

interface LessonItemProps {
  lesson: TeacherLesson;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson }) => {
  return (
    <div className={styles.lessonItem}>
      <div className={styles.lessonInfo}>
        <h3>{lesson.category_name}</h3>
        <p>{new Date(lesson.datetime).toLocaleString()}</p>
      </div>
      <div className={styles.lessonStatus}>
        <span>{lesson.status}</span>
      </div>
    </div>
  );
};

export default LessonItem;
