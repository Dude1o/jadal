import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

function loadPersistedLanguage(): "en" | "ar" {
  try {
    const raw = localStorage.getItem("settings-store");
    if (raw) {
      const parsed = JSON.parse(raw);
      const lang = parsed?.state?.language;
      if (lang === "en" || lang === "ar") return lang;
    }
  } catch {}
  return "ar";
}

i18n
  .use(HttpBackend) // lazy loading
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: loadPersistedLanguage(),
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
