import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import loginBg from "../assets/login-bg.jpg"; // Adjust path if needed

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const scale = 0.64;

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: Integrate with your backend for real password reset logic
    alert("Password reset link sent (demo only)");
  }

  return (
    <div style={styles.outer}>
      {/* Left-side background image */}
      <div style={{ ...styles.leftBg, backgroundImage: `url(${loginBg})` }} />
      {/* Right-side form */}
      <div style={styles.formArea}>
        <h1 style={styles.title}>Reset Password</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            style={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit" style={styles.submitBtn}>
            Reset Password
          </button>
          <div style={styles.belowLinks}>
            <span>
              Already have an account?{" "}
              <a
                href="#"
                style={styles.link}
                onClick={e => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Log In here
              </a>
            </span>
            <br />
            <span>
              Trouble signing up?{" "}
              <a
                href="#"
                style={styles.link}
                onClick={e => {
                  e.preventDefault();
                  navigate("/contact");
                }}
              >
                Contact us
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  outer: {
    display: "flex",
    minHeight: "100vh",
    background: "#111",
    fontFamily: baseFont,
  },
  leftBg: {
    flex: 1,
    minHeight: "100vh",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  formArea: {
    flex: 1,
    background: "#00477f",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: "9vw 3vw 0 2vw",
    minHeight: "100vh",
    zIndex: 2,
  },
  title: {
    fontFamily: baseFont,
    fontSize: `${3.5 * scale}rem`,
    color: "#fff",
    fontWeight: 700,
    marginBottom: "2.3vw",
    marginTop: "0vw",
    letterSpacing: "-0.04em",
  },
  form: {
    width: "100%",
    maxWidth: 680 * scale,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.9vw",
  },
  label: {
    fontSize: `${1.3 * scale}rem`,
    fontWeight: 700,
    color: "#fff",
    marginBottom: ".2em",
    letterSpacing: ".01em",
    display: "block",
  },
  input: {
    width: "100%",
    fontSize: `${1.2 * scale}rem`,
    padding: "0.60em 0.9em",
    background: "#fed7cd",
    border: "2px solid #222",
    color: "#fff",
    borderRadius: "0px",
    fontWeight: 400,
    marginBottom: "0.3vw",
    marginTop: "0.10vw",
    outline: "none",
    fontFamily: baseFont,
    boxSizing: "border-box",
    transition: "border 0.13s",
  },
  submitBtn: {
    width: "100%",
    padding: "0.9em 0",
    fontSize: `${1.6 * scale}rem`,
    fontWeight: 700,
    background: "#f3f3f3",
    color: "#d06549",
    border: "none",
    borderRadius: "0px",
    margin: "0.6vw 0 0.3vw 0",
    cursor: "pointer",
    fontFamily: baseFont,
    transition: "background .14s",
    marginTop: "0.5vw",
  },
  belowLinks: {
    marginTop: "0.5vw",
    color: "#bfbfbf",
    fontSize: `${1.05 * scale}rem`,
    fontWeight: 400,
  },
  link: {
    color: "#fff",
    textDecoration: "underline",
    fontWeight: 700,
    cursor: "pointer",
  },
};
