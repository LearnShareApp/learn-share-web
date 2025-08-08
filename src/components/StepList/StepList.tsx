import React from "react";
import styles from "./StepList.module.scss";

interface StepItem {
  number: number | string;
  title: string;
  description: string;
}

interface StepListProps {
  steps: StepItem[];
  className?: string;
}

const StepList: React.FC<StepListProps> = ({ steps, className = "" }) => {
  return (
    <div className={[styles.steps, className].filter(Boolean).join(" ")}>
      {steps.map((step) => (
        <div key={step.number} className={styles.step}>
          <div className={styles.stepNumber}>{step.number}</div>
          <div className={styles.stepContent}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepList;
