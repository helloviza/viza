import React from "react";
import { useNavigate } from "react-router-dom";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const GoForVisa = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    // Not logged in: either redirect or show login prompt with link
    return (
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          fontFamily: baseFont,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2.5rem",
            borderRadius: "18px",
            boxShadow: "0 6px 28px 0 rgba(44,44,44,0.09)",
            minWidth: 330,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "2.3rem", marginBottom: "2rem" }}>
            Login Required
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Please{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#00477f",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.1rem",
                padding: 0,
              }}
            >
              login
            </button>{" "}
            to access the Visa services.
          </p>
        </div>
      </div>
    );
  }

  // If logged in, show the Visa widget
  return (
    <div style={{ minHeight: "90vh", padding: 0, background: "#fafafa", fontFamily: baseFont }}>
      <h1
        style={{
          padding: "4rem 0 2.2rem 0",
          margin: 0,
          fontSize: "2.4rem",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Go for Visa
      </h1>
      <iframe
        src="https://your-partner-url.com/partner-widget"
        width="100%"
        height="900"
        style={{ border: "none", borderRadius: 0, display: "block", margin: "0 auto" }}
        title="Go For Visa Widget"
        allowFullScreen
      />
    </div>
  );
};

export default GoForVisa;
