import Image from "next/image";
import React from "react";

interface AvatarProps {
  size: number;
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ size, src }) => {
  // Используем дефолтную аватарку, если src пустая строка или null
  const avatarSrc = src && src.trim() !== "" ? src : "/default-avatar.png";

  return (
    <Image
      src={avatarSrc}
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
