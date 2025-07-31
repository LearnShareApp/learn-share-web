import React from "react";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  number: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  number,
  label,
  icon,
  trend,
  className = "",
}) => {
  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.content}>
        <div className={styles.main}>
          <span className={styles.number}>{number}</span>
          <span className={styles.label}>{label}</span>
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      {trend && (
        <div
          className={`${styles.trend} ${
            trend.isPositive ? styles.positive : styles.negative
          }`}
        >
          <span>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
