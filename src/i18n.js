import { createI18n } from "vue-i18n";
import pt from "./locales/pt.js";
import en from "./locales/en.js";
import es from "./locales/es.js";

// Get saved language or fallback to browser language, or 'pt'
const savedLocale = localStorage.getItem("musicroll_lang");
const navLang = navigator.language.split("-")[0];
const defaultLocale =
  savedLocale || (["pt", "en", "es"].includes(navLang) ? navLang : "pt");

const i18n = createI18n({
  legacy: false, // use Composition API
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: "pt",
  messages: { pt, en, es },
});

export default i18n;
