// src/components/WhyChooseHelloviza.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

const CAROUSEL_IMAGES = [
  { src: "/images/singapore.jpg",  alt: "Singapore"  },
  { src: "/images/taiwan.jpg",     alt: "Taiwan"     },
  { src: "/images/new_zealand.jpg",alt: "New Zealand" },
  { src: "/images/georgia.jpg",    alt: "Georgia"    },
  { src: "/images/russia.jpg",     alt: "Russia"     },
];

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

const STATS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    big: "99.2%", title: "Visas On Time",
    desc: "Visas delivered on or before the travel date, every time.",
    accent: BRAND, bg: "rgba(0,71,127,0.06)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    big: "500k+", title: "Visas Processed",
    desc: "Half a million travelers successfully served worldwide.",
    accent: ACCENT, bg: "rgba(208,101,73,0.06)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    big: "4.81★", title: "Customer Rating",
    desc: "Industry's highest rating for service & reliability.",
    accent: ACCENT, bg: "rgba(208,101,73,0.06)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" stroke="white" strokeWidth="2"/>
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
          stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    big: "150+", title: "Countries Covered",
    desc: "Visa assistance for destinations across every continent.",
    accent: BRAND, bg: "rgba(0,71,127,0.06)",
  },
];

const ICONS = {
  speed: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill={ACCENT} opacity="0.1"/>
      <path d="M20 10v4M20 26v4M10 20h4M26 20h4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="6" fill={ACCENT} opacity="0.2" stroke={ACCENT} strokeWidth="2"/>
      <path d="M20 20l3-5" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  secure: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <path d="M20 5L8 10v9c0 7.18 5.14 13.88 12 15.5C27.86 32.88 33 26.18 33 19V10L20 5z"
        fill={BRAND} opacity="0.1" stroke={BRAND} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M15 20l3.5 3.5L26 16" stroke={BRAND} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  support: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill={ACCENT} opacity="0.08"/>
      <path d="M12 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
      <rect x="10" y="22" width="5" height="7" rx="2.5" fill={ACCENT} opacity="0.3" stroke={ACCENT} strokeWidth="1.5"/>
      <rect x="25" y="22" width="5" height="7" rx="2.5" fill={ACCENT} opacity="0.3" stroke={ACCENT} strokeWidth="1.5"/>
    </svg>
  ),
  track: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="8" width="24" height="24" rx="5" fill={BRAND} opacity="0.08" stroke={BRAND} strokeWidth="1.8"/>
      <path d="M14 20h12M20 14v12" stroke={BRAND} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <circle cx="20" cy="20" r="4" fill={BRAND} opacity="0.25" stroke={BRAND} strokeWidth="1.8"/>
      <circle cx="20" cy="20" r="1.5" fill={BRAND}/>
    </svg>
  ),
  price: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill={ACCENT} opacity="0.08"/>
      <path d="M20 11v2M20 27v2M15 16h7.5c1.38 0 2.5 1.12 2.5 2.5S23.88 21 22.5 21H17.5C16.12 21 15 22.12 15 23.5S16.12 26 17.5 26H25"
        stroke={ACCENT} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  expert: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="15" r="7" fill={BRAND} opacity="0.1" stroke={BRAND} strokeWidth="1.8"/>
      <path d="M10 33c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={BRAND} strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 12l1.5 3 3 .5-2.25 2.1.5 3-2.75-1.5-2.75 1.5.5-3L19.5 15.5l3-.5z"
        fill={ACCENT} stroke={ACCENT} strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  ),
};

// ─── CAROUSEL ────────────────────────────────────────────────────────────────
const ImageCarousel = ({ images }) => {
  const [active, setActive]         = useState(0);
  const [animating, setAnimating]   = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const goTo = useCallback((idx) => {
    if (animating || idx === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(idx); setAnimating(false); }, 350);
  }, [animating, active]);

  const prev = () => goTo((active - 1 + images.length) % images.length);
  const next = () => goTo((active + 1) % images.length);

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length]);

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd   = (e) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    setTouchStart(null);
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",           /* ← fills parent height instead of aspect-ratio */
        minHeight: "320px",        /* ← fallback for mobile stacked layout */
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 56px rgba(0,71,127,0.18)",
        background: "#e8f0fb",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: "absolute", inset: 0,
            opacity: i === active ? (animating ? 0 : 1) : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: i === active ? "auto" : "none",
          }}
        >
          <img
            src={img.src}
            alt={img.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => {
              e.target.style.display = "none";
              e.target.parentElement.style.background =
                i % 2 === 0
                  ? "linear-gradient(135deg, #00477f 0%, #005fa3 100%)"
                  : "linear-gradient(135deg, #d06549 0%, #e07a5f 100%)";
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)",
            pointerEvents: "none",
          }}/>
        </div>
      ))}

      {images.length > 1 && (
        <>
          {[
            { label: "Previous", pos: "left",  onClick: prev, d: "M13 4l-6 6 6 6" },
            { label: "Next",     pos: "right", onClick: next, d: "M7 4l6 6-6 6"   },
          ].map(({ label, pos, onClick, d }) => (
            <button
              key={pos}
              onClick={onClick}
              aria-label={label}
              style={{
                position: "absolute",
                [pos]: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "36px", height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(4px)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                zIndex: 10,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d={d} stroke={BRAND} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </>
      )}

      <div style={{
        position: "absolute", bottom: "14px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "7px", zIndex: 10,
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === active ? "20px" : "7px",
              height: "7px",
              borderRadius: "9999px",
              border: "none",
              background: i === active ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
              WebkitTapHighlightColor: "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const WhyChooseHelloViza = () => {
  const { t }     = useTranslation();
  const width     = useWindowWidth();

  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const sidePad = isMobile ? "20px" : isTablet ? "40px" : "103px";

  const reasons = useMemo(() => [
    {
      icon: ICONS.speed,  number: "01",
      title: t("services.cards.0.title", { defaultValue: "Lightning Fast Processing" }),
      desc:  t("services.cards.0.desc",  { defaultValue: "Get your visa approved in record time with our streamlined digital process." }),
      bg: "rgba(208,101,73,0.05)",
    },
    {
      icon: ICONS.secure, number: "02",
      title: t("services.cards.1.title", { defaultValue: "100% Secure & Trusted" }),
      desc:  t("services.cards.1.desc",  { defaultValue: "Your documents and personal data are protected with enterprise-grade security." }),
      bg: "rgba(0,71,127,0.05)",
    },
    {
      icon: ICONS.support, number: "03",
      title: t("services.cards.2.title", { defaultValue: "24/7 Expert Support" }),
      desc:  t("services.cards.2.desc",  { defaultValue: "Our visa specialists are available round the clock to assist you at every step." }),
      bg: "rgba(208,101,73,0.05)",
    },
    {
      icon: ICONS.track, number: "04",
      title: t("services.cards.3.title", { defaultValue: "Real-Time Tracking" }),
      desc:  t("services.cards.3.desc",  { defaultValue: "Track your application status in real time from application to approval." }),
      bg: "rgba(0,71,127,0.05)",
    },
    {
      icon: ICONS.price, number: "05",
      title: "Best Price Guarantee",
      desc:  "Transparent pricing with no hidden charges. Get the best rates in the industry.",
      bg: "rgba(208,101,73,0.05)",
    },
    {
      icon: ICONS.expert, number: "06",
      title: "Visa Experts",
      desc:  "Our certified visa consultants bring years of experience across 150+ countries.",
      bg: "rgba(0,71,127,0.05)",
    },
  ], [t]);

  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      background: "#f1f1f1",
      padding: `${isMobile ? "40px" : "60px"} 0`,
    }}>

      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "340px", height: "340px", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(208,101,73,0.08) 0%, transparent 70%)",
        transform: "translate(30%,-30%)",
      }}/>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: "280px", height: "280px", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(0,71,127,0.07) 0%, transparent 70%)",
        transform: "translate(-30%,30%)",
      }}/>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "1400px",
        margin: "0 auto",
        paddingLeft: sidePad,
        paddingRight: sidePad,
      }}>

        {/* ══ HERO ROW ══════════════════════════════════════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: isDesktop ? "48px" : "28px",
          alignItems: "stretch",          /* ← both columns same height */
          marginBottom: isMobile ? "32px" : "52px",
        }}>

          {/* Carousel above text on mobile/tablet */}
          {!isDesktop && (
            <div style={{ width: "100%", aspectRatio: "4/3" }}>
              <ImageCarousel images={CAROUSEL_IMAGES} />
            </div>
          )}

          {/* ── LEFT: text + stats ── */}
          <div style={{
            paddingRight: isDesktop ? "20px" : "0",
            display: "flex",
            flexDirection: "column",
          }}>
            <h2 style={{
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 900, color: BRAND,
              fontSize: isMobile ? "1.8rem" : isTablet ? "2.4rem" : "clamp(2.4rem, 3.8vw, 3.0rem)",
              lineHeight: 1.05, letterSpacing: "-1px", marginBottom: "12px",
            }}>
              Why Choose{" "}
              <span style={{
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontWeight: 900,
                fontSize: isMobile ? "1.8rem" : isTablet ? "2.4rem" : "clamp(2.4rem, 3.8vw, 3.0rem)",
                color: ACCENT, letterSpacing: "-0.5px",
              }}>hello</span>
              <span style={{
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontWeight: 900,
                fontSize: isMobile ? "1.8rem" : isTablet ? "2.4rem" : "clamp(2.4rem, 3.8vw, 3.0rem)",
                color: BRAND, letterSpacing: "-0.5px",
              }}>viza?</span>
            </h2>

            <p style={{
              color: "#64748b",
              fontSize: isMobile ? "0.9rem" : "1rem",
              lineHeight: 1.65, marginBottom: "28px",
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              maxWidth: "460px",
            }}>
              Your trusted partner for global visas. Fast, reliable, and always by your side.
            </p>

            {/* Stats 2×2 grid — flex:1 so it fills remaining left-column height */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              flex: 1,                    /* ← grows to fill leftover space */
            }}>
              {STATS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: isMobile ? "16px 14px" : "20px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    border: `1.5px solid ${s.accent}18`,
                    transition: "transform 0.18s, box-shadow 0.18s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform  = "translateY(-3px)";
                    e.currentTarget.style.boxShadow  = "0 12px 32px rgba(0,71,127,0.10)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform  = "translateY(0)";
                    e.currentTarget.style.boxShadow  = "none";
                  }}
                >
                  {/* Icon pill — stroke swapped to accent color */}
                  <div style={{
                    width: "40px", height: "40px",
                    borderRadius: "11px",
                    background: s.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {React.cloneElement(s.icon, {
                      ...s.icon.props,
                      children: React.Children.map(s.icon.props.children, child =>
                        child ? React.cloneElement(child, { stroke: s.accent }) : child
                      ),
                    })}
                  </div>

                  {/* Big number */}
                  <div style={{
                    fontSize: isMobile ? "1.6rem" : "1.9rem",
                    fontWeight: 900, lineHeight: 1,
                    letterSpacing: "-1px", color: s.accent,
                    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                  }}>
                    {s.big}
                  </div>

                  <div>
                    <p style={{
                      fontSize: "0.72rem", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      color: s.accent, margin: "0 0 5px",
                      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    }}>
                      {s.title}
                    </p>
                    <div style={{
                      height: "1.5px", background: s.accent,
                      opacity: 0.18, borderRadius: "2px", marginBottom: "6px",
                    }}/>
                    <p style={{
                      fontSize: "0.78rem", color: "#64748b",
                      lineHeight: 1.5, margin: 0,
                      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: carousel (desktop) — fills full row height ── */}
          {isDesktop && (
            <div style={{
              display: "flex",
              flexDirection: "column",
            }}>
              <ImageCarousel images={CAROUSEL_IMAGES} />
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseHelloViza;