import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImg from "../assets/visa-bg.jpg";
import hellovizaLogo from "../assets/helloviza-logo.png";
import { API_BASE } from "../utils/api"; // <- matches your utils/api exports

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// --- tiny helpers -----------------------------------------------------------
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function toDDMMMYYYY(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mon = MONTHS[d.getUTCMonth()];
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mon}-${yyyy}`;
}

// ----------------------------------------------------------------------------
export default function GoForVisa({ user }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [evmUrl, setEvmUrl] = useState(null);
  const [trackUrl, setTrackUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // optional prefill coming from your search bar
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

  async function handleInitiateVisa() {
    setLoading(true);
    setApiError("");

    try {
      // NOTE: keep your existing ids/tokens here (demo placeholders below)
      const payload = {
        external_user_id: "febce587-f33c-321e-951f-7dc4183d8c30",
        token: "ajskhdiusatciusghfdwqhjfgwqhjgfsajkhcjkasgcjhg",
        host: "demo",
        cor: "",
        nationality: "",
        travelling_to: prefill.to || "",
        travelling_to_identity: "",
        no_of_applicants: 1,
        start_date: prefill.startFmt,
        end_date: prefill.endFmt,
      };

      // Always call your backend – never Visaero directly from the browser
      const res = await fetch(`${API_BASE}/api/partner/initiate-visa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.details?.message ||
          data?.message ||
          data?.error ||
          `HTTP ${res.status}`
        );
      }

      // Visaero success: { status: 1, data: { evm_url, evm_track_url, ... } }
      const ok = data?.status === 1;
      const url = data?.data?.evm_url || data?.data?.evmUrl || null;
      const turl = data?.data?.evm_track_url || data?.data?.evmTrackUrl || null;

      if (!ok || !url) {
        throw new Error(data?.message || "Visaero did not return a launch URL.");
      }

      setEvmUrl(url);
      setTrackUrl(turl || null);
    } catch (err) {
      setApiError(
        typeof err?.message === "string" ? err.message : "Failed to start visa application."
      );
    } finally {
      setLoading(false);
    }
  }

  // --- not logged in: gentle prompt -----------------------------------------
  if (!user) {
    return (
      <div style={styles.outerNoUser}>
        <div style={styles.noUserCard}>
          <h2 style={styles.title}>Login Required</h2>
          <p>Please log in to access the Visa application service.</p>
          <button onClick={() => navigate("/login?next=/go-for-visa")} style={styles.loginBtn}>
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // --- fullscreen Visaero iframe once we have a URL --------------------------
  if (evmUrl) {
    return (
      <div style={styles.fullScreenWrapper}>
        <div style={styles.heroSection}>
          <h1 style={styles.mainTitle}>Complete Your Visa Application</h1>
          <p style={{ ...styles.subtitle, fontWeight: 400 }}>
            Welcome to your secure visa application suite, meticulously powered by{" "}
            <img
              src={hellovizaLogo}
              alt="Helloviza"
              style={{ height: "1.7em", verticalAlign: "middle", margin: "0 0.24em", display: "inline-block" }}
            />
            for a seamless and distinguished experience.
          </p>
        </div>

        <iframe
          key={evmUrl}
          src={evmUrl}
          title="Visa Application"
          style={styles.fullScreenIframe}
          allowFullScreen
        />

        <div style={styles.afterIframeActionsFS}>
          {trackUrl && (
            <button
              style={styles.secondaryBtnFS}
              onClick={() => navigate("/trackyourvisaapplication", { state: { trackUrl } })}
            >
              Track Your Visa Application
            </button>
          )}
          <button style={styles.linkBtnFS} onClick={() => window.location.reload()}>
            Start New Application
          </button>
          <a href={evmUrl} target="_blank" rel="noopener noreferrer" style={styles.linkBtnFS}>
            Open in New Tab
          </a>
        </div>
      </div>
    );
  }

  // --- “Get Started” screen --------------------------------------------------
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
          <h2 style={styles.cardTitle}>Let's Get Started</h2>
          <p style={styles.cardDesc}>
            Click the button below to launch your personalized visa application journey. <br />
            <span style={{ color: "#d06549", fontWeight: 700 }}>No paperwork, no hassle.</span>
          </p>

          {(prefill.to || prefill.startFmt || prefill.endFmt) && (
            <div style={styles.prefillNotice}>
              <strong>We’ll prefill from your search:</strong>{" "}
              {prefill.to && <>Destination: <b>{prefill.to}</b> • </>}
              {(prefill.startFmt || prefill.endFmt) && (
                <>Dates: <b>{prefill.startFmt || "—"}</b>{prefill.endFmt ? " → " : ""}<b>{prefill.endFmt || ""}</b></>
              )}
              <div style={{ marginTop: 6, opacity: 0.9 }}>You can still change these on the next page.</div>
            </div>
          )}

          {apiError && <div style={styles.errorMsg}>{apiError}</div>}

          <button style={styles.ctaBtn} onClick={handleInitiateVisa} disabled={loading}>
            {loading ? <span>Starting…</span> : <span>Start Visa Application</span>}
          </button>

          <div style={styles.infoFooter}>
            <span role="img" aria-label="secure">🔒</span> 100% Secure &amp; Trusted Partner
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------- styles --------------------------------------
const styles = {
  fullScreenWrapper: {
    minHeight: "100vh",
    width: "100vw",
    background: "#f7fafd",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    position: "relative",
    fontFamily: baseFont,
    paddingTop: 120,
    zIndex: 0, // ensure the iframe can sit above other page layers
  },
  // Important: prevent this decorative block from intercepting clicks
  heroSection: {
    textAlign: "center",
    padding: "2rem 0 .8rem 0",
    background: "transparent",
    pointerEvents: "none",
  },
  mainTitle: {
    fontSize: "2.6rem",
    fontWeight: 800,
    margin: "-4rem 0 .45rem 0",
    color: "#23456b",
    letterSpacing: "-.01em",
  },
  subtitle: { fontSize: "1.19rem", color: "#1c274c", fontWeight: 400, marginBottom: 0, letterSpacing: ".01em", lineHeight: 1.3 },

  // Critical: make iframe the click target
  fullScreenIframe: {
    border: "none",
    width: "100vw",
    height: "100vh",
    minHeight: 600,
    margin: 0,
    padding: 0,
    display: "block",
    background: "#fcfdfe",
    marginTop: 28,
    marginBottom: 20,
    position: "relative",
    zIndex: 1,
    pointerEvents: "auto",
  },

  // Do not block clicks to the iframe; re-enable on children
  afterIframeActionsFS: {
    position: "absolute",
    left: "50%",
    bottom: 32,
    transform: "translateX(-50%)",
    display: "flex",
    gap: 18,
    zIndex: 10,
    pointerEvents: "none",
  },
  secondaryBtnFS: {
    background: "#e3f2fd",
    color: "#00477f",
    border: "none",
    fontWeight: 700,
    borderRadius: 8,
    fontSize: "1.08rem",
    padding: "0.98rem 2.4rem",
    cursor: "pointer",
    pointerEvents: "auto",
  },
  linkBtnFS: {
    background: "none",
    color: "#0074D9",
    border: "none",
    fontWeight: 700,
    fontSize: "1.08rem",
    textDecoration: "underline",
    cursor: "pointer",
    pointerEvents: "auto",
  },

  fullPageBg: (img) => ({
    minHeight: "100vh",
    width: "100vw",
    background: img
      ? `linear-gradient(120deg, #d9eaf7 0%, #f8fcff 100%), url(${img}) center/cover no-repeat`
      : "#f7fafd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: baseFont,
    paddingBottom: "1rem",
    paddingTop: "5rem",
  }),
  bannerArea: { width: "100%", padding: "6vw 0 1.5vw 0", textAlign: "center" },
  centerCard: {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 6px 38px 0 rgba(44,44,44,0.12)",
    padding: "2.6rem 2.2rem 2.1rem",
    textAlign: "center",
    position: "relative",
    marginBottom: "3vw",
  },
  stepContent: { padding: "0 0 1.6rem 0" },
  cardTitle: { fontWeight: 700, fontSize: "2.1rem", margin: "0 0 1.2rem 0", color: "#23456b", letterSpacing: "-.01em" },
  cardDesc: { color: "#343a40", fontSize: "1.18rem", marginBottom: "1.3rem", fontWeight: 400, lineHeight: 1.45 },
  ctaBtn: {
    width: "100%",
    background: "linear-gradient(90deg, #00477f 0%, #2196f3 100%)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "1.28rem",
    border: "none",
    borderRadius: 10,
    padding: "1.06rem 0",
    margin: "1.2rem 0 .8rem",
    boxShadow: "0 3px 18px #7fbdff24",
    cursor: "pointer",
    letterSpacing: ".03em",
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

  outerNoUser: {
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
    fontFamily: baseFont,
  },
  noUserCard: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: 18,
    boxShadow: "0 6px 28px 0 rgba(44,44,44,0.09)",
    minWidth: 330,
    textAlign: "center",
  },
  title: { marginTop: 0, marginBottom: 10 },
  loginBtn: {
    marginTop: 20,
    background: "linear-gradient(90deg,#00477f,#2196f3)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.12rem",
    border: "none",
    borderRadius: 8,
    padding: "0.75rem 2.1rem",
    cursor: "pointer",
    boxShadow: "0 1px 7px #b8d6ff1a",
  },
};
