// src/pages/Login.jsx
<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
=======
import React, { useEffect, useState, useCallback, useMemo } from "react";
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import loginBg from "../assets/login-bg.jpg";
import { useAuth } from "../context/AuthContext";

/* ====== constants ====== */
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

<<<<<<< HEAD
/* ====== post-login target (STRICT & STRING-SAFE) ======
   Allows:
   • https://visa.helloviza.com/...
   • https://www.helloviza.com/... (rarely needed)
=======
/* ====== Safe next resolver (strict) ======
   Allows:
   • https://visa.helloviza.com/...
   • https://www.helloviza.com/...
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
   • local paths starting with "/"
   Falls back to https://visa.helloviza.com
*/
function pickPostLoginTarget(searchOrSaved) {
  const fallback = "https://visa.helloviza.com";

<<<<<<< HEAD
  // Prefer explicit saved string, else read from current query
=======
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
  const rawSearch =
    typeof searchOrSaved === "string" && searchOrSaved.includes("=")
      ? searchOrSaved
      : (typeof window !== "undefined" ? window.location.search : "");

  let raw = null;
  try {
    const p = new URLSearchParams(rawSearch);
    raw = p.get("next");
  } catch {
    raw = null;
  }

  if (!raw || typeof raw !== "string") {
<<<<<<< HEAD
    // maybe caller passed an already-saved NEXT string instead of "?next=..."
=======
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
    if (typeof searchOrSaved === "string" && searchOrSaved.trim()) {
      raw = searchOrSaved.trim();
    } else {
      return fallback;
    }
  }

  let next = "";
<<<<<<< HEAD
  try {
    // decode once if it was encoded in the link
    next = decodeURIComponent(raw);
  } catch {
    next = raw;
  }

  // Absolute to allowed subdomains
  if (/^https:\/\/visa\.helloviza\.com(\/|$)/i.test(next)) return next;
  if (/^https:\/\/(www\.)?helloviza\.com(\/|$)/i.test(next)) return next;

  // Local path only
=======
  try { next = decodeURIComponent(raw); } catch { next = raw; }

  if (/^https:\/\/visa\.helloviza\.com(\/|$)/i.test(next)) return next;
  if (/^https:\/\/(www\.)?helloviza\.com(\/|$)/i.test(next)) return next;
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
  if (next.startsWith("/")) return next;

  return fallback;
}

/* ====== small modal for mobile verification ====== */
function MobileVerificationModal({ show, onClose, onVerified }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  async function sendOtp() {
    if (!mobile) return setError("Please enter your mobile number");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/send-otp-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp) return setError("Enter OTP");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/verify-otp-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      await fetch(`${API_BASE}/api/auth/add-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile }),
      });

      onVerified(mobile);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={M.overlay}>
      <div style={M.box}>
        <h2 style={{ marginBottom: "1rem", color: "#00477f" }}>Verify your Mobile</h2>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {!otpSent ? (
          <>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              style={M.input}
            />
            <button onClick={sendOtp} style={M.button} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={M.input}
            />
            <button onClick={verifyOtp} style={M.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </>
        )}
        <button onClick={onClose} style={M.cancel}>Cancel</button>
      </div>
    </div>
  );
}

const M = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 },
  box: { background: "#fff", padding: "2rem", borderRadius: 10, width: "min(400px,90vw)", textAlign: "center" },
  input: { width: "100%", padding: ".8rem", marginBottom: "1rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem" },
  button: { width: "100%", background: "#00477f", color: "#fff", border: "none", borderRadius: 6, padding: ".8rem 1rem", fontWeight: 700, cursor: "pointer" },
  cancel: { marginTop: "1rem", background: "transparent", color: "#d06549", border: "none", cursor: "pointer" },
};

<<<<<<< HEAD
/* ====== MAIN COMPONENT ====== */
=======
/* ===== MAIN COMPONENT ===== */
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
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
  const [googleReady, setGoogleReady] = useState(false);
<<<<<<< HEAD

  const [mobile, setMobile] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
=======
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)

  const [mobile, setMobile] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const [checkingSession, setCheckingSession] = useState(true); // 🚦 block redirects until we confirm session
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
<<<<<<< HEAD
  const { user, loading: authLoading } = useAuth();
=======
  const { /* user, loading: authLoading */ } = useAuth(); // we won't auto-redirect on this; guard with /session instead
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)

  /* helpers */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

<<<<<<< HEAD
  /* Persist ?next= very early for multi-step flows */
=======
  // Persist ?next= very early
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
  useEffect(() => {
    const n = params.get("next");
    if (n) sessionStorage.setItem(LOGIN_REDIRECT_KEY, n);
  }, [params]);

<<<<<<< HEAD
  /* Also accept ?from= for legacy links */
=======
  // Also accept ?from= for legacy links
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const candidate = sp.get("from") || sp.get("next");
    if (candidate) sessionStorage.setItem(LOGIN_REDIRECT_KEY, candidate);
  }, [location.search]);

<<<<<<< HEAD
  /* If already authenticated, jump to saved/derived target */
  useEffect(() => {
    if (authLoading || !user) return;
    // prefer saved; else current query; else fallback
    const saved = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
    const target = pickPostLoginTarget(saved || location.search);
    sessionStorage.removeItem(LOGIN_REDIRECT_KEY);

    if (/^https?:\/\//i.test(target)) {
      window.location.replace(target);
    } else {
      navigate(target, { replace: true });
    }
  }, [user, authLoading, navigate, location.search]);

  useEffect(() => setGoogleReady(true), []);

  const finishLogin = useCallback(() => {
    const saved = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
    const target = pickPostLoginTarget(saved || location.search);
    sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
    if (/^https?:\/\//i.test(target)) {
      window.location.replace(target);
    } else {
      navigate(target, { replace: true });
    }
  }, [location.search, navigate]);
=======
  const resolveNext = useCallback(() => {
    const saved = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
    return pickPostLoginTarget(saved || location.search);
  }, [location.search]);

  // ✅ NEW: Only redirect away if /api/auth/session confirms logged-in
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        if (!cancelled && res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data && data.user) {
            const target = resolveNext();
            sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
            if (/^https?:\/\//i.test(target)) {
              window.location.replace(target);
            } else {
              navigate(target, { replace: true });
            }
            return;
          }
        }
      } catch (_) {}
      if (!cancelled) setCheckingSession(false); // show the form if not logged-in
    })();
    return () => { cancelled = true; };
  }, [navigate, resolveNext]);

  useEffect(() => setGoogleReady(true), []);

  // 🔁 Shared post-login finisher: re-check /session, then redirect once
  const finishLogin = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data && data.user) {
          const target = resolveNext();
          sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
          if (/^https?:\/\//i.test(target)) {
            window.location.replace(target);
          } else {
            navigate(target, { replace: true });
          }
          return;
        }
      }
      // Optional: tiny delay + retry once if needed
      setTimeout(async () => {
        const res2 = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        if (res2.ok) {
          const data2 = await res2.json().catch(() => ({}));
          if (data2 && data2.user) {
            const target = resolveNext();
            sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
            if (/^https?:\/\//i.test(target)) {
              window.location.replace(target);
            } else {
              navigate(target, { replace: true });
            }
          }
        }
      }, 300);
    } catch (_) {}
  }, [navigate, resolveNext]);
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)

  /* ===== Email OTP (Signup) ===== */
  async function sendOtp() {
    if (!form.email) return setError("Enter your email");
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Failed to send OTP");
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp) return setError("Enter OTP");
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, otp }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "OTP verification failed");
      setOtpVerified(true);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD
  /* ===== Mobile OTP (Manual Login + Backend + Timer) ===== */
  const [timer, setTimer] = useState(0);

=======
  /* ===== Mobile OTP (Manual Login + Timer) ===== */
  const [timer, setTimer] = useState(0);
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  async function handleSendMobileOtp(e) {
    e.preventDefault();
    if (!mobile) return setError("Enter mobile number");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/send-otp-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile, type: "login" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to send OTP");
      setMobileOtpSent(true);
      setTimer(30);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendMobileOtp(e) {
    e.preventDefault();
    if (!mobile) return setError("Enter mobile number");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/resend-otp-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.type !== "success") throw new Error("Failed to resend OTP");
      setTimer(30);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyMobileOtp(e) {
    e.preventDefault();
    if (!mobileOtp) return setError("Enter OTP");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/verify-otp-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile, otp: mobileOtp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Invalid OTP");

      const loginRes = await fetch(`${API_BASE}/api/auth/mobile-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mobile }),
      });
<<<<<<< HEAD

=======
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) throw new Error(loginData.error || "Login failed");

      const userData = loginData.user;
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));

      onLogin?.(userData);
<<<<<<< HEAD
      finishLogin();
=======
      await finishLogin();
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  /* ===== Email Login / Signup ===== */
  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === "signup" && !otpVerified) return setError("Please verify your email first");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const r = await fetch(`${API_BASE}${endpoint}`, {
<<<<<<< HEAD
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Auth failed");

      const userData = d.user;
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));

      onLogin?.(userData);
      finishLogin();
    } catch (err) {
      setError(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  /* ===== Google Auth ===== */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      const decoded = idToken ? jwtDecode(idToken) : null;

      const r = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // Backend expects `credential` OR {email,name}; send both for safety
        body: JSON.stringify({
          credential: idToken || null,
          email: decoded?.email || null,
          name: decoded?.name || null,
          picture: decoded?.picture || null,
        }),
      });

      const txt = await r.text();
      const d = txt ? JSON.parse(txt) : {};
      if (!r.ok) throw new Error(d.error || "Google login failed");

      const userData = { ...d.user, picture: decoded?.picture || d.user?.picture };
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));
      localStorage.setItem("hv_token", idToken || "");

      if (!userData?.mobileVerified && !userData?.mobile) {
        setPendingUser(userData);
        setShowMobileModal(true);
        return;
      }

      onLogin?.(userData);
      finishLogin();
    } catch (err) {
=======
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Auth failed");

      const userData = d.user;
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));

      onLogin?.(userData);
      await finishLogin();
    } catch (err) {
      setError(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  /* ===== Google Auth ===== */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      const decoded = idToken ? jwtDecode(idToken) : null;

      const r = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          credential: idToken || null,
          email: decoded?.email || null,
          name: decoded?.name || null,
          picture: decoded?.picture || null,
        }),
      });

      const txt = await r.text();
      const d = txt ? JSON.parse(txt) : {};
      if (!r.ok) throw new Error(d.error || "Google login failed");

      const userData = { ...d.user, picture: decoded?.picture || d.user?.picture };
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));
      localStorage.setItem("hv_token", idToken || "");

      if (!userData?.mobileVerified && !userData?.mobile) {
        setPendingUser(userData);
        setShowMobileModal(true);
        return;
      }

      onLogin?.(userData);
      await finishLogin();
    } catch (err) {
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
      console.error(err);
      setError(err.message || "Google login failed, please try again.");
    }
  };

  const handleGoogleFailure = () => setError("Google login failed, please try again.");

  /* ===== UI ===== */
<<<<<<< HEAD
=======
  // While checking session, keep the page blank (or a tiny spinner)
  if (checkingSession) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", color: "#fff", fontFamily: baseFont }}>
        Checking session…
      </div>
    );
  }

>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
  return (
    <div className="login-outer" style={S.outer}>
      <style>{responsiveCSS}</style>
      <div className="login-left-bg" style={{ ...S.leftBg, backgroundImage: `url(${loginBg})` }} />
      <div className="login-form-area" style={S.formArea}>
        <div className="login-tabs" style={S.tabs}>
          {[
            { key: "login", label: "Log in" },
            { key: "signup", label: "Sign Up" },
            { key: "mobile", label: "Mobile Login" },
          ].map((t) => (
            <div
              key={t.key}
              onClick={() => { setMode(t.key); setError(""); }}
              style={{ ...S.tabWrap, ...(mode === t.key ? S.activeTabWrap : {}) }}
            >
              <span style={{ ...S.tab, ...(mode === t.key ? S.activeTab : {}) }}>
                • {t.label}
              </span>
              <div style={{ ...S.underline, ...(mode === t.key ? S.activeUnderline : {}) }} />
            </div>
          ))}
        </div>

        {googleReady && mode !== "mobile" && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} useOneTap={false} />
          </div>
        )}

        {/* === EMAIL LOGIN / SIGNUP === */}
        {mode !== "mobile" && (
          <form onSubmit={handleSubmit} style={S.form}>
            {error && <div style={S.error}>{error}</div>}
            {mode === "signup" && (
              <div style={{ display: "flex", gap: "2vw" }}>
                <div style={{ flex: 1 }}>
                  <label style={S.label}>First Name*</label>
                  <input name="firstName" style={S.input} value={form.firstName} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.label}>Last Name*</label>
                  <input name="lastName" style={S.input} value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "2vw" }}>
              <div style={{ flex: 1 }}>
                <label style={S.label}>Email*</label>
                <input type="email" name="email" style={S.input} value={form.email} onChange={handleChange} required />
              </div>
              {mode === "signup" ? (
                <div style={{ flex: 1 }}>
                  <label style={S.label}>Country</label>
                  <input name="country" style={S.input} value={form.country} onChange={handleChange} />
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <label style={S.label}>Password</label>
                  <input type="password" name="password" style={S.input} value={form.password} onChange={handleChange} required />
                </div>
              )}
            </div>

            {mode === "signup" && (
              <>
                {!otpSent ? (
                  <button type="button" onClick={sendOtp} style={S.otpBtn}>
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                ) : !otpVerified ? (
                  <>
                    <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={S.input} />
                    <button type="button" onClick={verifyOtp} style={S.otpBtn}>
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </>
                ) : (
                  <p style={{ color: "green" }}>Email verified!</p>
                )}

                <div style={{ display: "flex", gap: "2vw" }}>
                  <div style={{ flex: 1 }}>
                    <label style={S.label}>Password</label>
                    <input type="password" name="password" style={S.input} value={form.password} onChange={handleChange} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={S.label}>Confirm Password</label>
                    <input type="password" name="confirmPassword" style={S.input} value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                </div>
              </>
            )}

            <button type="submit" style={S.submitBtn}>
              {mode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
        )}

        {/* === MOBILE LOGIN === */}
        {mode === "mobile" && (
          <form onSubmit={mobileOtpSent ? handleVerifyMobileOtp : handleSendMobileOtp} style={S.form}>
            {error && <div style={S.error}>{error}</div>}
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              style={S.input}
              required
            />

            {mobileOtpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={mobileOtp}
                  onChange={(e) => setMobileOtp(e.target.value)}
                  maxLength={4}
                  style={S.input}
                  required
                />
                <button type="submit" style={S.submitBtn}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  type="button"
                  onClick={handleResendMobileOtp}
                  disabled={timer > 0 || loading}
<<<<<<< HEAD
                  style={{
                    ...S.otpBtn,
                    backgroundColor: timer > 0 ? "#888" : "#d06549",
                    marginTop: "10px",
                  }}
=======
                  style={{ ...S.otpBtn, backgroundColor: timer > 0 ? "#888" : "#d06549", marginTop: "10px" }}
>>>>>>> 872b0dc (Login: session guard + safe next redirect; fix / ↔ /login loop)
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </>
            ) : (
              <button type="submit" style={S.otpBtn}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            )}
          </form>
        )}
      </div>

      {/* mobile modal for Google users */}
      <MobileVerificationModal
        show={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        onVerified={(num) => {
          const updated = { ...pendingUser, mobile: num };
          localStorage.setItem("hv_user", JSON.stringify(updated));
          sessionStorage.setItem("hv_user", JSON.stringify(updated));
          setShowMobileModal(false);
          onLogin?.(updated);
          finishLogin();
        }}
      />
    </div>
  );
}

/* ===== styles ===== */
const responsiveCSS = `
@media (max-width:600px){
  .login-outer{flex-direction:column!important;min-height:100vh!important;}
  .login-left-bg{min-height:140px!important;}
  .login-form-area{padding:2rem!important;}
}`;
const S = {
  outer: { display: "flex", minHeight: "100vh", fontFamily: baseFont, backgroundColor: "#00477f", color: "#fff" },
  leftBg: { flex: "1 1 40%", backgroundSize: "cover", backgroundPosition: "center" },
  formArea: { flex: "1 1 60%", padding: "10rem 4rem 15rem", maxWidth: 600 },
  tabs: { display: "flex", gap: "2rem", marginBottom: "2rem" },
  tabWrap: { position: "relative", cursor: "pointer" },
  tab: { fontSize: "2rem", fontWeight: 900, color: "rgba(255,255,255,0.6)" },
  activeTab: { color: "#fff" },
  underline: { position: "absolute", bottom: -6, left: 0, right: 0, height: 4, backgroundColor: "transparent" },
  activeUnderline: { backgroundColor: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  label: { marginBottom: ".4rem", fontWeight: "bold" },
  input: { width: "100%", padding: ".6rem 1rem", borderRadius: 6, border: "1px solid #444", backgroundColor: "#a7c8fc", color: "#111" },
  submitBtn: { marginTop: "2rem", padding: "1rem", fontSize: "1.2rem", fontWeight: "bold", backgroundColor: "#fff", color: "#d06549", border: "none", borderRadius: 8, cursor: "pointer" },
  otpBtn: { padding: ".6rem 1rem", fontWeight: "bold", backgroundColor: "#d06549", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  error: { color: "#ffdddd", background: "#44000033", padding: "0.4rem 0.6rem", borderRadius: 6, fontWeight: "bold" },
};
