// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

/* ------------------------------------------------------------------
   ⚙️ Config
   - Keep Google Client ID overridable via env; fallback to known ID.
------------------------------------------------------------------ */
const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "709917234172-qksoun2rn12ikrc4t7mft9hdsjepb731.apps.googleusercontent.com";

/* ------------------------------------------------------------------
   🚫 Disable automatic scroll restoration (SPA-friendly)
------------------------------------------------------------------ */
if ("scrollRestoration" in window.history) {
  try {
    window.history.scrollRestoration = "manual";
  } catch {}
}

/* ------------------------------------------------------------------
   🚀 Mount App
   - Auth bootstrap now happens inside AuthContext (via /api/auth/me).
   - No global fetch monkey-patch here (api wrapper lives in AuthContext).
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
