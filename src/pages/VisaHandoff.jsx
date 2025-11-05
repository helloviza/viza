// src/pages/VisaHandoff.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VISA_INTENT_KEY = "HV:VISA_INTENT_TS";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";
const INTENT_TTL_MS = 5 * 60 * 1000;

function resolveApiBase() {
  const fromEnv = process.env.REACT_APP_API_BASE;
  if (fromEnv) return fromEnv;

  // Avoid using global `location` directly (ESLint no-restricted-globals)
  const host =
    typeof window !== "undefined" && window.location
      ? window.location.hostname
      : "";

  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "http://localhost:8080" : "https://api.helloviza.com";
}

const API_BASE = resolveApiBase();

export default function VisaHandoff() {
  const navigate = useNavigate();
  const routerLoc = useLocation();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const hasFreshIntent = useMemo(() => {
    try {
      const ts = Number(sessionStorage.getItem(VISA_INTENT_KEY));
      return ts && Date.now() - ts <= INTENT_TTL_MS;
    } catch {
      return false;
    }
    // re-evaluate when route key changes (back/forward)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLoc.key]);

  // Read session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        if (!cancelled && r.ok) {
          const d = await r.json().catch(() => ({}));
          setUser(d?.user || null);
        }
      } catch {}
      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Optional auto-handoff: only if logged in AND fresh intent
  useEffect(() => {
    if (checking) return;

    if (!user) {
      navigate(`/login?next=/go/visa`, { replace: true });
      return;
    }

    if (hasFreshIntent) {
      try { sessionStorage.removeItem(VISA_INTENT_KEY); } catch {}
      // hard redirect (no ?autostart)
      window.location.href = "https://visa.helloviza.com";
    }
  }, [checking, user, hasFreshIntent, navigate]);

  const clearIntent = useCallback(() => {
    try { sessionStorage.removeItem(VISA_INTENT_KEY); } catch {}
    try {
      sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
      localStorage.removeItem(LOGIN_REDIRECT_KEY);
    } catch {}
    navigate("/go/visa", { replace: true });
  }, [navigate]);

  const continueManually = useCallback(() => {
    try { sessionStorage.removeItem(VISA_INTENT_KEY); } catch {}
    window.location.href = "https://visa.helloviza.com";
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "#00477f" }}>
        Checking session…
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", color: "#00477f" }}>
          <h2>Go for Visa</h2>
          <p>You need to log in to continue.</p>
          <button
            onClick={() => navigate("/login?next=/go/visa")}
            style={btn("#00477f", "#fff")}
          >
            Log in to continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <div style={card}>
        <h1 style={{ color: "#083b6e", marginTop: 0 }}>Go for Visa</h1>
        <p style={{ color: "#0e4b84" }}>You're logged in.</p>
        <p style={pill}>Auto-handoff is {hasFreshIntent ? "enabled" : "disabled"}.</p>
        <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
          <button onClick={continueManually} style={bigBtn("#0e477f", "#fff")}>
            Continue to Visa
          </button>
          <button onClick={() => navigate("/")} style={bigBtn("#d06549", "#fff")}>
            Back to Home
          </button>
        </div>
        {!hasFreshIntent && (
          <div style={{ marginTop: 16 }}>
            <button onClick={clearIntent} style={linkBtn}>
              Clear Visa Intent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== styles ===== */
const card = {
  width: "min(920px, 92vw)",
  background: "#fff",
  borderRadius: 18,
  padding: "28px 28px 32px",
  boxShadow: "0 18px 40px rgba(0,0,0,.10)",
  textAlign: "center",
};
const pill = {
  display: "inline-block",
  marginTop: 6,
  padding: "8px 12px",
  borderRadius: 999,
  background: "#edf4ff",
  color: "#1b5fb4",
  fontWeight: 700,
};
const btn = (bg, fg) => ({
  background: bg, color: fg, border: "none", borderRadius: 8, padding: ".7rem 1.1rem",
  fontWeight: 800, cursor: "pointer"
});
const bigBtn = (bg, fg) => ({
  background: bg, color: fg, border: "none", borderRadius: 12, padding: "1.1rem 1.6rem",
  fontWeight: 900, fontSize: "1.15rem", cursor: "pointer"
});
const linkBtn = {
  background: "transparent", border: "none", color: "#b54a40",
  textDecoration: "underline", cursor: "pointer", fontWeight: 800
};
