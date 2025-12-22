import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "@/src/locales/en/common.json";
import viTranslations from "@/src/locales/vi/common.json";

// Ensure translations are loaded
const resources = {
  en: {
    translation: enTranslations,
  },
  vi: {
    translation: viTranslations,
  },
};

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: typeof window !== "undefined" ? localStorage.getItem("i18nextLng") || "vi" : "vi",
      fallbackLng: "vi",
      debug: process.env.NODE_ENV === "development", // Enable debug in development
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      react: {
        useSuspense: false, // Disable suspense for Next.js compatibility
      },
      returnEmptyString: false, // Return key if translation not found
      returnNull: false, // Don't return null if translation not found
    });
}

export default i18n;