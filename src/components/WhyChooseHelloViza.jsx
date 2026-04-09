// src/components/WhyChooseHelloviza.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";



const BRAND  = "#00477f";
const ACCENT = "#d06549";

// ─────────────────────────────────────────────
// 🖼️  ADD YOUR OWN CAROUSEL IMAGES HERE
//     e.g. { src: "/images/vietnam.jpg", alt: "Vietnam" }
// ─────────────────────────────────────────────
const CAROUSEL_IMAGES = [
  { src: "/images/singapore.jpg", alt: "Singapore" },
  { src: "/images/taiwan.jpg", alt: "Taiwan" },
  { src: "/images/new_zealand.jpg", alt: "New Zealand" },
  { src: "/images/georgia.jpg", alt: "Georgia" },
  { src: "/images/russia.jpg", alt: "Russia" }
];

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// VISA SERVICE LIST
// ─────────────────────────────────────────────
const VISA_TYPES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Tourist Visa",
    desc: "Experience seamless travel for holidays and tourism across the globe.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" strokeWidth="1.8"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="white" strokeWidth="1.8"/>
        <path d="M12 12v4M10 14h4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: "Business Visa",
    desc: "Accelerate your international business journeys with dedicated support.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 10v6M2 10l10-7 10 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 10v10h12V10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="14" width="6" height="6" stroke="white" strokeWidth="1.6"/>
      </svg>
    ),
    title: "Student Visa",
    desc: "Unlock global education opportunities with our expert visa guidance.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Family Visa",
    desc: "Bring your loved ones closer—smooth family visa processing for all destinations.",
  },
];

// ─────────────────────────────────────────────
// FEATURE CARD ICONS
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// TOUCH-AWARE IMAGE CAROUSEL
// ─────────────────────────────────────────────
const ImageCarousel = ({ images }) => {
  const [active, setActive]       = useState(0);
  const [animating, setAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const goTo = useCallback((idx) => {
    if (animating || idx === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(idx); setAnimating(false); }, 350);
  }, [animating, active]);

  const prev = () => goTo((active - 1 + images.length) % images.length);
  const next = () => goTo((active + 1) % images.length);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length]);

  // Touch / swipe support
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
        borderRadius: "20px",
        overflow: "hidden",
        aspectRatio: "4/3",
        boxShadow: "0 20px 56px rgba(0,71,127,0.18)",
        background: "#e8f0fb",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Slides */}
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

      {/* Prev / Next arrows */}
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
                // tap highlight off on mobile
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

      {/* Dot indicators */}
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

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const WhyChooseHelloViza = () => {
  const { t }     = useTranslation();
  const width     = useWindowWidth();

  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  // Padding: 20px mobile → 40px tablet → 103px desktop
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

  const stats = [
    { big: "99.2%", label: "Visas On Time"     },
    { big: "500k+", label: "Visas Processed"   },
    { big: "4.81★", label: "Customer Rating"   },
    { big: "150+",  label: "Countries Covered" },
  ];

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

        {/* ══ HERO ROW ══════════════════════════════════════════════ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: isDesktop ? "10px" : "28px",
          alignItems: "center",
          marginBottom: isMobile ? "32px" : "52px",
        }}>

          {/* Carousel renders ABOVE text on mobile/tablet */}
          {!isDesktop && (
            <div>
              <ImageCarousel images={CAROUSEL_IMAGES} />
            </div>
          )}

          {/* ── LEFT: text + visa list ── */}
          <div style={{ paddingRight: isDesktop ? "40px" : "0" }}>

            <p style={{
              color: ACCENT, fontSize: "0.78rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              marginBottom: "10px",
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
            }}>
              {t("services.why.title", { defaultValue: "Why Choose Us" })}
            </p>

            <h2 style={{
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
              fontWeight: 900, color: BRAND,
              fontSize: isMobile ? "2rem" : isTablet ? "2.6rem" : "clamp(2.6rem, 4vw, 3.8rem)",
              lineHeight: 1.05, letterSpacing: "-1px", marginBottom: "12px",
            }}>
              Why Choose{" "}
  <span
    style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 900,
      fontSize: isMobile ? "1.8rem" : isTablet ? "2.4rem" : "clamp(2.4rem, 3.8vw, 3.0rem)",
      color: ACCENT,
      letterSpacing: "-0.5px",
    }}
  >
    hello
  </span>
  <span
    style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 900,
      fontSize: isMobile ? "1.8rem" : isTablet ? "2.4rem" : "clamp(2.4rem, 3.8vw, 3.0rem)",
      color: BRAND,
      letterSpacing: "-0.5px",
    }}
  >
    viza?
  </span>

            </h2>

            <p style={{
              color: "#64748b",
              fontSize: isMobile ? "0.9rem" : "1rem",
              lineHeight: 1.65, marginBottom: "24px",
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;", maxWidth: "460px",
            }}>
              Your trusted partner for global visas. Fast, reliable, and always by your side.
            </p>

            {/* Visa type list */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {VISA_TYPES.map((v, i) => (
                <div key={i}>
                  <div style={{
                    display: "flex", alignItems: "flex-start", gap: "14px",
                    padding: isMobile ? "13px 0" : "17px 0",
                  }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: BRAND, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(0,71,127,0.25)",
                    }}>
                      {v.icon}
                    </div>
                    <div>
                      <h4 style={{
                        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                        fontWeight: 800, color: BRAND,
                        fontSize: isMobile ? "1rem" : "2rem", marginBottom: "3px",
                      }}>
                        {v.title}
                      </h4>
                      <p style={{
                        color: "#64748b",
                        fontSize: isMobile ? "0.82rem" : "0.9rem",
                        lineHeight: 1.5, margin: 0,
                        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                      }}>
                        {v.desc}
                      </p>
                    </div>
                  </div>
                  {i < VISA_TYPES.length - 1 && (
                    <div style={{ height: "1px", background: "rgba(0,0,0,0.06)" }}/>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: carousel (desktop only) ── */}
          {isDesktop && (
            <div>
              <ImageCarousel images={CAROUSEL_IMAGES} />
            </div>
          )}
        </div>



      </div>
    </section>
  );
};

export default WhyChooseHelloViza;