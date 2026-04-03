// ------------------------------------------------------------
// 🌍 API Base URL Detection
// ------------------------------------------------------------
const DETECTED_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  ((window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://api.helloviza.com");

// Normalize once (trim + remove trailing slashes)
export const API_BASE = String(DETECTED_BASE || "").trim().replace(/\/+$/, "");

// ------------------------------------------------------------
// 🔧 URL join helper (prevents double slashes)
// ------------------------------------------------------------
function joinUrl(path = "") {
  const base = String(API_BASE || "").replace(/\/+$/, "");
  const p = String(path || "").trim();
  if (!p) return base;
  if (/^https?:\/\//i.test(p)) return p;
  return `${base}${p.startsWith("/") ? "" : "/"}${p}`;
}

// ------------------------------------------------------------
// 🌐 Unified response handler (safe JSON/text parsing)
// ------------------------------------------------------------
async function handle(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {
      try {
        const t = await res.text();
        if (t) msg = t;
      } catch {}
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined;

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return undefined;
    }
  }
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

// ------------------------------------------------------------
// 🧩 Headers builder — JSON only (NO Authorization header)
// ------------------------------------------------------------
function jsonHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(extra || {}),
  };
}

// ------------------------------------------------------------
// 🧩 Main API helper (cookie-only auth)
// ------------------------------------------------------------
export const api = {
  // Low-level: returns the raw Response (useful for downloads/uploads)
  raw: (path, opts = {}) => {
    const headers = { ...(opts.headers || {}) };
    return fetch(joinUrl(path), {
      credentials: "include",
      ...opts,
      headers,
    });
  },

  get: (path, opts = {}) =>
    fetch(joinUrl(path), {
      method: "GET",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
    }).then(handle),

  post: (path, body, opts = {}) =>
    fetch(joinUrl(path), {
      method: "POST",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(handle),

  put: (path, body, opts = {}) =>
    fetch(joinUrl(path), {
      method: "PUT",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(handle),

  patch: (path, body, opts = {}) =>
    fetch(joinUrl(path), {
      method: "PATCH",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(handle),

  delete: (path, opts = {}) =>
    fetch(joinUrl(path), {
      method: "DELETE",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
    }).then(handle),

  // Alias used across many codebases
  del: (path, opts = {}) =>
    fetch(joinUrl(path), {
      method: "DELETE",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
    }).then(handle),
};

// ------------------------------------------------------------
// 🧱 Endpoint Constants
// ------------------------------------------------------------
export const API = {
  PROFILE: "/api/profile",
  PROFILE_UPDATE: "/api/profile/update",
  DOCUMENTS: "/api/documents",
  VISA_HISTORY: "/api/visa-history",
  WALLET: "/api/wallet",
  WALLET_TXN: "/api/wallet/transaction",
  WISHLIST: "/api/wishlist",
  SAVED: "/api/saved",
  HISTORY: "/api/history",

  //Transfer
  TRANSFER_TAXI: "/api/transfer",

  // Admin
  ADMIN_PROFILES: "/api/admin/profiles",
  ADMIN_COUNTRY_PRICES: "/api/admin/country-prices",
  ADMIN_OFFERS: "/api/admin/offers",

  // Public (visa grid)
  COUNTRY_PRICES_PUBLIC: "/api/country-prices",
  ANNOUNCEMENT: "/api/announcement",
};
