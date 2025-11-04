// helloviza/client/src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useLocation, Navigate } from "react-router-dom";

/* ============================================================
   API base resolution (env-aware):
   - REACT_APP_API_BASE wins (useful for local overrides)
   - localhost/127.0.0.1 => http://localhost:8080
   - otherwise => https://api.helloviza.com
   ============================================================ */
const HOST = typeof window !== "undefined" ? window.location.hostname : "";
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";

export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (IS_LOCAL ? "http://localhost:8080" : "https://api.helloviza.com");

/* ============================================================
   Context
   ============================================================ */
const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

/* ============================================================
   Provider
   ============================================================ */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // server-truth only
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------
     Centralized fetch:
     - Always include credentials (cookies)
     - Attach Bearer hv_token if present
     - Set Accept: application/json
     - Set Content-Type only when body exists
     ------------------------------------------------------------ */
  const apiFetch = useCallback(async (path, opts = {}) => {
    const token = localStorage.getItem("hv_token");
    const headers = new Headers(opts.headers || {});
    headers.set("Accept", "application/json");
    if (!headers.has("Content-Type") && opts.body) {
      headers.set("Content-Type", "application/json");
    }
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...opts,
      headers,
    });
  }, []);

  /* ------------------------------------------------------------
     Consume SSO token if present
     - Supports #sso=... or ?sso=...
     - Saves to localStorage hv_token
     - Strips from URL without reload
     ------------------------------------------------------------ */
  const consumeSsoTokenIfPresent = useCallback(() => {
    try {
      let sso = null;

      // Hash: #sso=...
      const hash = window.location.hash || "";
      if (hash.startsWith("#")) {
        const hp = new URLSearchParams(hash.slice(1));
        sso = hp.get("sso");
        if (sso) {
          localStorage.setItem("hv_token", sso);
          hp.delete("sso");
          const rest = hp.toString();
          const newUrl =
            window.location.pathname +
            (window.location.search || "") +
            (rest ? "#" + rest : "");
          window.history.replaceState(null, "", newUrl);
          return sso;
        }
      }

      // Query: ?sso=...
      const sp = new URLSearchParams(window.location.search || "");
      const qsso = sp.get("sso");
      if (qsso) {
        localStorage.setItem("hv_token", qsso);
        sp.delete("sso");
        const newSearch = sp.toString();
        const newUrl =
          window.location.pathname +
          (newSearch ? "?" + newSearch : "") +
          (window.location.hash || "");
        window.history.replaceState(null, "", newUrl);
        return qsso;
      }

      return null;
    } catch {
      return null;
    }
  }, []);

  /* ------------------------------------------------------------
     Refresh session from server (source of truth)
     GET /api/auth/session => { user } | 401
     Also mirrors user to local/session storage for convenience,
     but never *reads* it to decide auth.
     ------------------------------------------------------------ */
  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/session", { method: "GET" });
      if (!res.ok) {
        setUser(null);
        try {
          localStorage.removeItem("hv_user");
          sessionStorage.removeItem("hv_user");
        } catch {}
        return;
      }
      const data = await res.json().catch(() => ({}));
      const u = data?.user || null;
      setUser(u);

      // Mirror user (optional convenience for other UI parts)
      if (u) {
        try {
          localStorage.setItem("hv_user", JSON.stringify(u));
          sessionStorage.setItem("hv_user", JSON.stringify(u));
        } catch {}
        // Opportunistically sync a cookie-issued token if backend sets one
        try {
          const c = (document.cookie || "").split("; ").find((x) => x.startsWith("token="));
          if (c) {
            const val = c.split("=")[1];
            if (val) localStorage.setItem("hv_token", val);
          }
        } catch {}
      } else {
        try {
          localStorage.removeItem("hv_user");
          sessionStorage.removeItem("hv_user");
        } catch {}
      }
    } catch {
      setUser(null);
    }
  }, [apiFetch]);

  /* ------------------------------------------------------------
     Logout: server + client cleanup
     ------------------------------------------------------------ */
  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {}
    try {
      localStorage.removeItem("hv_token");
      localStorage.removeItem("hv_user");
      sessionStorage.removeItem("hv_user");
    } catch {}
    setUser(null);
  }, [apiFetch]);

  /* ------------------------------------------------------------
     Initial bootstrap:
     - Consume SSO if present
     - Refresh session from server
     ------------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      consumeSsoTokenIfPresent();
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [consumeSsoTokenIfPresent, refresh]);

  const value = useMemo(
    () => ({ user, loading, refresh, logout }),
    [user, loading, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ============================================================
   Hook
   ============================================================ */
export function useAuth() {
  return useContext(AuthContext);
}

/* ============================================================
   Route guard:
   - Waits for server session load
   - If not authenticated, redirect to /login?next=<current>
   ============================================================ */
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner

  if (!user) {
    const next = encodeURIComponent(
      (location?.pathname || "/") + (location?.search || "")
    );
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}
