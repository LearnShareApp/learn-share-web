"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import initTranslations from "./i18n";
import { Resource } from "i18next";

type TranslationsProviderProps = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
};

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  // Create a fresh i18n instance (to avoid sharing state across users on the server)
  const i18n = createInstance();

  // Initialize the i18n instance with the given locale, namespaces, and resources
  initTranslations(locale, namespaces, i18n, resources);

  // Wrap children in the I18nextProvider so they can use the useTranslation hook
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
