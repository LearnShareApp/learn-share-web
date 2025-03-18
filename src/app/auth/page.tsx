/* Authentication page for user login and registration */
"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "../../utilities/api";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Link from "next/link";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      router.push("/home");
    }

    // Определяем, является ли устройство мобильным
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
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
    <div className={styles.authPageWrapper}>
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
            <h1>Create Account</h1>
            {isMobile && (
              <p className={styles.mobileSwitch}>
                Already have an account?{" "}
                <button type="button" onClick={handleSignInClick}>
                  Sign In
                </button>
              </p>
            )}
            <div className={styles["form-row"]}>
              <input
                type="text"
                placeholder="First Name"
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, name: e.target.value })
                }
                required
                className={styles.formInput}
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
            />
            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
            <div className={styles.footerText}>
              <p>
                By signing up, you agree to our{" "}
                <Link href="/privacy">Terms & Privacy Policy</Link>
              </p>
            </div>
          </form>
        </div>
        <div
          className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
        >
          <form onSubmit={handleLoginSubmit} className={styles["auth-form"]}>
            <h1>Sign In</h1>
            {isMobile && (
              <p className={styles.mobileSwitch}>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </p>
            )}
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
              className={styles.formInput}
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
            />
            <Link href="#" className={styles.forgotPassword}>
              Forgot your password?
            </Link>
            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>
          </form>
        </div>
        {!isMobile && (
          <div className={styles["overlay-container"]}>
            <div className={styles.overlay}>
              <div
                className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}
              >
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us, please sign in with your personal
                  details
                </p>
                <button
                  className={styles.ghost}
                  onClick={handleSignInClick}
                  id="signIn"
                >
                  Sign In
                </button>
              </div>
              <div
                className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}
              >
                <h1>Hello, Friend!</h1>
                <p>
                  Enter your personal details and start your journey with us
                </p>
                <button
                  className={styles.ghost}
                  onClick={handleSignUpClick}
                  id="signUp"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
