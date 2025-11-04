// src/pages/VisaHandoff.jsx
import React, { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VisaHandoff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Memoized to satisfy react-hooks/exhaustive-deps
  const buildTargetUrl = useCallback(() => {
    const base = "https://visa.helloviza.com/go-for-visa";
    const srcParams = new URLSearchParams(location.search);
    if (!srcParams.has("autostart")) srcParams.set("autostart", "1");
    const qs = srcParams.toString();
    return qs ? `${base}?${qs}` : base;
  }, [location.search]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const nextPath = `/go/visa${location.search || ""}`;
      navigate(`/login?next=${encodeURIComponent(nextPath)}`, { replace: true });
      return;
    }

    window.location.href = buildTargetUrl();
  }, [user, loading, navigate, location.search, buildTargetUrl]);

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
          <h2>Redirecting to Visa Booking…</h2>
          <p>Connecting you securely to visa.helloviza.com</p>
          <small style={{ opacity: 0.7 }}>
            If this takes longer,{" "}
            <a
              href={buildTargetUrl()}
              style={{ color: "#00477f", textDecoration: "underline" }}
            >
              click here
            </a>
            .
          </small>
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
