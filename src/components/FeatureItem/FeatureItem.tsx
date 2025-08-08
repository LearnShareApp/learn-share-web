import React from "react";
import styles from "./FeatureItem.module.scss";

interface FeatureItemProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, label, className = "" }) => {
  return (
    <div className={[styles.featureItem, className].filter(Boolean).join(" ")}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default FeatureItem; 