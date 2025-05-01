import React from "react";
import Link from "next/link";
import { TeacherProfile } from "../../types/types";
import styles from "./TeacherItem.module.scss";
import Avatar from "../avatar/Avatar";

interface TeacherItemProps {
  teacher: TeacherProfile;
  category?: string;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, category }) => {
  // Выбор отображаемого навыка
  const skillToShow =
    teacher.skills && teacher.skills.length > 0
      ? category
        ? teacher.skills.find(
            (skill) => String(skill.category_id) === category
          ) || teacher.skills[0]
        : teacher.skills[0]
      : null;

  // Формирование ссылки на профиль учителя
  const teacherLink =
    `/teachers/${teacher.teacher_id}` +
    (skillToShow ? `?category=${skillToShow.category_id}` : "");

  // Форматирование рейтинга
  const formattedRating =
    teacher.common_rate !== 0 ? teacher.common_rate.toFixed(1) : "—";

  // Склонение слова "занятие" в зависимости от количества
  const getLessonsText = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return `${count} занятие`;
    } else if (
      [2, 3, 4].includes(lastDigit) &&
      ![12, 13, 14].includes(lastTwoDigits)
    ) {
      return `${count} занятия`;
    } else {
      return `${count} занятий`;
    }
  };

  return (
    <Link href={teacherLink} className={styles.teacherItemLink}>
      <div className={styles.teacherItem}>
        <div className={styles.teacherItem__image}>
          <Avatar avatarId={teacher.avatar} size={100} />
        </div>
        <div className={styles.teacherItem__info}>
          <div className={styles.teacherItem__names}>
            {teacher.name} {teacher.surname}
          </div>
          <div className={styles.teacherItem__skills}>
            {teacher.skills && teacher.skills.length > 0 ? (
              teacher.skills.map((skill, index) => (
                <span
                  key={`${skill.category_id}-${index}`}
                  className={styles.skillBadge}
                >
                  {skill.category_name}
                </span>
              ))
            ) : (
              <span className={styles.skillBadge}>No skills</span>
            )}
          </div>
          {skillToShow?.about && (
            <p className={styles.skillDescription}>
              {skillToShow.about.length > 100
                ? `${skillToShow.about.substring(0, 100)}...`
                : skillToShow.about}
            </p>
          )}
        </div>
        <div className={styles.teacherItem__rating}>
          <div className={styles.ratingValue}>
            {formattedRating} <span className={styles.star}>★</span>
          </div>
          <div className={styles.finishedLessons}>
            {getLessonsText(teacher.finished_lessons)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeacherItem;
