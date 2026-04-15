// src/components/NewFooter.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

// ─────────────────────────────────────────────────────────────
// 🖼️  HERO BACKGROUND IMAGE — replace with your own path
// ─────────────────────────────────────────────────────────────
const HERO_IMAGE_SRC = "/images/Nepa_L.jpg";  

// ─────────────────────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────────────────────
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
};

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
// const STATS = [
//   { big: "99.2%", title: "Visas On Time",  desc: "Visa delivered before travel date" },
//   { big: "500k+", title: "Processed",      desc: "Processed for travelers worldwide" },
//   { big: "4.81",  title: "Rating",         desc: "Industry's highest rating for customer service & reliability" },
// ];

const DISCOVER_LINKS   = [
  { label: "Home",    to: "/" },
  { label: "Blog",    to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const MANAGEMENT_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Career",   to: "/careers" },
];

const BOTTOM_LINKS = [
  { label: "Privacy Policy",     to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Newsroom",           to: "/press" },
];

const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/helloviza",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/helloviza",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/helloviza",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/helloviza",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@helloviza",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
// REUSABLE LINK COLUMN
// ─────────────────────────────────────────────────────────────
const LinkColumn = ({ heading, links }) => (
  <div>
    <h4 style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
      fontWeight: 800,
      fontSize: "0.92rem",
      color: "#1e293b",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: "16px",
      marginTop: 0,
    }}>
      {heading}
    </h4>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
      {links.map((l) => (
        <li key={l.label}>
          <Link
            to={l.to}
            style={{ color: "#64748b", fontSize: "0.88rem", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = BRAND}
            onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const NewFooter = () => {
  const [email, setEmail] = useState("");
  const width    = useWindowWidth();
  const year     = new Date().getFullYear();

  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  // Responsive side padding
  const sidePad = isMobile ? "20px" : isTablet ? "40px" : "103px";

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>

      {/* ══════════════════════════════════════════════════════
          STATS CARDS + HERO IMAGE
      ══════════════════════════════════════════════════════ */}
      {/* <div style={{ position: "relative", background: "#f1f1f1" }}>

        //Stats card grid
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          paddingLeft: sidePad,
          paddingRight: sidePad,
          paddingTop: isMobile ? "32px" : "60px",
          position: "relative",
          zIndex: 2,
        }}>
          {isMobile ? (
            // Mobile: Stack cards vertically with equal spacing
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              background: "#f1f1f1",
              borderRadius: "20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              {STATS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "24px 20px",
                    borderBottom: i < STATS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                    flex: 1,
                  }}
                >
                  <div style={{
                    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                    fontWeight: 900,
                    fontSize: "2.4rem",
                    color: BRAND,
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}>
                    {s.big}
                  </div>
                  <div style={{
                    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    color: BRAND,
                    marginBottom: "8px",
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    width: "28px",
                    height: "2px",
                    background: ACCENT,
                    borderRadius: "2px",
                    marginBottom: "10px",
                  }}/>
                  <p style={{
                    color: "#64748b",
                    fontSize: "0.8rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // Tablet & Desktop: Grid layout
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0",
              background: "#f1f1f1",
              borderRadius: "20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              {STATS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: isTablet ? "28px 24px" : "36px 40px",
                    borderRight: i < STATS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                    fontWeight: 900,
                    fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
                    color: BRAND,
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}>
                    {s.big}
                  </div>
                  <div style={{
                    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: BRAND,
                    marginBottom: "8px",
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    width: "28px",
                    height: "2px",
                    background: ACCENT,
                    borderRadius: "2px",
                    marginBottom: "8px",
                  }}/>
                  <p style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

         
        <div style={{
          width: "100%",
          height: isMobile ? "180px" : "260px",
          marginTop: isMobile ? "0" : "-60px",
          position: "relative",
          overflow: "hidden",
        }}>
          <img
            src={HERO_IMAGE_SRC}
            alt="Travel destination"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 60%",
              display: "block",
            }}
            onError={e => {
              e.target.style.display = "none";
              e.target.parentElement.style.background =
                "linear-gradient(135deg, #00477f 0%, #005fa3 60%, #d06549 100%)";
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(245,247,250,0.55) 0%, transparent 40%)",
            pointerEvents: "none",
          }}/>
        </div>
      </div> */}

      {/* ══════════════════════════════════════════════════════
          MAIN FOOTER BODY
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: "#f1f1f1", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          paddingLeft: sidePad,
          paddingRight: sidePad,
          paddingTop: isMobile ? "40px" : "60px",
          paddingBottom: isMobile ? "36px" : "48px",
        }}>

          {/* ── DESKTOP LAYOUT: 5-col grid ── */}
          {isDesktop && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1.4fr 2fr",
              gap: "10px",
              alignItems: "start",
            }}>
              {/* Logo + tagline */}
              <LogoBlock />

              {/* Discover */}
              <LinkColumn heading="Discover"    links={DISCOVER_LINKS} />

              {/* Management */}
              <LinkColumn heading="Management"  links={MANAGEMENT_LINKS} />

              {/* Our Service */}
              <ServiceBox />

              {/* Subscribe */}
              <SubscribeBox
                email={email}
                setEmail={setEmail}
                handleSubscribe={handleSubscribe}
              />
            </div>
          )}

          {/* ── TABLET LAYOUT: 2-col top, then 3-col bottom ── */}
          {isTablet && (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {/* Row 1: Logo + Subscribe side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <LogoBlock />
                <SubscribeBox email={email} setEmail={setEmail} handleSubscribe={handleSubscribe} />
              </div>
              {/* Row 2: Links + Service box */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                <LinkColumn heading="Discover"   links={DISCOVER_LINKS} />
                <LinkColumn heading="Management" links={MANAGEMENT_LINKS} />
                <ServiceBox />
              </div>
            </div>
          )}

          {/* ── MOBILE LAYOUT: single column stacked ── */}
          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <LogoBlock />

              {/* Links side by side on mobile */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <LinkColumn heading="Discover"   links={DISCOVER_LINKS} />
                <LinkColumn heading="Management" links={MANAGEMENT_LINKS} />
              </div>

              <ServiceBox fullWidth />

              <SubscribeBox
                email={email}
                setEmail={setEmail}
                handleSubscribe={handleSubscribe}
                fullWidth
              />
            </div>
          )}

        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          maxWidth: "1400px",
          margin: "0 auto",
          paddingLeft: sidePad,
          paddingRight: sidePad,
          paddingTop: "16px",
          paddingBottom: "16px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "14px" : "12px",
          textAlign: isMobile ? "center" : "left",
        }}>

          {/* Policy links */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "20px",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
          }}>
            {BOTTOM_LINKS.map((l, i, arr) => (
              <React.Fragment key={l.label}>
                <Link
                  to={l.to}
                  style={{ color: "#64748b", fontSize: "0.78rem", textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color = BRAND}
                  onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                >
                  {l.label}
                </Link>
                {i < arr.length - 1 && (
                  <span style={{ color: "#cbd5e1", fontSize: "0.65rem" }}>|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ color: "#94a3b8", fontSize: "0.76rem", margin: 0 }}>
            © {year} | Helloviza, All rights reserved
          </p>

          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = BRAND;
                  e.currentTarget.style.color = BRAND;
                  e.currentTarget.style.background = "rgba(0,71,127,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS (keep main component clean)
// ─────────────────────────────────────────────────────────────

const LogoBlock = () => (
  <div>
    <div style={{ marginBottom: "12px" }}>
  <img
    src={logo}
    alt="HelloViza Logo"
    style={{
      height: "60px", // adjust size as needed
      objectFit: "contain",
    }}
  />
   </div>
    <p style={{
      color: "#64748b", fontSize: "0.875rem",
      lineHeight: 1.65, margin: 0, maxWidth: "260px",
    }}>
      Experience seamless visa services designed to turn your travel dreams into reality.
    </p>
  </div>
);

const ServiceBox = ({ fullWidth }) => (
  <div>
    <div style={{
      border: "1.5px solid rgba(0,0,0,0.09)",
      borderRadius: "14px",
      padding: "20px 18px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: fullWidth ? "100%" : "auto",
      maxWidth: fullWidth ? "100%" : "180px",
      boxSizing: "border-box",
    }}>
      <span style={{
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
        fontWeight: 800, fontSize: "0.88rem",
        color: "#1e293b", letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        Our Service
      </span>
      <button
        style={{
          background: ACCENT, color: "white", border: "none",
          borderRadius: "8px", padding: "10px 16px",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
          fontWeight: 700, fontSize: "0.9rem",
          cursor: "pointer", letterSpacing: "0.03em",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Book my Flight
      </button>
      <button
        style={{
          background: BRAND, color: "white", border: "none",
          borderRadius: "8px", padding: "10px 16px",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
          fontWeight: 700, fontSize: "0.9rem",
          cursor: "pointer", letterSpacing: "0.03em",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Book my Hotel
      </button>
    </div>
  </div>
);

const SubscribeBox = ({ email, setEmail, handleSubscribe, fullWidth }) => (
  <div style={{ width: fullWidth ? "100%" : "auto" }}>
    <p style={{
      color: "#1e293b", fontSize: "0.88rem",
      lineHeight: 1.6, marginBottom: "16px",
      maxWidth: fullWidth ? "100%" : "280px",
      marginTop: 0,
    }}>
      Subscribe for visa news, destination insights, and special deals curated just for you.
    </p>
    <form
      onSubmit={handleSubscribe}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        style={{
          border: "1.5px solid rgba(0,0,0,0.12)",
          borderRadius: "8px", padding: "11px 14px",
          fontSize: "0.875rem", color: "#1e293b",
          outline: "none",
          width: "100%", boxSizing: "border-box",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
          background: "white",
        }}
        onFocus={e => e.target.style.borderColor = BRAND}
        onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.12)"}
      />
      <button
        type="submit"
        style={{
          background: BRAND, color: "white", border: "none",
          borderRadius: "8px", padding: "11px 24px",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
          fontWeight: 700, fontSize: "0.95rem",
          cursor: "pointer", letterSpacing: "0.04em",
          alignSelf: "flex-start",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#003d6e"}
        onMouseLeave={e => e.currentTarget.style.background = BRAND}
      >
        Subscribe
      </button>
    </form>
  </div>
);

export default NewFooter;