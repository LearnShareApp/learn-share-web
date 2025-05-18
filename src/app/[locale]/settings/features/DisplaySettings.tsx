import LanguageSwitcher from "@/features/language-switcher/LanguageSwitcher";
import React from "react";

interface DisplaySettingsProps {
  styles: { [key: string]: string };
  // TODO: Add props for timezone, currency, timeFormat
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({ styles }) => {
  return (
    <>
      <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>
        Display Settings
      </h2>

      {/* Display Language */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Display Language</label>
        <div className={styles.settingControl}>
          <LanguageSwitcher />
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
