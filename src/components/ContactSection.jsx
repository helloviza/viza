// helloviza/client/src/components/ContactSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE as MAYBE_API_BASE } from "../utils/api";

const API_BASE = typeof MAYBE_API_BASE === "string" ? MAYBE_API_BASE : "https://api.helloviza.com";
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const bodyFont = "'Barlow', Arial, sans-serif";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

/** Responsive (SSR-safe) */
function useScreenSize() {
  const get = () => {
    if (typeof window === "undefined") return { w: 1200 };
    return { w: window.innerWidth };
  };
  const [s, setS] = useState(get);
  useEffect(() => {
    const onR = () => setS(get());
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return { isLt700: s.w <= 700, isLt900: s.w <= 900 };
}

export default function ContactSection() {
  const { t, i18n } = useTranslation("common");
  const { isLt700, isLt900 } = useScreenSize();

  // ── All original state ──────────────────────────────────────────────────────
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [subject, setSubject]       = useState("");
  const [mobile, setMobile]         = useState("");
  const [extraEmail, setExtraEmail] = useState("");
  const [message, setMessage]       = useState("");
  const [statusMsg, setStatusMsg]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [hp, setHp]                 = useState(""); // honeypot

  const showExtra = subject === "login" || subject === "signup";

  // ── Original subjects list ──────────────────────────────────────────────────
  const subjects = useMemo(
    () => [
      { v: "vaa",     l: t("contact.subjects.visaHelp",        { defaultValue: "Visa Application Assistance" }) },
      { v: "ptq",     l: t("contact.subjects.processingTime",  { defaultValue: "Processing Time Queries" }) },
      { v: "sdr",     l: t("contact.subjects.destinationReq",  { defaultValue: "Specific Destination Requirements" }) },
      { v: "cts",     l: t("contact.subjects.customTravel",    { defaultValue: "Customized Travel Solutions" }) },
      { v: "fpi",     l: t("contact.subjects.feePayment",      { defaultValue: "Fee and Payment Information" }) },
      { v: "login",   l: t("contact.subjects.unableLogin",     { defaultValue: "Unable to Login" }) },
      { v: "signup",  l: t("contact.subjects.failedSignup",    { defaultValue: "Failed to do Signup" }) },
      { v: "cr",      l: t("contact.subjects.consultation",    { defaultValue: "Consultation Requests" }) },
      { v: "partner", l: t("contact.subjects.partnership",     { defaultValue: "Partnership Requirement" }) },
      { v: "feedback",l: t("contact.subjects.feedback",        { defaultValue: "Feedback" }) },
    ],
    [t]
  );

  // ── Original handleSubmit — UNTOUCHED ───────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setStatusMsg("");

    if (hp) {
      setStatusMsg(t("contact.status.botBlocked", { defaultValue: "❌ Submission blocked." }));
      return;
    }

    if (showExtra && !/^\d{10,15}$/.test(mobile)) {
      setStatusMsg(t("contact.status.badMobile", { defaultValue: "❌ Enter a valid mobile number (10–15 digits)." }));
      return;
    }

    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      subject,
      message,
      loginMobile: showExtra ? mobile : "",
      loginEmail:  showExtra ? extraEmail : "",
      locale:      i18n.language || "en",
    };

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try { data = await response.json(); } catch {}

      if (response.status === 201) {
        setStatusMsg(t("contact.status.success", { defaultValue: "✅ Your query has been submitted!" }));
        setFirstName(""); setLastName(""); setEmail(""); setSubject("");
        setMobile(""); setExtraEmail(""); setMessage("");
      } else {
        setStatusMsg(
          data?.message ||
          t("contact.status.genericFail", { defaultValue: "❌ Something went wrong." })
        );
      }
    } catch {
      setStatusMsg(
        t("contact.status.serverDown", { defaultValue: "❌ Could not connect to server. Please try again later." })
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Shared input style ──────────────────────────────────────────────────────
  const fieldStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    outline: "none",
    fontSize: "0.9rem",
    fontFamily: bodyFont,
    color: "#1b1b1b",
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s",
    resize: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
    fontFamily: bodyFont,
  };

  // ── Success screen (mirrors ContactUs) ──────────────────────────────────────
  const isSuccess = statusMsg.startsWith("✅");

  return (
    <section
      style={{
        width: "100vw",
        maxWidth: "100%",
        background: "#fff",
        padding: isLt700 ? "100px 0 28px 0" : "4.5rem 0",
        fontFamily: baseFont,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
      dir={i18n.dir()}
    >
      <div
        style={{
          width: "97vw",
          maxWidth: "1100px",
          display: "flex",
          flexDirection: isLt900 ? "column" : "row",
          gap: isLt900 ? "1.2rem" : "3vw",
          alignItems: isLt900 ? "center" : "flex-start",
        }}
      >

        {/* ── LEFT: Info panel ─────────────────────────────────────── */}
        <div
          style={{
            flex: "1 1 42%",
            minWidth: 200,
            maxWidth: isLt900 ? "100%" : 420,
            width: isLt900 ? "100%" : undefined,
            textAlign: isLt900 ? "center" : "left",
          }}
        >
          <p
            style={{
              color: ACCENT,
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: "0.75rem",
              fontFamily: baseFont,
            }}
          >
            {t("contact.eyebrow", { defaultValue: "Get In Touch" })}
          </p>

          <h1
            style={{
              fontFamily: baseFont,
              fontWeight: 900,
              color: BRAND,
              lineHeight: 1,
              margin: "0 0 1.25rem 0",
              letterSpacing: "-1px",
              fontSize: isLt700 ? "2.5rem" : "3rem",
            }}
          >
            {t("contact.title", { defaultValue: "Contact" })}{" "}
            <em style={{ color: ACCENT, fontStyle: "italic" }}>
              {t("contact.titleAccent", { defaultValue: "Us" })}
            </em>
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "1rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
              fontFamily: bodyFont,
            }}
          >
            {t("contact.intro", {
              defaultValue:
                "Have a question about your visa, need help with documents, or want to partner with us? We're here to help.",
            })}
          </p>

          {/* Contact details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
                label: t("contact.emailHeading", { defaultValue: "E-MAIL ADDRESS" }),
                value: "hello@helloviza.com",
                href: "mailto:hello@helloviza.com",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  </svg>
                ),
                label: t("contact.officeLabel", { defaultValue: "OFFICE" }),
                value: "New Delhi, India",
                href: null,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: isLt900 ? "center" : "flex-start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(208,101,73,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ textAlign: isLt900 ? "left" : "left" }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 2,
                      fontFamily: bodyFont,
                    }}
                  >
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        fontFamily: baseFont,
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: BRAND,
                        textDecoration: "none",
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div style={{ fontFamily: baseFont, fontSize: "1rem", fontWeight: 700, color: BRAND }}>
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Business hours */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1.25rem",
              borderRadius: 16,
              background: "rgba(0,71,127,0.05)",
              border: "1px solid rgba(0,71,127,0.1)",
            }}
          >
            <p
              style={{
                fontFamily: baseFont,
                fontWeight: 900,
                color: BRAND,
                fontSize: "1rem",
                margin: "0 0 0.75rem 0",
              }}
            >
              {t("contact.hoursHeading", { defaultValue: "Working Hours" })}
            </p>
            {[
              { day: t("contact.hoursMF",  { defaultValue: "Mon – Fri" }), time: "9:00 AM – 7:00 PM IST" },
              { day: t("contact.hoursSat", { defaultValue: "Saturday" }),  time: "10:00 AM – 5:00 PM IST" },
              { day: t("contact.hoursSun", { defaultValue: "Sunday" }),    time: t("contact.hoursLine", { defaultValue: "Monday – Sunday, 9 AM – 8 PM, IST" }).includes("Sunday") ? "Emergency Support Only" : "Emergency Support Only" },
            ].map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                  marginBottom: i < 2 ? 6 : 0,
                  fontFamily: bodyFont,
                }}
              >
                <span style={{ color: "#6b7280" }}>{h.day}</span>
                <span style={{ color: BRAND, fontWeight: 600 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form card ──────────────────────────────────────── */}
        <div
          style={{
            flex: "1 1 58%",
            width: isLt900 ? "100%" : undefined,
            maxWidth: isLt900 ? "100%" : undefined,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              padding: isLt700 ? "1.5rem 1rem" : "2.5rem",
              background: "#f8f9fc",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Success state */}
            {isSuccess ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="#22c55e" strokeWidth="2"/>
                    <path d="M10 16l4 4 8-8" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: baseFont,
                    fontWeight: 900,
                    color: BRAND,
                    fontSize: "1.5rem",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {t("contact.successTitle", { defaultValue: "Message Sent!" })}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "0.9rem", fontFamily: bodyFont, margin: 0 }}>
                  {t("contact.successSub", { defaultValue: "Our team will get back to you within 2 business hours." })}
                </p>
                <button
                  onClick={() => setStatusMsg("")}
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.6rem 1.5rem",
                    borderRadius: 12,
                    background: BRAND,
                    color: "#fff",
                    fontFamily: baseFont,
                    fontWeight: 700,
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("contact.sendAnother", { defaultValue: "Send Another Message" })}
                </button>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                autoComplete="off"
                aria-label={t("contact.formAria", { defaultValue: "Contact form" })}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                <h3
                  style={{
                    fontFamily: baseFont,
                    fontWeight: 900,
                    color: BRAND,
                    fontSize: "1.25rem",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("contact.formTitle", { defaultValue: "Send Us a Message" })}
                </h3>

                {/* First + Last name row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isLt700 ? "1fr" : "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="firstName">
                      {t("contact.firstName", { defaultValue: "First Name*" })}
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder={t("contact.fnPlaceholder", { defaultValue: "Enter name" })}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      style={fieldStyle}
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="lastName">
                      {t("contact.lastName", { defaultValue: "Last Name*" })}
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder={t("contact.lnPlaceholder", { defaultValue: "Enter last name" })}
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      style={fieldStyle}
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Email + Subject row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isLt700 ? "1fr" : "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="email">
                      {t("contact.email", { defaultValue: "Email Address*" })}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={t("contact.emailPlaceholder", { defaultValue: "Enter e-mail" })}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={fieldStyle}
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="subject">
                      {t("contact.subject", { defaultValue: "Subject*" })}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      style={{ ...fieldStyle, color: subject ? "#1b1b1b" : "#9ca3af" }}
                      aria-required="true"
                    >
                      <option value="">{t("contact.selectSubject", { defaultValue: "Select subject" })}</option>
                      {subjects.map(s => (
                        <option key={s.v} value={s.v}>{s.l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conditional extra fields (login/signup) */}
                {showExtra && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isLt700 ? "1fr" : "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle} htmlFor="mobile">
                        {t("contact.mobile", { defaultValue: "Mobile Number*" })}
                      </label>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        required
                        placeholder={t("contact.mobilePlaceholder", { defaultValue: "Enter mobile number" })}
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        pattern="[0-9]{10,15}"
                        maxLength={15}
                        style={fieldStyle}
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="extraEmail">
                        {t("contact.extraEmail", { defaultValue: "Email ID*" })}
                      </label>
                      <input
                        id="extraEmail"
                        name="extraEmail"
                        type="email"
                        required
                        placeholder={t("contact.extraEmailPlaceholder", { defaultValue: "Enter email id" })}
                        value={extraEmail}
                        onChange={e => setExtraEmail(e.target.value)}
                        style={fieldStyle}
                        aria-required="true"
                      />
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label style={labelStyle} htmlFor="message">
                    {t("contact.message", { defaultValue: "Message*" })}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t("contact.msgPlaceholder", { defaultValue: "Tell us how we can help…" })}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ ...fieldStyle, minHeight: 120, maxHeight: 240 }}
                    aria-required="true"
                  />
                </div>

                {/* Honeypot (visually hidden) — ORIGINAL UNTOUCHED */}
                <div style={{ position: "absolute", left: "-5000px", height: 0, overflow: "hidden" }}>
                  <label htmlFor="company">{t("contact.hpLabel", { defaultValue: "Company" })}</label>
                  <input id="company" name="company" type="text" value={hp} onChange={e => setHp(e.target.value)} />
                </div>

                {/* Error message */}
                {statusMsg && !isSuccess && (
                  <p
                    role="status"
                    style={{
                      color: "#ef4444",
                      fontSize: "0.9rem",
                      fontFamily: bodyFont,
                      margin: 0,
                    }}
                  >
                    {statusMsg}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading ? "true" : "false"}
                  style={{
                    width: "100%",
                    padding: isLt700 ? "0.875rem" : "1rem",
                    borderRadius: 12,
                    border: "none",
                    background: loading
                      ? "#aaa"
                      : `linear-gradient(135deg, ${BRAND} 0%, #005fa3 100%)`,
                    boxShadow: loading ? "none" : "0 8px 24px rgba(0,71,127,0.3)",
                    color: "#fff",
                    fontFamily: baseFont,
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    transition: "transform .15s, background .18s",
                    transform: "scale(1)",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg
                        style={{ animation: "spin 1s linear infinite", width: 20, height: 20 }}
                        viewBox="0 0 24 24" fill="none"
                      >
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      {t("contact.submitting", { defaultValue: "Submitting…" })}
                    </span>
                  ) : (
                    `${t("contact.submitCta", { defaultValue: "Submit Your Query" })} →`
                  )}
                </button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}