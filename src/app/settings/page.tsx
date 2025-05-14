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

      await apiService.updateProfile({
        name,
        surname,
        birthdate: formattedBirthdate || "",
        ...(newAvatar ? { avatar: newAvatar } : {}),
      });

      await refreshProfile();
      setFormSuccessMessage("Profile updated successfully");
      setNewAvatar(undefined);
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Error updating profile";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setFormError(`Error updating profile: ${errorMessage}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size > 2 * 1024 * 1024) {
          setFormError("File is too large. Maximum size is 2MB.");
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
