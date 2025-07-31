import React from "react";
import styles from "./PageHeader.module.scss";
import Button from "../Button/Button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className = "",
}) => {
  return (
    <div className={`${styles.pageHeader} ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href ? (
                <Button
                  variant="ghost"
                  size="small"
                  href={crumb.href}
                  className={styles.breadcrumbLink}
                >
                  {crumb.label}
                </Button>
              ) : (
                <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className={styles.breadcrumbSeparator}>/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
