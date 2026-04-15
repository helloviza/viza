// src/components/VisaTilesSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BRAND  = "#00477f";
const ACCENT = "#d06549"; 
const baseFont = "'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif";

/* ── Icons ── */
// const icons = {
//   experience: (
//     <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
//       <path d="M13 2C7.477 2 3 6.477 3 12s4.477 10 10 10 10-4.477 10-10S18.523 2 13 2z" fill={ACCENT} opacity="0.1" stroke={ACCENT} strokeWidth="1.7"/>
//       <path d="M8.5 16c1.2-2.4 7.8-2.4 9 0" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round"/>
//       <circle cx="10.5" cy="11" r="1.4" fill={ACCENT}/>
//       <circle cx="15.5" cy="11" r="1.4" fill={ACCENT}/>
//     </svg>
//   ),
//   events: (
//     <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
//       <rect x="3" y="6" width="20" height="17" rx="3" fill={ACCENT} opacity="0.1" stroke={ACCENT} strokeWidth="1.7"/>
//       <path d="M3 11.5h20" stroke={ACCENT} strokeWidth="1.7"/>
//       <circle cx="9" cy="4.5" r="1.4" fill={ACCENT}/>
//       <circle cx="17" cy="4.5" r="1.4" fill={ACCENT}/>
//       <path d="M9 4.5v4M17 4.5v4" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round"/>
//       <rect x="7" y="15" width="4" height="4" rx="1" fill={ACCENT} opacity="0.45"/>
//       <rect x="13" y="15" width="4" height="4" rx="1" fill={ACCENT} opacity="0.3"/>
//     </svg>
//   ),
// };

/* ── Big Tile ── */
function BigTile({ title, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        flex: 1,
        //background: hov ? "rgba(255,255,255,0.98)" : "#f5f5f5",
        background: hov ? "rgba(255,255,255,0.97)" : ACCENT,
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: `1.5px solid ${hov ? ACCENT : "rgba(255,255,255,0.65)"}`,
        boxShadow: hov
          ? "0 12px 36px rgba(208,101,73,0.18), 0 2px 8px rgba(0,0,0,0.08)"
          : "0 4px 18px rgba(0,0,0,0.10)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14, 
        cursor: "pointer",
        transition: "all 0.24s cubic-bezier(.22,.9,.22,1)",
        transform: hov ? "translateY(-3px)" : "none",
        fontFamily: baseFont,
      }}
    >
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center", marginBottom: 4 }}>
          <span style={{
            fontWeight: 900,
            fontSize: "2.32rem",
            color: hov ? BRAND : "#fff",
            letterSpacing: "0.01em",
            lineHeight: 1,
            transition: "color 0.24s ease",
          }}>
            {title}
          </span>
        </div>
      </div>

      {/* <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: hov ? ACCENT : "rgba(0,71,127,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.22s ease",
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">  </svg>
          <path d="M2 6h8M7 3l3 3-3 3" stroke={hov ? "#fff" : BRAND} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        
      </div> */}
    </div>
  );
}

/* ── Small Tile ── */
function SmallTile({  title, desc, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        flex: 1,
        background: hov ? "rgba(255,255,255,0.97)" : ACCENT,
        backdropFilter: "blur(10px)",
        borderRadius: 14,
        border: `1.5px solid ${hov ? ACCENT : "rgba(255,255,255,0.5)"}`,
        boxShadow: hov ? "0 8px 26px rgba(208,101,73,0.15)" : "0 2px 10px rgba(0,0,0,0.07)",
        padding: "13px 13px 12px",
        display: "flex",
        alignItems: "center",
        gap: 11,
        cursor: "pointer",
        transition: "all 0.24s cubic-bezier(.22,.9,.22,1)",
        transform: hov ? "translateY(-2px)" : "none",
        fontFamily: baseFont,
      }}
    >
      {/* <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: "rgba(208,101,73,0.08)",
        border: "1.5px solid rgba(208,101,73,0.14)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "transform 0.2s ease",
        transform: hov ? "scale(1.1)" : "none",
      }}>
        {icon}
      </div> */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: "1.55rem", color: hov ? BRAND : "#fff", lineHeight: 1, marginBottom: 3 }}>{title}</div>
        {/* <div style={{ fontFamily: "'Barlow', Arial, sans-serif", fontSize: "0.78rem", color: "#7a8799", lineHeight: 1.3 }}>{desc}</div> */}
      </div>
    </div>
  );
}

function getCachedUser() {
  try {
    const raw = localStorage.getItem("hv_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const VISA_INTENT_KEY     = "HV:VISA_INTENT_TS";
const TRANSFER_INTENT_KEY = "HV:TRANSFER_INTENT_TS";

/* ── Main Export ── */
export default function VisaServiceTiles({ user }) {
  const navigate = useNavigate();
  const [effectiveUser, setEffectiveUser] = useState(() => user || getCachedUser());

  useEffect(() => {
    const sync = () => setEffectiveUser(user || getCachedUser());
    sync();
    const onStorage = (e) => { if (!e || e.key === "hv_user") sync(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  const handleGoForVisaClick = useCallback(() => {
    navigate("/gonew/visa");
  }, [navigate]);

  const handleGoForTransfer = useCallback(() => {
    // if (effectiveUser) { navigate("/transfer-service"); return; }
    // try { sessionStorage.setItem(TRANSFER_INTENT_KEY, String(Date.now())); } catch {}
    navigate("/transfer-service");
  }, [navigate]);

  const handleGoForEvents = useCallback(() => {
    navigate("/events");
  }, [navigate]);

  const handleGoForExperiences = useCallback(() => {
    navigate("/experiences");
  }, [navigate]);

  return (
    // ↓ position: relative (normal flow) — NOT fixed
    <div style={{ width: "100%", fontFamily: baseFont }}>

      {/* Row 1 — Visa + Transfer */}
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <BigTile title="Visa"     onClick={handleGoForVisaClick} />
        <BigTile title="Transfer" onClick={handleGoForTransfer} />
      </div>

      {/* Row 2 — Experience + Events */}
      <div style={{ display: "flex", gap: 8 }}>
        {/* <SmallTile
          // icon={icons.experience}
          title="Experience"
          // desc="We are coming soon..."
          onClick={handleGoForExperiences}
        /> */}
        <SmallTile
          // icon={icons.events}
          title="Events"
          // desc="We are coming soon..."
          onClick={handleGoForEvents}
        />
      </div>

      {/* Progress bar shimmer */}
      <div style={{
        height: 3,
        background: "rgba(255,255,255,0.4)",
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 7,
      }}>
        <div style={{
          height: "100%",
          width: "100%",
          background: `linear-gradient(90deg, ${BRAND}, #2a8ed6, ${ACCENT})`,
          backgroundSize: "200% 100%",
          animation: "hvShimmer 2.5s ease infinite",
        }}/>
      </div>

      <style>{`
        @keyframes hvShimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}