const VISA_ORIGIN =
  process.env.REACT_APP_VISA_ORIGIN || "https://visa.helloviza.com";

export function visaUrl(pathWithSearch = "/") {
  if (!pathWithSearch.startsWith("/")) pathWithSearch = "/" + pathWithSearch;
  return `${VISA_ORIGIN}${pathWithSearch}`;
}

/**
 * Resolve a final target path for visa:
 * Priority: explicit ?to=... (must start with "/") → env default → "/"
 */
export function resolveVisaPath(rawToParam) {
  if (typeof rawToParam === "string") {
    try {
      const decoded = decodeURIComponent(rawToParam);
      if (decoded.startsWith("/")) return decoded;
    } catch { /* ignore */ }
  }
  return process.env.REACT_APP_VISA_DEFAULT_PATH || "/";
}
