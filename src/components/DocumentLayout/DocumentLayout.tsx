import React from "react";
import styles from "./DocumentLayout.module.scss";
import { PageHeader } from "@/components";

interface DocumentLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
  className?: string;
}

const DocumentLayout: React.FC<DocumentLayoutProps> = ({
  title,
  lastUpdated,
  children,
  className = "",
}) => {
  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      <div className={styles.header}>
        <PageHeader title={title} />
        {lastUpdated && (
          <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default DocumentLayout;
