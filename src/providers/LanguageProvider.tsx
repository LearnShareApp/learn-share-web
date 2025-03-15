"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ruTranslation from "@/locales/ru";
import enTranslation from "@/locales/en";
import srTranslation from "@/locales/sr";

export type Language = "ru" | "en" | "sr";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof ruTranslation;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguage должен использоваться внутри LanguageProvider"
    );
  }
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  const t =
    language === "ru"
      ? ruTranslation
      : language === "en"
      ? enTranslation
      : srTranslation;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
