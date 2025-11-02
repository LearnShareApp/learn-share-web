import React from "react";
import Image from "next/image";
import type { UserProfile } from "@/types/types"; // Исправленный импорт типа Profile
import type Avatar from "../../../components/avatar/Avatar"; // Импортируем дефолтный экспорт

interface ProfileInformationSettingsProps {
  styles: { [key: string]: string }; // Тип для объекта стилей SCSS-модуля
  AvatarComponent: typeof Avatar; // Используем typeof Avatar, если Avatar - это сам компонент
  profile: UserProfile | null;
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (surname: string) => void;
  // birthdate: string; // Если понадобится дата рождения
  // setBirthdate: (date: string) => void; // Если понадобится дата рождения
  // newAvatar: string | undefined; // Удалено, так как getAvatarToDisplay инкапсулирует это
  getAvatarToDisplay: () => string | undefined;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formLoading: boolean;
  formError: string;
  formSuccessMessage: string;
  onCancelEdit: () => void;
}

const ProfileInformationSettings: React.FC<ProfileInformationSettingsProps> = ({
  styles,
  AvatarComponent,
  profile,
  name,
  setName,
  surname,
  setSurname,
  // newAvatar, // Удалено из деструктуризации
  getAvatarToDisplay,
  handleAvatarChange,
  onProfileSubmit,
  formLoading,
  formError,
  formSuccessMessage,
  onCancelEdit,
}) => {
  return (
    <form onSubmit={onProfileSubmit} className={styles.profileForm}>
      {/* Profile Photo Section */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Profile Photo</label>
        <div className={styles.settingControl}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {(() => {
                const avatarSrc = getAvatarToDisplay();
                return avatarSrc?.startsWith("data:image/") ? (
                  <Image
                    src={avatarSrc}
                    alt="Avatar preview"
                    width={100}
                    height={100}
                    unoptimized
                    style={{
                      borderRadius: "50%",
                      border: "none",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                ) : (
                  <AvatarComponent avatarId={avatarSrc} size={100} />
                );
              })()}
            </div>
            <div className={styles.avatarControls}>
              <p className={styles.avatarDescription}>
                This will be displayed to other users when they view your
                profile or posts. Image will be automatically compressed.
              </p>
              <input
                type="file"
                id="avatar-upload"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
              <label
                htmlFor="avatar-upload"
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                UPLOAD
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Name Input */}
      <div className={styles.settingItem}>
        <label htmlFor="name" className={styles.settingLabel}>
          Name
        </label>
        <div className={styles.settingControl}>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
        </div>
      </div>

      {/* Surname Input */}
      <div className={styles.settingItem}>
        <label htmlFor="surname" className={styles.settingLabel}>
          Surname
        </label>
        <div className={styles.settingControl}>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className={styles.inputField}
          />
        </div>
      </div>

      {/* Email Display */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Email</label>
        <div className={styles.settingControl}>
          <span>{profile?.email || "Not specified"}</span>
          {/* TODO: Add "Validated" status and "Change Email" button/modal */}
        </div>
      </div>

      {/* Phone Section */}
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Phone</label>
        <div className={styles.settingControl}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            // onClick={handleAddPhone} // TODO: Implement
          >
            Add Phone
          </button>
          {/* TODO: Display phone if exists, or "Add Phone" button */}
        </div>
      </div>

      {/* Social Connections Placeholder */}
      {/* 
      <div className={styles.settingItem}>
        <label className={styles.settingLabel}>Facebook</label>
        <div className={styles.settingControl}>
          <button type="button" className={`${styles.button} ${styles.buttonSocial}`}>
            Connect Facebook
          </button>
        </div>
      </div>
      */}

      {/* Form Messages and Actions */}
      {formError && <p className={styles.errorMessage}>{formError}</p>}
      {formSuccessMessage && (
        <p className={styles.successMessage}>{formSuccessMessage}</p>
      )}
      <div className={styles.formActions}>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={formLoading}
        >
          {formLoading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancelEdit}
          className={`${styles.button} ${styles.buttonSecondary}`}
          disabled={formLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileInformationSettings;
