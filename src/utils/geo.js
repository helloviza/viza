// src/utils/geo.js

const GEO_COOKIE = 'viewerCountry';
const ONE_YEAR = 60 * 60 * 24 * 365;

/* ------------------------------------------------------------------
   🔗 API base
   Order: explicit backend origin → API base → hard fallback (HTTPS)
------------------------------------------------------------------ */
const API_BASE =
  process.env.REACT_APP_BACKEND_ORIGIN ||
  process.env.REACT_APP_API_BASE ||
  'https://api.helloviza.com';

/* ------------------------------------------------------------------
   🍪 Safe cookie setter
   - Domain: .helloviza.com in prod so all subdomains share it
   - SameSite=Lax keeps it sent on top-level navigations only
   - Secure on https
------------------------------------------------------------------ */
export function setViewerCountryCookie(code) {
  try {
    if (!code || typeof code !== 'string') return;
    const trimmed = code.trim().toUpperCase();
    const isHttps = window.location.protocol === 'https:';
    const isProdHost = /\.helloviza\.com$/i.test(window.location.hostname);
    const domain = isProdHost ? '; Domain=.helloviza.com' : '';
    const secure = isHttps ? '; Secure' : '';
    document.cookie = `${GEO_COOKIE}=${encodeURIComponent(
      trimmed
    )}; Max-Age=${ONE_YEAR}; Path=/${domain}; SameSite=Lax${secure}`;
  } catch {
    // no-op
  }
}

/* ------------------------------------------------------------------
   🍪 Read cookie value by name
------------------------------------------------------------------ */
export function getCookie(name) {
  const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[2]) : '';
}

/* ------------------------------------------------------------------
   📡 Init: fetch /api/geo -> set cookie -> push to dataLayer
   - Skips fetch if cookie already present
   - Uses no-store to prevent SPA HTML cache (304) from S3/CloudFront
   - Times out in 6s to avoid hanging
------------------------------------------------------------------ */
export async function initViewerCountry() {
  // 1) If already set, push and return
  const existing = getCookie(GEO_COOKIE);
  if (existing) {
    pushCountryToDataLayer(existing, 'cookie');
    return existing;
  }

  // 2) Fetch from backend
  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE}/api/geo`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      mode: 'cors',
      signal: controller.signal,
      // prevent caches from serving SPA HTML
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
      },
    });
    clearTimeout(to);

    if (!res.ok) throw new Error(`geo fetch failed: ${res.status}`);

    // Try parse JSON safely (if CDN served HTML accidentally, this will throw)
    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('geo parse failed');
    }

    const code =
      data && data.country ? String(data.country).toUpperCase() : 'ZZ';

    setViewerCountryCookie(code);
    pushCountryToDataLayer(code, 'fetch');
    return code;
  } catch {
    pushCountryToDataLayer('ZZ', 'error');
    return 'ZZ';
  }
}

/* ------------------------------------------------------------------
   📊 Push into GTM dataLayer
------------------------------------------------------------------ */
function pushCountryToDataLayer(code, source) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'hv_geo_ready',
      hv_viewer_country: code,
      hv_geo_source: source, // cookie | fetch | error
    });
  } catch {
    // no-op
  }
}
