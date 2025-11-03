// helloviza/client/src/utils/api.js
// ------------------------------------------------------------
// 🌍 API Base URL Detection
// ------------------------------------------------------------
export const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  ((window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://api.helloviza.com");

// ------------------------------------------------------------
// 🌐 Unified response handler
// ------------------------------------------------------------
async function handle(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? undefined : res.json();
}

// ------------------------------------------------------------
// 🧩 Headers builder — JSON only (NO Authorization header)
// ------------------------------------------------------------
function jsonHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };
}

// ------------------------------------------------------------
// 🧩 Main API helper (cookie-only auth)
// ------------------------------------------------------------
export const api = {
  get: (path, opts = {}) =>
    fetch(`${API_BASE}${path}`, {
      method: "GET",
      credentials: "include",            // send cookie
      headers: jsonHeaders(opts.headers),
    }).then(handle),

  post: (path, body, opts = {}) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(handle),

  put: (path, body, opts = {}) =>
    fetch(`${API_BASE}${path}`, {
      method: "PUT",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(handle),

  patch: (path, body, opts = {}) =>
    fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      credentials: "include",
      headers: jsonHeaders(opts.headers),
      body: body != null ? JSON.stringify(body) : undefined,
    }).then(handle),

  delete: (path, opts = {}) =>
    fetch(`${API_BASE}${path}`, {
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
};
