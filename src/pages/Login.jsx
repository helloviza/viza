// src/pages/Login.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import loginBg from "../assets/login-bg.jpg";

/* ====== constants ====== */
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";

const HOST = typeof window !== "undefined" ? window.location.hostname : "";
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";

export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (IS_LOCAL ? "http://localhost:8080" : "https://api.helloviza.com");

// ---- Feature Flags (env-driven) ----
const ENABLE_GOOGLE = (process.env.REACT_APP_ENABLE_GOOGLE_OAUTH ?? "true") === "true";
const ENABLE_MOBILE = (process.env.REACT_APP_ENABLE_MOBILE_LOGIN ?? "true") === "true";
const ENABLE_EMAIL  = (process.env.REACT_APP_ENABLE_EMAIL_LOGIN ?? "true") === "true";

// External redirects OFF by default to keep login/signup local
const ALLOW_EXTERNAL_NEXT =
  (process.env.REACT_APP_ALLOW_EXTERNAL_POST_LOGIN ?? "false") === "true";

/* ====== Safe next resolver (strict) ======
   INTERNAL-FIRST: keep users inside this app.

   If ALLOW_EXTERNAL_NEXT === true, we additionally allow:
   • https://visa.helloviza.com/...
   • https://www.helloviza.com/...

   Fallback (internal home): "/"
*/
function pickPostLoginTarget(searchOrSaved) {
  const fallback = "/";

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
    if (typeof searchOrSaved === "string" && searchOrSaved.trim()) {
      raw = searchOrSaved.trim();
    } else {
      return fallback;
    }
  }

  let next = "";
  try { next = decodeURIComponent(raw); } catch { next = raw; }

  // INTERNAL paths are always allowed
  if (typeof next === "string" && next.startsWith("/")) return next || "/";

  // Optionally allow trusted external domains
  if (ALLOW_EXTERNAL_NEXT && typeof next === "string") {
    if (/^https:\/\/visa\.helloviza\.com(\/|$)/i.test(next)) return next;
    if (/^https:\/\/(www\.)?helloviza\.com(\/|$)/i.test(next)) return next;
  }

  return fallback;
}

/* ====== small modal for mobile verification (used when Google user has no mobile) ====== */
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

/* ===== MAIN COMPONENT ===== */
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

  // Mobile login states
  const [mobile, setMobile] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [timer, setTimer] = useState(0);

  // Google users without mobile
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  // Session guard
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // helpers
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  // Persist ?next= or ?from= very early for multi-step flows
  useEffect(() => {
    const n = params.get("next");
    if (n) sessionStorage.setItem(LOGIN_REDIRECT_KEY, n);
  }, [params]);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const candidate = sp.get("from") || sp.get("next");
    if (candidate) sessionStorage.setItem(LOGIN_REDIRECT_KEY, candidate);
  }, [location.search]);

  const resolveNext = useCallback(() => {
    const saved = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
    return pickPostLoginTarget(saved || location.search);
  }, [location.search]);

  // Check if already logged in → redirect to target (strictly internal unless env allows)
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
              if (ALLOW_EXTERNAL_NEXT) {
                window.location.replace(target);
                return;
              }
              navigate("/", { replace: true });
              return;
            } else {
              navigate(target, { replace: true });
              return;
            }
          }
        }
      } catch (_) {}
      if (!cancelled) setCheckingSession(false); // show form if not logged-in
    })();
    return () => { cancelled = true; };
  }, [navigate, resolveNext]);

  useEffect(() => setGoogleReady(true), []);

  // After login, re-check session and then redirect (strictly internal unless env allows)
  const finishLogin = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data && data.user) {
          const target = resolveNext();
          sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
          if (/^https?:\/\//i.test(target)) {
            if (ALLOW_EXTERNAL_NEXT) {
              window.location.replace(target);
            } else {
              navigate("/", { replace: true });
            }
          } else {
            navigate(target, { replace: true });
          }
          return;
        }
      }
      // retry once
      setTimeout(async () => {
        const res2 = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        if (res2.ok) {
          const data2 = await res2.json().catch(() => ({}));
          if (data2 && data2.user) {
            const target = resolveNext();
            sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
            if (/^https?:\/\//i.test(target)) {
              if (ALLOW_EXTERNAL_NEXT) {
                window.location.replace(target);
              } else {
                navigate("/", { replace: true });
              }
            } else {
              navigate(target, { replace: true });
            }
          }
        }
      }, 300);
    } catch (_) {}
  }, [navigate, resolveNext]);

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

  /* ===== Mobile OTP (Manual Login + Timer) ===== */
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

      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) throw new Error(loginData.error || "Login failed");

      const userData = loginData.user;
      localStorage.setItem("helloviza_user", JSON.stringify(userData));
      localStorage.setItem("hv_user", JSON.stringify(userData));
      sessionStorage.setItem("hv_user", JSON.stringify(userData));

      onLogin?.(userData);
      await finishLogin();
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

      if (!userData?.mobileVerified && !userData?.mobile) {
        setPendingUser(userData);
        setShowMobileModal(true);
        return;
      }

      onLogin?.(userData);
      await finishLogin();
    } catch (err) {
      console.error(err);
      setError(err.message || "Google login failed, please try again.");
    }
  };

  const handleGoogleFailure = () => setError("Google login failed, please try again.");

  /* ===== Unconditional tab definitions + guard (before any return) ===== */
  const tabDefs = React.useMemo(() => {
    const arr = [];
    if (ENABLE_EMAIL) {
      arr.push({ key: "login", label: "Log in" });
      arr.push({ key: "signup", label: "Sign Up" });
    }
    if (ENABLE_MOBILE) {
      arr.push({ key: "mobile", label: "Mobile Login" });
    }
    return arr;
  }, []);

  useEffect(() => {
    const allowed = tabDefs.map(t => t.key);
    if (!allowed.includes(mode) && allowed.length) {
      setMode(allowed[0]);
    }
  }, [mode, tabDefs]);

  /* ===== UI (safe early return AFTER all hooks) ===== */
  if (checkingSession) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", color: "#fff", fontFamily: baseFont }}>
        Checking session…
      </div>
    );
  }

  return (
    <div className="login-outer" style={S.outer}>
      <style>{responsiveCSS}</style>
      <div className="login-left-bg" style={{ ...S.leftBg, backgroundImage: `url(${loginBg})` }} />
      <div className="login-form-area" style={S.formArea}>
        <div className="login-tabs" style={S.tabs}>
          {tabDefs.map((t) => (
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

        {/* Google button (optional) */}
        {ENABLE_GOOGLE && mode !== "mobile" && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} useOneTap={false} />
          </div>
        )}

        {/* === EMAIL LOGIN / SIGNUP === */}
        {ENABLE_EMAIL && mode !== "mobile" && (
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
        {ENABLE_MOBILE && mode === "mobile" && (
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
                  maxLength={6}
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
                  style={{ ...S.otpBtn, backgroundColor: timer > 0 ? "#888" : "#d06549", marginTop: "10px" }}
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
          // do not assume session; finishLogin will confirm then redirect
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
