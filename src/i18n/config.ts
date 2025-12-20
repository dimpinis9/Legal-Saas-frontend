import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import elTranslations from "./locales/el.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    el: {
      translation: elTranslations,
    },
  },
  lng: localStorage.getItem("language") || "el", // Default to Greek
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
