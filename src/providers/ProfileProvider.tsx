"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useUserProfile from "@/hooks/useUserProfile";
import { UserProfile } from "@/types/types";

interface ProfileContextType {
  profile: UserProfile | null;
  loadingProfile: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useProfileContext должен использоваться внутри ProfileProvider"
    );
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const {
    userProfile,
    loadingUserProfile,
    errorUserProfile,
    refetchUserProfile,
  } = useUserProfile();

  const profileData = {
    profile: userProfile,
    loadingProfile: loadingUserProfile,
    error: errorUserProfile,
    refreshProfile: refetchUserProfile,
  };

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
