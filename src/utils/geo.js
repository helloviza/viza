// src/utils/geo.js

/** Cookie name + 1 year */
const GEO_COOKIE = 'viewerCountry';
const ONE_YEAR = 60 * 60 * 24 * 365;

/** Choose API base: prefer REACT_APP_API_BASE (api.helloviza.com), fallback BACKEND_ORIGIN, else same-origin */
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_ORIGIN ||
  '';

/** Read cookie by name */
export function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

/** Write viewerCountry cookie (Lax so auth works; domain=.helloviza.com on prod) */
export function setViewerCountryCookie(code) {
  try {
    if (!code) return;
    const c = String(code).trim().toUpperCase();
    const isHttps = window.location.protocol === 'https:';
    const isProd = /\.helloviza\.com$/i.test(window.location.hostname);
    const domain = isProd ? '; Domain=.helloviza.com' : '';
    const secure = isHttps ? '; Secure' : '';
    document.cookie = `${GEO_COOKIE}=${encodeURIComponent(
      c
    )}; Max-Age=${ONE_YEAR}; Path=/${domain}; SameSite=Lax${secure}`;
  } catch {}
}

/** Push to dataLayer for GTM */
function pushDL(code, source) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'hv_geo_ready',
      hv_viewer_country: code,
      hv_geo_source: source, // cookie|override|fetch|error
    });
  } catch {}
}

/**
 * Initialize viewerCountry:
 *  - Uses localStorage 'HV_DEBUG_COUNTRY' (manual override) if present
 *  - Else reads cookie (if exists)
 *  - Else fetches /api/geo and sets cookie
 * Returns the 2-letter country code.
 */
export async function initViewerCountry() {
  // 0) manual override for debugging
  const dbg = (localStorage.getItem('HV_DEBUG_COUNTRY') || '').trim().toUpperCase();
  if (/^[A-Z]{2}$/.test(dbg)) {
    setViewerCountryCookie(dbg);
    pushDL(dbg, 'override');
    return dbg;
  }

  // 1) already have cookie
  const existing = getCookie(GEO_COOKIE);
  if (existing) {
    pushDL(existing, 'cookie');
    return existing;
  }

  // 2) fetch from backend
  try {
    const url = `${API_BASE}/api/geo`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`geo ${res.status}`);
    const data = await res.json();
    const code = (data && data.country ? String(data.country) : 'ZZ').toUpperCase();
    setViewerCountryCookie(code);
    pushDL(code, 'fetch');
    return code;
  } catch {
    pushDL('ZZ', 'error');
    return 'ZZ';
  }
}
