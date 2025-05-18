export const locales = ["en", "ru", "sr"] as const;
export const defaultLocale = "en" as const;
export const languageNames = {
  en: "English",
  ru: "Русский",
  sr: "Српски",
} as const;

const i18nConfig = {
  locales: locales,
  defaultLocale: defaultLocale,
  prefixDefault: false, // true - /en/about -> /about, false - /en/about -> /en/about
};

export default i18nConfig;
