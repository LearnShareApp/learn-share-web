import { Resource, createInstance, i18n } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import i18nConfig from "./config";

export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource
) {
  // If no instance is provided, create a new one
  i18nInstance = i18nInstance || createInstance();

  // Add React integration plugin to i18n
  i18nInstance.use(initReactI18next);

  // If no resources are passed, dynamically load them from the file system
  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/lib/i18n/locales/${language}/${namespace}.json`)
        // This function dynamically loads a JSON file for a specific language and namespace
      )
    );
  }

  // Initialize the i18n instance with config options
  await i18nInstance.init({
    lng: locale, // Active language
    resources, // If provided, use these resources directly
    fallbackLng: i18nConfig.defaultLocale, // Fallback language if translation is missing
    supportedLngs: i18nConfig.locales, // Allowed languages
    defaultNS: namespaces[0], // Default namespace
    fallbackNS: namespaces[0], // Fallback namespace (same as default)
    ns: namespaces, // Namespaces to load
    preload: resources ? [] : i18nConfig.locales, // If no resources were passed, preload all locales
  });

  // Return the initialized i18n instance, its resource store, and the translation function
  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
