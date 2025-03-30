"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { apiService } from "../../../utilities/api";
import { useProfileContext } from "../../../providers/ProfileProvider";
import { useAvatar } from "@/hooks/avatar-hook";
import * as zod from "zod";
import Loader from "@/components/loader/Loader";
import Avatar from "@/components/avatar/Avatar";
import axios, { AxiosError } from "axios";

const profileSchema = zod.object({
  name: zod
    .string()
    .min(2, { message: "Name must contain at least 2 characters" }),
  surname: zod
    .string()
    .min(2, { message: "Surname must contain at least 2 characters" }),
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

const EditProfilePage = () => {
  const router = useRouter();
  const { profile, loadingProfile, refreshProfile } = useProfileContext();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar || null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [newAvatar, setNewAvatar] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSurname(profile.surname || "");
      // If birthdate comes in ISO format, we extract only the date part
      setBirthdate(profile.birthdate ? profile.birthdate.split("T")[0] : "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const validationError = validateProfileData({
      name,
      surname,
      birthdate,
      avatar: newAvatar,
    });
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Преобразуем формат даты в ISO 8601 с timezone (если дата существует)
      const formattedBirthdate = birthdate
        ? new Date(birthdate).toISOString()
        : birthdate;

      await apiService.updateProfile({
        name,
        surname,
        birthdate: formattedBirthdate,
        ...(newAvatar ? { avatar: newAvatar } : {}),
      });

      // Обновляем данные профиля после успешного сохранения
      await refreshProfile();

      setSuccessMessage("Profile updated successfully");

      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      // Выводим более детальную информацию об ошибке
      let errorMessage = "Error updating profile";

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(`Error updating profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setNewAvatar(base64data);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload an image in JPG, PNG or GIF format");
      }
    }
  };

  const getAvatarSrc = () => {
    if (newAvatar) return newAvatar;
    return avatarSource;
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (loadingProfile || loadingAvatar) return <Loader />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Profile</h1>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.profileLayout}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarPreview}>
                <Avatar src={getAvatarSrc()} size={120} />
              </div>
              <div className={styles.avatarControls}>
                <label className={styles.fileInputLabel}>
                  Change Avatar
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
                  <label htmlFor="name">Name:</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Enter your name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="surname">Surname:</label>
                  <input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Enter your surname"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="birthdate">Date of Birth:</label>
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

          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && (
            <p className={styles.successMessage}>{successMessage}</p>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
