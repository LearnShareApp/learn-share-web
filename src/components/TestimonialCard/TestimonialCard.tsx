import React from "react";
import Image from "next/image";
import styles from "./TestimonialCard.module.scss";

interface TestimonialCardProps {
  text: string;
  avatarSrc: string;
  name: string;
  role: string;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  text,
  avatarSrc,
  name,
  role,
  className = "",
}) => {
  return (
    <div className={[styles.card, className].filter(Boolean).join(" ")}>
      <div className={styles.content}>
        <p>“{text}”</p>
      </div>
      <div className={styles.author}>
        <Image
          src={avatarSrc}
          alt={name}
          width={64}
          height={64}
          className={styles.avatar}
        />
        <div className={styles.authorInfo}>
          <p className={styles.authorName}>{name}</p>
          <p className={styles.authorRole}>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
