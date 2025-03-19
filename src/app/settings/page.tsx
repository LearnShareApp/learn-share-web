"use client";

import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import styles from "./page.module.scss";
import { FaGlobe, FaCog, FaBell, FaLock, FaUserCircle } from "react-icons/fa";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: "ru" | "en" | "sr") => {
    setLanguage(lang);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Настройки</h1>

      <div className={styles.settingsLayout}>
        <div className={styles.sidebar}>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "general" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            <FaCog />
            <span>Общие</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "notifications" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell />
            <span>Уведомления</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "security" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <FaLock />
            <span>Безопасность</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUserCircle />
            <span>Профиль</span>
          </div>
        </div>

        <div className={styles.content}>
          {activeTab === "general" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaGlobe className={styles.sectionIcon} />
                Выбор языка
              </h2>
              <div className={styles.languageSelector}>
                <div
                  className={`${styles.languageOption} ${
                    language === "ru" ? styles.selected : ""
                  }`}
                  onClick={() => handleLanguageChange("ru")}
                >
                  <div className={styles.languageFlag}>🇷🇺</div>
                  <div className={styles.languageInfo}>
                    <span className={styles.languageName}>Русский</span>
                    <span className={styles.languageNative}>Русский</span>
                  </div>
                  {language === "ru" && (
                    <div className={styles.selectedIndicator}></div>
                  )}
                </div>

                <div
                  className={`${styles.languageOption} ${
                    language === "en" ? styles.selected : ""
                  }`}
                  onClick={() => handleLanguageChange("en")}
                >
                  <div className={styles.languageFlag}>🇬🇧</div>
                  <div className={styles.languageInfo}>
                    <span className={styles.languageName}>Английский</span>
                    <span className={styles.languageNative}>English</span>
                  </div>
                  {language === "en" && (
                    <div className={styles.selectedIndicator}></div>
                  )}
                </div>

                <div
                  className={`${styles.languageOption} ${
                    language === "sr" ? styles.selected : ""
                  }`}
                  onClick={() => handleLanguageChange("sr")}
                >
                  <div className={styles.languageFlag}>🇷🇸</div>
                  <div className={styles.languageInfo}>
                    <span className={styles.languageName}>Сербский</span>
                    <span className={styles.languageNative}>Српски</span>
                  </div>
                  {language === "sr" && (
                    <div className={styles.selectedIndicator}></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={styles.section}>
              <h2>Настройки уведомлений</h2>
              <p>Здесь будут настройки уведомлений</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className={styles.section}>
              <h2>Настройки безопасности</h2>
              <p>Здесь будут настройки безопасности</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className={styles.section}>
              <h2>Настройки профиля</h2>
              <p>Здесь будут настройки профиля</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
