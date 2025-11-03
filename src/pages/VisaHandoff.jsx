// src/pages/VisaHandoff.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VisaHandoff() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for AuthContext to finish loading
    if (loading) return;

    if (!user) {
      // not logged in -> redirect to login with ?next
      navigate(`/login?next=${encodeURIComponent('/go/visa')}`, { replace: true });
      return;
    }

    // ✅ user ready: now redirect externally
    const visaUrl = "https://visa.helloviza.com";
    window.location.href = visaUrl;
  }, [user, loading, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        fontFamily: "'Barlow Condensed', Arial, sans-serif",
        color: "#00477f",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      {loading ? (
        <>
          <h2>Checking your session…</h2>
          <p>Please wait while we verify your login.</p>
        </>
      ) : user ? (
        <>
          <h2>Redirecting to Visa Booking Page…</h2>
          <p>Connecting you securely to visa.helloviza.com</p>
        </>
      ) : (
        <>
          <h2>Preparing sign-in…</h2>
          <p>Redirecting you to the login page.</p>
        </>
      )}
    </div>
  );
}
