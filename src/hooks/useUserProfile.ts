import { useState, useEffect, useCallback } from "react";
import { apiService, UserProfile } from "../utilities/api";

interface UseUserProfileOptions {
  userId?: string | number;
}

/**
 * Хук для получения профиля пользователя
 * Если userId не указан, возвращает профиль текущего пользователя
 * Если userId указан, возвращает профиль пользователя с указанным ID
 */
export const useUserProfile = (options?: UseUserProfileOptions) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      let data;
      if (options?.userId) {
        // Если передан ID, получаем профиль конкретного пользователя
        data = await apiService.getUserProfileById(options.userId);
      } else {
        // Иначе получаем профиль текущего пользователя
        // Проверяем наличие токена перед запросом
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setUserProfile(null);
          setError(null);
          setLoading(false);
          return; // Не делаем запрос, если нет токена
        }
        data = await apiService.getUserProfile();
      }

      setUserProfile(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  }, [options?.userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    userProfile,
    loadingUserProfile: loading,
    errorUserProfile: error,
    refetchUserProfile: fetchProfile,
  };
};

export default useUserProfile;
