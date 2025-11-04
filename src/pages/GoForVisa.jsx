// src/pages/GoForVisa.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import bgImg from "../assets/visa-bg.jpg";
import hellovizaLogo from "../assets/helloviza-logo.png";
import { API_BASE } from "../utils/api";

/* =========================
   Config & small utilities
   ========================= */
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * 🔒 Force the real visa subdomain (absolute, not relative)
 * Ignore any env that might point to localhost for this page.
 */
const VISA_ORIGIN = "https://visa.helloviza.com";

/** Choose the landing path on the subdomain */
const VISA_DEFAULT_PATH = "/qr-visa?autostart=1"; // change to "/" if you prefer the root

const toDDMMMYYYY = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getUTCDate()).padStart(2, "0")}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
};

/** Build ABSOLUTE target like https://visa.helloviza.com/qr-visa?autostart=1&to=... */
function buildVisaAbsoluteUrl(currentSearch = "") {
  // Start from an absolute base (prevents any relative navigation)
  const baseAbs = new URL(VISA_DEFAULT_PATH, VISA_ORIGIN);

  // Merge the current page’s query (to/start/end/etc.) into the visa URL
  const incoming = new URLSearchParams(currentSearch || "");
  incoming.forEach((val, key) => {
    baseAbs.searchParams.set(key, val);
  });

  // Ensure autostart=1 present (idempotent)
  if (!baseAbs.searchParams.has("autostart")) {
    baseAbs.searchParams.set("autostart", "1");
  }

  // Final absolute URL
  return baseAbs.toString();
}

/** Local login with next=<ABSOLUTE VISA URL> */
function buildLoginUrlWithNext(nextAbs) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const u = new URL("/login", origin);
  u.searchParams.set("next", nextAbs);
  return u.toString();
}

/* =========================
   Component
   ========================= */
export default function GoForVisa() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Prefill panel (informational only)
  const prefill = useMemo(() => {
    const to = params.get("to") || "";
    const start = params.get("start") || "";
    const end = params.get("end") || "";
    return {
      to,
      startISO: start,
      endISO: end,
      startFmt: toDDMMMYYYY(start),
      endFmt: toDDMMMYYYY(end),
    };
  }, [params]);

  /** Click → check session → either go to VISA or go to local /login?next=<VISA> */
  const handleStart = useCallback(async () => {
    setApiError("");
    setLoading(true);
    try {
      // 1) Always compute an ABSOLUTE visa target (never relative)
      const visaTargetAbs = buildVisaAbsoluteUrl(
        typeof window !== "undefined" ? window.location.search : ""
      );

      // 2) Extra hardening — normalize again to the absolute origin
      const finalTarget = new URL(visaTargetAbs, VISA_ORIGIN).toString();

      // 3) Absolutely forbid localhost as target (belt & suspenders)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(finalTarget)) {
        throw new Error("Blocked a localhost redirect. Target must be visa.helloviza.com");
      }

      // 4) Check server-truth session
      const r = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
      const d = await r.json().catch(() => ({}));
      const hasSession = Boolean(r.ok && d && d.user);

      if (hasSession) {
        // 5a) Logged-in → handoff to subdomain
        window.location.assign(finalTarget);
      } else {
        // 5b) Not logged-in → go to local /login with next=<absolute visa URL>
        const loginUrl = buildLoginUrlWithNext(finalTarget);
        window.location.assign(loginUrl);
      }
    } catch (err) {
      setApiError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, []);

  /* =========================
     UI (Get Started card)
     ========================= */
  const currentTarget =
    typeof window !== "undefined"
      ? buildVisaAbsoluteUrl(window.location.search)
      : buildVisaAbsoluteUrl("");

  return (
    <div style={styles.fullPageBg(bgImg)}>
      <div style={styles.bannerArea}>
        <h1 style={styles.mainTitle}>Apply for Your Visa with Confidence</h1>
        <p style={styles.subtitle}>
          Fast, Secure, and Effortless Visa Applications Powered by{" "}
          <img
            src={hellovizaLogo}
            alt="Helloviza"
            style={{
              height: "1.2em",
              verticalAlign: "middle",
              margin: "0 0.18em",
              display: "inline-block",
            }}
          />
        </p>
      </div>

      <div style={styles.centerCard}>
        <div style={styles.stepContent}>
          <h2 style={styles.cardTitle}>Let’s Get Started</h2>
          <p style={styles.cardDesc}>
            Click below to begin your seamless visa journey. We’ll hand you off securely to{" "}
            <strong style={{ color: "#00477f" }}>{new URL(VISA_ORIGIN).host}</strong>.
          </p>

          {(prefill.to || prefill.startFmt || prefill.endFmt) && (
            <div style={styles.prefillNotice}>
              <strong>We’ll prefill from your search:</strong>{" "}
              {prefill.to && (
                <>
                  Destination: <b>{prefill.to}</b> •{" "}
                </>
              )}
              {(prefill.startFmt || prefill.endFmt) && (
                <>
                  Dates: <b>{prefill.startFmt || "—"}</b>
                  {prefill.endFmt ? " → " : ""}<b>{prefill.endFmt || ""}</b>
                </>
              )}
              <div style={{ marginTop: 6, opacity: 0.9 }}>You can still change these later.</div>
            </div>
          )}

          {apiError && <div style={styles.errorMsg}>{apiError}</div>}

          <button
            style={styles.ctaBtn}
            onClick={handleStart}
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Checking…" : "Start Visa Application"}
          </button>

          {/* Tiny debug line to confirm absolute target */}
          <div style={{ marginTop: "0.8rem", fontSize: "0.98rem", color: "#7a8594" }}>
            Target:&nbsp;
            <code style={{ wordBreak: "break-all" }}>{currentTarget}</code>
          </div>

          <div style={styles.infoFooter}>
            <span role="img" aria-label="secure">🔒</span>{" "}
            100% Secure &amp; Trusted Partner
          </div>
        </div>
      </div>

      <div style={{ height: "6vh" }} />
    </div>
  );
}

/* =========================
   Styles
   ========================= */
const styles = {
  fullPageBg: (img) => ({
    minHeight: "100vh",
    width: "100vw",
    background: img
      ? `linear-gradient(120deg,#d9eaf7 0%,#f8fcff 100%), url(${img}) center/cover no-repeat`
      : "#f7fafd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: baseFont,
    paddingBottom: "1rem",
    paddingTop: "5rem",
  }),
  bannerArea: { width: "100%", padding: "6vw 0 1.5vw 0", textAlign: "center" },
  mainTitle: {
    fontSize: "2.6rem",
    fontWeight: 800,
    margin: "0 0 .45rem 0",
    color: "#23456b",
    letterSpacing: "-.01em",
  },
  subtitle: {
    fontSize: "1.19rem",
    color: "#1c274c",
    fontWeight: 400,
    marginBottom: 0,
    letterSpacing: ".01em",
    lineHeight: 1.3,
  },
  centerCard: {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 6px 38px 0 rgba(44,44,44,0.12)",
    padding: "2.6rem 2.2rem 2.1rem",
    textAlign: "center",
    marginBottom: "3vw",
  },
  stepContent: { padding: "0 0 1.6rem 0" },
  cardTitle: {
    fontWeight: 700,
    fontSize: "2.1rem",
    margin: "0 0 1.2rem 0",
    color: "#23456b",
    letterSpacing: "-.01em",
  },
  cardDesc: {
    color: "#343a40",
    fontSize: "1.18rem",
    marginBottom: "1.3rem",
    fontWeight: 400,
    lineHeight: 1.45,
  },
  ctaBtn: {
    width: "100%",
    background: "linear-gradient(90deg,#00477f 0%,#2196f3 100%)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "1.28rem",
    border: "none",
    borderRadius: 10,
    padding: "1.06rem 0",
    margin: "1.2rem 0 .8rem",
    boxShadow: "0 3px 18px #7fbdff24",
    cursor: "pointer",
  },
  infoFooter: { marginTop: "1.1rem", fontSize: "1.07rem", color: "#8e949e" },
  prefillNotice: {
    background: "#eef6ff",
    border: "1px solid #d7e9ff",
    color: "#0d3a66",
    padding: "12px 14px",
    borderRadius: 10,
    textAlign: "left",
    marginBottom: 12,
  },
  errorMsg: {
    background: "#ffe6e6",
    color: "#e53935",
    borderRadius: 6,
    padding: "0.65rem 0.85rem",
    fontWeight: 600,
    fontSize: "1rem",
    margin: "1rem 0 .2rem",
    textAlign: "center",
  },
};
