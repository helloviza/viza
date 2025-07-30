import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
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
    try {
      let url, payload;
      if (mode === "login") {
        url = `${API_BASE_URL}/auth/login`;
        payload = { email: form.email, password: form.password };
      } else {
        url = `${API_BASE_URL}/auth/register`;
        payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          country: form.country,
        };
        if (form.password !== form.confirmPassword)
          throw new Error("Passwords do not match");
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");

      // Login: save user/token, call onLogin
      if (mode === "login" && data.token && data.user) {
        localStorage.setItem("helloviza_token", data.token);
        localStorage.setItem("helloviza_user", JSON.stringify(data.user));
        if (onLogin) onLogin();
        navigate("/");
      } else if (mode === "signup") {
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.outer}>
      <div style={{ ...styles.leftBg, backgroundImage: `url(${loginBg})` }} />
      <div style={styles.formArea}>
        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tabWrap,
              ...(mode === "login" ? styles.activeTabWrap : {}),
            }}
            onClick={() => setMode("login")}
            tabIndex={0}
            role="button"
            aria-label="Log in"
          >
            <span
              style={{
                ...styles.tab,
                ...(mode === "login" ? styles.activeTab : {}),
              }}
            >
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
            style={{
              ...styles.tabWrap,
              ...(mode === "signup" ? styles.activeTabWrap : {}),
            }}
            onClick={() => setMode("signup")}
            tabIndex={0}
            role="button"
            aria-label="Sign Up"
          >
            <span
              style={{
                ...styles.tab,
                ...(mode === "signup" ? styles.activeTab : {}),
              }}
            >
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

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={{ color: "#c00", fontWeight: "bold", marginBottom: 8 }}>
              {error}
            </div>
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
          )}
          {mode === "signup" && (
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
                    onClick={e => {
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
                    onClick={e => {
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
                    onClick={e => {
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
                    onClick={e => {
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

const styles = { /* ... your same styles ... */ };
