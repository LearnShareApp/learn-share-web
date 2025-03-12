import React from "react";
import Image from "next/image";
import styles from "./TeacherItem.module.scss";

const TeacherItem: React.FC = () => {
  return (
    <div className={styles.teacherItem}>
      <div className={styles.teacherItem__image}>
        <Image src="/images/teacher.jpg" alt="Teacher" />
      </div>
    </div>
  );
};

export default TeacherItem;
