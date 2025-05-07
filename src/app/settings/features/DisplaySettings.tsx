import React from "react";
import type { Language as LanguageType } from "@/providers/LanguageProvider"; // Импорт типа Language

interface DisplaySettingsProps {
  styles: { [key: string]: string };
  language: LanguageType;
  onLanguageChange: (lang: LanguageType) => void;
  // TODO: Add props for timezone, currency, timeFormat
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  styles,
  language,
  onLanguageChange,
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>
        Display Settings
      </h2>

      {/* Display Language */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Display Language</label>
        <div className={styles.settingControl}>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageType)}
            className={styles.selectField}
          >
            <option value="ru">Русский (Russian)</option>
            <option value="en">English</option>
            <option value="sr">Srpski (Serbian)</option>
          </select>
        </div>
      </div>

      {/* Timezone - Placeholder */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Timezone</label>
        <div className={styles.settingControl}>
          <select className={styles.selectField} disabled>
            {" "}
            {/* disabled пока нет логики */}
            <option>Europe/Belgrade (UTC+02:00)</option>
            {/* ... other options */}
          </select>
        </div>
      </div>

      {/* Currency - Placeholder */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Currency</label>
        <div className={styles.settingControl}>
          <select className={styles.selectField} disabled>
            {" "}
            {/* disabled пока нет логики */}
            <option>USD $</option>
            {/* ... other options */}
          </select>
        </div>
      </div>

      {/* Time Format - Placeholder */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Time Format</label>
        <div className={styles.settingControl}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="timeFormat"
                value="12h"
                defaultChecked
                disabled // disabled пока нет логики
              />{" "}
              12h
            </label>
            <label>
              <input
                type="radio"
                name="timeFormat"
                value="24h"
                disabled // disabled пока нет логики
              />{" "}
              24h
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplaySettings;
