/* Это новая страница для авторизации и регистрации пользователей */
"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "../../utilities/api";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    surname: "",
    birthdate: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

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
      setMessage("Успешный вход. Токен: " + response.token);
      localStorage.setItem("userToken", response.token);
      router.push("/home");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка входа. Проверьте введённые данные.");
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiService.signUp({
        ...signUpData,
        birthdate: new Date(signUpData.birthdate),
      });
      setMessage("Успешная регистрация. Токен: " + response.token);
      localStorage.setItem("userToken", response.token);
      router.push("/home");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка регистрации. Проверьте введённые данные.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <button
          onClick={() => setIsLogin(true)}
          style={{
            flex: 1,
            padding: "10px",
            background: isLogin ? "#ccc" : "#fff",
          }}
        >
          Вход
        </button>
        <button
          onClick={() => setIsLogin(false)}
          style={{
            flex: 1,
            padding: "10px",
            background: !isLogin ? "#ccc" : "#fff",
          }}
        >
          Регистрация
        </button>
      </div>
      {message && <p>{message}</p>}
      {isLogin ? (
        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <br />
            <input
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Пароль:</label>
            <br />
            <input
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "10px" }}>
            Войти
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignUpSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Имя:</label>
            <br />
            <input
              type="text"
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Фамилия:</label>
            <br />
            <input
              type="text"
              value={signUpData.surname}
              onChange={(e) =>
                setSignUpData({ ...signUpData, surname: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Дата рождения:</label>
            <br />
            <input
              type="date"
              value={signUpData.birthdate}
              onChange={(e) =>
                setSignUpData({ ...signUpData, birthdate: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <br />
            <input
              type="email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Пароль:</label>
            <br />
            <input
              type="password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              required
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "10px" }}>
            Зарегистрироваться
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
