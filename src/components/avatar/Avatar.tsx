import Image from "next/image";
import React from "react";

interface AvatarProps {
  size: number;
  src: string;
}

const Avatar: React.FC<AvatarProps> = ({ size, src }) => {
  return (
    <Image
      src={src}
      alt="User Avatar"
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};

export default Avatar;
