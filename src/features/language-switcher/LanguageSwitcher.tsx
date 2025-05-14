"use client";

import React from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import styles from "./LanguageSwitcher.module.scss";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as "ru" | "en" | "sr");
  };

  return (
    <div className={styles.container}>
      <select
        value={language}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="sr">Српски</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
