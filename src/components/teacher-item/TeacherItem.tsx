import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TeacherProfile } from "../../utilities/api";
import styles from "./TeacherItem.module.scss";
import { useAvatar } from "../../utilities/avatar-hook";

interface TeacherItemProps {
  teacher: TeacherProfile;
  category?: string;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, category }) => {
  console.log(teacher.avatar);

  const skillToShow =
    teacher.skills && teacher.skills.length > 0
      ? category
        ? teacher.skills.find(
            (skill) => String(skill.category_id) === category
          ) || teacher.skills[0]
        : teacher.skills[0]
      : null;

  const teacherLink =
    `/teacher/${teacher.teacher_id}` +
    (skillToShow ? `?category=${skillToShow.category_id}` : "");

  // Используем useAvatar для получения корректного URL для аватара, деструктурируя avatarSource
  const { avatarSource } = useAvatar(teacher.avatar);

  return (
    <Link href={teacherLink} className={styles.teacherItemLink}>
      <div className={`${styles.teacherItem} card`}>
        <div className={styles.teacherItem__image}>
          <Image
            src={avatarSource}
            alt={`${teacher.name} ${teacher.surname}`}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.teacherItem__info}>
          <div className={styles.teacherItem__names}>
            <span>{teacher.name}</span> <span>{teacher.surname}</span>
          </div>
          <div className={styles.teacherItem__skills}>
            {teacher.skills && teacher.skills.length > 0 ? (
              teacher.skills.map((skill, index) => (
                <span
                  key={`${skill.about}-${index}`}
                  className={styles.skillBadge}
                >
                  {skill.category_name}
                </span>
              ))
            ) : (
              <span>Без навыков</span>
            )}
          </div>
        </div>
        <div className={styles.teacherItem__rating}>
          <div className={styles.ratingValue}>
            {teacher.common_rate !== 0 ? teacher.common_rate.toFixed(1) : "--"}{" "}
            <span className={styles.star}>★</span>
          </div>
          <div className={styles.finishedLessons}>
            {teacher.finished_lessons} занятий
          </div>
        </div>
        {/* <div>{skillToShow?.about}</div> */}
      </div>
    </Link>
  );
};

export default TeacherItem;
