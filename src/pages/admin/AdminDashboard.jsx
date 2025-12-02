// helloviza/client/src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const card = () => ({
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 18,
  padding: 18,
  background: "rgba(255,255,255,.06)",
  boxShadow: "0 18px 60px rgba(0,0,0,.18)",
  backdropFilter: "blur(10px)",
  textDecoration: "none",
  color: "#eaf2ff",
  display: "block",
});

const title = { margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: 0.2 };
const text = {
  margin: "8px 0 0",
  color: "rgba(234,242,255,.75)",
  lineHeight: 1.35,
  fontWeight: 700,
};

export default function AdminDashboard() {
  return (
    <div style={{ fontFamily: baseFont }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ color: "#eaf2ff", fontSize: "1.9rem", fontWeight: 900, margin: 0 }}>
          Admin Dashboard
        </h1>
        <Link to="/" style={{ color: "#ffb199", fontWeight: 900, textDecoration: "none" }}>
          ← Back to website
        </Link>
      </div>

      <div style={{ height: 12 }} />

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <Link to="/admin/profiles" style={card()}>
          <h3 style={title}>Profiles</h3>
          <p style={text}>List users + exports</p>
        </Link>

        <Link to="/admin/country-prices" style={card()}>
          <h3 style={title}>Country Cards</h3>
          <p style={text}>Image + Price + Apply Routing + Enable/Disable</p>
        </Link>

        <Link to="/admin/offers" style={card()}>
          <h3 style={title}>Offers</h3>
          <p style={text}>Homepage Announcement Bar</p>
        </Link>

        {/* ✅ NEW */}
        <Link to="/admin/user-stats" style={card()}>
          <h3 style={title}>User Stats</h3>
          <p style={text}>Booking count, spend, top destinations, segments</p>
        </Link>
      </div>
    </div>
  );
}
