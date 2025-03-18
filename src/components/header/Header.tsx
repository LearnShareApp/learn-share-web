"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import useProfile from "@/hooks/useProfile";
import { useAvatar } from "@/hooks/avatar-hook";
import { useState, useEffect, useRef } from "react";
import Avatar from "@/components/avatar/Avatar";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { avatarSource } = useAvatar(profile?.avatar || null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Проверяем авторизацию при монтировании компонента
  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const userToken = localStorage.getItem("userToken");
    setIsAuthenticated(!!userToken);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    console.log("Dropdown visibility:", !isDropdownVisible);
  };

  const handleLogout = () => {
    // Удаляем jwt токен из localStorage
    localStorage.removeItem("userToken");
    // Обновляем состояние авторизации
    setIsAuthenticated(false);
    // Перенаправляем пользователя на страницу авторизации
    router.push("/");
  };

  useEffect(() => {
    // Используем IntersectionObserver для отслеживания видимости основной шапки
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Если основная шапка не видна, показываем фиксированную
        setShowFixedHeader(!entry.isIntersecting);
      },
      {
        // Настраиваем порог: шапка считается видимой, если видно хотя бы 5% её высоты
        threshold: 0.05,
        // Добавляем root margin для лучшего определения
        rootMargin: "-5px 0px 0px 0px",
      }
    );

    // Сохраняем текущее значение ref в локальной переменной
    const currentHeaderRef = mainHeaderRef.current;

    if (currentHeaderRef) {
      observer.observe(currentHeaderRef);
    }

    // Проверяем начальное состояние (если страница загружена уже прокрученной)
    if (currentHeaderRef && window.scrollY > 0) {
      // Если страница уже прокручена, проверяем видимость основной шапки
      const headerRect = currentHeaderRef.getBoundingClientRect();
      if (headerRect.bottom <= 0) {
        setShowFixedHeader(true);
      }
    }

    return () => {
      if (currentHeaderRef) {
        observer.unobserve(currentHeaderRef);
      }
    };
  }, []);

  // Определяем набор ссылок и иконок в зависимости от авторизации
  const renderNavigation = () => {
    if (isAuthenticated) {
      // Навигация для авторизованных пользователей
      return (
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
      );
    } else {
      // Навигация для неавторизованных пользователей
      return (
        <nav className={styles.navigation}>
          <Link
            href="/about"
            className={`${styles.navLink} ${
              pathname === "/about" ? styles.active : ""
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>About us</span>
          </Link>
          <Link
            href="/support"
            className={`${styles.navLink} ${
              pathname === "/support" ? styles.active : ""
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.923 14.83L9 16.414V12a1 1 0 01.923-.83z"
              />
            </svg>
            <span>Support</span>
          </Link>
          <Link
            href="/privacy"
            className={`${styles.navLink} ${
              pathname === "/privacy" ? styles.active : ""
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Privacy</span>
          </Link>
          <Link
            href="/contacts"
            className={`${styles.navLink} ${
              pathname === "/contacts" ? styles.active : ""
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Contacts</span>
          </Link>
        </nav>
      );
    }
  };

  // Рендерим правую часть шапки в зависимости от авторизации
  const renderUserActions = () => {
    if (isAuthenticated) {
      // Действия для авторизованных пользователей
      return (
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
                <div
                  className={styles.dropdownItem}
                  onClick={() => router.push("/profile")}
                >
                  <Avatar src={avatarSource} size={32} /> {profile?.name}{" "}
                  {profile?.surname}
                </div>
                <Link href="/settings" className={styles.dropdownItem}>
                  Settings
                </Link>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Действия для неавторизованных пользователей
      return (
        <div className={styles.userActions}>
          <Link href="/auth" className={styles.authButton}>
            <button className={styles.joinButton}>Start learning</button>
          </Link>
        </div>
      );
    }
  };

  // Содержимое шапки с динамическими элементами
  const headerContent = (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Левая часть - логотип */}
        <div className={styles.logo}>
          <Link href={isAuthenticated ? "/home" : "/"}>
            <Image
              src="/logo.png"
              alt="Learn&Share Logo"
              width={40}
              height={40}
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Центральная часть - динамическое меню */}
        {renderNavigation()}

        {/* Правая часть - динамические действия пользователя */}
        {renderUserActions()}
      </div>
    </div>
  );

  return (
    <>
      {/* Основная шапка, которая следует за скроллом */}
      <header ref={mainHeaderRef} className={styles.header}>
        {headerContent}
      </header>

      {/* Фиксированная шапка, которая появляется, когда основная не видна */}
      <header
        className={`${styles.fixedHeader} ${
          showFixedHeader ? styles.fixedHeaderVisible : ""
        }`}
      >
        {headerContent}
      </header>
    </>
  );
};

export default Header;
