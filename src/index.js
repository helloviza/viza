// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

// 🔤 i18n bootstrap (must exist: src/i18n.js)
import "./i18n";
import i18n from "i18next";

// 🌍 geo + lang helpers
import { initViewerCountry, getCookie } from "./utils/geo";
import { applyHtmlLangDir, countryToLang, pushDL } from "./utils/lang";

/* ------------------------------------------------------------------
   ⚙️ Config
   - Prefer Vite env first (VITE_GOOGLE_CLIENT_ID)
   - Fallback to CRA env (REACT_APP_GOOGLE_CLIENT_ID)
------------------------------------------------------------------ */
const GOOGLE_CLIENT_ID =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID) ||
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "709917234172-qksoun2rn12ikrc4t7mft9hdsjepb731.apps.googleusercontent.com";

/* ------------------------------------------------------------------
   🚫 SPA scroll restoration
------------------------------------------------------------------ */
if ("scrollRestoration" in window.history) {
  try {
    window.history.scrollRestoration = "manual";
  } catch {}
}

/* ------------------------------------------------------------------
   🔤 Ensure <html> has correct lang/dir immediately
------------------------------------------------------------------ */
applyHtmlLangDir(i18n.language || "en");

// Keep <html dir> synced if language changes later (e.g., header switcher)
i18n.on("languageChanged", (lng) => {
  applyHtmlLangDir(lng);
});

/* ------------------------------------------------------------------
   🌐 Auto-set language from viewerCountry (only if user never chose)
   - We first look for cookie (fast); if missing we await /api/geo.
   - We DO NOT override if localStorage:i18nextLng already exists.
------------------------------------------------------------------ */
(function bootstrapLanguageFromGeo() {
  try {
    const userChosen = (localStorage.getItem("i18nextLng") || "").trim();
    if (userChosen) return; // respect user preference

    const fromCookie = getCookie("viewerCountry");
    if (fromCookie) {
      maybeSetLanguageFromCountry(fromCookie, "cookie");
    } else {
      initViewerCountry()
        .then((code) => {
          maybeSetLanguageFromCountry(code, "fetch");
        })
        .catch(() => {
          // keep current language if geo fails
        });
    }
  } catch {}
})();

function maybeSetLanguageFromCountry(countryCode, source) {
  const desired = countryToLang(countryCode);
  const current = (i18n.language || "en").slice(0, 2);
  if (current !== desired) {
    i18n
      .changeLanguage(desired)
      .then(() => {
        applyHtmlLangDir(desired);
        pushDL("language_auto_set", {
          language_code: desired,
          previous_language: current,
          viewer_country: String(countryCode || "ZZ").toUpperCase(),
          hv_geo_source: source || "unknown",
        });
      })
      .catch(() => {
        applyHtmlLangDir(desired);
      });
  } else {
    applyHtmlLangDir(desired);
  }
}

/* ------------------------------------------------------------------
   🚀 Mount App
------------------------------------------------------------------ */
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);

// 🔔 Fire geo init for analytics (DL) even if cookie already existed
initViewerCountry();
