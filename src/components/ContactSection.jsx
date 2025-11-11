// helloviza/client/src/components/ContactSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE as MAYBE_API_BASE } from "../utils/api"; // if not present, fallback below

const API_BASE = typeof MAYBE_API_BASE === "string" ? MAYBE_API_BASE : "https://api.helloviza.com";
const baseFont = "'Barlow Condensed', Arial, sans-serif";

const inputStyle = {
  fontFamily: baseFont,
  fontSize: "1.1rem",
  background: "#d8e7f3",
  border: "none",
  outline: "none",
  borderRadius: "0px",
  padding: "1.1rem 1.25rem",
  marginBottom: 0,
  color: "#1b1b1b",
  fontWeight: 400,
  width: "100%",
  resize: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: baseFont,
  fontWeight: 700,
  fontSize: "1.13rem",
  marginBottom: ".32rem",
  color: "#00477f",
  letterSpacing: ".02em",
};

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [subject, setSubject]     = useState("");
  const [mobile, setMobile]       = useState("");
  const [extraEmail, setExtraEmail] = useState("");
  const [message, setMessage]     = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading]     = useState(false);

  // honeypot (basic bot deterrent)
  const [hp, setHp] = useState("");

  const showExtra = subject === "login" || subject === "signup";

  const sectionPad = isLt700 ? "100px 0 28px 0" : "4.5rem 0";
  const containerFlexDir = isLt900 ? "column" : "row";
  const containerGap = isLt900 ? "1.2rem" : "3vw";
  const leftAlign = isLt900 ? "center" : "flex-start";
  const leftTextAlign = isLt900 ? "center" : "left";
  const leftH1Size = isLt700 ? "2.2rem" : "3.8rem";
  const formMinWidth = isLt700 ? "100%" : 320;
  const nameRowDisplay = isLt700 ? "block" : "flex";
  const nameRowGap = isLt700 ? "0" : "1.3rem";

  const subjects = useMemo(
    () => [
      { v: "vaa",    l: t("contact.subjects.visaHelp",           { defaultValue: "Visa Application Assistance" }) },
      { v: "ptq",    l: t("contact.subjects.processingTime",     { defaultValue: "Processing Time Queries" }) },
      { v: "sdr",    l: t("contact.subjects.destinationReq",     { defaultValue: "Specific Destination Requirements" }) },
      { v: "cts",    l: t("contact.subjects.customTravel",       { defaultValue: "Customized Travel Solutions" }) },
      { v: "fpi",    l: t("contact.subjects.feePayment",         { defaultValue: "Fee and Payment Information" }) },
      { v: "login",  l: t("contact.subjects.unableLogin",        { defaultValue: "Unable to Login" }) },
      { v: "signup", l: t("contact.subjects.failedSignup",       { defaultValue: "Failed to do Signup" }) },
      { v: "cr",     l: t("contact.subjects.consultation",       { defaultValue: "Consultation Requests" }) },
      { v: "partner",l: t("contact.subjects.partnership",        { defaultValue: "Partnership Requirement" }) },
      { v: "feedback",l:t("contact.subjects.feedback",           { defaultValue: "Feedback" }) },
    ],
    [t]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setStatusMsg("");

    // honeypot check
    if (hp) {
      setStatusMsg(t("contact.status.botBlocked", { defaultValue: "❌ Submission blocked." }));
      return;
    }

    // basic client validation
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
      loginEmail: showExtra ? extraEmail : "",
      locale: i18n.language || "en",
    };

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // If non-JSON or empty body, guard safely
      let data = {};
      try { data = await response.json(); } catch {}

      if (response.status === 201) {
        setStatusMsg(t("contact.status.success", { defaultValue: "✅ Your query has been submitted!" }));
        // Reset form
        setFirstName(""); setLastName(""); setEmail(""); setSubject("");
        setMobile(""); setExtraEmail(""); setMessage("");
      } else {
        setStatusMsg(
          data?.message ||
          t("contact.status.genericFail", { defaultValue: "❌ Something went wrong." })
        );
      }
    } catch (err) {
      setStatusMsg(
        t("contact.status.serverDown", { defaultValue: "❌ Could not connect to server. Please try again later." })
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        width: "100vw",
        maxWidth: "100%",
        background: "#fff",
        padding: sectionPad,
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
          flexDirection: containerFlexDir,
          gap: containerGap,
          background: "#fff",
          borderRadius: "0px",
          boxShadow: "0 8px 32px 0 rgba(32,32,32,0.08)",
          padding: isLt700 ? "2.2rem 1rem" : "3rem 2rem",
          alignItems: leftAlign,
        }}
      >
        {/* Left: Info */}
        <div
          style={{
            flex: "1 1 33%",
            minWidth: 200,
            maxWidth: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: leftAlign,
            marginBottom: isLt900 ? "2rem" : 0,
            textAlign: leftTextAlign,
          }}
        >
          <h1
            style={{
              fontSize: leftH1Size,
              fontWeight: 700,
              margin: "0 0 1.2rem 0",
              lineHeight: 0.98,
              color: "#00477f",
              letterSpacing: "-1px",
            }}
          >
            {t("contact.title", { defaultValue: "Contact" })}
          </h1>

          <div style={{ marginBottom: "1.3rem" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#00477f",
                marginBottom: ".11rem",
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              {t("contact.emailHeading", { defaultValue: "E–MAIL ADDRESS" })}
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                color: "#d06549",
                fontWeight: 700,
                letterSpacing: "-.02em",
                marginTop: ".1rem",
              }}
            >
              hello@helloviza.com
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#00477f",
                marginBottom: ".11rem",
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              {t("contact.hoursHeading", { defaultValue: "WORKING HOURS" })}
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                color: "#d06549",
                fontWeight: 700,
                letterSpacing: "-.02em",
                marginTop: ".1rem",
              }}
            >
              {t("contact.hoursLine", { defaultValue: "Monday – Sunday, 9 AM – 8 PM, IST" })}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <form
          style={{
            flex: "1 1 67%",
            minWidth: formMinWidth,
            display: "flex",
            flexDirection: "column",
            gap: "1.08rem",
            background: "transparent",
          }}
          autoComplete="off"
          onSubmit={handleSubmit}
          aria-label={t("contact.formAria", { defaultValue: "Contact form" })}
        >
          <div
            style={{
              display: nameRowDisplay,
              gap: nameRowGap,
              marginBottom: ".4rem",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginBottom: isLt700 ? "1rem" : 0 }}>
              <label style={labelStyle} htmlFor="firstName">{t("contact.firstName", { defaultValue: "First Name*" })}</label>
              <input
                id="firstName"
                name="firstName"
                style={inputStyle}
                type="text"
                placeholder={t("contact.fnPlaceholder", { defaultValue: "Enter name" })}
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                aria-required="true"
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={labelStyle} htmlFor="lastName">{t("contact.lastName", { defaultValue: "Last Name*" })}</label>
              <input
                id="lastName"
                name="lastName"
                style={inputStyle}
                type="text"
                placeholder={t("contact.lnPlaceholder", { defaultValue: "Enter last name" })}
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                aria-required="true"
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle} htmlFor="email">{t("contact.email", { defaultValue: "Email Address*" })}</label>
            <input
              id="email"
              name="email"
              style={inputStyle}
              type="email"
              placeholder={t("contact.emailPlaceholder", { defaultValue: "Enter e-mail" })}
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-required="true"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle} htmlFor="subject">{t("contact.subject", { defaultValue: "Subject*" })}</label>
            <select
              id="subject"
              name="subject"
              style={inputStyle}
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              aria-required="true"
            >
              <option value="">{t("contact.selectSubject", { defaultValue: "Select subject" })}</option>
              {subjects.map(s => (
                <option key={s.v} value={s.v}>{s.l}</option>
              ))}
            </select>
          </div>

          {showExtra && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle} htmlFor="mobile">{t("contact.mobile", { defaultValue: "Mobile Number*" })}</label>
                <input
                  id="mobile"
                  name="mobile"
                  style={inputStyle}
                  type="tel"
                  placeholder={t("contact.mobilePlaceholder", { defaultValue: "Enter mobile number" })}
                  value={mobile}
                  required
                  onChange={e => setMobile(e.target.value)}
                  pattern="[0-9]{10,15}"
                  maxLength={15}
                  aria-required="true"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle} htmlFor="extraEmail">{t("contact.extraEmail", { defaultValue: "Email ID*" })}</label>
                <input
                  id="extraEmail"
                  name="extraEmail"
                  style={inputStyle}
                  type="email"
                  placeholder={t("contact.extraEmailPlaceholder", { defaultValue: "Enter email id" })}
                  value={extraEmail}
                  required
                  onChange={e => setExtraEmail(e.target.value)}
                  aria-required="true"
                />
              </div>
            </>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle} htmlFor="message">{t("contact.message", { defaultValue: "Message*" })}</label>
            <textarea
              id="message"
              name="message"
              style={{ ...inputStyle, minHeight: 104, maxHeight: 240 }}
              rows={5}
              placeholder={t("contact.msgPlaceholder", { defaultValue: "Enter message" })}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              aria-required="true"
            />
          </div>

          {/* Honeypot (visually hidden) */}
          <div style={{ position: "absolute", left: "-5000px", height: 0, overflow: "hidden" }}>
            <label htmlFor="company">{t("contact.hpLabel", { defaultValue: "Company" })}</label>
            <input id="company" name="company" type="text" value={hp} onChange={e => setHp(e.target.value)} />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "1.1rem",
              width: "100%",
              padding: isLt700 ? "0.7rem" : "1.2rem",
              background: "#00477f",
              color: "#fff",
              fontWeight: 700,
              fontFamily: baseFont,
              border: "none",
              borderRadius: "0px",
              fontSize: isLt700 ? "1.05rem" : "1.25rem",
              letterSpacing: "0.01em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background .18s",
            }}
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? t("contact.submitting", { defaultValue: "Submitting..." }) : t("contact.submitCta", { defaultValue: "Submit Your Query" })}
          </button>

          {statusMsg && (
            <div
              role="status"
              style={{
                marginTop: "1rem",
                color: statusMsg.startsWith("✅") ? "#087d41" : "#d06549",
                fontWeight: 700,
                fontSize: "1.1rem",
                minHeight: 30,
              }}
            >
              {statusMsg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
