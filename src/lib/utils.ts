import { locales } from "./i18n/config";

export const removeLangPrefix = (path: string) => {
  const parts = path.split("/");

  // Check if the first segment matches any language code in `locales`
  if (locales.includes(parts[1] as (typeof locales)[number])) {
    // Remove the language prefix
    return "/" + parts.slice(2).join("/");
  }

  // Return the path as-is if no language prefix
  return path;
};