// client/src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

/** Single source of truth for redirect storage */
const LOGIN_REDIRECT_KEY = "postLoginRedirect";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    country: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  /** -------- Redirect helpers -------- */
  function normalizeNext(urlish) {
    try {
      const u = new URL(urlish, window.location.origin);
      // Only allow same-origin paths
      let path = u.pathname + (u.search || "");
      // If target is /go-for-visa, ensure autostart=1 once
      if (u.pathname === "/go-for-visa") {
        const sp = new URLSearchParams(u.search);
        if (!sp.has("autostart")) sp.set("autostart", "1");
        path = u.pathname + "?" + sp.toString();
      }
      return path.startsWith("/") ? path : "/";
    } catch {
      return typeof urlish === "string" && urlish.startsWith("/") ? urlish : "/";
    }
  }

  function stashRedirectFromQuery() {
    const sp = new URLSearchParams(location.search);
    const qFrom = sp.get("from");
    const qNext = sp.get("next");
    const candidate = qFrom || qNext;
    if (candidate) {
      const normalized = normalizeNext(candidate);
      try {
        sessionStorage.setItem(LOGIN_REDIRECT_KEY, normalized);
      } catch {}
    }
  }

  function popRedirectOrHome() {
    let next = "/";
    try {
      const saved = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
      if (saved) next = normalizeNext(saved);
      sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
    } catch {}
    // tiny defer to avoid any race with header state
    setTimeout(() => navigate(next, { replace: true }), 0);
  }

  /** On arrival, capture ?from= or ?next= */
  useEffect(() => {
    stashRedirectFromQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  /** If already signed-in (local state) and we have a redirect saved, go there */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("helloviza_user") || localStorage.getItem("hv_user") || sessionStorage.getItem("hv_user");
      const hasNext = !!sessionStorage.getItem(LOGIN_REDIRECT_KEY);
      if (stored && hasNext) popRedirectOrHome();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** -------- OTP stubs (backed by your /api endpoints) -------- */
  async function sendOtp() {
    setError("");
    if (!form.email) {
      setError("Please enter your email to receive OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5055/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5055/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");
      setOtpVerified(true);
    } catch (err) {
      setError(err.message);
      setOtpVerified(false);
    } finally {
      setLoading(false);
    }
  }

  /** -------- Submit (fake auth for now) -------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !otpVerified) {
      setError("Please verify your email OTP before signing up.");
      return;
    }

    // Replace with real auth; we persist minimal user for downstream flows
    const userData = {
      name: form.firstName ? `${form.firstName} ${form.lastName}` : "User",
      email: form.email,
    };
    try {
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));
    } catch {}

    if (onLogin) onLogin(userData);
    popRedirectOrHome(); // go to saved target (/go-for-visa?autostart=1) or "/"
  }

  /** -------- Google login -------- */
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        name: decoded.name || "Google User",
        email: decoded.email || "",
        picture: decoded.picture || "",
        token: credentialResponse.credential,
      };
      try {
        localStorage.setItem("helloviza_user", JSON.stringify(userData));
        localStorage.setItem("hv_user", JSON.stringify(userData));
        sessionStorage.setItem("hv_user", JSON.stringify(userData));
        localStorage.setItem("hv_token", userData.token);
      } catch {}
      if (onLogin) onLogin(userData);
      popRedirectOrHome();
    } catch {
      setError("Failed to process Google login. Please try again.");
    }
  };
  const handleGoogleFailure = () => setError("Google login failed, please try again.");

  /** -------- UI -------- */
  return (
    <div className="login-outer" style={styles.outer}>
      {/* Responsive tweaks for mobile only; desktop unchanged */}
      <style>{`
        @media (max-width: 600px) {
          .login-outer { flex-direction: column !important; min-height: 100vh !important; align-items: stretch !important; }
          .login-left-bg { min-height: 140px !important; flex-basis: 32vw !important; width: 100% !important; background-size: cover !important; background-position: center !important; display: block !important; border-radius: 0 !important; }
          .login-form-area { max-width: 100vw !important; padding: 2.4rem 4vw 2.2rem !important; min-width: unset !important; border-radius: 0 !important; margin: 0 !important; }
          .login-tabs { gap: 1.1rem !important; margin-bottom: 1.1rem !important; }
          .login-tab { font-size: 1.1rem !important; }
          .login-form-area input, .login-form-area select { font-size: .96rem !important; padding: .54rem .7rem !important; }
          .login-form-area button[type="submit"] { padding: .88rem .6rem !important; font-size: 1.09rem !important; }
          .login-form-area label { font-size: .95rem !important; }
        }
      `}</style>

      <div className="login-left-bg" style={{ ...styles.leftBg, backgroundImage: `url(${loginBg})` }} />
      <div className="login-form-area" style={styles.formArea}>
        {/* Tabs */}
        <div className="login-tabs" role="tablist" aria-label="Login and Signup Tabs" style={styles.tabs}>
          <div
            className="login-tab"
            role="tab"
            tabIndex={0}
            aria-selected={mode === "login"}
            onClick={() => setMode("login")}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode("login"); } }}
            style={{ ...styles.tabWrap, ...(mode === "login" ? styles.activeTabWrap : {}), cursor: "pointer" }}
          >
            <span style={{ ...styles.tab, ...(mode === "login" ? styles.activeTab : {}) }}>• Log in</span>
            <div style={{ ...styles.underline, ...(mode === "login" ? styles.activeUnderline : {}) }} />
          </div>
          <div
            className="login-tab"
            role="tab"
            tabIndex={0}
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode("signup"); } }}
            style={{ ...styles.tabWrap, ...(mode === "signup" ? styles.activeTabWrap : {}), cursor: "pointer" }}
          >
            <span style={{ ...styles.tab, ...(mode === "signup" ? styles.activeTab : {}) }}>• Sign Up</span>
            <div style={{ ...styles.underline, ...(mode === "signup" ? styles.activeUnderline : {}) }} />
          </div>
        </div>

        {/* Google */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={{ color: "#c00", fontWeight: "bold", marginBottom: 8 }}>{error}</div>}

          <div style={{ display: "flex", gap: "2vw" }}>
            {mode === "signup" && (
              <>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>First Name*</label>
                  <input type="text" name="firstName" style={styles.input} value={form.firstName} onChange={handleChange} placeholder="Enter first name" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Last Name*</label>
                  <input type="text" name="lastName" style={styles.input} value={form.lastName} onChange={handleChange} placeholder="Enter last name" required />
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "2vw" }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Email*</label>
              <input
                type="email"
                name="email"
                style={styles.input}
                value={form.email}
                onChange={(e) => { setOtpVerified(false); setOtpSent(false); setOtp(""); handleChange(e); }}
                placeholder="Enter email"
                required
              />
            </div>

            {mode === "signup" && (
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Country (optional)</label>
                <input type="text" name="country" style={styles.input} value={form.country} onChange={handleChange} placeholder="Enter country" />
              </div>
            )}

            {mode === "login" && (
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Password</label>
                <input type="password" name="password" style={styles.input} value={form.password} onChange={handleChange} placeholder="Enter password" required />
              </div>
            )}
          </div>

          {mode === "signup" && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                {!otpSent ? (
                  <button type="button" onClick={sendOtp} disabled={loading || !form.email} style={styles.otpBtn}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                ) : !otpVerified ? (
                  <>
                    <label style={styles.label}>Enter OTP</label>
                    <input type="text" name="otp" style={styles.input} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" disabled={loading} maxLength={6} />
                    <button type="button" onClick={verifyOtp} disabled={loading || otp.length !== 6} style={styles.otpBtn}>
                      {loading ? "Verifying OTP..." : "Verify OTP"}
                    </button>
                  </>
                ) : (
                  <p style={{ color: "green", fontWeight: "bold" }}>Email verified!</p>
                )}
              </div>

              <div style={{ display: "flex", gap: "2vw" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Password</label>
                  <input type="password" name="password" style={styles.input} value={form.password} onChange={handleChange} placeholder="Enter password" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Confirm Password</label>
                  <input type="password" name="confirmPassword" style={styles.input} value={form.confirmPassword} onChange={handleChange} placeholder="Enter confirm password" required />
                </div>
              </div>

              <div style={styles.checkboxWrap}>
                <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} style={styles.checkbox} required />
                <span style={styles.agreeText}>By creating an account, I agree to this website&apos;s privacy policy and terms of service</span>
              </div>
            </>
          )}

          <button type="submit" style={styles.submitBtn} disabled={mode === "signup" && !otpVerified}>
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        {/* Below links */}
        <div style={styles.belowLinks}>
          {mode === "login" ? (
            <>
              <span>
                Forgot your password?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/reset-password");
                  }}
                >
                  Reset here
                </a>
              </span>
              <br />
              <span>
                Trouble logging in?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                >
                  Contact us
                </a>
              </span>
            </>
          ) : (
            <>
              <span>
                Already have an account?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("login");
                  }}
                >
                  Log in here
                </a>
              </span>
              <br />
              <span>
                Trouble signing up?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                >
                  Contact us
                </a>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  outer: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: baseFont,
    backgroundColor: "#00477f",
    color: "#fff",
  },
  leftBg: {
    flex: "1 1 40%",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  formArea: {
    flex: "1 1 60%",
    padding: "10rem 4rem 15rem",
    maxWidth: 600,
    boxSizing: "border-box",
  },
  tabs: {
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem",
  },
  tabWrap: {
    position: "relative",
    cursor: "pointer",
  },
  activeTabWrap: {},
  tab: {
    fontSize: "2rem",
    fontWeight: 900,
    color: "rgba(255, 255, 255, 0.6)",
  },
  activeTab: {
    color: "#fff",
  },
  underline: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "transparent",
    transition: "background-color 0.3s",
  },
  activeUnderline: {
    backgroundColor: "#ffffff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.4rem",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.6rem 1rem",
    borderRadius: 6,
    border: "1px solid #444",
    backgroundColor: "#a7c8fc",
    color: "#111111",
    fontSize: "1rem",
  },
  checkboxWrap: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
  },
  checkbox: {
    marginRight: 10,
  },
  agreeText: {
    fontSize: "0.8rem",
    lineHeight: 1.3,
  },
  submitBtn: {
    marginTop: "2rem",
    padding: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    color: "#d06549",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  otpBtn: {
    padding: "0.6rem 1rem",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: "#d06549",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: "1rem",
  },
  belowLinks: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.7)",
  },
  link: {
    color: "#ffffff",
    textDecoration: "underline",
    cursor: "pointer",
  },
};
