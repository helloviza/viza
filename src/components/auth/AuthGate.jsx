// src/auth/AuthGate.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Minimal fetch wrapper (no dependency on your api util to avoid cycles)
async function fetchMe() {
  const r = await fetch("/api/auth/me", { credentials: "include" });
  // /me should return 200 with a JSON user or 204/401 if not logged in.
  if (r.status === 204) return null;
  if (!r.ok) return null;
  try { return await r.json(); } catch { return null; }
}

function getCachedUser() {
  try {
    const raw = localStorage.getItem("hv_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedUser(u) {
  if (!u) {
    localStorage.removeItem("hv_user");
    // notify listeners (Header listens)
    window.dispatchEvent(new StorageEvent("storage", { key: "hv_user" }));
    return;
  }
  localStorage.setItem("hv_user", JSON.stringify(u));
  window.dispatchEvent(new StorageEvent("storage", { key: "hv_user" }));
}

/**
 * AuthGate defers any redirect until we’ve bootstrapped auth from:
 *   1) localStorage (instant) and then 2) /api/auth/me (cookie-validated).
 *
 * Usage:
 *   <AuthGate requireAuth><MyPrivatePage/></AuthGate>
 *   <AuthGate requireGuest><LoginPage/></AuthGate>
 */
export default function AuthGate({ requireAuth = false, requireGuest = false, children }) {
  const [booted, setBooted] = useState(false);
  const [user, setUser] = useState(() => getCachedUser());
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Step 1: optimistic from cache (already in state)
      // Step 2: confirm with server
      const serverUser = await fetchMe();

      if (cancelled) return;

      if (serverUser) {
        // prefer server truth and refresh cache
        setUser(serverUser);
        setCachedUser(serverUser);
      } else if (!user) {
        // truly unauthenticated
        setUser(null);
        setCachedUser(null);
      }
      setBooted(true);
    })();

    return () => { cancelled = true; };
  }, []); // run once

  // While we don’t know yet, render nothing (or a slim splash)
  if (!booted) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#00477f" }}>
        Checking session…
      </div>
    );
  }

  // Auth rules after bootstrap
  if (requireAuth && !user) {
    // preserve where we were headed
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (requireGuest && user) {
    // if already logged in, bounce away from login/signup
    const next = new URLSearchParams(location.search).get("next");
    return <Navigate to={next || "/"} replace />;
  }

  return <>{children}</>;
}
