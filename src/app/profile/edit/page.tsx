"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";
import { apiService } from "../../../utilities/api";
import useProfile from "../../../hooks/useProfile";
import { useAvatar } from "@/hooks/avatar-hook";
import * as zod from "zod";
import Loader from "@/components/loader/Loader";

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

const EditProfilePage = () => {
  const router = useRouter();
  const { profile, loadingProfile } = useProfile();
  const { avatarSource, loadingAvatar } = useAvatar(profile?.avatar || null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [newAvatar, setNewAvatar] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setSurname(profile.surname || "");
      // Если birthdate приходит в формате ISO, выбираем только дату
      setBirthdate(profile.birthdate ? profile.birthdate.split("T")[0] : "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      console.log(newAvatar);
      await apiService.updateProfile({
        name,
        surname,
        birthdate,
        ...(newAvatar ? { avatar: newAvatar } : {}),
      });
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Ошибка при обновлении профиля");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setNewAvatar(base64data);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarSrc = () => {
    if (newAvatar) return newAvatar;
    return avatarSource;
  };

  if (loadingProfile || loadingAvatar) return <Loader />;

  return (
    <div className={styles.container}>
      <h1>Редактирование профиля</h1>
      <form onSubmit={handleSubmit} className="card">
        <div>
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Фамилия:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Дата рождения:</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Аватар:</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {(newAvatar || profile?.avatar) && (
            <Image
              src={getAvatarSrc()}
              alt="Avatar preview"
              width={100}
              height={100}
            />
          )}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
