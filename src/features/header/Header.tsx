"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import useUserProfile from "@/hooks/useUserProfile";
import { useState, useEffect, useRef } from "react";
import Avatar from "@/components/avatar/Avatar";
import {
  UserCircle2,
  Settings,
  LogOut,
  Home,
  Search,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Info,
  LifeBuoy,
  ShieldCheck,
  Mail,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useUserProfile();
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
            <Home className={styles.navIcon} />
            <span>Home</span>
          </Link>
          {/* Остальные пункты навигации */}
          <Link
            href="/teachers"
            className={`${styles.navLink} ${
              pathname === "/teachers" ? styles.active : ""
            }`}
          >
            <Search className={styles.navIcon} />
            <span>Search</span>
          </Link>
          <Link
            href="/lessons"
            className={`${styles.navLink} ${
              pathname === "/lessons" ? styles.active : ""
            }`}
          >
            <BookOpen className={styles.navIcon} />
            <span>Lessons</span>
          </Link>
          <Link
            href="/for-teachers"
            className={`${styles.navLink} ${
              pathname === "/for-teachers" ? styles.active : ""
            }`}
          >
            <GraduationCap className={styles.navIcon} />
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
            <Info className={styles.navIcon} />
            <span>About us</span>
          </Link>
          {/* Остальные пункты навигации */}
          <Link
            href="/support"
            className={`${styles.navLink} ${
              pathname === "/support" ? styles.active : ""
            }`}
          >
            <LifeBuoy className={styles.navIcon} />
            <span>Support</span>
          </Link>
          <Link
            href="/privacy"
            className={`${styles.navLink} ${
              pathname === "/privacy" ? styles.active : ""
            }`}
          >
            <ShieldCheck className={styles.navIcon} />
            <span>Privacy</span>
          </Link>
          <Link
            href="/contacts"
            className={`${styles.navLink} ${
              pathname === "/contacts" ? styles.active : ""
            }`}
          >
            <Mail className={styles.navIcon} />
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
            <MessageSquare className={styles.chatIcon} />
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
              <Avatar avatarId={userProfile?.avatar} size={36} />
            </button>

            {/* Для десктопных устройств добавляем меню прямо здесь, управляемое через CSS */}
            {!isMobile && (
              <div className={styles.dropdownMenu}>
                <div className={styles.userProfile}>
                  <Avatar avatarId={userProfile?.avatar} size={40} />
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {userProfile?.name} {userProfile?.surname}
                    </div>
                    <div className={styles.userRole}>Student</div>
                  </div>
                </div>

                <button
                  className={styles.dropdownItem}
                  onClick={() =>
                    userProfile && navigateTo(`/users/${userProfile.id}`)
                  }
                >
                  <UserCircle2 className={styles.dropdownIcon} />
                  My Profile
                </button>

                <button
                  className={styles.dropdownItem}
                  onClick={() => navigateTo("/settings")}
                >
                  <Settings className={styles.dropdownIcon} />
                  Settings
                </button>

                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <LogOut className={styles.dropdownIcon} />
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
            <Menu className={styles.burgerIcon} />
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
                <X className={styles.closeIconBurger} />
              </div>
            </div>

            <div className={styles.mobileNavLinks}>
              <button
                onClick={() => navigateTo("/home")}
                className={`${styles.dropdownItem} ${
                  pathname === "/home" ? styles.active : ""
                }`}
              >
                <Home className={styles.dropdownIcon} />
                Home
              </button>
              {/* Остальные пункты мобильного меню */}
              <button
                onClick={() => navigateTo("/teachers")}
                className={`${styles.dropdownItem} ${
                  pathname === "/teachers" ? styles.active : ""
                }`}
              >
                <Search className={styles.dropdownIcon} />
                Search Teachers
              </button>
              <button
                onClick={() => navigateTo("/lessons")}
                className={`${styles.dropdownItem} ${
                  pathname === "/lessons" ? styles.active : ""
                }`}
              >
                <BookOpen className={styles.dropdownIcon} />
                My Lessons
              </button>
              <button
                onClick={() => navigateTo("/for-teachers")}
                className={`${styles.dropdownItem} ${
                  pathname === "/for-teachers" ? styles.active : ""
                }`}
              >
                <GraduationCap className={styles.dropdownIcon} />
                For Teachers
              </button>
              <button
                onClick={() => navigateTo("/chats")}
                className={`${styles.dropdownItem} ${
                  pathname === "/chats" ? styles.active : ""
                }`}
              >
                <MessageSquare className={styles.dropdownIcon} />
                Chats
              </button>
            </div>

            <button
              className={styles.dropdownItem}
              onClick={() =>
                userProfile && navigateTo(`/users/${userProfile.id}`)
              }
            >
              <UserCircle2 className={styles.dropdownIcon} />
              My Profile
            </button>

            <button
              className={styles.dropdownItem}
              onClick={() => navigateTo("/settings")}
            >
              <Settings className={styles.dropdownIcon} />
              Settings
            </button>

            <button className={styles.dropdownItem} onClick={handleLogout}>
              <LogOut className={styles.dropdownIcon} />
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
                <X className={styles.closeIconBurger} />
              </div>
            </div>

            <div className={styles.mobileNavLinks}>
              <button
                onClick={() => navigateTo("/about")}
                className={`${styles.dropdownItem} ${
                  pathname === "/about" ? styles.active : ""
                }`}
              >
                <Info className={styles.dropdownIcon} />
                About Us
              </button>
              <button
                onClick={() => navigateTo("/support")}
                className={`${styles.dropdownItem} ${
                  pathname === "/support" ? styles.active : ""
                }`}
              >
                <LifeBuoy className={styles.dropdownIcon} />
                Support
              </button>
              <button
                onClick={() => navigateTo("/privacy")}
                className={`${styles.dropdownItem} ${
                  pathname === "/privacy" ? styles.active : ""
                }`}
              >
                <ShieldCheck className={styles.dropdownIcon} />
                Privacy
              </button>
              <button
                onClick={() => navigateTo("/contacts")}
                className={`${styles.dropdownItem} ${
                  pathname === "/contacts" ? styles.active : ""
                }`}
              >
                <Mail className={styles.dropdownIcon} />
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
