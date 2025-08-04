import React from "react";
import logo from "../assets/helloviza-logo.png";

const TRACKER_URL = "https://evm.visaero.com/evm/track-application?external_user_id=febce517-f33c-3b1e-951f-7dc4183d8c30&host=demo";

export default function TrackVisaApplication() {
  return (
    <div style={styles.outer}>
      <div style={styles.headerSection}>
        <h1 style={styles.heading}>Track Your Visa Application</h1>
        <p style={styles.subtext}>
          You’re in a secure tracking window powered by{" "}
          <img
            src={logo}
            alt="Helloviza"
            style={styles.inlineLogo}
          />
        </p>
      </div>
      <div style={styles.iframeBox}>
        <iframe
          src={TRACKER_URL}
          title="Visa Application Tracking"
          style={styles.iframe}
          allowFullScreen
        />
      </div>
    </div>
  );
}

const styles = {
  outer: {
    minHeight: "100vh",
    background: "#f6f8fa",
    fontFamily: "'Barlow Condensed', Arial, sans-serif",
    padding: 0,
    margin: 0,
  },
  headerSection: {
    textAlign: "center",
    paddingTop: "80px",
    paddingBottom: "24px",
    background: "#fff",
    borderBottom: "1px solid #e5eaf0",
  },
  heading: {
    fontSize: "2.6rem",
    color: "#23456b",
    fontWeight: 800,
    margin: "0 0 10px 0",
    letterSpacing: "-.01em",
  },
  subtext: {
    fontSize: "1.42rem",
    color: "#28334c",
    margin: 0,
    fontWeight: 400,
    letterSpacing: ".01em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  inlineLogo: {
    height: "1.4em",
    verticalAlign: "middle",
    display: "inline-block",
    margin: "0 0.16em",
  },
  iframeBox: {
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    background: "#f6f8fa",
    minHeight: "calc(100vh - 160px)",
  },
  iframe: {
    border: "none",
    width: "100vw",
    height: "80vh",
    minHeight: 550,
    background: "#fff",
  },
};
