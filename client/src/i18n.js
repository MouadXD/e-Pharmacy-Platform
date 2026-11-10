import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locale/en.json";
import fr from "./locale/fr.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

const Lang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: Lang,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
