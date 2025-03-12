"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthRedirector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token && pathname !== "/" && pathname !== "/auth") {
      router.replace("/");
    }
  }, [pathname, router]);

  return null;
}
