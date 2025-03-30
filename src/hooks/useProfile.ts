import { useCallback } from "react";
import useUserProfile from "./useUserProfile";

const useProfile = () => {
  // Используем новый хук useUserProfile для единого подхода
  const {
    userProfile,
    loadingUserProfile,
    errorUserProfile,
    refetchUserProfile,
  } = useUserProfile();

  // Сохраняем обратную совместимость с предыдущей версией
  const refreshProfile = useCallback(() => {
    return refetchUserProfile();
  }, [refetchUserProfile]);

  return {
    profile: userProfile,
    loadingProfile: loadingUserProfile,
    error: errorUserProfile,
    refreshProfile,
  };
};

export default useProfile;
