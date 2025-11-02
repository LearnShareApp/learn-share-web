/* Authentication page (simplified) */
"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "../../utilities/api";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Link from "next/link";

type Mode = "signin" | "signup";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    surname: "",
    birthdate: "",
    email: "",
    password: "",
  });
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
        birthdate: new Date(signUpData.birthdate).toISOString(),
      });
      localStorage.setItem("userToken", response.token);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.simpleCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Learn&Share</h1>
          <p className={styles.subtitle}>
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === "signin" ? styles.activeTab : ""
            }`}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === "signup" ? styles.activeTab : ""
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
              className={styles.formInput}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
              className={styles.formInput}
              autoComplete="current-password"
            />
            <div className={styles.formFooter}>
              <Link href="#" className={styles.forgotPassword}>
                Forgot your password?
              </Link>
            </div>
            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="First Name"
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, name: e.target.value })
                }
                required
                className={styles.formInput}
                autoComplete="given-name"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={signUpData.surname}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, surname: e.target.value })
                }
                required
                className={styles.formInput}
                autoComplete="family-name"
              />
            </div>
            <input
              type="date"
              placeholder="Date of Birth"
              value={signUpData.birthdate}
              onChange={(e) =>
                setSignUpData({ ...signUpData, birthdate: e.target.value })
              }
              required
              className={styles.formInput}
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
              required
              className={styles.formInput}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              required
              className={styles.formInput}
              autoComplete="new-password"
            />
            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
            <p className={styles.agreement}>
              By signing up, you agree to our{" "}
              <Link href="/privacy">Terms & Privacy Policy</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
