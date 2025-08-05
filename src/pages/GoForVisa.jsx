import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/visa-bg.jpg";
import hellovizaLogo from "../assets/helloviza-logo.png";
import { API_BASE_URL } from "../utils/api"; // Import your base URL

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const GoForVisa = ({ user }) => {
  const navigate = useNavigate();
  const [evmUrl, setEvmUrl] = useState(null);
  const [trackUrl, setTrackUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ====== Visa API Integration ======
  async function handleInitiateVisa() {
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        external_user_id: "febce517-f33c-3b1e-951f-7dc4183d8c30",
        token: "ajskhdiusatciusghfdwqhjfgwqhjgfsajkhcjkasgcjhg",
        host: "demo",
        cor: "",
        nationality: "",
        travelling_to: "",
        travelling_to_identity: "",
        no_of_applicants: 1,
        start_date: "",
        end_date: "",
      };
      // Always use API_BASE_URL for all fetch calls
      const res = await fetch(`${API_BASE_URL}/api/partner/initiate-visa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 1 && data.data?.evm_url) {
        setEvmUrl(data.data.evm_url);
        setTrackUrl(data.data.evm_track_url);
      } else {
        setApiError(data.message || JSON.stringify(data));
      }
    } catch (err) {
      setApiError("Network error: " + err.message);
    }
    setLoading(false);
  }

  // ====== Not logged in (show login prompt) ======
  if (!user) {
    return (
      <div style={styles.outerNoUser}>
        <div style={styles.noUserCard}>
          <h2 style={styles.title}>Login Required</h2>
          <p>Please log in to access the Visa application service.</p>
          <button
            onClick={() => navigate("/login")}
            style={styles.loginBtn}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // ====== Visa App: Fullscreen Iframe Mode with logo in subtitle ======
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
              style={{
                height: "1.7em",
                verticalAlign: "middle",
                margin: "0 0.24em",
                display: "inline-block",
              }}
            />
            for a seamless and distinguished experience.
          </p>
        </div>
        <iframe
          src={evmUrl}
          style={styles.fullScreenIframe}
          title="Visa Application"
          allowFullScreen
        />
        <div style={styles.afterIframeActionsFS}>
          <button
            style={styles.secondaryBtnFS}
            onClick={() => {
              navigate("/trackyourvisaapplication");
              // You can use React context or global state to pass trackUrl if needed!
            }}
          >
            Track Your Visa Application
          </button>
          <button
            style={styles.linkBtnFS}
            onClick={() => window.location.reload()}
          >
            Start New Application
          </button>
        </div>
      </div>
    );
  }

  // ====== "Get Started" Mode ======
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
          <h2 style={styles.cardTitle}>Let's Get Started</h2>
          <p style={styles.cardDesc}>
            Click the button below to launch your personalized visa application journey. <br />
            <span style={{ color: "#d06549", fontWeight: 700 }}>No paperwork, no hassle.</span>
          </p>
          {apiError && <div style={styles.errorMsg}>{apiError}</div>}
          <button
            style={styles.ctaBtn}
            onClick={handleInitiateVisa}
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="loader" style={styles.loader}></span>
                Starting...
              </span>
            ) : (
              <span>Start Visa Application</span>
            )}
          </button>
          <div style={styles.infoFooter}>
            <span role="img" aria-label="secure">🔒</span> 100% Secure &amp; Trusted Partner
          </div>
        </div>
      </div>
    </div>
  );
};

// ====== Styles ======
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
  },
  heroSection: {
    textAlign: "center",
    padding: "2rem 0 0.8rem 0",
    background: "transparent",
  },
  mainTitle: {
    fontSize: "2.6rem",
    fontWeight: 800,
    margin: "0rem 0 0.45rem 0",
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
  },
  afterIframeActionsFS: {
    position: "absolute",
    left: "50%",
    bottom: "32px",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "18px",
    zIndex: 10,
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
    transition: "background 0.16s",
  },
  linkBtnFS: {
    background: "none",
    color: "#0074D9",
    border: "none",
    fontWeight: 700,
    fontSize: "1.08rem",
    textDecoration: "underline",
    cursor: "pointer",
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
  bannerArea: {
    width: "100%",
    padding: "6vw 0 1.5vw 0",
    textAlign: "center",
  },
  centerCard: {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 6px 38px 0 rgba(44,44,44,0.12)",
    padding: "2.6rem 2.2rem 2.1rem 2.2rem",
    textAlign: "center",
    position: "relative",
    marginBottom: "3vw",
  },
  stepContent: {
    padding: "0 0 1.6rem 0",
  },
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
    background: "linear-gradient(90deg, #00477f 0%, #2196f3 100%)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "1.28rem",
    border: "none",
    borderRadius: 10,
    padding: "1.06rem 0",
    margin: "1.2rem 0 0.8rem 0",
    boxShadow: "0 3px 18px #7fbdff24",
    cursor: "pointer",
    transition: "background 0.18s",
    letterSpacing: ".03em",
  },
  infoFooter: {
    marginTop: "1.1rem",
    fontSize: "1.07rem",
    color: "#8e949e",
  },
  errorMsg: {
    background: "#ffe6e6",
    color: "#e53935",
    borderRadius: 6,
    padding: "0.65rem 0.85rem",
    fontWeight: 600,
    fontSize: "1rem",
    margin: "1rem 0 0.2rem 0",
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
    borderRadius: "18px",
    boxShadow: "0 6px 28px 0 rgba(44,44,44,0.09)",
    minWidth: 330,
    textAlign: "center",
  },
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
  loader: {
    display: "inline-block",
    width: 16,
    height: 16,
    border: "3px solid #fff",
    borderTop: "3px solid #2196f3",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    marginRight: 8,
    verticalAlign: "middle",
  }
};

// Loader keyframes (add in your global CSS!)
// @keyframes spin { 100% { transform: rotate(360deg); } }

export default GoForVisa;
