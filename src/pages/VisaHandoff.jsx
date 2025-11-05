// src/pages/VisaHandoff.jsx
import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";

const API_BASE =
  typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

const VISA_HOST = "https://visa.helloviza.com";
const VISA_PATH = "/qr-visa"; // or "/" if you prefer root

// Short-lived flag keys
const VISA_FLOW_FLAG = "HV:VISA_FLOW";
const VISA_FLOW_TS   = "HV:VISA_FLOW_TS";
const FLAG_TTL_MS    = 2 * 60 * 1000; // 2 minutes

export default function VisaHandoff() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  // Build absolute visa URL (logged-in only)
  const buildVisaUrl = useCallback(() => {
    const target = new URL(VISA_PATH, VISA_HOST);
    const incoming = new URLSearchParams(location.search || "");
    if (!incoming.has("autostart")) incoming.set("autostart", "1");
    for (const [k, v] of incoming.entries()) target.searchParams.set(k, v);
    return target.toString();
  }, [location.search]);

  // Internal login with internal next back to this handoff
  const buildInternalLoginUrl = useCallback(() => {
    // Always go back to /go/visa after login (internal path only)
    const next = "/go/visa" + (location.search || "");
    const u = new URL(typeof window !== "undefined" ? "/login" : "/login", window.location.origin);
    u.searchParams.set("next", next);
    return u.toString();
  }, [location.search]);

  // Helpers to manage a short-lived “visa flow” flag
  const setVisaFlag = () => {
    try {
      sessionStorage.setItem(VISA_FLOW_FLAG, "1");
      sessionStorage.setItem(VISA_FLOW_TS, String(Date.now()));
    } catch {}
  };
  const clearVisaFlag = () => {
    try {
      sessionStorage.removeItem(VISA_FLOW_FLAG);
      sessionStorage.removeItem(VISA_FLOW_TS);
    } catch {}
  };
  const flagIsFresh = () => {
    try {
      const ts = Number(sessionStorage.getItem(VISA_FLOW_TS) || 0);
      return ts && (Date.now() - ts) < FLAG_TTL_MS;
    } catch { return false; }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.ok && data?.user) {
          // Logged in → clear flag (we're about to finish) and go to visa
          clearVisaFlag();
          const url = buildVisaUrl();
          window.location.replace(url);
        } else {
          // Not logged in → set short-lived flag and go to internal login with internal next
          setVisaFlag();
          const loginUrl = buildInternalLoginUrl();
          window.location.replace(loginUrl);
        }
      } catch {
        // On error, still funnel to login internally
        setVisaFlag();
        const loginUrl = buildInternalLoginUrl();
        window.location.replace(loginUrl);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    // Safety: expire stale flags if user lingers here
    const timer = setInterval(() => {
      if (!flagIsFresh()) clearVisaFlag();
    }, 15000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [buildVisaUrl, buildInternalLoginUrl]);

  return (
    <div style={s.wrap}>
      <h2>{checking ? "Checking your session…" : "Opening doors to new horizons—your next adventure awaits on our Visa booking page!"}</h2>
      <p>Rolling out the red carpet for your journey—just a moment as we arrange your travel details.</p>
    </div>
  );
}

const s = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    fontFamily: "'Barlow Condensed', Arial, sans-serif",
    color: "#00477f",
    textAlign: "center",
    padding: "1rem",
  },
};
