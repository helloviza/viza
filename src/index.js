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
------------------------------------------------------------------ */
const GOOGLE_CLIENT_ID =
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

/* ------------------------------------------------------------------
   🌐 Auto-set language from viewerCountry (only if user never chose)
   - We first look for cookie (fast); if missing we await /api/geo.
   - We DO NOT override if localStorage:i18nextLng already exists.
------------------------------------------------------------------ */
(function bootstrapLanguageFromGeo() {
  try {
    const userChosen = (localStorage.getItem("i18nextLng") || "").trim();
    if (userChosen) return; // respect user preference

    // Try cookie quickly
    const fromCookie = getCookie("viewerCountry");
    if (fromCookie) {
      maybeSetLanguageFromCountry(fromCookie, "cookie");
    } else {
      // Populate cookie & DL, then decide language
      initViewerCountry().then((code) => {
        maybeSetLanguageFromCountry(code, "fetch");
      }).catch(() => {
        // keep current language if geo fails
      });
    }
  } catch {}
})();

function maybeSetLanguageFromCountry(countryCode, source) {
  const desired = countryToLang(countryCode);
  const current = (i18n.language || "en").slice(0, 2);
  if (current !== desired) {
    i18n.changeLanguage(desired).then(() => {
      applyHtmlLangDir(desired);
      pushDL("language_auto_set", {
        language_code: desired,
        previous_language: current,
        viewer_country: String(countryCode || "ZZ").toUpperCase(),
        hv_geo_source: source || "unknown",
      });
    }).catch(() => {
      applyHtmlLangDir(desired);
    });
  } else {
    // keep html attributes in sync anyway
    applyHtmlLangDir(desired);
  }
}

// Keep <html dir> synced if language changes later (e.g., header switcher)
i18n.on("languageChanged", (lng) => {
  applyHtmlLangDir(lng);
});

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

// ⬇️ Still call geo init so DL gets hv_geo_ready even if cookie existed
initViewerCountry();
