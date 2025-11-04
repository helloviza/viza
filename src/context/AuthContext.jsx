// helloviza/client/src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useLocation, Navigate } from 'react-router-dom';

/**
 * API base resolution:
 * - If REACT_APP_API_BASE is set, use it.
 * - If running on localhost / 127.0.0.1, use local.
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

  /**
   * Centralized fetch for API:
   * - Always send cookies
   * - Attach Bearer if hv_token exists
   */
  const apiFetch = useCallback(async (path, opts = {}) => {
    const token = localStorage.getItem('hv_token');
    const headers = new Headers(opts.headers || {});
    headers.set('Accept', 'application/json');

    // Only set Content-Type if we're sending a body (avoid for GETs with no body)
    if (!headers.has('Content-Type') && opts.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...opts,
      headers,
    });
  }, []);

  /**
   * Parse #sso token (if present), store as hv_token, then strip it from URL
   */
  const consumeSsoTokenIfPresent = useCallback(() => {
    try {
      const hash = window.location.hash || '';
      if (!hash.startsWith('#')) return null;
      const params = new URLSearchParams(hash.slice(1));
      const sso = params.get('sso');
      if (!sso) return null;

      localStorage.setItem('hv_token', sso);

      // strip only the sso fragment without reloading
      params.delete('sso');
      const rest = params.toString();
      const { pathname, search } = window.location;
      const newUrl = pathname + (search || '') + (rest ? '#' + rest : '');
      window.history.replaceState(null, '', newUrl);
      return sso;
    } catch {
      return null;
    }
  }, []);

  /**
   * Ask backend who the current user is (SESSION endpoint)
   * - Endpoint: /api/auth/session
   * - Expects: { user: {...} } or empty/401
   * - Also opportunistically sync token from cookie if backend sets one
   */
  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch('/api/auth/session', { method: 'GET' });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const u = data?.user || null;
        setUser(u);

        if (u) {
          try {
            localStorage.setItem('hv_user', JSON.stringify(u));
            sessionStorage.setItem('hv_user', JSON.stringify(u));
          } catch {}

          // opportunistically sync token from cookie if backend sets one
          try {
            const cookieTok = document.cookie.split('; ').find(c => c.startsWith('token='));
            if (cookieTok) {
              const val = cookieTok.split('=')[1];
              if (val) localStorage.setItem('hv_token', val);
            }
          } catch {}
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
  }, [apiFetch]);

  /**
   * Logout clears cookie server-side and local caches
   */
  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    try {
      localStorage.removeItem('hv_token');
      localStorage.removeItem('hv_user');
      sessionStorage.removeItem('hv_user');
    } catch {}
    setUser(null);
  }, [apiFetch]);

  /**
   * Initial bootstrap
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      consumeSsoTokenIfPresent();
      await refresh();
      setLoading(false);
    })();
  }, [consumeSsoTokenIfPresent, refresh]);

  const value = useMemo(
    () => ({ user, loading, refresh, logout }),
    [user, loading, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Route guard: waits for session; if unauthenticated, redirects to /login?next=<current>
 */
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Optionally render a spinner

  if (!user) {
    const next = encodeURIComponent(location.pathname + (location.search || ''));
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}
