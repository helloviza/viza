// helloviza/client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

/**
 * API base resolution:
 * - If REACT_APP_API_BASE is set, use it (overrides everything).
 * - If running on localhost / 127.0.0.1, use the local backend.
 * - Otherwise default to production API.
 */
const HOST = typeof window !== 'undefined' ? window.location.hostname : '';
const IS_LOCAL = HOST === 'localhost' || HOST === '127.0.0.1';
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (IS_LOCAL ? 'http://localhost:8080' : 'https://api.helloviza.com');

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Centralized fetch for API: always send cookies; attach Bearer if hv_token exists
  async function apiFetch(path, opts = {}) {
    const token = localStorage.getItem('hv_token');
    const headers = new Headers(opts.headers || {});
    headers.set('Accept', 'application/json');
    // Only set Content-Type if we're sending JSON (avoid messing with GETs)
    if (!headers.has('Content-Type') && opts.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include', // ensure cookie-based session works across origins
      ...opts,
      headers,
    });
    return res;
  }

  // Parse #sso token, stash to localStorage, strip hash from URL
  function consumeSsoTokenIfPresent() {
    try {
      const hash = window.location.hash || '';
      if (!hash.startsWith('#')) return null;
      const params = new URLSearchParams(hash.slice(1));
      const sso = params.get('sso');
      if (!sso) return null;

      localStorage.setItem('hv_token', sso);

      // remove only the sso fragment without reloading
      params.delete('sso');
      const rest = params.toString();
      const { pathname, search } = window.location;
      const newUrl = pathname + (search || '') + (rest ? '#' + rest : '');
      window.history.replaceState(null, '', newUrl);
      return sso;
    } catch {
      return null;
    }
  }

  // Ask backend who the current user is
  async function refresh() {
    try {
      const res = await apiFetch('/api/auth/me', { method: 'GET' });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const u = data?.user || data || null;
        setUser(u);
        if (u) {
          localStorage.setItem('hv_user', JSON.stringify(u));
          sessionStorage.setItem('hv_user', JSON.stringify(u));
        } else {
          localStorage.removeItem('hv_user');
          sessionStorage.removeItem('hv_user');
        }
      } else {
        setUser(null);
        localStorage.removeItem('hv_user');
        sessionStorage.removeItem('hv_user');
      }
    } catch {
      setUser(null);
    }
  }

  // Logout clears cookie server-side and local token/cache
  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    try {
      localStorage.removeItem('hv_token');
      localStorage.removeItem('helloviza_user');
      localStorage.removeItem('hv_user');
      sessionStorage.removeItem('hv_user');
    } catch {}
    setUser(null);
  }

  // Initial bootstrap
  useEffect(() => {
    (async () => {
      setLoading(true);
      consumeSsoTokenIfPresent();
      await refresh();
      setLoading(false);
    })();
  }, []);

  const value = useMemo(
    () => ({ user, loading, refresh, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Route guard: waits for /me; if unauthenticated, redirects to /login?next=<current>
 */
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // you can render a spinner instead

  if (!user) {
    const next = encodeURIComponent(location.pathname + (location.search || ''));
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}
