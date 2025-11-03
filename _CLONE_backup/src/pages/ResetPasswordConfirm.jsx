import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const scale = 0.64;

export default function ResetPasswordConfirm() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(decodeURIComponent(emailParam));
    }
  }, [location.search]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5055/api/reset-password/confirm",
        {
          // For production:
          // "https://api.helloviza.com/api/reset-password/confirm",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="resetpw-outer" style={styles.outer}>
      <style>{`
        @media (max-width: 600px) {
          .resetpw-outer {
            flex-direction: column !important;
            min-height: 100vh !important;
            align-items: stretch !important;
          }
          .resetpw-left-bg {
            min-height: 140px !important;
            width: 100% !important;
            flex-basis: 32vw !important;
            background-size: cover !important;
            background-position: center !important;
            display: block !important;
            border-radius: 0 !important;
          }
          .resetpw-form-area {
            max-width: 100vw !important;
            padding: 2.3rem 4vw 2.1rem 4vw !important;
            min-width: unset !important;
            border-radius: 0 !important;
            margin: 0 !important;
            align-items: flex-start !important;
            min-height: unset !important;
          }
          .resetpw-title {
            font-size: 2rem !important;
            margin-bottom: 1.4rem !important;
            margin-top: 0 !important;
            text-align: left !important;
          }
          .resetpw-form label,
          .resetpw-form input,
          .resetpw-form button {
            font-size: 1.02rem !important;
          }
          .resetpw-form input {
            padding: 0.5em 0.7em !important;
          }
          .resetpw-form button[type="submit"] {
            padding: 0.88rem 0.6rem !important;
            font-size: 1.1rem !important;
            margin-top: 1rem !important;
          }
        }
      `}</style>

      {/* Left-side background image */}
      <div
        className="resetpw-left-bg"
        style={{ ...styles.leftBg, backgroundImage: `url(${loginBg})` }}
      />

      {/* Right-side form */}
      <div className="resetpw-form-area" style={styles.formArea}>
        <h1 className="resetpw-title" style={styles.title}>
          Set a New Password
        </h1>

        <form
          className="resetpw-form"
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            style={styles.input}
            value={email}
            disabled
          />

          <label style={styles.label}>Enter New Password</label>
          <input
            type="password"
            name="newPassword"
            style={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            minLength={8}
            required
            disabled={loading || success}
            autoComplete="new-password"
          />

          <label style={styles.label}>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            minLength={8}
            required
            disabled={loading || success}
            autoComplete="new-password"
          />

          {error && (
            <div
              style={{
                color: "#f44336",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                color: "#388e3c",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Password has been reset! Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading || success}
            aria-busy={loading}
          >
            {loading ? "Updating..." : "Set New Password"}
          </button>
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
    color: "#111",
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
};
