// src/pages/Contact.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const SUBJECT_OPTIONS = [
  { value: "", labelKey: "contact.selectSubject" },
  { value: "login", labelKey: "contact.subjects.unableLogin" },
  { value: "vaa", labelKey: "contact.subjects.visaHelp" },
  { value: "ptq", labelKey: "contact.subjects.processingTime" },
  { value: "sdr", labelKey: "contact.subjects.destinationReq" },
  { value: "cts", labelKey: "contact.subjects.customTravel" },
  { value: "fpi", labelKey: "contact.subjects.feePayment" },
  { value: "cr", labelKey: "contact.subjects.consultation" },
  { value: "partner", labelKey: "contact.subjects.partnership" },
  { value: "feedback", labelKey: "contact.subjects.feedback" }
];

const Contact = () => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");

  return (
    <div style={styles.wrapper}>
      {/* Left Column */}
      <div style={styles.leftCol}>
        <h1 style={styles.heading}>{t("contact.title", "Contact")}</h1>

        <div style={styles.infoBlock}>
          <div style={styles.label}>
            {t("contact.emailHeading", "E–MAIL ADDRESS")}
          </div>
          <div style={styles.value}>hello@helloviza.com</div>
        </div>

        <div style={styles.infoBlock}>
          <div style={styles.label}>
            {t("contact.hoursHeading", "WORKING HOURS")}
          </div>
          <div style={styles.value}>
            {t("contact.hoursLine", "Monday – Sunday, 9 AM – 8 PM, IST")}
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <form
        style={styles.rightCol}
        autoComplete="off"
        aria-label={t("contact.formAria", "Contact form")}
        onSubmit={e => e.preventDefault()}
      >
        <div style={styles.row2}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              {t("contact.firstName", "First Name*")}
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder={t("contact.fnPlaceholder", "Enter name")}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              {t("contact.lastName", "Last Name*")}
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder={t("contact.lnPlaceholder", "Enter last name")}
              required
            />
          </div>
        </div>

        <div className="single-row" style={styles.inputGroup}>
          <label style={styles.inputLabel}>
            {t("contact.email", "Email Address*")}
          </label>
          <input
            style={styles.input}
            type="email"
            placeholder={t("contact.emailPlaceholder", "Enter e-mail")}
            required
          />
        </div>

        <div className="single-row" style={styles.inputGroup}>
          <label style={styles.inputLabel}>
            {t("contact.subject", "Subject*")}
          </label>
          <select
            style={styles.input}
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
          >
            {SUBJECT_OPTIONS.map(opt => (
              <option key={opt.value || "default"} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {/* Extra field if "Unable to Login" is selected */}
        {subject === "login" && (
          <div className="single-row" style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              {t(
                "contact.accountLabel",
                "Your Account Email or Username*"
              )}
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder={t(
                "contact.accountPlaceholder",
                "Enter your account email or username"
              )}
              required
            />
          </div>
        )}

        <div className="single-row" style={styles.inputGroup}>
          <label style={styles.inputLabel}>
            {t("contact.message", "Message*")}
          </label>
          <textarea
            style={{ ...styles.input, ...styles.textarea }}
            rows={5}
            placeholder={t("contact.msgPlaceholder", "Enter message")}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          {t("contact.submitCta", "Submit Your Query")}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "92vh",
    background: "#f6f6f6",
    fontFamily: baseFont,
    width: "100vw",
    padding: 0,
    margin: 0
  },
  leftCol: {
    flex: "1 1 35%",
    minWidth: 350,
    maxWidth: 500,
    padding: "8rem 2rem 2rem 5vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    background: "transparent"
  },
  heading: {
    fontSize: "6rem",
    fontWeight: 700,
    marginBottom: "2rem",
    lineHeight: 0.95,
    letterSpacing: "-1px",
    color: "#111"
  },
  infoBlock: {
    marginBottom: "2.2rem"
  },
  label: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#595959",
    letterSpacing: "0.02em",
    marginBottom: ".1rem",
    textTransform: "uppercase"
  },
  value: {
    fontSize: "1.6rem",
    color: "#191919",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginTop: "0.1rem"
  },
  rightCol: {
    flex: "1 1 65%",
    padding: "8rem 7vw 2rem 3vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "transparent",
    gap: "1.2rem",
    minWidth: 380
  },
  row2: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "0.8rem"
  },
  inputGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginBottom: "0.8rem"
  },
  inputLabel: {
    fontFamily: baseFont,
    fontWeight: 700,
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#111",
    letterSpacing: "0.02em"
  },
  input: {
    fontFamily: baseFont,
    fontSize: "1.15rem",
    background: "#d8e7f3",
    border: "none",
    outline: "none",
    borderRadius: "5px",
    padding: "1.1rem 1.2rem",
    marginBottom: 0,
    color: "#191919",
    fontWeight: 400,
    resize: "none"
  },
  textarea: {
    minHeight: "120px",
    maxHeight: "220px",
    width: "100%"
  },
  button: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "1.1rem",
    background: "#111",
    color: "#fff",
    fontWeight: 700,
    fontFamily: baseFont,
    border: "none",
    borderRadius: "7px",
    fontSize: "1.3rem",
    letterSpacing: "0.02em",
    cursor: "pointer",
    transition: "background .15s"
  }
};

export default Contact;
