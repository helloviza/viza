// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Load bundled JSON namespaces
import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";

/** Flip <html> attributes when language changes */
function applyHtmlLangDir(lng) {
  try {
    const base = String(lng || "en").toLowerCase().slice(0, 2);
    const el = document.documentElement;
    el.setAttribute("lang", base);
    el.setAttribute("dir", base === "ar" ? "rtl" : "ltr");
  } catch {}
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ar: { common: arCommon },
    },
    // let detector pick; falls back to English
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    ns: ["common"],
    defaultNS: "common",
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "cookie", "querystring"],
      caches: ["localStorage"], // key: i18nextLng
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// keep <html> in sync with current language
applyHtmlLangDir(i18n.language);
i18n.on("languageChanged", applyHtmlLangDir);

export default i18n;
