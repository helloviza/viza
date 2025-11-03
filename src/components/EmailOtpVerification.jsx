// src/components/EmailOtpVerification.jsx
import React, { useState } from "react";

// Optional: read API base from environment, fallback to proxy mode
const API_BASE = process.env.REACT_APP_API_BASE || "";

export default function EmailOtpVerification({ onVerified }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Send OTP API call
  const sendOtp = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
      setSuccess("OTP sent to your email");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP API call
  const verifyOtp = async () => {
    setError("");
    setSuccess("");
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");
      setSuccess("OTP verified successfully!");
      onVerified?.(); // Notify parent
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      {!otpSent ? (
        <>
          <h2>Verify your Email</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={sendOtp} disabled={loading} style={{ width: "100%", padding: "10px" }}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={verifyOtp} disabled={loading} style={{ width: "100%", padding: "10px" }}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}
    </div>
  );
}
