// src/components/RedirectToVisaSubdomain.jsx
import { useEffect } from "react";

export default function RedirectToVisaSubdomain() {
  useEffect(() => {
    // Build final URL for subdomain, preserving query parameters
    const currentUrl = new URL(window.location.href);
    const query = currentUrl.search || "";
    const visaUrl = `https://visa.helloviza.com${query}`;

    // Instant redirect — no visual delay
    window.location.replace(visaUrl);
  }, []);

  // Return nothing (no visible content)
  return null;
}
