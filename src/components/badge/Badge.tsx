import React from "react";
import styles from "./Badge.module.scss";

interface BadgeProps {
  title: string;
  isSkill?: boolean;
  color?: string;
}

const Badge: React.FC<BadgeProps> = ({ title, isSkill = true, color }) => {
  return (
    <div
      className={`${styles.badge} ${isSkill ? styles.skillBadge : ""}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      {title}
    </div>
  );
};

export default Badge;
