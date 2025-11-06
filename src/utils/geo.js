// src/utils/geo.js
const GEO_COOKIE = 'viewerCountry';
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Safe cookie setter (domain .helloviza.com in prod; Lax so auth cookies still work)
 */
export function setViewerCountryCookie(code) {
  try {
    if (!code || typeof code !== 'string') return;
    const trimmed = code.trim().toUpperCase();
    const isHttps = window.location.protocol === 'https:';
    const isProdHost = /\.helloviza\.com$/i.test(window.location.hostname);
    const domain = isProdHost ? '; domain=.helloviza.com' : '';
    const secure = isHttps ? '; Secure' : '';
    document.cookie = `${GEO_COOKIE}=${encodeURIComponent(trimmed)}; Max-Age=${ONE_YEAR}; Path=/${domain}; SameSite=Lax${secure}`;
  } catch {}
}

/**
 * Read cookie value by name
 */
export function getCookie(name) {
  const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[2]) : '';
}

/**
 * Fetch /api/geo and push to dataLayer
 */
export async function initViewerCountry() {
  // if already set, don't refetch (cheap)
  const existing = getCookie(GEO_COOKIE);
  if (existing) {
    pushCountryToDataLayer(existing, 'cookie');
    return existing;
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_ORIGIN || ''}/api/geo`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('geo fetch failed');
    const data = await res.json();
    const code = (data && data.country) ? String(data.country).toUpperCase() : 'ZZ';
    setViewerCountryCookie(code);
    pushCountryToDataLayer(code, 'fetch');
    return code;
  } catch {
    pushCountryToDataLayer('ZZ', 'error');
    return 'ZZ';
  }
}

function pushCountryToDataLayer(code, source) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'hv_geo_ready',
      hv_viewer_country: code,
      hv_geo_source: source, // cookie|fetch|error
    });
  } catch {}
}
