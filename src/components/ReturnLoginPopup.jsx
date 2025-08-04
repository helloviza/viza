import React from "react";
import hellovizaLogo from "../assets/helloviza-logo.png";
import heartIcon from "../assets/heart-icon.png";

export default function ReturnLoginPopup({ message, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button aria-label="Close popup" onClick={onClose} style={styles.closeBtn}>
          &times;
        </button>

        <h1 style={styles.welcomeText}>Welcome back to the</h1>
        <img src={hellovizaLogo} alt="Helloviza Logo" style={styles.logo} />
        <div style={styles.heartWrapper}>
          <img
            src={heartIcon}
            alt="Heart"
            style={styles.heartIcon}
            onError={e => {
              e.target.style.display = "none";
              const span = document.createElement("span");
              span.textContent = "❤️";
              span.style.fontSize = "3rem";
              e.target.parentNode.appendChild(span);
            }}
          />
        </div>
        <p style={styles.bodyText}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",  // dimmed black background
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 2000,
    padding: "1rem",
  },
  popup: {
    position: "relative",
    maxWidth: 420,
    width: "100%",
    backgroundColor: "#f9f5ef",
    borderRadius: 20,
    padding: "2.5rem 2rem 3rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    textAlign: "center",
    fontFamily: "'Crimson Pro', serif",
    color: "#3b3a39",
  },
  closeBtn: {
    position: "absolute",
    top: 15, right: 15,
    fontSize: 24,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#777",
  },
  welcomeText: {
    fontFamily: "'La Luxes Script', cursive",
    fontSize: "2rem",
    margin: "0 0 0.2rem 0",
    color: "#3b3a39",
  },
  logo: {
    maxWidth: "70%",
    margin: "0 auto",
    display: "block",
    userSelect: "none",
  },
  heartWrapper: {
    marginTop: "0.5rem",
    marginBottom: "1rem",
  },
  heartIcon: {
    width: 36,
    height: 36,
    userSelect: "none",
  },
  bodyText: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
};
