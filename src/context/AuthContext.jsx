// helloviza/client/src/context/AuthContext.jsx
'use strict';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5055';

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
    headers.set('Content-Type', 'application/json');

    // If we have a token (from #sso), send it; /api/auth/me will set cookie if missing
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include', // **critical** so the cookie is sent/received
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

      // remove the sso hash without reloading
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

  // Probe server truth
  async function refresh() {
    try {
      const res = await apiFetch('/api/auth/me', { method: 'GET' });
      const data = await res.json().catch(() => ({}));
      setUser(data?.user || null);
    } catch {
      setUser(null);
    }
  }

  // Logout clears cookie server-side and local token
  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    try {
      localStorage.removeItem('hv_token');
      localStorage.removeItem('hv_user'); // legacy UI-only cache
      sessionStorage.removeItem('hv_user');
    } catch {}
    setUser(null);
  }

  // Initial bootstrap:
  // 1) consume #sso (if any) so /me can set cookie
  // 2) call /me with credentials to get user
  useEffect(() => {
    (async () => {
      setLoading(true);
      consumeSsoTokenIfPresent();
      await refresh();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, loading, refresh, logout }), [user, loading]);

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

  if (loading) return null; // or a spinner component

  if (!user) {
    const next = encodeURIComponent(location.pathname + (location.search || ''));
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}
