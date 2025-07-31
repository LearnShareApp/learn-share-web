import React from "react";
import styles from "./SectionTitle.module.scss";

interface SectionTitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  align?: "left" | "center" | "right";
  className?: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  level = 2,
  align = "left",
  className = "",
  subtitle,
}) => {
  const titleClasses = [
    styles.sectionTitle,
    styles[`level-${level}`],
    styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div className={styles.titleWrapper}>
      <Tag className={titleClasses}>{children}</Tag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
