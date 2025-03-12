import { useState, useEffect } from "react";
import { apiService } from "./api";

export const useAvatar = (avatarId: string | null) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(true);
  const [errorAvatar, setErrorAvatar] = useState<string | null>(null);

  const fetchAvatar = async () => {
    if (!avatarId) {
      setLoadingAvatar(false);
      return;
    }

    try {
      setLoadingAvatar(true);
      const response = await apiService.getAvatar(avatarId);
      if (response) {
        // Преобразуем ArrayBuffer в base64
        const bytes = new Uint8Array(response);
        let binary = "";
        bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        const base64 = btoa(binary);
        setAvatar(`data:image/jpeg;base64,${base64}`);
        setErrorAvatar(null);
      } else {
        throw new Error("No avatar data received");
      }
    } catch (err) {
      console.error("Avatar fetch error:", err);
      setErrorAvatar("Failed to fetch avatar");
      setAvatar(null);
    } finally {
      setLoadingAvatar(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [avatarId]);

  // Возвращаем полученный аватар или путь к значку по умолчанию
  const avatarSource = avatar ? avatar : "/default-avatar.png";

  return {
    avatar,
    loadingAvatar,
    errorAvatar,
    avatarSource,
    refetchAvatar: fetchAvatar,
  };
};
