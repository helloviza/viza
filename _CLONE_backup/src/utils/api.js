// Tries Vite env first, then CRA env, then defaults to 5055
export const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5055";

async function handle(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json())?.message || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

export const api = {
  get: (path, opts = {}) =>
    fetch(`${API_BASE}${path}`, { credentials: "include", ...opts }).then(handle),

  post: (path, body, opts = {}) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      ...opts,
    }).then(handle),
};
