// client/src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";
const API_BASE = "https://api.helloviza.com"; // ✅ Backend

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
      let path = u.pathname + (u.search || "");
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
    setTimeout(() => navigate(next, { replace: true }), 0);
  }

  useEffect(() => {
    stashRedirectFromQuery();
  }, [location.search]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("helloviza_user") || localStorage.getItem("hv_user") || sessionStorage.getItem("hv_user");
      const hasNext = !!sessionStorage.getItem(LOGIN_REDIRECT_KEY);
      if (stored && hasNext) popRedirectOrHome();
    } catch {}
  }, []);

  /** -------- OTP -------- */
  async function sendOtp() {
    setError("");
    if (!form.email) {
      setError("Please enter your email to receive OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

  /** -------- Login / Signup -------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !otpVerified) {
      setError("Please verify your email OTP before signing up.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ important for cookies
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auth failed");

      const userData = { id: data.user?.id, name: data.user?.name, email: data.user?.email };
      try {
        localStorage.setItem("helloviza_user", JSON.stringify(userData));
        localStorage.setItem("hv_user", JSON.stringify(userData));
        sessionStorage.setItem("hv_user", JSON.stringify(userData));
      } catch {}

      if (onLogin) onLogin(userData);
      popRedirectOrHome();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /** -------- Google login -------- */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ keep cookies
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed");

      const userData = { id: data.user?.id, name: data.user?.name, email: data.user?.email, picture: decoded.picture };
      try {
        localStorage.setItem("helloviza_user", JSON.stringify(userData));
        localStorage.setItem("hv_user", JSON.stringify(userData));
        sessionStorage.setItem("hv_user", JSON.stringify(userData));
        localStorage.setItem("hv_token", credentialResponse.credential);
      } catch {}

      if (onLogin) onLogin(userData);
      popRedirectOrHome();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleFailure = () => setError("Google login failed, please try again.");

  /** -------- UI -------- */
  return (
    <div className="login-outer" style={styles.outer}>
      {/* Responsive tweaks for mobile only */}
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

          {/* Rest of form unchanged (First name, last name, email, OTP, password, etc.) */}
          {/* ... keep your full JSX here exactly as before ... */}

          <button type="submit" style={styles.submitBtn} disabled={mode === "signup" && !otpVerified}>
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        {/* Below links */}
        {/* (Unchanged from your code) */}
      </div>
    </div>
  );
}

const styles = {
  outer: { display: "flex", minHeight: "100vh", fontFamily: baseFont, backgroundColor: "#00477f", color: "#fff" },
  leftBg: { flex: "1 1 40%", backgroundSize: "cover", backgroundPosition: "center" },
  formArea: { flex: "1 1 60%", padding: "10rem 4rem 15rem", maxWidth: 600, boxSizing: "border-box" },
  tabs: { display: "flex", gap: "2rem", marginBottom: "2rem" },
  tabWrap: { position: "relative", cursor: "pointer" },
  activeTabWrap: {},
  tab: { fontSize: "2rem", fontWeight: 900, color: "rgba(255, 255, 255, 0.6)" },
  activeTab: { color: "#fff" },
  underline: { position: "absolute", bottom: -6, left: 0, right: 0, height: 4, backgroundColor: "transparent", transition: "background-color 0.3s" },
  activeUnderline: { backgroundColor: "#ffffff" },
  form: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  label: { display: "block", marginBottom: "0.4rem", fontWeight: "bold" },
  input: { width: "100%", padding: "0.6rem 1rem", borderRadius: 6, border: "1px solid #444", backgroundColor: "#a7c8fc", color: "#111111", fontSize: "1rem" },
  checkboxWrap: { display: "flex", alignItems: "center", marginTop: "1rem" },
  checkbox: { marginRight: 10 },
  agreeText: { fontSize: "0.8rem", lineHeight: 1.3 },
  submitBtn: { marginTop: "2rem", padding: "1rem", fontSize: "1.2rem", fontWeight: "bold", backgroundColor: "#ffffff", color: "#d06549", border: "none", borderRadius: 8, cursor: "pointer" },
  otpBtn: { padding: "0.6rem 1rem", fontSize: "1rem", fontWeight: "bold", backgroundColor: "#d06549", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: "1rem" },
  belowLinks: { marginTop: "1rem", fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)" },
  link: { color: "#ffffff", textDecoration: "underline", cursor: "pointer" },
};
