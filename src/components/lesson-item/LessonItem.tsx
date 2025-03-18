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
  const timeLeft = Math.max(0, lessonDate.getTime() - Date.now());
  const timeLeftString = new Date(timeLeft).toISOString().substr(11, 8);

  return (
    <div className={styles.lessonItem}>
      <div className={styles.avatarWrapper}>
        <Avatar src={avatarSource} size={50} />
      </div>
      <div className={styles.lessonInfo}>
        <h3>
          {isTeacher
            ? `${(lesson as TeacherLesson).student_name} ${
                (lesson as TeacherLesson).student_surname
              }`
            : `${(lesson as Lesson).teacher_name} ${
                (lesson as Lesson).teacher_surname
              }`}
        </h3>
        <p>Skill: {lesson.category_name}</p>
        <p>Time left: {timeLeftString}</p>
        <button className={styles.joinButton}>Join Lesson</button>
      </div>
    </div>
  );
};

export default LessonItem;
