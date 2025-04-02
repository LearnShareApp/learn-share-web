"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import useUserProfile from "@/hooks/useUserProfile";
import { useAvatar } from "@/hooks/avatar-hook";
import { useState, useEffect, useRef } from "react";
import Avatar from "@/components/avatar/Avatar";

// Иконки для выпадающего меню
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.dropdownIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.dropdownIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={styles.dropdownIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useUserProfile();
  const { avatarSource } = useAvatar(userProfile?.avatar || null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeHeaderId, setActiveHeaderId] = useState<string | null>(null);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIfMobile = () => {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);
    };

    // Проверяем сразу
    checkIfMobile();

    // Добавляем слушатель изменения размера экрана
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Проверяем авторизацию при монтировании компонента
  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const userToken = localStorage.getItem("userToken");
    setIsAuthenticated(!!userToken);
  }, []);

  // Закрытие выпадающего меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        avatarContainerRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    // Добавляем обработчик только если меню открыто
    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  // Обработчик для переключения видимости выпадающего меню
  const toggleDropdown = (headerId: string) => {
    if (isDropdownVisible && activeHeaderId === headerId) {
      setDropdownVisible(false);
      setActiveHeaderId(null);
    } else {
      setDropdownVisible(true);
      setActiveHeaderId(headerId);
    }

    // Для отладки: покажем в консоли состояние меню
    console.log(
      "Dropdown toggled:",
      isDropdownVisible ? "closing" : "opening",
      "headerId:",
      headerId
    );
  };

  // Обработчик выхода пользователя из системы
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsAuthenticated(false);
    setDropdownVisible(false);
    router.push("/");
  };

  // Навигация на другую страницу с закрытием меню
  const navigateTo = (path: string) => {
    router.push(path);
    setDropdownVisible(false);
    setActiveHeaderId(null);
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

  // Обработка блокировки скролла при открытом мобильном меню
  useEffect(() => {
    // Функция блокировки скролла
    const blockScroll = () => {
      if (isMobile && isDropdownVisible) {
        // Сохраняем текущую позицию прокрутки
        const scrollY = window.scrollY;
        // Добавляем стили, блокирующие прокрутку
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
      } else {
        // Получаем позицию прокрутки из стиля
        const scrollY = document.body.style.top;
        // Возвращаем нормальное состояние
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        // Восстанавливаем позицию прокрутки
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
        }
      }
    };

    blockScroll();

    // Очистить блокировку при размонтировании
    return () => {
      if (document.body.style.position === "fixed") {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    };
  }, [isMobile, isDropdownVisible]);

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
          {/* Остальные пункты навигации */}
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
          {/* Остальные пункты навигации */}
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
  const renderUserActions = (headerId: string) => {
    if (isAuthenticated) {
      // Действия для авторизованных пользователей
      return (
        <div className={styles.userActions}>
          <button
            onClick={() => navigateTo("/chats")}
            className={styles.chatButton}
            aria-label="Open chats"
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
            className={styles.avatarContainer}
            ref={activeHeaderId === headerId ? avatarContainerRef : null}
          >
            <button
              className={styles.avatarButton}
              onClick={() => toggleDropdown(headerId)}
              aria-expanded={isDropdownVisible && activeHeaderId === headerId}
              aria-haspopup="true"
              aria-label="Open user menu"
            >
              <Avatar src={avatarSource} size={36} />
            </button>

            {/* Для десктопных устройств добавляем меню прямо здесь, управляемое через CSS */}
            {!isMobile && (
              <div className={styles.dropdownMenu}>
                <div className={styles.userProfile}>
                  <Avatar src={avatarSource} size={40} />
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {userProfile?.name} {userProfile?.surname}
                    </div>
                    <div className={styles.userRole}>Student</div>
                  </div>
                </div>

                <button
                  className={styles.dropdownItem}
                  onClick={() => navigateTo("/profile")}
                >
                  <ProfileIcon />
                  My Profile
                </button>

                <button
                  className={styles.dropdownItem}
                  onClick={() => navigateTo("/settings")}
                >
                  <SettingsIcon />
                  Settings
                </button>

                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <LogoutIcon />
                  Log Out
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
          {/* Start Learning кнопка - видимая только на больших экранах */}
          <Link href="/auth" className={styles.desktopAuthButton}>
            <button className={styles.joinButton}>Start Learning</button>
          </Link>

          {/* Кнопка бургер-меню - для мобильных устройств */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => toggleDropdown(headerId)}
            aria-expanded={isDropdownVisible && activeHeaderId === headerId}
            aria-haspopup="true"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.burgerIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      );
    }
  };

  // Рендерим само выпадающее меню отдельно
  const renderDropdownMenu = () => {
    // Для мобильных устройств с React-управлением видимостью
    if (isMobile) {
      if (!isDropdownVisible) return null;

      if (isAuthenticated) {
        return (
          <div
            className={`${styles.dropdownMenu} ${styles.dropdownMenuMobile}`}
            ref={dropdownRef}
          >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.userName}>
                  {userProfile?.name} {userProfile?.surname}
                </div>
                <div className={styles.userRole}>Student</div>
              </div>
              <div
                className={styles.mobileAvatarContainer}
                onClick={() => {
                  setDropdownVisible(false);
                  setActiveHeaderId(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.closeIconBurger}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.mobileNavLinks}>
              <button
                onClick={() => navigateTo("/home")}
                className={`${styles.dropdownItem} ${
                  pathname === "/home" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                Home
              </button>
              {/* Остальные пункты мобильного меню */}
              <button
                onClick={() => navigateTo("/teachers")}
                className={`${styles.dropdownItem} ${
                  pathname === "/teachers" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                Search Teachers
              </button>
              <button
                onClick={() => navigateTo("/lessons")}
                className={`${styles.dropdownItem} ${
                  pathname === "/lessons" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                My Lessons
              </button>
              <button
                onClick={() => navigateTo("/for-teachers")}
                className={`${styles.dropdownItem} ${
                  pathname === "/for-teachers" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                For Teachers
              </button>
              <button
                onClick={() => navigateTo("/chats")}
                className={`${styles.dropdownItem} ${
                  pathname === "/chats" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                Chats
              </button>
            </div>

            <button
              className={styles.dropdownItem}
              onClick={() => navigateTo("/profile")}
            >
              <ProfileIcon />
              My Profile
            </button>

            <button
              className={styles.dropdownItem}
              onClick={() => navigateTo("/settings")}
            >
              <SettingsIcon />
              Settings
            </button>

            <button className={styles.dropdownItem} onClick={handleLogout}>
              <LogoutIcon />
              Log Out
            </button>
          </div>
        );
      } else {
        // Меню для неавторизованных пользователей (мобильное)
        return (
          <div
            className={`${styles.dropdownMenu} ${styles.dropdownMenuMobile}`}
            ref={dropdownRef}
          >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.userName}>Menu</div>
              </div>
              <div
                className={styles.mobileAvatarContainer}
                onClick={() => {
                  setDropdownVisible(false);
                  setActiveHeaderId(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.closeIconBurger}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.mobileNavLinks}>
              <button
                onClick={() => navigateTo("/about")}
                className={`${styles.dropdownItem} ${
                  pathname === "/about" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                About Us
              </button>
              <button
                onClick={() => navigateTo("/support")}
                className={`${styles.dropdownItem} ${
                  pathname === "/support" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                Support
              </button>
              <button
                onClick={() => navigateTo("/privacy")}
                className={`${styles.dropdownItem} ${
                  pathname === "/privacy" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                Privacy
              </button>
              <button
                onClick={() => navigateTo("/contacts")}
                className={`${styles.dropdownItem} ${
                  pathname === "/contacts" ? styles.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.dropdownIcon}
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
                Contacts
              </button>
              <Link href="/auth" className={styles.mobileAuthButton}>
                Start Learning
              </Link>
            </div>
          </div>
        );
      }
    } else {
      // Для десктопа - ничего не возвращаем, меню будет находиться внутри avatarContainer
      // и управляться через CSS-hover
      return null;
    }
  };

  // Содержимое шапки с динамическими элементами
  const headerContent = (headerId: string) => (
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
        {renderUserActions(headerId)}
      </div>
    </div>
  );

  return (
    <>
      {/* Основная шапка, которая следует за скроллом */}
      <header ref={mainHeaderRef} className={styles.header}>
        {headerContent("main-header")}
      </header>

      {/* Фиксированная шапка, которая появляется, когда основная не видна */}
      <header
        className={`${styles.fixedHeader} ${
          showFixedHeader ? styles.fixedHeaderVisible : ""
        }`}
      >
        {headerContent("fixed-header")}
      </header>

      {/* Выносим выпадающее меню за пределы шапок, чтобы избежать дублирования */}
      {renderDropdownMenu()}
    </>
  );
};

export default Header;
