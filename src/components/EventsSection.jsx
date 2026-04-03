import React, { useState, useRef, useEffect } from "react";

/* ─── Brand tokens (from Login.jsx) ─────────────────────────────
   Brand  : #00477f  deep navy blue
   Accent : #d06549  warm terracotta / coral
   Light  : #e6f0ff  sky tint (Login input bg)
   Mid    : #0a5aa4  mid-blue (Login gradient stop)
──────────────────────────────────────────────────────────────── */

const API_BASE =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

const PROPOSAL_ENDPOINT = `${API_BASE}/api/proposals/submit`;

/* ══════════════════════════════════════════════
   OTP BOX
══════════════════════════════════════════════ */
function OtpBox({ value, onChange }) {
  const refs = useRef([]);
  const chars = (value || "").split("").concat(["", "", "", ""]).slice(0, 4);

  function handleKey(i, e) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...chars];
      if (next[i]) next[i] = "";
      else if (i > 0) { next[i - 1] = ""; refs.current[i - 1]?.focus(); }
      onChange(next.join(""));
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < 3) refs.current[i + 1]?.focus();
    else if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const next = [...chars]; next[i] = e.key;
      onChange(next.join(""));
      if (i < 3) refs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const next = p.split("").concat(["", "", "", ""]).slice(0, 4);
    onChange(next.join(""));
    refs.current[Math.min(p.length, 3)]?.focus();
  }

  return (
    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "0.75rem" }}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={ch} onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: "3.2rem", height: "3.6rem",
            textAlign: "center", fontSize: "1.6rem", fontWeight: 900,
            borderRadius: "0.75rem",
            border: ch ? "2.5px solid #d06549" : "2px solid #c9def3",
            background: ch ? "#fff5f2" : "#e6f0ff",
            color: "#00477f", outline: "none",
            boxShadow: ch ? "0 2px 12px rgba(208,101,73,.2)" : "inset 0 1px 2px rgba(0,0,0,.04)",
            transition: "all .15s",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOBILE VERIFICATION MODAL
══════════════════════════════════════════════ */
function MobileVerificationModal({ show, mobile, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => { if (show && !otpSent) sendOtp(); }, [show]); // eslint-disable-line

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  async function sendOtp() {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/send-otp-mobile`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ mobile, type: "login" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true); setTimer(30);
    } catch (err) { setError(err.message || "Failed to send OTP"); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (otp.length < 4) return setError("Please enter all 4 digits");
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/verify-otp-mobile`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Invalid OTP");
      onVerified();
    } catch (err) { setError(err.message || "OTP verification failed"); setOtp(""); }
    finally { setLoading(false); }
  }

  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", padding: "1rem" }}>
      <div className="ev-fadeIn" style={{ position: "relative", background: "#fff", borderRadius: "1.5rem", boxShadow: "0 32px 80px rgba(0,71,127,.25)", width: "100%", maxWidth: "22rem", padding: "2.25rem 2rem" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", width: "2rem", height: "2rem", borderRadius: "50%", border: "none", background: "#e6f0ff", color: "#00477f", fontWeight: 900, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ✕
        </button>

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <div style={{ width: "5rem", height: "5rem", borderRadius: "1.25rem", background: "linear-gradient(135deg,#e6f0ff,#c9def3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", boxShadow: "0 4px 20px rgba(0,71,127,.15)" }}>
            📱
          </div>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: 900, color: "#00477f", letterSpacing: "-.02em", marginBottom: ".25rem" }}>
          Verify Your Number
        </h2>
        <p style={{ textAlign: "center", fontSize: ".875rem", color: "#5a7a9a", marginBottom: "1.5rem" }}>
          OTP sent to <strong style={{ color: "#00477f" }}>+91 {mobile}</strong>
        </p>

        {error && (
          <div style={{ background: "#ffefef", border: "1px solid #ffc9c9", color: "#a40000", borderRadius: ".75rem", padding: ".625rem 1rem", marginBottom: "1rem", fontSize: ".875rem", fontWeight: 700, textAlign: "center" }}>
            {error}
          </div>
        )}

        <OtpBox value={otp} onChange={setOtp} />

        <button onClick={verifyOtp} disabled={loading || otp.length < 4}
          style={{
            marginTop: "1.5rem", width: "100%", padding: ".9rem", borderRadius: "1rem",
            border: "none", fontWeight: 900, fontSize: "1rem", cursor: otp.length < 4 ? "not-allowed" : "pointer",
            color: "#fff", transition: "all .2s",
            background: otp.length === 4 ? "#d06549" : "#b0c8e0",
            boxShadow: otp.length === 4 ? "0 6px 20px rgba(208,101,73,.35)" : "none",
            opacity: loading ? .7 : 1,
          }}>
          {loading ? "Verifying…" : "Confirm & Continue"}
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: ".875rem" }}>
          {timer > 0
            ? <span style={{ color: "#8aa5c0" }}>Resend in <strong style={{ color: "#00477f" }}>{timer}s</strong></span>
            : <button onClick={sendOtp} disabled={loading}
                style={{ background: "none", border: "none", color: "#d06549", fontWeight: 900, textDecoration: "underline", cursor: "pointer", fontSize: ".875rem" }}>
                Resend Code
              </button>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
      <label style={{ fontSize: ".7rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a7a9a" }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{error}</span>}
    </div>
  );
}

function useInputStyle(hasErr) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%", padding: ".75rem 1rem", borderRadius: ".75rem",
    border: hasErr
      ? (focused ? "1.5px solid #d06549" : "1.5px solid #d06549")
      : (focused ? "1.5px solid #00477f" : "1.5px solid #c9def3"),
    background: hasErr ? (focused ? "#fff" : "#fff5f2") : (focused ? "#fff" : "#e6f0ff"),
    color: "#0b315c", fontWeight: 600, fontSize: ".9rem",
    outline: "none", transition: "all .18s", fontFamily: "inherit",
    boxShadow: focused
      ? `0 0 0 3px ${hasErr ? "rgba(208,101,73,.12)" : "rgba(0,71,127,.1)"}`
      : "inset 0 1px 2px rgba(0,0,0,.04)",
  };
  return { style: base, onFocus: () => setFocused(true), onBlur: () => setFocused(false) };
}

function Inp({ hasErr, style: extraStyle, ...props }) {
  const { style, onFocus, onBlur } = useInputStyle(hasErr);
  return <input {...props} style={{ ...style, ...extraStyle }} onFocus={onFocus} onBlur={onBlur} />;
}
function Sel({ hasErr, children, ...props }) {
  const { style, onFocus, onBlur } = useInputStyle(hasErr);
  return <select {...props} style={{ ...style, appearance: "none", cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>{children}</select>;
}
function Txt({ hasErr, ...props }) {
  const { style, onFocus, onBlur } = useInputStyle(hasErr);
  return <textarea {...props} style={{ ...style, resize: "none" }} onFocus={onFocus} onBlur={onBlur} />;
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function EventsSection() {
  const [form, setForm] = useState({
    fullName: "", company: "", email: "", phone: "",
    eventType: "Meetings", groupSize: "", preferredDates: "",
    city: "", budget: "", notes: "",
  });
  const [errors, setErrors] = useState({});
  const [mobileVerified, setMobileVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [submitMsg, setSubmitMsg] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (name === "phone") setMobileVerified(false);
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
    if (!form.groupSize.trim()) e.groupSize = "Group size is required";
    if (!form.city.trim()) e.city = "City / Destination is required";
    return e;
  }

  function handleVerifyClick() {
    if (!form.phone || !/^\d{10}$/.test(form.phone))
      return setErrors((p) => ({ ...p, phone: "Enter a valid 10-digit number first" }));
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    if (!mobileVerified) return setErrors((p) => ({ ...p, phone: "Please verify your mobile number" }));
    setSubmitState("loading");
    try {
      const res = await fetch(PROPOSAL_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ ...form, mobileVerified: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed. Please try again.");
      setSubmitState("success");
      setSubmitMsg(data.message || "Your request has been received! We'll be in touch within 24 hours.");
    } catch (err) {
      setSubmitState("error");
      setSubmitMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  /* ── Success screen ── */
  if (submitState === "success") {
    return (
      <section style={{ marginTop: "5rem", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ textAlign: "center", maxWidth: "28rem", margin: "0 auto" }}>
          <div style={{ width: "6rem", height: "6rem", borderRadius: "1.5rem", background: "linear-gradient(135deg,#e6f0ff,#c9def3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", margin: "0 auto 1.5rem", boxShadow: "0 8px 32px rgba(0,71,127,.2)" }}>
            🎉
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#00477f", letterSpacing: "-.03em", marginBottom: ".75rem" }}>Request Sent!</h2>
          <p style={{ fontWeight: 500, color: "#5a7a9a", lineHeight: 1.7, marginBottom: "2rem" }}>{submitMsg}</p>
          <button onClick={() => {
            setSubmitState("idle");
            setForm({ fullName:"",company:"",email:"",phone:"",eventType:"Meetings",groupSize:"",preferredDates:"",city:"",budget:"",notes:"" });
            setMobileVerified(false); setErrors({});
          }}
            style={{ background: "#d06549", color: "#fff", border: "none", borderRadius: "1rem", padding: ".9rem 2.5rem", fontWeight: 900, fontSize: "1rem", cursor: "pointer", boxShadow: "0 8px 24px rgba(208,101,73,.35)" }}>
            Submit Another Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <MobileVerificationModal
        show={showModal} mobile={form.phone}
        onClose={() => setShowModal(false)}
        onVerified={() => { setMobileVerified(true); setShowModal(false); }}
      />

      <section style={{ marginTop: "5rem", padding: "0 1rem 7rem" }}>

        {/* ════ HERO ════ */}
        <div style={{ maxWidth: "64rem", margin: "0 auto 4rem", textAlign: "center" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", borderRadius: "9999px", padding: ".5rem 1.25rem", fontSize: ".7rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", background: "#e6f0ff", color: "#00477f", border: "1.5px solid #c9def3", marginBottom: "1.75rem" }}>
            <span className="ev-pulse" style={{ width: ".5rem", height: ".5rem", borderRadius: "50%", background: "#d06549", display: "inline-block" }} />
            Events Coming Soon
          </div>

          <h1 style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: "1.5rem", fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#00477f" }}>
            Something{" "}
            <span style={{ position: "relative", display: "inline-block", color: "#d06549" }}>
              extraordinary
              <svg style={{ position: "absolute", left: 0, bottom: "-4px", width: "100%" }} height="6" viewBox="0 0 300 6" fill="none" preserveAspectRatio="none">
                <path d="M0 4 Q75 0 150 4 Q225 8 300 4" stroke="#d06549" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </span>{" "}
            is being planned.
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.75, fontWeight: 500, color: "#4a6a88", maxWidth: "42rem", margin: "0 auto" }}>
            We're crafting experiences that will leave your guests breathless — conferences, brand moments,
            gala dinners, and everything in between. While our events calendar comes to life,{" "}
            <strong style={{ color: "#00477f" }}>don't wait.</strong>{" "}
            Tell us what you're envisioning, and we'll build it around you — on your terms, your timeline.
          </p>

          {/* Decorative divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", marginTop: "2.5rem" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "inline-block", borderRadius: "9999px", height: ".5rem", width: i === 1 ? "2rem" : ".5rem", background: i === 1 ? "#d06549" : "#c9def3" }} />
            ))}
          </div>
        </div>

        {/* ════ CARD — max-w-6xl for wide desktop ════ */}
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ borderRadius: "1.75rem", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,71,127,.16), 0 4px 16px rgba(0,71,127,.08)", border: "1px solid #daeaff" }}>

            {/* ── Header ── */}
            <div style={{ position: "relative", overflow: "hidden", padding: "2.25rem 2.75rem", background: "linear-gradient(125deg, #00477f 0%, #0a5aa4 55%, #1a6ac0 100%)" }}>
              {/* decorative blobs */}
              <div style={{ position: "absolute", top: "-3rem", right: "-3rem", width: "14rem", height: "14rem", borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
              <div style={{ position: "absolute", bottom: "-2rem", left: "30%", width: "20rem", height: "8rem", borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
              {/* accent left bar */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "5px", background: "#d06549", borderRadius: "0 4px 4px 0" }} />

              <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: ".7rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".12em", color: "#c9def3", marginBottom: ".5rem" }}>
                    📋 Proposal Request
                  </p>
                  <h2 style={{ fontWeight: 900, fontSize: "1.75rem", color: "#fff", letterSpacing: "-.02em", margin: 0 }}>
                    Let's Plan Your Next Event
                  </h2>
                  <p style={{ marginTop: ".4rem", color: "#93b8d8", fontSize: ".9rem", fontWeight: 500 }}>
                    Share the essentials — we'll respond with curated ideas &amp; budgets within 24 hrs.
                  </p>
                </div>
                <div style={{ display: "flex", gap: ".75rem" }}>
                  {["🏢", "🌆", "🎤"].map((em, i) => (
                    <div key={i} style={{ width: "2.75rem", height: "2.75rem", borderRadius: ".875rem", background: "rgba(255,255,255,.12)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                      {em}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Form body ── */}
            <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "2.5rem 2.75rem 2.25rem" }}>

              {submitState === "error" && (
                <div style={{ background: "#ffefef", border: "1px solid #ffc9c9", color: "#a40000", borderRadius: ".875rem", padding: ".75rem 1rem", fontSize: ".875rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                  {submitMsg}
                </div>
              )}

              {/* Row 1 — 3 cols */}
              <div className="ev-grid-3 ev-gap" style={{ marginBottom: "1.25rem" }}>
                <Field label="Full Name *" error={errors.fullName}>
                  <Inp hasErr={!!errors.fullName} name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jane Smith" />
                </Field>
                <Field label="Company *" error={errors.company}>
                  <Inp hasErr={!!errors.company} name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" />
                </Field>
                <Field label="Email *" error={errors.email}>
                  <Inp hasErr={!!errors.email} type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" />
                </Field>
              </div>

              {/* Row 2 — 3 cols */}
              <div className="ev-grid-3 ev-gap" style={{ marginBottom: "1.25rem" }}>
                {/* Phone + verify */}
                <Field label="Mobile Number *" error={errors.phone}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: ".875rem", top: "50%", transform: "translateY(-50%)", fontSize: ".875rem", fontWeight: 900, color: "#00477f", pointerEvents: "none", userSelect: "none" }}>+91</span>
                    <Inp hasErr={!!errors.phone} type="tel" name="phone" value={form.phone} onChange={handleChange}
                      maxLength={10} placeholder="98765 43210"
                      style={{ paddingLeft: "2.75rem", paddingRight: "5.25rem" }} />
                    <button type="button" onClick={handleVerifyClick}
                      style={{
                        position: "absolute", right: ".5rem", top: "50%", transform: "translateY(-50%)",
                        fontSize: ".75rem", fontWeight: 900, padding: ".4rem .75rem", borderRadius: ".5rem",
                        border: "none", cursor: "pointer", transition: "all .2s",
                        ...(mobileVerified
                          ? { background: "#d1fae5", color: "#065f46" }
                          : { background: "#d06549", color: "#fff", boxShadow: "0 2px 8px rgba(208,101,73,.4)" }),
                      }}>
                      {mobileVerified ? "✓ Done" : "Verify"}
                    </button>
                  </div>
                </Field>

                <Field label="Event Type">
                  <Sel name="eventType" value={form.eventType} onChange={handleChange}>
                    {["Meetings", "Conference", "Product Launch", "Corporate Dinner", "Team Offsite", "Workshop", "Gala / Awards", "Other"].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </Sel>
                </Field>

                <Field label="Group Size (approx.) *" error={errors.groupSize}>
                  <Inp hasErr={!!errors.groupSize} name="groupSize" value={form.groupSize} onChange={handleChange} placeholder="e.g. 50–100" />
                </Field>
              </div>

              {/* Row 3 — 3 cols */}
              <div className="ev-grid-3 ev-gap" style={{ marginBottom: "1.25rem" }}>
                <Field label="Preferred Dates">
                  <Inp name="preferredDates" value={form.preferredDates} onChange={handleChange} placeholder="15 Aug – 17 Aug" />
                </Field>
                <Field label="City / Destination *" error={errors.city}>
                  <Inp hasErr={!!errors.city} name="city" value={form.city} onChange={handleChange} placeholder="Mumbai, Goa, Jaipur…" />
                </Field>
                <Field label="Budget (₹) or range">
                  <Inp name="budget" value={form.budget} onChange={handleChange} placeholder="₹5L – ₹10L" />
                </Field>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: "1.25rem" }}>
                <Field label="Notes / Special Requests">
                  <Txt name="notes" value={form.notes} onChange={handleChange} rows={4}
                    placeholder="Agenda highlights, venue preferences, production ideas, dietary needs, AV requirements…" />
                </Field>
              </div>

              {/* Verify notice */}
              {!mobileVerified && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: ".875rem", borderRadius: "1rem", padding: "1rem 1.25rem", marginBottom: "1.25rem", background: "#e6f0ff", border: "1.5px solid #c9def3" }}>
                  <span style={{ fontSize: "1.25rem", color: "#d06549", flexShrink: 0, marginTop: ".1rem" }}>🔒</span>
                  <p style={{ fontSize: ".875rem", fontWeight: 600, color: "#00477f", lineHeight: 1.55, margin: 0 }}>
                    Mobile verification is required before submitting.{" "}
                    <button type="button" onClick={handleVerifyClick}
                      style={{ background: "none", border: "none", color: "#d06549", fontWeight: 900, textDecoration: "underline", textUnderlineOffset: ".15em", cursor: "pointer", fontSize: ".875rem" }}>
                      Click Verify
                    </button>{" "}
                    next to your number to receive your one-time code.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={!mobileVerified || submitState === "loading"}
                style={{
                  width: "100%", padding: "1.1rem", borderRadius: "1rem", border: "none",
                  fontWeight: 900, fontSize: "1.05rem", letterSpacing: ".02em",
                  cursor: mobileVerified ? "pointer" : "not-allowed",
                  transition: "all .25s",
                  color: "#fff",
                  ...(mobileVerified
                    ? { background: "linear-gradient(135deg, #d06549 0%, #b84f38 100%)", boxShadow: "0 8px 28px rgba(208,101,73,.4)" }
                    : { background: "#c9def3", color: "#8aa5c0" }),
                }}
                onMouseEnter={(e) => { if (mobileVerified) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                {submitState === "loading" ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
                    <svg style={{ animation: "spin 1s linear infinite", width: "1.25rem", height: "1.25rem" }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: .25 }} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" style={{ opacity: .75 }} />
                    </svg>
                    Sending your request…
                  </span>
                ) : mobileVerified
                  ? "Send My Proposal Request →"
                  : "🔒  Verify Mobile to Unlock Submission"
                }
              </button>

              <p style={{ textAlign: "center", fontSize: ".78rem", fontWeight: 500, color: "#93b8d8", marginTop: "1rem" }}>
                No commitment required — just a conversation. We respond within 24 hours.
              </p>

            </form>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes evFadeIn {
          from { opacity:0; transform: scale(.96) translateY(10px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .ev-fadeIn { animation: evFadeIn .25s ease-out both; }

        @keyframes evPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.55; transform:scale(1.5); }
        }
        .ev-pulse { animation: evPulse 1.8s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsive grid helpers */
        .ev-grid-3 { display: grid; grid-template-columns: 1fr; }
        .ev-gap    { gap: 1.25rem; }

        @media (min-width: 640px) {
          .ev-grid-3 { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .ev-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>
    </>
  );
}