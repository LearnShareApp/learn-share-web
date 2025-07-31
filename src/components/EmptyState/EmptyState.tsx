import React from "react";
import styles from "./EmptyState.module.scss";
import Button from "../Button/Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = "",
}) => {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionText && (actionHref || onAction) && (
        <Button
          variant="primary"
          href={actionHref}
          onClick={onAction}
          className={styles.action}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
