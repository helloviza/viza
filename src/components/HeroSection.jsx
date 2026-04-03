// src/components/HeroSection.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

const AIRPLANE_IMAGE = "/images/aeroplane.png";

const AVATAR_IMAGES = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
];




const SKY_VIDEO_WEBM = "/videos/Background_Vid2.webm";
const SKY_VIDEO_MP4  = "/videos/Background_Vid2.mp4";

const EXPLORE_IMAGES = [
  { src: "/images/Dominic_A.jpg",              label: "Malaysia"    },
  { src: "/images/Ethiopi_A.jpg",              label: "South Korea" },
  { src: "/images/Colombi_A.jpg",              label: "Colombia"    },
  { src: "/images/Nepa_L.jpg",                 label: "Hawaii"      },
  { src: "/images/Cambodi_A.jpg",              label: "Seoul"       },
  { src: "/images/explore/destination-6.jpg",  label: "Antigua"     },
];

/* ─────────────────────────────────────────────
   Responsive helpers injected once via <style>
───────────────────────────────────────────── */
const RESPONSIVE_CSS = `
  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Section 1 — Hero ── */
  .hs-hero-inner {
    padding: 180px 144px 60px;
  }
  .hs-headline { font-size: clamp(2.8rem, 6vw, 4.8rem); }

  /* ── Section 2 — Sky video card ── */
  .hs-sky-section {
    padding: 40px 144px;
  }
  .hs-sky-text {
    padding: 80px 64px;
  }
  .hs-sky-h2 { font-size: clamp(2.6rem, 4vw, 4rem); }

  /* ── Section 3 — Explore grid ── */
  .hs-explore-section {
    padding: 70px 144px 0px;
  }
  .hs-explore-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  .hs-col-tall {
    /* Column 2 fills the height of col 1 & 3 naturally */
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }

  /* ── Airplane ── */
  .hs-airplane {
    position: absolute;
    top: 1px;
    left: 87px;
    z-index: 2;
    pointer-events: none;
    width: clamp(260px, 42vw, 480px);
  }

  /* ════════════════════════════════════════
     TABLET  ≤ 1024px
  ════════════════════════════════════════ */
  @media (max-width: 1024px) {
    .hs-hero-inner   { padding: 160px 64px 60px; }
    .hs-airplane     { left: 20px; width: clamp(200px, 36vw, 340px); }
    .hs-sky-section  { padding: 32px 64px; }
    .hs-sky-text     { padding: 60px 40px; }
    .hs-explore-section { padding: 64px 64px; }
  }

  /* ════════════════════════════════════════
     LARGE MOBILE  ≤ 768px
  ════════════════════════════════════════ */
  @media (max-width: 768px) {
    .hs-hero-inner   { padding: 140px 24px 48px; }
    .hs-airplane     { left: -10px; width: clamp(160px, 50vw, 260px); top: 4px; }
    .hs-headline     { font-size: clamp(2rem, 8vw, 3rem); }

    .hs-sky-section  { padding: 24px 20px; }
    .hs-sky-text     { padding: 48px 28px; }
    .hs-sky-h2       { font-size: clamp(2rem, 7vw, 3rem); }

    .hs-explore-section { padding: 48px 20px 5px; }
    /* Collapse to single column on mobile */
    .hs-explore-grid {
      grid-template-columns: 1fr 1fr;
    }
    /* The tall middle column spans 2 cols */
    .hs-col-tall { grid-column: 1 / -1; aspect-ratio: 16/7; }
    .hs-col-stack { flex-direction: row; }
  }

  /* ════════════════════════════════════════
     SMALL MOBILE  ≤ 480px
  ════════════════════════════════════════ */
  @media (max-width: 480px) {
    .hs-hero-inner   { padding: 120px 16px 40px; }
    .hs-airplane     { width: clamp(120px, 44vw, 200px); left: -4px; }
    .hs-headline     { font-size: clamp(1.8rem, 9vw, 2.6rem); }

    .hs-hero-btns    { flex-direction: column; width: 100%; }
    .hs-hero-btns button { width: 100%; justify-content: center; }

    .hs-sky-section  { padding: 16px 12px; }
    .hs-sky-text     { padding: 36px 20px; }
    .hs-sky-h2       { font-size: clamp(1.7rem, 8vw, 2.4rem); }

    .hs-explore-section { padding: 36px 12px; }
    .hs-explore-grid {
      grid-template-columns: 1fr;
    }
    .hs-col-tall     { grid-column: 1; aspect-ratio: 4/3; }
    .hs-col-stack    { flex-direction: column; }
  }

  /* ── Hover scale utility ── */
  .hs-img-wrap img { transition: transform 0.5s ease; }
  .hs-img-wrap:hover img { transform: scale(1.06); }
`;



/* ─────────────────────────────────────────────
   Reusable destination card
───────────────────────────────────────────── */
const DestCard = ({ src, label, style = {} }) => (

  


  <div
    className="hs-img-wrap"
    style={{
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      ...style,
    }}
  >
    <img
      src={src}
      alt={label}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      onError={e => {
        e.target.style.display = "none";
        e.target.parentElement.style.background = "linear-gradient(135deg,#00477f,#005fa3)";
      }}
    />
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
      pointerEvents: "none",
    }}/>
    <span style={{
      position: "absolute", bottom: "14px", left: "16px",
      color: "white",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 800, fontSize: "1.05rem",
    }}>
      {label}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const HeroSection = ({ user }) => {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const continueManually = useCallback(() => {
    window.location.href = "https://visa.helloviza.com";
  }, []);
  

  return (


    
    <>
      <style>{RESPONSIVE_CSS}</style>

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <section
        id="hero"
        style={{
          position: "relative",
          background: "white",
          minHeight: "520px",
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Airplane */}
        <div className="hs-airplane">
          <img
            src={AIRPLANE_IMAGE}
            alt="Airplane"
            style={{
              width: "100%", height: "auto", display: "block",
              filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.13))",
            }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>

        {/* Hero text */}
        <div
          className="hs-hero-inner"
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", position: "relative", zIndex: 3,
          }}
        >
          {/* Headline */}
          <h1
            className="hs-headline"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900, color: BRAND,
              lineHeight: 1.05, letterSpacing: "-1.5px",
              marginBottom: "16px", maxWidth: "680px",
            }}
          >
            Your gateway to the{" "}
            <span style={{ color: ACCENT }}>WORLD</span>

            {/* Avatars */}
            <span style={{
              display: "inline-flex", alignItems: "center",
              gap: "0", marginLeft: "12px",
              verticalAlign: "middle", position: "relative", top: "-4px",
            }}>
              {AVATAR_IMAGES.map((src, i) => (
                <img
                  key={i} src={src} alt={`User ${i + 1}`}
                  style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    border: "2px solid white", objectFit: "cover",
                    marginLeft: i === 0 ? "0" : "-10px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                  onError={e => { e.target.style.background = "#e2e8f0"; }}
                />
              ))}
              {/* HV badge */}
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                border: "2px solid white", marginLeft: "-10px",
                background: BRAND, display: "flex",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}>
                <span style={{
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900, fontSize: "0.65rem",
                }}>HV</span>
              </div>
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#64748b", fontSize: "0.95rem", lineHeight: 1.65,
            maxWidth: "480px", marginBottom: "32px",
            fontFamily: "'Inter', sans-serif",
          }}>
            {t("home.hero.subtitle", {
              defaultValue:
                "Behind every visa lies a world of endless possibilities. Visa Services simplifies your journey, unlocking seamless travel, unforgettable adventures, and hassle-free exploration wherever your dreams take you",
            })}
          </p>

          {/* CTA Buttons */}
          <div
            className="hs-hero-btns"
            style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
          >
            <button
              onClick={continueManually}
              style={{
                background: BRAND, color: "white", border: "none",
                borderRadius: "999px", padding: "12px 28px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.04em",
                cursor: "pointer", transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#003d6e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = BRAND;     e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Explore More
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: ACCENT, color: "white", border: "none",
                borderRadius: "999px", padding: "12px 28px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.04em",
                cursor: "pointer", transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#b85540"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = ACCENT;    e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Signup
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — SKY VIDEO CARD
      ══════════════════════════════════════ */}
      <section className="hs-sky-section" style={{ background: "#fff" }}>
        <div style={{
          position: "relative", overflow: "hidden",
          minHeight: "420px", display: "flex", alignItems: "center",
          borderRadius: "18px",
        }}>
          {/* Video */}
          <video
            autoPlay muted loop playsInline
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
            }}
          >
            <source src={SKY_VIDEO_WEBM} type="video/webm"/>
            <source src={SKY_VIDEO_MP4}  type="video/mp4"/>
          </video>

          {/* Dark overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }}/>

          {/* Text */}
          <div className="hs-sky-text" style={{ position: "relative", zIndex: 2 }}>
            <p style={{
              color: "#d06549", fontSize: "0.78rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: "14px",
              fontFamily: "'Inter', sans-serif",
            }}>
              Discover
            </p>
            <h2
              className="hs-sky-h2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900, color: "white",
                lineHeight: 1.0, letterSpacing: "-1px", marginBottom: "20px",
              }}
            >
              Where the Sky<br/>
              <span style={{ fontStyle: "italic", color: "#d06549" }}>Meets</span> the Earth
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.72)", fontSize: "0.9rem",
              lineHeight: 1.6, maxWidth: "420px",
              fontFamily: "'Inter', sans-serif", margin: 0,
            }}>
              From bustling cityscapes to serene mountain retreats — we open every door so your journey is as extraordinary as your destination.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — EXPLORE GRID
      ══════════════════════════════════════ */}
      <section className="hs-explore-section" style={{ background: "white" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <h2 style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900, color: "#1e293b",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            lineHeight: 1.05, letterSpacing: "-0.5px", marginBottom: "16px",
          }}>
            Explore <em style={{ fontStyle: "italic" }}>Worlds</em><br/>
            Beyond Imagination
          </h2>
          <p style={{
            color: "#64748b", fontSize: "0.9rem", lineHeight: 1.65,
            maxWidth: "520px", margin: "0 auto 40px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Embark on a seamless journey to the world's most exclusive destinations. From hidden valleys to pristine coastlines, our bespoke visa services unlock extraordinary escapes, crafted with elegance to inspire your next adventure.
          </p>
        </div>

        {/* Grid */}
        <div className="hs-explore-grid">

          {/* Column 1 — 2 stacked */}
          <div className="hs-col-stack" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <DestCard src={EXPLORE_IMAGES[0].src} label={EXPLORE_IMAGES[0].label} style={{ aspectRatio: "4/3" }}/>
            <DestCard src={EXPLORE_IMAGES[1].src} label={EXPLORE_IMAGES[1].label} style={{ aspectRatio: "4/3" }}/>
          </div>

          {/* Column 2 — tall single */}
          <div className="hs-col-stack" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <DestCard
            src={EXPLORE_IMAGES[2].src}
            label={EXPLORE_IMAGES[2].label}
             style={{ flex: 0.85 }}

          />
          </div>

          {/* Column 3 — 2 stacked */}
          <div className="hs-col-stack" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <DestCard src={EXPLORE_IMAGES[3].src} label={EXPLORE_IMAGES[3].label} style={{ aspectRatio: "4/3" }}/>
            <DestCard src={EXPLORE_IMAGES[4].src} label={EXPLORE_IMAGES[4].label} style={{ aspectRatio: "4/3" }}/>
          </div>

        </div>
      </section>
    </>
  );
};

export default HeroSection; 