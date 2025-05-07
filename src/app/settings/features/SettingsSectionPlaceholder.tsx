import React from "react";
import { LucideProps } from "lucide-react"; // Базовый тип для Lucide иконок

interface SettingsSectionPlaceholderProps {
  styles: { [key: string]: string };
  title: string;
  IconComponent: React.FC<LucideProps>; // Тип для компонента иконки Lucide
  children: React.ReactNode;
}

const SettingsSectionPlaceholder: React.FC<SettingsSectionPlaceholderProps> = ({
  styles,
  title,
  IconComponent,
  children,
}) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <IconComponent className={styles.sectionIcon} />
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
};

export default SettingsSectionPlaceholder;
