/* Это новая страница для авторизации и регистрации пользователей */
"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "../../utilities/api";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

const AuthPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    surname: "",
    birthdate: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiService.login(loginData);
      localStorage.setItem("userToken", response.token);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiService.signUp({
        ...signUpData,
        birthdate: new Date(signUpData.birthdate),
      });
      localStorage.setItem("userToken", response.token);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div
      className={`${styles.container} ${
        isRightPanelActive ? styles["right-panel-active"] : ""
      }`}
      id="container"
    >
      <div
        className={`${styles["form-container"]} ${styles["sign-up-container"]}`}
      >
        <form onSubmit={handleSignUpSubmit} className={styles["auth-form"]}>
          <h1>Создать аккаунт</h1>
          <div className={styles["social-container"]}>
            <a href="#" className={styles.social}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span>или используйте ваш email для регистрации</span>
          <input
            type="text"
            placeholder="Имя"
            value={signUpData.name}
            onChange={(e) =>
              setSignUpData({ ...signUpData, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={(e) =>
              setSignUpData({ ...signUpData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={signUpData.password}
            onChange={(e) =>
              setSignUpData({ ...signUpData, password: e.target.value })
            }
            required
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
      <div
        className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
      >
        <form onSubmit={handleLoginSubmit} className={styles["auth-form"]}>
          <h1>Вход</h1>
          <div className={styles["social-container"]}>
            <a href="#" className={styles.social}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span>или используйте ваш аккаунт</span>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />
          <a href="#">Забыли пароль?</a>
          <button type="submit">Войти</button>
        </form>
      </div>
      <div className={styles["overlay-container"]}>
        <div className={styles.overlay}>
          <div
            className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}
          >
            <h1>С возвращением!</h1>
            <p>Чтобы оставаться на связи, войдите с вашими личными данными</p>
            <button
              className={styles.ghost}
              onClick={handleSignInClick}
              id="signIn"
            >
              Войти
            </button>
          </div>
          <div
            className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}
          >
            <h1>Привет, друг!</h1>
            <p>Введите ваши личные данные и начните путешествие с нами</p>
            <button
              className={styles.ghost}
              onClick={handleSignUpClick}
              id="signUp"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
