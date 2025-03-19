import React, { forwardRef } from "react";
import styles from "./SkillBadge.module.scss";

interface SkillBadgeProps {
  category_name: string;
  onClick?: () => void;
  isActive?: boolean;
}

const SkillBadge = forwardRef<HTMLDivElement, SkillBadgeProps>(
  ({ category_name, onClick, isActive }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.skillBadge} ${isActive ? styles.active : ""}`}
        onClick={onClick}
      >
        {category_name}
      </div>
    );
  }
);

SkillBadge.displayName = "SkillBadge";

export default SkillBadge;
