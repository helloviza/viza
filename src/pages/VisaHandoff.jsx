// src/pages/VisaHandoff.jsx
import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Force absolute hosts for handoff (both dev & prod).
 * If you ever need to change domains, do it here.
 */
const API_BASE =
  typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

// Always use absolute public hosts for login and visa
const WWW_HOST  = "https://www.helloviza.com";
const VISA_HOST = "https://visa.helloviza.com";
const VISA_PATH = "/qr-visa"; // change to "/" if you want root

export default function VisaHandoff() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  // Build absolute visa URL: https://visa.helloviza.com/qr-visa?autostart=1&...
  const buildVisaUrl = useCallback(() => {
    const target = new URL(VISA_PATH, VISA_HOST);
    const src = new URLSearchParams(location.search || "");
    // Ensure autostart=1; keep all incoming query params (to/start/end/etc.)
    if (!src.has("autostart")) src.set("autostart", "1");
    for (const [k, v] of src.entries()) target.searchParams.set(k, v);
    return target.toString();
  }, [location.search]);

  // Build absolute login URL on www with ?next=<ABSOLUTE VISA URL>
  const buildLoginUrl = useCallback(() => {
    const nextAbs = buildVisaUrl(); // already absolute
    const u = new URL("/login", WWW_HOST);
    u.searchParams.set("next", nextAbs);
    return u.toString();
  }, [buildVisaUrl]);

  useEffect(() => {
    // purge any stale client flags
    try {
      localStorage.removeItem("hv_user");
      sessionStorage.removeItem("hv_user");
    } catch {}

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/session`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.ok && data?.user) {
          // ✅ Logged in → go straight to visa subdomain (absolute)
          const target = buildVisaUrl();

          // Paranoid guard — do not allow localhost here
          if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(target)) {
            console.error("Blocked localhost redirect:", target);
            // Force absolute visa host again (shouldn't be needed)
            const forced = new URL(VISA_PATH, VISA_HOST).toString();
            window.location.replace(forced);
            return;
          }

          window.location.replace(target);
        } else {
          // ❌ Not logged in → go to absolute www login with ?next=<absolute visa url>
          window.location.replace(buildLoginUrl());
        }
      } catch {
        if (!cancelled) {
          window.location.replace(buildLoginUrl());
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [buildVisaUrl, buildLoginUrl]);

  return (
    <div style={s.wrap}>
      <h2>{checking ? "Checking your session…" : "Redirecting…"}</h2>
      <p>Please wait.</p>
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
