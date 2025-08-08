import React from "react";
import styles from "./IconCard.module.scss";

interface IconCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const IconCard: React.FC<IconCardProps> = ({
  icon,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={[styles.iconCard, className].filter(Boolean).join(" ")}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default IconCard;
