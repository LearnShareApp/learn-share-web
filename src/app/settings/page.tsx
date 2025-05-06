"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import styles from "./page.module.scss";
import { Settings, Bell, Lock, UserCircle, Globe } from "lucide-react";
import { apiService } from "../../utilities/api";
import { useProfileContext } from "../../providers/ProfileProvider";
import * as zod from "zod";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import axios, { AxiosError } from "axios";

const profileSchema = zod.object({
  name: zod
    .string()
    .min(2, { message: "Имя должно содержать минимум 2 символа" }),
  surname: zod
    .string()
    .min(2, { message: "Фамилия должна содержать минимум 2 символа" }),
  birthdate: zod.string().optional(),
  avatar: zod.string().optional(),
});

const validateProfileData = (data: {
  name: string;
  surname: string;
  birthdate?: string;
  avatar?: string;
}) => {
  try {
    profileSchema.parse(data);
    return null;
  } catch (error) {
    const zodError = error as zod.ZodError;
    return zodError.errors.map((err) => err.message).join(", ");
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const { profile, loadingProfile, refreshProfile } = useProfileContext();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [newAvatar, setNewAvatar] = useState<string | undefined>(undefined);
  const [currentAvatarId, setCurrentAvatarId] = useState<string | undefined>(
    undefined
  );
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSurname(profile.surname || "");
      setBirthdate(profile.birthdate ? profile.birthdate.split("T")[0] : "");
      setCurrentAvatarId(profile.avatar);
      setNewAvatar(undefined);
    }
  }, [profile]);

  const handleLanguageChange = (lang: "ru" | "en" | "sr") => {
    setLanguage(lang);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccessMessage("");

    const validationError = validateProfileData({
      name,
      surname,
      birthdate,
      ...(newAvatar ? { avatar: newAvatar } : {}),
    });

    if (validationError) {
      setFormError(validationError);
      setFormLoading(false);
      return;
    }

    try {
      const formattedBirthdate = birthdate
        ? new Date(birthdate).toISOString()
        : undefined;

      await apiService.updateProfile({
        name,
        surname,
        birthdate: formattedBirthdate || "",
        ...(newAvatar ? { avatar: newAvatar } : {}),
      });

      await refreshProfile();
      setFormSuccessMessage("Профиль успешно обновлен");
      setNewAvatar(undefined);
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Ошибка обновления профиля";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setFormError(`Ошибка обновления профиля: ${errorMessage}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size > 2 * 1024 * 1024) {
          setFormError("Файл слишком большой. Максимальный размер - 2MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setNewAvatar(base64data);
          setFormError("");
        };
        reader.readAsDataURL(file);
      } else {
        setFormError(
          "Пожалуйста, загрузите изображение в формате JPG, PNG или GIF."
        );
      }
    }
  };

  const getAvatarToDisplay = () => {
    if (newAvatar) return newAvatar;
    return currentAvatarId;
  };

  const handleCancelEdit = () => {
    if (profile?.id) {
      router.push(`/users/${profile.id}`);
    } else {
      router.push("/");
    }
  };

  if (loadingProfile && activeTab === "profile") {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Настройки</h1>
        <div className={styles.settingsLayout}>
          <div className={styles.sidebar}></div>
          <div className={styles.content}>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Настройки</h1>

      <div className={styles.settingsLayout}>
        <div className={styles.sidebar}>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <UserCircle />
            <span>Профиль</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "general" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            <Settings />
            <span>Общие</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "notifications" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell />
            <span>Уведомления</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "security" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <Lock />
            <span>Безопасность</span>
          </div>
        </div>

        <div className={styles.content}>
          {activeTab === "general" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Globe className={styles.sectionIcon} />
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
              <h2 className={styles.sectionTitle}>Настройки уведомлений</h2>
              <p>Здесь будут настройки уведомлений</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Настройки безопасности</h2>
              <p>Здесь будут настройки безопасности</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <UserCircle className={styles.sectionIcon} />
                Редактирование профиля
              </h2>
              {loadingProfile ? (
                <Loader />
              ) : (
                <form
                  onSubmit={handleProfileSubmit}
                  className={styles.profileEditForm}
                >
                  <div className={styles.profileLayout}>
                    <div className={styles.avatarSection}>
                      <div className={styles.avatarPreview}>
                        <Avatar avatarId={getAvatarToDisplay()} size={120} />
                      </div>
                      <div className={styles.avatarControls}>
                        <label className={styles.fileInputLabel}>
                          Изменить аватар
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className={styles.fileInput}
                          />
                        </label>
                      </div>
                    </div>

                    <div className={styles.formFields}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="name">Имя:</label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Введите ваше имя"
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="surname">Фамилия:</label>
                          <input
                            id="surname"
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Введите вашу фамилию"
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="birthdate">Дата рождения:</label>
                        <input
                          id="birthdate"
                          type="date"
                          value={birthdate}
                          onChange={(e) => setBirthdate(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <p className={styles.errorMessage}>{formError}</p>
                  )}
                  {formSuccessMessage && (
                    <p className={styles.successMessage}>
                      {formSuccessMessage}
                    </p>
                  )}

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={styles.cancelButton}
                      disabled={formLoading}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading || loadingProfile}
                      className={styles.submitButton}
                    >
                      {formLoading ? "Сохранение..." : "Сохранить изменения"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
