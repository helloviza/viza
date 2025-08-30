// helloviza-frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

const GOOGLE_CLIENT_ID =
  "709917234172-qksoun2rn12ikrc4t7mft9hdsjepb731.apps.googleusercontent.com";

// 🔧 feature flags / env (CRA-style)
const ENABLE_SSO =
  (process.env.REACT_APP_ENABLE_SSO ?? "true").toLowerCase() === "true";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5055";

/* ---------------- SSO handoff helpers ---------------- */

// 1) Save SSO token coming from /sso/consume redirect as a hash:  /page#sso=<JWT>
(function storeSSOTokenFromHash() {
  if (!ENABLE_SSO) return;
  const m = window.location.hash.match(/(?:^|#|&)sso=([^&]+)/);
  if (m) {
    try {
      const token = decodeURIComponent(m[1]);
      if (token) localStorage.setItem("helloviza_token", token);
    } catch {
      /* ignore */
    }
    // Clean the URL (remove #sso=...)
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }
})();

// Small helper: decide if a request points to our API
function isHvApi(input) {
  try {
    // Absolute URL?
    if (typeof input === "string" && /^https?:\/\//i.test(input)) {
      const u = new URL(input);
      const base = new URL(API_BASE);
      return u.origin === base.origin;
    }
    if (input instanceof URL) {
      const base = new URL(API_BASE);
      return input.origin === base.origin;
    }
  } catch {
    // fallthrough
  }
  // Relative URL: treat paths starting with /api as our backend
  const urlStr = typeof input === "string" ? input : String(input?.url || "");
  return urlStr.startsWith("/api");
}

// 2) Attach Authorization header & credentials only for our API
(function attachAuthHeader() {
  if (!ENABLE_SSO) return;
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    if (isHvApi(input)) {
      const headers = new Headers(init.headers || {});
      const tok = localStorage.getItem("helloviza_token");
      if (tok && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${tok}`);
      }
      return origFetch(input, {
        ...init,
        headers,
        credentials: init.credentials ?? "include",
      });
    }
    // Non-API calls unchanged
    return origFetch(input, init);
  };
})();

/* ---------------- misc ---------------- */

// Disable automatic scroll restoration by browser
if ("scrollRestoration" in window.history) {
  try {
    window.history.scrollRestoration = "manual";
  } catch {}
}

async function bootstrap() {
  // If SSO enabled, try to resolve current user via cookie
  if (ENABLE_SSO) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (data?.user) {
        // Keep compatibility with existing App.js which reads this
        localStorage.setItem("helloviza_user", JSON.stringify(data.user));
      }
    } catch {
      // ignore – UI can still show login if needed
    }
  }

  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("Root element #root not found");

  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

bootstrap();
