"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import styles from "./page.module.scss";
import { Bell, Lock, UserCircle, CreditCard } from "lucide-react";
import { apiService } from "../../utilities/api";
import { useProfileContext } from "../../providers/ProfileProvider";
import * as zod from "zod";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import axios, { AxiosError } from "axios";

// Импорт новых компонентов
import ProfileInformationSettings from "./features/ProfileInformationSettings";
import DisplaySettings from "./features/DisplaySettings";
import SettingsSectionPlaceholder from "./features/SettingsSectionPlaceholder";

const profileSchema = zod.object({
  name: zod
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  surname: zod
    .string()
    .min(2, { message: "Surname must be at least 2 characters long" }),
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
  const [activeTab, setActiveTab] = useState("general");
  const { language, setLanguage } = useLanguage();

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

      // Удаляем префикс data:image/jpeg;base64, из base64 строки, если он есть
      const avatarToSend = newAvatar
        ? newAvatar.replace(/^data:image\/[a-z]+;base64,/, "")
        : undefined;

      const profileData: {
        name: string;
        surname: string;
        birthdate: string;
        avatar?: string;
      } = {
        name,
        surname,
        birthdate: formattedBirthdate || "",
      };

      // Добавляем avatar только если он есть
      if (avatarToSend) {
        profileData.avatar = avatarToSend;
      }

      await apiService.updateProfile(profileData);

      await refreshProfile();
      setFormSuccessMessage("Profile updated successfully");
      setNewAvatar(undefined);
    } catch (err: unknown) {
      console.error("Profile update error:", err);
      let errorMessage = "Error updating profile";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{
          message?: string;
          error?: string;
        }>;
        // Пытаемся получить детальное сообщение об ошибке
        const serverMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message;

        // Логируем полный ответ для отладки
        if (axiosError.response) {
          console.error("Server response:", axiosError.response.status);
          console.error("Server data:", axiosError.response.data);
        }

        errorMessage = serverMessage || "Unknown server error";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setFormError(`Error updating profile: ${errorMessage}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Функция для сжатия изображения с обрезкой до квадрата (1:1)
  const compressImage = (
    file: File,
    size: number = 800,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Вычисляем размер стороны квадрата (минимальная сторона исходного изображения)
          const minSide = Math.min(img.width, img.height);

          // Вычисляем координаты для обрезки по центру
          const sourceX = (img.width - minSide) / 2;
          const sourceY = (img.height - minSide) / 2;

          // Устанавливаем размер canvas как квадрат
          canvas.width = size;
          canvas.height = size;

          // Рисуем обрезанное изображение на canvas с масштабированием до нужного размера
          ctx.drawImage(
            img,
            sourceX, // X координата начала обрезки
            sourceY, // Y координата начала обрезки
            minSide, // Ширина области обрезки
            minSide, // Высота области обрезки
            0, // X координата на canvas
            0, // Y координата на canvas
            size, // Ширина на canvas (квадрат)
            size // Высота на canvas (квадрат)
          );

          // Конвертируем в base64 с заданным качеством
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        const result = reader.result;
        if (typeof result === "string") {
          img.src = result;
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.type.startsWith("image/")) {
        try {
          setFormError("");
          // Сжимаем изображение перед установкой
          const compressedBase64 = await compressImage(file);
          setNewAvatar(compressedBase64);
        } catch (error) {
          console.error("Error compressing image:", error);
          setFormError(
            "Failed to process image. Please try another image file."
          );
        }
      } else {
        setFormError("Please upload an image in JPG, PNG, or GIF format.");
      }
    }
  };

  const getAvatarToDisplay = () => {
    if (newAvatar) return newAvatar;
    return currentAvatarId;
  };

  const handleCancelEdit = () => {
    if (profile) {
      setName(profile.name || "");
      setSurname(profile.surname || "");
      setBirthdate(profile.birthdate ? profile.birthdate.split("T")[0] : "");
      setNewAvatar(undefined);
      setCurrentAvatarId(profile.avatar);
      setFormError("");
      setFormSuccessMessage("");
    }
  };

  if (loadingProfile && activeTab === "general") {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
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
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.settingsLayout}>
        <div className={styles.sidebar}>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "general" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            <UserCircle />
            <span>General</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "privacy" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            <Lock />
            <span>Privacy</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "notifications" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell />
            <span>Notifications</span>
          </div>
          <div
            className={`${styles.sidebarItem} ${
              activeTab === "payment" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("payment")}
          >
            <CreditCard />
            <span>Payment</span>
          </div>
        </div>

        <div className={styles.content}>
          {activeTab === "general" && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <ProfileInformationSettings
                styles={styles}
                AvatarComponent={Avatar}
                profile={profile}
                name={name}
                setName={setName}
                surname={surname}
                setSurname={setSurname}
                getAvatarToDisplay={getAvatarToDisplay}
                handleAvatarChange={handleAvatarChange}
                onProfileSubmit={handleProfileSubmit}
                formLoading={formLoading}
                formError={formError}
                formSuccessMessage={formSuccessMessage}
                onCancelEdit={handleCancelEdit}
              />
              <DisplaySettings
                styles={styles}
                language={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          )}

          {activeTab === "privacy" && (
            <SettingsSectionPlaceholder
              styles={styles}
              title="Privacy Settings"
              IconComponent={Lock}
            >
              Privacy settings for your account will be here.
            </SettingsSectionPlaceholder>
          )}

          {activeTab === "notifications" && (
            <SettingsSectionPlaceholder
              styles={styles}
              title="Notification Settings"
              IconComponent={Bell}
            >
              Notification settings will be here.
            </SettingsSectionPlaceholder>
          )}

          {activeTab === "payment" && (
            <SettingsSectionPlaceholder
              styles={styles}
              title="Payment Methods"
              IconComponent={CreditCard}
            >
              Payment method settings will be here.
            </SettingsSectionPlaceholder>
          )}
        </div>
      </div>
    </div>
  );
}
