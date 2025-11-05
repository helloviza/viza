// src/pages/GoForVisa.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import bgImg from "../assets/visa-bg.jpg";
import hellovizaLogo from "../assets/helloviza-logo.png";

/* =========================
   Small utilities
   ========================= */
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const toDDMMMYYYY = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getUTCDate()).padStart(2, "0")}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
};

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

  /** Click → navigate internally to /go/visa (handoff page) */
  const handleStart = useCallback(() => {
    setApiError("");
    setLoading(true);
    try {
      // Go to internal handoff (VisaHandoff) preserving any query (?to&start&end…)
      const qs = typeof window !== "undefined" ? window.location.search || "" : "";
      window.location.assign("/go/visa" + qs);
    } catch (err) {
      setApiError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, []);

  // just for the tiny debug line
  const currentTarget =
    typeof window !== "undefined"
      ? "/go/visa" + (window.location.search || "")
      : "/go/visa";

  /* =========================
     UI (Get Started card)
     ========================= */
  return (
    <div style={styles.fullPageBg(bgImg)}>
      <div style={styles.bannerArea}>
        <h1 style={styles.mainTitle}>Apply for Your Visa with Confidence</h1>
        <p style={styles.subtitle}>
          Fast, Secure, and Effortless Visa Applications Powered by{" "}
          <img
            src={hellovizaLogo}
            alt="Helloviza"
            style={{ height: "1.2em", verticalAlign: "middle", margin: "0 0.18em", display: "inline-block" }}
          />
        </p>
      </div>

      <div style={styles.centerCard}>
        <div style={styles.stepContent}>
          <h2 style={styles.cardTitle}>Let’s Get Started</h2>
          <p style={styles.cardDesc}>
            Click below to begin your seamless visa journey. We’ll first take you to a secure
            handoff inside this site, then forward you to our visa portal as needed.
          </p>

        {(prefill.to || prefill.startFmt || prefill.endFmt) && (
          <div style={styles.prefillNotice}>
            <strong>We’ll prefill from your search:</strong>{" "}
            {prefill.to && <>Destination: <b>{prefill.to}</b> • </>}
            {(prefill.startFmt || prefill.endFmt) && <>Dates: <b>{prefill.startFmt || "—"}</b>{prefill.endFmt ? " → " : ""}<b>{prefill.endFmt || ""}</b></>}
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

          <div style={{ marginTop: "0.8rem", fontSize: "0.98rem", color: "#7a8594" }}>
            Handoff:&nbsp;<code style={{ wordBreak: "break-all" }}>{currentTarget}</code>
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
  mainTitle: { fontSize: "2.6rem", fontWeight: 800, margin: "0 0 .45rem 0", color: "#23456b", letterSpacing: "-.01em" },
  subtitle: { fontSize: "1.19rem", color: "#1c274c", fontWeight: 400, marginBottom: 0, letterSpacing: ".01em", lineHeight: 1.3 },
  centerCard: { width: "100%", maxWidth: 520, background: "#fff", borderRadius: 20, boxShadow: "0 6px 38px 0 rgba(44,44,44,0.12)", padding: "2.6rem 2.2rem 2.1rem", textAlign: "center", marginBottom: "3vw" },
  stepContent: { padding: "0 0 1.6rem 0" },
  cardTitle: { fontWeight: 700, fontSize: "2.1rem", margin: "0 0 1.2rem 0", color: "#23456b", letterSpacing: "-.01em" },
  cardDesc: { color: "#343a40", fontSize: "1.18rem", marginBottom: "1.3rem", fontWeight: 400, lineHeight: 1.45 },
  ctaBtn: { width: "100%", background: "linear-gradient(90deg,#00477f 0%,#2196f3 100%)", color: "#fff", fontWeight: 800, fontSize: "1.28rem", border: "none", borderRadius: 10, padding: "1.06rem 0", margin: "1.2rem 0 .8rem", boxShadow: "0 3px 18px #7fbdff24", cursor: "pointer" },
  infoFooter: { marginTop: "1.1rem", fontSize: "1.07rem", color: "#8e949e" },
  prefillNotice: { background: "#eef6ff", border: "1px solid #d7e9ff", color: "#0d3a66", padding: "12px 14px", borderRadius: 10, textAlign: "left", marginBottom: 12 },
  errorMsg: { background: "#ffe6e6", color: "#e53935", borderRadius: 6, padding: "0.65rem 0.85rem", fontWeight: 600, fontSize: "1rem", margin: "1rem 0 .2rem", textAlign: "center" },
};
