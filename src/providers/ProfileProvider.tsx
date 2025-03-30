"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useProfile from "@/hooks/useProfile";
import { UserProfile } from "@/utilities/api";

interface ProfileContextType {
  profile: UserProfile | null;
  loadingProfile: boolean;
  error: unknown;
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
  const profileData = useProfile();

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
