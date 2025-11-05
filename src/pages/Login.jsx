// src/pages/Login.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import loginBg from "../assets/login-bg.jpg";

/* =================== constants =================== */
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";

// short-lived intent set by Header.jsx when user clicks “Go for Visa”
const VISA_INTENT_KEY = "HV:VISA_INTENT_TS";
const VISA_INTENT_TTL_MS = 5 * 60 * 1000; // 5 minutes

const HOST = typeof window !== "undefined" ? window.location.hostname : "";
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";

export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (IS_LOCAL ? "http://localhost:8080" : "https://api.helloviza.com");

// Feature Flags (env-driven)
const ENABLE_GOOGLE = (process.env.REACT_APP_ENABLE_GOOGLE_OAUTH ?? "true") === "true";
const ENABLE_MOBILE = (process.env.REACT_APP_ENABLE_MOBILE_LOGIN ?? "true") === "true";
const ENABLE_EMAIL  = (process.env.REACT_APP_ENABLE_EMAIL_LOGIN ?? "true") === "true";

/* =================== helpers =================== */
const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
const isInternalPath = (v) => typeof v === "string" && v.startsWith("/");

function normalizeInternalPath(pathLike) {
  if (!isInternalPath(pathLike)) return null;
  try {
    const url = new URL(pathLike, "https://x.example");
    if (url.searchParams.has("autostart")) url.searchParams.delete("autostart");
    const clean = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "");
    return clean || "/";
  } catch {
    return null;
  }
}
function hasFreshVisaIntent() {
  try {
    const ts = Number(sessionStorage.getItem(VISA_INTENT_KEY));
    if (!ts) return false;
    return Date.now() - ts <= VISA_INTENT_TTL_MS;
  } catch {
    return false;
  }
}
function sanitizeNext(next) {
  if (!next || isAbsoluteUrl(next)) return null;
  const normalized = normalizeInternalPath(next);
  return normalized;
}
function scrubLoginUrl(location, navigate) {
  const params = new URLSearchParams(location.search || "");
  let changed = false;

  if (params.has("autostart")) {
    params.delete("autostart");
    changed = true;
  }

  const rawNext = params.get("next");
  const next = sanitizeNext(rawNext);
  if (rawNext && !next) {
    params.delete("next");
    changed = true;
  } else if (next && next.startsWith("/go/visa") && !hasFreshVisaIntent()) {
    params.delete("next");
    changed = true;
  } else if (next && next !== rawNext) {
    params.set("next", next);
    changed = true;
  }

  if (changed) {
    const search = params.toString();
    navigate({ pathname: "/login", search: search ? `?${search}` : "" }, { replace: true });
    return true;
  }
  return false;
}
function decidePostLoginTarget(location) {
  const params = new URLSearchParams(location.search || "");
  const rawNext = params.get("next");
  const next = sanitizeNext(rawNext);

  if (next) {
    if (next.startsWith("/go/visa")) {
      if (hasFreshVisaIntent()) return next;
    } else {
      return next;
    }
  }

  try {
    const savedRaw = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
    const saved = sanitizeNext(savedRaw);
    if (saved) return saved;
  } catch {}

  return "/";
}
function finalizeTarget(target) {
  const clean = sanitizeNext(target);
  return clean || "/";
}

/* =================== Mobile verification modal =================== */
function MobileVerificationModal({ show, onClose, onVerified }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  async function sendOtp() {
    if (!mobile) return setError("Please enter your mobile number");
    setError(""); setLoading(true);
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
    setError(""); setLoading(true);
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
        <h2 style={{ marginBottom: "1rem", color: "#00477f", fontFamily: baseFont }}>Verify your Mobile</h2>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {!otpSent ? (
          <>
            <input type="tel" placeholder="Enter mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={10} style={M.input} />
            <button onClick={sendOtp} style={M.button} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={M.input} />
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

/* =================== MAIN =================== */
export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: "",
    country: "", confirmPassword: "", agree: false,
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  /* 1) FIRST DEFENSE: scrub current login URL */
  useEffect(() => {
    const rewrote = scrubLoginUrl(location, navigate);
    if (!rewrote) setCheckingSession(false);
  }, [location, navigate]);

  // Expire stale visa intent on mount
  useEffect(() => {
    try {
      const ts = Number(sessionStorage.getItem(VISA_INTENT_KEY));
      if (ts && Date.now() - ts > VISA_INTENT_TTL_MS) {
        sessionStorage.removeItem(VISA_INTENT_KEY);
      }
    } catch {}
  }, []);

  // Persist a sanitized ?next= early (ONLY if internal)
  useEffect(() => {
    const n = params.get("next");
    const safe = sanitizeNext(n);
    if (safe) {
      try { sessionStorage.setItem(LOGIN_REDIRECT_KEY, safe); } catch {}
    }
  }, [params]);

  // Countdown for mobile resend
  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resolveTarget = useCallback(() => finalizeTarget(decidePostLoginTarget(location)), [location]);

  // If already logged in → redirect using gated resolver
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        if (!cancelled && res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data && data.user) {
            const target = resolveTarget();
            try { sessionStorage.removeItem(LOGIN_REDIRECT_KEY); } catch {}
            navigate(target, { replace: true });
            return;
          }
        }
      } catch {}
      if (!cancelled) setCheckingSession(false);
    })();
    return () => { cancelled = true; };
  }, [navigate, resolveTarget]);

  // After login, re-check session and then redirect using gated resolver
  const finishLogin = useCallback(async () => {
    const go = async () => {
      const target = resolveTarget();
      try { sessionStorage.removeItem(LOGIN_REDIRECT_KEY); } catch {}
      navigate(target, { replace: true });
    };
    try {
      const res = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data && data.user) return go();
      }
      // retry once quickly
      setTimeout(async () => {
        const res2 = await fetch(`${API_BASE}/api/auth/session`, { credentials: "include" });
        if (res2.ok) {
          const data2 = await res2.json().catch(() => ({}));
          if (data2 && data2.user) go();
        }
      }, 300);
    } catch {}
  }, [navigate, resolveTarget]);

  /* =================== Email OTP (Signup) =================== */
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

  /* =================== Email Login / Signup =================== */
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

  /* =================== Mobile OTP Login =================== */
  async function handleSendMobileOtp(e) {
    e.preventDefault();
    if (!mobile) return setError("Enter mobile number");
    setError(""); setLoading(true);
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
    setError(""); setLoading(true);
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
    setError(""); setLoading(true);
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
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  /* =================== Google Auth =================== */
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
      setError(err.message || "Google login failed, please try again.");
    }
  };
  const handleGoogleFailure = () => setError("Google login failed, please try again.");

  /* =================== Tabs =================== */
  const tabDefs = useMemo(() => {
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

  /* =================== UI =================== */
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

      {/* Left hero (visible like SS2) */}
      <div className="login-left-bg" style={{ ...S.leftBg, backgroundImage: `url(${loginBg})` }} />

      {/* Right form */}
      <div className="login-form-area" style={S.formArea}>
        <div style={S.formInner}>

          {/* Tabs row like SS2 */}
          <div className="login-tabs" style={S.tabs}>
            {tabDefs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setMode(t.key); setError(""); }}
                style={{ ...S.tabBtn, ...(mode === t.key ? S.tabBtnActive : {}) }}
              >
                <span style={S.bullet}>•</span> {t.label}
                {mode === t.key && <div style={S.underline} />}
              </button>
            ))}
          </div>

          {/* Google button positioned cleanly */}
          {ENABLE_GOOGLE && mode !== "mobile" && (
            <div style={{ margin: "8px 0 18px", width: "min(560px, 88vw)" }}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} useOneTap={false} />
            </div>
          )}

          {/* === EMAIL LOGIN / SIGNUP === */}
          {ENABLE_EMAIL && mode !== "mobile" && (
            <form onSubmit={handleSubmit} style={S.form}>
              {error && <div style={S.error}>{error}</div>}

              {mode === "signup" && (
                <div style={S.row}>
                  <div style={S.col}>
                    <label style={S.label}>First Name*</label>
                    <input name="firstName" style={S.input} value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div style={S.col}>
                    <label style={S.label}>Last Name*</label>
                    <input name="lastName" style={S.input} value={form.lastName} onChange={handleChange} required />
                  </div>
                </div>
              )}

              {/* Two-column like SS2 */}
              <div style={S.row}>
                <div style={S.col}>
                  <label style={S.label}>Email*</label>
                  <input type="email" name="email" style={S.input} value={form.email} onChange={handleChange} required />
                </div>
                <div style={S.col}>
                  <label style={S.label}>Password</label>
                  <input type="password" name="password" style={S.input} value={form.password} onChange={handleChange} required />
                </div>
              </div>

              {mode === "signup" && (
                <>
                  {!otpSent ? (
                    <button type="button" onClick={sendOtp} style={S.otpBtn}>
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  ) : !otpVerified ? (
                    <div style={S.row}>
                      <div style={S.col}>
                        <label style={S.label}>Enter OTP</label>
                        <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={S.input} />
                      </div>
                      <div style={{ ...S.col, display: "flex", alignItems: "flex-end" }}>
                        <button type="button" onClick={verifyOtp} style={S.otpBtn}>
                          {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "#bae6a1", fontWeight: 700, margin: "8px 0" }}>Email verified!</p>
                  )}

                  <div style={S.row}>
                    <div style={S.col}>
                      <label style={S.label}>Confirm Password</label>
                      <input type="password" name="confirmPassword" style={S.input} value={form.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div style={S.col}>
                      <label style={S.label}>Country</label>
                      <input name="country" style={S.input} value={form.country} onChange={handleChange} />
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginTop: 6 }}>
                <button type="submit" style={S.submitBtn}>
                  {mode === "login" ? "Log In" : "Sign Up"}
                </button>
              </div>
            </form>
          )}

          {/* === MOBILE LOGIN === */}
          {ENABLE_MOBILE && mode === "mobile" && (
            <form onSubmit={mobileOtpSent ? handleVerifyMobileOtp : handleSendMobileOtp} style={S.form}>
              {error && <div style={S.error}>{error}</div>}
              <div style={S.rowSingle}>
                <label style={S.label}>Mobile Number</label>
                <input type="tel" placeholder="Enter mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={10} style={S.input} required />
              </div>

              {mobileOtpSent ? (
                <>
                  <div style={S.rowSingle}>
                    <label style={S.label}>Enter OTP</label>
                    <input type="text" placeholder="Enter OTP" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value)} maxLength={6} style={S.input} required />
                  </div>
                  <button type="submit" style={S.submitBtn}>
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button type="button" onClick={handleResendMobileOtp} disabled={timer > 0 || loading} style={{ ...S.otpBtn, backgroundColor: timer > 0 ? "#888" : "#d06549", marginTop: "10px" }}>
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

          {/* Mobile verification modal (post Google) */}
          {showMobileModal && (
            <MobileVerificationModal
              show={showMobileModal}
              onClose={() => { setShowMobileModal(false); setPendingUser(null); }}
              onVerified={async () => {
                setShowMobileModal(false);
                onLogin?.(pendingUser);
                await finishLogin();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =================== styles =================== */
const S = {
  outer: {
    minHeight: "100vh",
    display: "grid",
    // Narrower blue column, wider photo (closer to old feel)
    gridTemplateColumns: "1.35fr 0.8fr",
    background: "linear-gradient(180deg, #00477f 0%, #0a5aa4 100%)",
    fontFamily: baseFont,
  },
  leftBg: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  },
  formArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // keep it elegant but not bulky
    padding: "5rem 2rem 3rem",
  },
  // Tighter content width (old maxWidth ≈ 600)
  formInner: {
    width: "min(640px, 90vw)",
    color: "#fff",
  },

  /* --- Tabs strip: keep compact --- */
  tabs: {
    display: "flex",
    gap: "1.4rem",
    marginBottom: "1.1rem",
    flexWrap: "wrap",
    maxWidth: "520px",
    justifyContent: "flex-start",
  },
  tabBtn: {
    position: "relative",
    background: "transparent",
    border: "none",
    color: "#c9def3",
    fontWeight: 800,
    fontSize: "1.45rem", // was 1.75rem
    cursor: "pointer",
    paddingBottom: 6,
    lineHeight: 1.15,
  },
  tabBtnActive: {
    color: "#ffffff",
  },
  underline: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "64px",
    height: "3px",
    background: "#ffffff",
    borderRadius: 2,
  },
  bullet: { marginRight: 8 },

  /* --- Form --- */
  form: {
    width: "min(640px, 90vw)",
    background: "transparent",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.2rem",
    marginBottom: "1rem",
  },
  rowSingle: { marginBottom: "1rem" },
  col: { display: "flex", flexDirection: "column" },
  label: {
    display: "block",
    color: "#e8f1fb",
    marginBottom: 6,
    fontWeight: 900,
    letterSpacing: ".4px",
    fontSize: "1.05rem",
  },
  input: {
    width: "100%",
    padding: "1rem 1rem",
    borderRadius: 12,
    border: "none",
    outline: "none",
    background: "#e6f0ff",
    color: "#0b315c",
    fontWeight: 700,
    boxShadow: "inset 0 1px 0 rgba(0,0,0,.06)",
  },
  otpBtn: {
    background: "#d06549",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: ".75rem 1rem",
    fontWeight: 900,
    cursor: "pointer",
  },
  submitBtn: {
    background: "#ffffff",
    color: "#00477f",
    border: "none",
    borderRadius: 12,
    padding: "1rem 1.1rem",
    fontWeight: 900,
    cursor: "pointer",
    width: "100%",
    marginTop: 6,
    boxShadow: "0 6px 16px rgba(0,0,0,.15)",
  },
  error: {
    background: "#ffefef",
    color: "#a40000",
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: 700,
  },
};

const responsiveCSS = `
/* Desktop → Tablet */
@media (max-width: 1080px) {
  .login-outer { grid-template-columns: 1fr; }
  .login-left-bg { display: none; }
}

/* Mirror old compact spacing on small screens */
@media (max-width: 600px) {
  .login-outer { min-height: 100vh !important; }
  .login-form-area { padding: 2rem !important; }
}
`;
