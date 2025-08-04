import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailOTPVerify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5055/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Verification failed");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#e3f2fd"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 6px 32px #1a4e801a", minWidth: 320
      }}>
        <h2 style={{marginBottom:18}}>Email OTP Verification</h2>
        <label>Email:</label>
        <input value={email} onChange={e=>setEmail(e.target.value)}
          type="email" required disabled={success||loading} style={{width:"100%",marginBottom:12,padding:9}} />
        <label>Enter OTP:</label>
        <input value={otp} onChange={e=>setOtp(e.target.value)}
          type="text" required maxLength={6} pattern="\d*" disabled={success||loading} style={{width:"100%",marginBottom:16,padding:9}} />
        {error && <div style={{color:"#c00",marginBottom:10}}>{error}</div>}
        {success && <div style={{color:"#008c49",marginBottom:10}}>Email verified! Redirecting...</div>}
        <button type="submit" disabled={loading||success} style={{
          width:"100%",padding:11,background:"#00477f",color:"#fff",fontWeight:600,border:"none",borderRadius:5
        }}>{loading?"Verifying...":"Verify Email"}</button>
      </form>
    </div>
  );
}
