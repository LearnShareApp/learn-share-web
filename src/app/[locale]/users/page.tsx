"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";
import Loader from "@/components/loader/Loader";

const UsersRedirectPage = () => {
  const router = useRouter();
  const { userProfile, loadingUserProfile } = useUserProfile();

  useEffect(() => {
    if (loadingUserProfile) {
    } else if (userProfile && userProfile.id) {
      router.replace(`/users/${userProfile.id}`);
    } else {
      // Пользователь не авторизован или отсутствует id
      router.replace("/auth");
    }
  }, [userProfile, router, loadingUserProfile]);

  return <Loader />;
};

export default UsersRedirectPage;
