"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import useProfile from "@/hooks/useProfile";
import { useAvatar } from "@/hooks/avatar-hook";
import { useState } from "react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { profile } = useProfile();
  const { avatarSource } = useAvatar(profile?.avatar || null);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    console.log("Dropdown visibility:", !isDropdownVisible);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Левая часть - логотип */}
          <div className={styles.logo}>
            <Link href="/home">
              <Image
                src="/logo.png"
                alt="Learn&Share Logo"
                width={40}
                height={40}
                className={styles.logoImage}
              />
            </Link>
          </div>

          {/* Центральная часть - основное меню */}
          <nav className={styles.navigation}>
            <Link
              href="/home"
              className={`${styles.navLink} ${
                pathname === "/home" ? styles.active : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home</span>
            </Link>
            <Link
              href="/teachers"
              className={`${styles.navLink} ${
                pathname === "/teachers" ? styles.active : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search</span>
            </Link>
            <Link
              href="/lessons"
              className={`${styles.navLink} ${
                pathname === "/lessons" ? styles.active : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Lessons</span>
            </Link>
            <Link
              href="/for-teachers"
              className={`${styles.navLink} ${
                pathname === "/for-teachers" ? styles.active : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.navIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span>For teachers</span>
            </Link>
          </nav>

          {/* Правая часть - профиль и чаты */}
          <div className={styles.userActions}>
            <button
              onClick={() => router.push("/chats")}
              className={styles.chatButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.chatIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            <div
              className={styles.avatarWrapper}
              onMouseEnter={toggleDropdown}
              onMouseLeave={toggleDropdown}
            >
              <Link href="/profile" className={styles.profileLink}>
                <Image
                  src={avatarSource}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className={styles.avatarImage}
                />
              </Link>
              {isDropdownVisible && (
                <div className={styles.dropdownMenu}>
                  <Link href="/settings" className={styles.dropdownItem}>
                    Настройки
                  </Link>
                  <button
                    onClick={() => {
                      /* логика выхода из аккаунта */
                    }}
                    className={styles.dropdownItem}
                  >
                    Выйти
                  </button>
                  <div className={styles.dropdownItem}>
                    Имя пользователя: {profile?.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
