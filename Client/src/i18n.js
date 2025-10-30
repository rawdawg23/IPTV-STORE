import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files - make sure these paths are correct
import enTranslations from "./locales/en/translation.json";
import arTranslations from "./locales/ar/translation.json";
import frTranslations from "./locales/fr/translation.json";
import esTranslations from "./locales/es/translation.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  es: {
    translation: esTranslations,
  },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    // Optional: Add debug mode to see i18next logs
    // debug: true,
  });

export default i18n;
