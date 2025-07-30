import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const scale = 0.64;

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
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Demo submit logic — replace with actual API calls
    console.log("Submitted", mode, form);
    if (onLogin) onLogin();
    if (mode === "signup") setMode("login"); // After signup switch to login mode
  }

  // Keyboard accessibility for tabs (Enter or Space toggles mode)
  const handleKeyDown = (e, newMode) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMode(newMode);
    }
  };

  return (
    <div style={styles.outer}>
      <div style={{ ...styles.leftBg, backgroundImage: `url(${loginBg})` }} />
      <div style={styles.formArea}>
        {/* Tabs for Login and Signup */}
        <div role="tablist" aria-label="Login and Signup Tabs" style={styles.tabs}>
          <div
            role="tab"
            tabIndex={0}
            aria-selected={mode === "login"}
            onClick={() => setMode("login")}
            onKeyDown={(e) => handleKeyDown(e, "login")}
            style={{
              ...styles.tabWrap,
              ...(mode === "login" ? styles.activeTabWrap : {}),
              cursor: "pointer",
            }}
          >
            <span style={{ ...styles.tab, ...(mode === "login" ? styles.activeTab : {}) }}>
              • Log in
            </span>
            <div
              style={{
                ...styles.underline,
                ...(mode === "login" ? styles.activeUnderline : {}),
              }}
            />
          </div>

          <div
            role="tab"
            tabIndex={0}
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
            onKeyDown={(e) => handleKeyDown(e, "signup")}
            style={{
              ...styles.tabWrap,
              ...(mode === "signup" ? styles.activeTabWrap : {}),
              cursor: "pointer",
            }}
          >
            <span style={{ ...styles.tab, ...(mode === "signup" ? styles.activeTab : {}) }}>
              • Sign Up
            </span>
            <div
              style={{
                ...styles.underline,
                ...(mode === "signup" ? styles.activeUnderline : {}),
              }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={{ color: "#c00", fontWeight: "bold", marginBottom: 8 }}>{error}</div>
          )}
          <div style={{ display: "flex", gap: "2vw" }}>
            {mode === "signup" && (
              <>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    style={styles.input}
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    style={styles.input}
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "2vw" }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Email*</label>
              <input
                type="email"
                name="email"
                style={styles.input}
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
            {mode === "signup" && (
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Country (optional)</label>
                <input
                  type="text"
                  name="country"
                  style={styles.input}
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
              </div>
            )}
            {mode === "login" && (
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  style={styles.input}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            )}
          </div>

          {mode === "signup" && (
            <>
              <div style={{ display: "flex", gap: "2vw" }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    style={styles.input}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    style={styles.input}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                    required
                  />
                </div>
              </div>

              <div style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  style={styles.checkbox}
                  required
                />
                <span style={styles.agreeText}>
                  By creating an account, I agree to this website's privacy policy and terms of service
                </span>
              </div>
            </>
          )}

          <button type="submit" style={styles.submitBtn}>
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>

          <div style={styles.belowLinks}>
            {mode === "login" ? (
              <>
                <span>
                  Forgot your password?{" "}
                  <a
                    href="#"
                    style={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/reset-password");
                    }}
                  >
                    Reset here
                  </a>
                </span>
                <br />
                <span>
                  Trouble logging in?{" "}
                  <a
                    href="#"
                    style={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/contact");
                    }}
                  >
                    Contact us
                  </a>
                </span>
              </>
            ) : (
              <>
                <span>
                  Already have an account?{" "}
                  <a
                    href="#"
                    style={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      setMode("login");
                    }}
                  >
                    Log in here
                  </a>
                </span>
                <br />
                <span>
                  Trouble signing up?{" "}
                  <a
                    href="#"
                    style={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/contact");
                    }}
                  >
                    Contact us
                  </a>
                </span>
              </>
            )}
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
    fontFamily: baseFont,
    backgroundColor: "#00477f",
    color: "#fff",
  },
  leftBg: {
    flex: "1 1 40%",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  formArea: {
    flex: "1 1 60%",
    padding: "6rem 3rem",
    maxWidth: 600,
    boxSizing: "border-box",
  },
  tabs: {
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem",
  },
  tabWrap: {
    position: "relative",
    cursor: "pointer",
  },
  activeTabWrap: {},
  tab: {
    fontSize: "2rem",
    fontWeight: 900,
    color: "rgba(255, 255, 255, 0.6)",
  },
  activeTab: {
    color: "#fff",
  },
  underline: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "transparent",
    transition: "background-color 0.3s",
  },
  activeUnderline: {
    backgroundColor: "#ffffff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.4rem",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.6rem 1rem",
    borderRadius: 6,
    border: "1px solid #444",
    backgroundColor: "#ffffff",
    color: "#fff",
    fontSize: "1rem",
  },
  checkboxWrap: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
  },
  checkbox: {
    marginRight: 10,
  },
  agreeText: {
    fontSize: "0.8rem",
    lineHeight: 1.3,
  },
  submitBtn: {
    marginTop: "2rem",
    padding: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    color: "#d06549",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  belowLinks: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.7)",
  },
  link: {
    color: "#d06549",
    textDecoration: "underline",
    cursor: "pointer",
  },
};
