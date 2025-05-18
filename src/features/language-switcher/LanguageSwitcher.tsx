"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import i18nConfig, { languageNames, locales } from "@/lib/i18n/config";
import styles from "./LanguageSwitcher.module.scss";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // 30 days
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;

    handleLanguageChange(newLocale);
  };

  return (
    <select
      value={currentLocale}
      onChange={handleSelectChange}
      className={styles.select}
    >
      {locales.map((lang) => (
        <option key={lang} value={lang}>
          {languageNames[lang as keyof typeof languageNames] || lang}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
