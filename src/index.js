// helloviza-frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

/* ------------------------------------------------------------------
   ⚙️ Config
------------------------------------------------------------------ */
const GOOGLE_CLIENT_ID =
  "709917234172-qksoun2rn12ikrc4t7mft9hdsjepb731.apps.googleusercontent.com";

const ENABLE_SSO =
  (process.env.REACT_APP_ENABLE_SSO ?? "true").toLowerCase() === "true";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

/* ------------------------------------------------------------------
   🧭 Identify our backend
------------------------------------------------------------------ */
function isHvApi(input) {
  try {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : input?.url || "";
    const base = new URL(API_BASE);
    const full = new URL(url, window.location.origin);
    return full.origin === base.origin || url.startsWith("/api");
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------
   🚀 Patch window.fetch (safe)
------------------------------------------------------------------ */
(function patchFetch() {
  if (!ENABLE_SSO) return;
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const isApi = isHvApi(input);
    const opts = {
      ...init,
      credentials: "include",
      headers: new Headers(init.headers || {}),
    };

    // Add token header if cookie missing
    const localTok = localStorage.getItem("helloviza_token");
    if (isApi && localTok && !document.cookie.includes("token=")) {
      opts.headers.set("Authorization", `Bearer ${localTok}`);
    }

    try {
      const res = await nativeFetch(input, opts);
      if (res.status === 401) {
        console.warn("⚠️ 401 → Clearing stale auth");
        localStorage.removeItem("helloviza_token");
        localStorage.removeItem("helloviza_user");
      }
      return res;
    } catch (err) {
      console.error("❌ Fetch error:", err);
      throw err;
    }
  };
})();

/* ------------------------------------------------------------------
   🧩 Bootstrap App (Resilient)
------------------------------------------------------------------ */
async function bootstrap() {
  const localUser = localStorage.getItem("helloviza_user");
  const localToken = localStorage.getItem("helloviza_token");

  // Temporary fallback user while verifying
  if (localUser && localToken) {
    console.log("🔄 Restoring session from localStorage");
  }

  // Attempt to verify cookie/token with backend
  let verifiedUser = null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    verifiedUser = data?.user || null;

    // Sync token from cookie if present
    const cookieToken = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="));
    if (cookieToken) {
      const val = cookieToken.split("=")[1];
      if (val) localStorage.setItem("helloviza_token", val);
    }

    if (verifiedUser) {
      localStorage.setItem("helloviza_user", JSON.stringify(verifiedUser));
    }
  } catch (e) {
    console.warn("⚠️ bootstrap /me failed:", e.message);
  }

  // Only redirect to login if both checks fail
  if (!verifiedUser && !localUser) {
    console.warn("⚠️ No valid user found → forcing login");
    localStorage.removeItem("helloviza_user");
    localStorage.removeItem("helloviza_token");
  }

  const rootEl = document.getElementById("root");
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

/* ------------------------------------------------------------------
   🚫 Disable scroll restoration
------------------------------------------------------------------ */
if ("scrollRestoration" in window.history) {
  try {
    window.history.scrollRestoration = "manual";
  } catch {}
}

/* ------------------------------------------------------------------
   🚀 Start
------------------------------------------------------------------ */
bootstrap();
