import React, { useRef, useEffect, forwardRef } from "react";
import styles from "./SkillBadge.module.scss";

interface SkillBadgeProps {
  category_name: string;
  onClick?: () => void;
  isActive?: boolean;
}

const SkillBadge = forwardRef<HTMLDivElement, SkillBadgeProps>(
  ({ category_name, onClick, isActive }, ref) => {
    const badgeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isActive && badgeRef.current) {
        const badge = badgeRef.current;
        const description = document.querySelector(
          ".skillDescription"
        ) as HTMLElement;
        if (description) {
          const badgeRect = badge.getBoundingClientRect();
          const descriptionRect = description.getBoundingClientRect();
          const offset =
            badgeRect.left - descriptionRect.left + badgeRect.width / 2;
          description.style.setProperty("--arrow-position", `${offset}px`);
        }
      }
    }, [isActive]);

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
