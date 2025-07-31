"use client";

import Image from "next/image";
import React from "react";
import { useAvatar } from "@/hooks/avatar-hook";

interface AvatarProps {
  size: number;
  avatarId: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ size, avatarId }) => {
  const { avatarSource } = useAvatar(avatarId ?? null);

  return (
    <Image
      src={avatarSource}
      alt="User Avatar"
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        border: "none",
        objectFit: "cover",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};

export default Avatar;
