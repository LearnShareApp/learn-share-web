import React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "small" | "medium" | "large";
  variant?: "default" | "elevated" | "outlined";
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "medium",
  variant = "default",
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    styles[`padding-${padding}`],
    styles[`variant-${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
