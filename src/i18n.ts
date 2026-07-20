import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // lazy loading
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ar",
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    debug: import.meta.env.DEV,

    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json`,
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
