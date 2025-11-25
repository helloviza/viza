// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Home.css";
import bgImg from "../assets/hero-bg.jpg"; // fallback static bg
import VisaSearchNeo from "../components/VisaSearchNeo";

function ResultsList({ items = [] }) {
  const { t } = useTranslation();
  if (!items || items.length === 0) return null;

  return (
    <section style={{ maxWidth: 1120, margin: "24px auto", padding: "0 24px" }}>
      <h3
        style={{
          fontFamily: "'Barlow Condensed', Arial, sans-serif",
          color: "#00477f",
          fontSize: "1.4rem",
          marginBottom: 12,
          fontWeight: 800,
          textAlign: "start",
        }}
      >
        {t("home.results.title")}
      </h3>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
        {items.map((v, idx) => {
          const title =
            v.route ??
            `${v.country || t("home.results.fallbackDestination")} — ${
              v.type || v.visaType || t("home.results.fallbackVisa")
            }`;

          return (
            <div
              key={v.id || `${v.country || v.route}-${idx}`}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 6px 16px rgba(0,0,0,.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', Arial, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    color: "#0f172a",
                    textAlign: "start",
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    fontFamily: "'Barlow Condensed', Arial, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: "#00477f",
                    textAlign: "end",
                  }}
                >
                  {(v.currency === "INR" || !v.currency ? "₹" : v.currency) + " "}
                  {v.fees || (v.fee ? String(v.fee).replace(/[^\d]/g, "") : "") || "—"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  marginTop: 8,
                  color: "#475569",
                  fontFamily: "'Barlow Condensed', Arial, sans-serif",
                }}
              >
                {v.processing_time && <span>{t("home.results.processing")} {v.processing_time}</span>}
                {v.processing && !v.processing_time && <span>{t("home.results.processing")} {v.processing}</span>}
                {v.validity && <span>{t("home.results.validity")} {v.validity}</span>}
                {v.stay && <span>{t("home.results.stay")} {v.stay}</span>}
                {v.type && !v.visaType && <span>{t("home.results.type")} {v.type}</span>}
                {v.visaType && <span>{t("home.results.type")} {v.visaType}</span>}
              </div>

              {Array.isArray(v.requirements) && v.requirements.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    color: "#64748b",
                    fontFamily: "'Barlow Condensed', Arial, sans-serif",
                    textAlign: "start",
                  }}
                >
                  {t("home.results.requirements")} {v.requirements.join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const Home = () => {
  const { t } = useTranslation();
  const [showBg, setShowBg] = useState(true);
  const [results, setResults] = useState([]);
  const bgRef = useRef(null);

  useEffect(() => {
    const sectionHeight = typeof window !== "undefined" ? window.innerHeight : 700;
    const onScroll = () => setShowBg(window.scrollY < sectionHeight * 2 - 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Static background image (no animation)
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    el.style.backgroundImage = `url(${bgImg})`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  }, []);

  return (
    <main id="home-main">
      {/* Background layer */}
      <div
        ref={bgRef}
        className="hero-bg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
          transition: "opacity .7s cubic-bezier(.7,0,.3,1)",
          opacity: showBg ? 1 : 0,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />

      {/* Foreground content */}
      <section className="hero-wrapper" id="hero">
        <div className="hero-content">
          <div className="text-block" style={{ textAlign: "start" }}>
            <h1 style={{ lineHeight: 1.05 }}>
              <span>{t("home.hero.titleLine1")}</span>
              <br />
              <span>{t("home.hero.titleLine2")}</span>
            </h1>
            <p style={{ marginTop: 10 }}>{t("home.hero.subtitle")}</p>
          </div>

          <div style={{ width: "100%", marginTop: 16 }}>
            <VisaSearchNeo onResults={setResults} />
          </div>
        </div>
      </section>

      {/* Spacer clamp: removes any big gap between hero and the next section */}
      <div style={{ height: "clamp(0px, 1vh, 8px)" }} />

      <ResultsList items={results} />

      {/* NOTE: Footer is rendered ONCE globally (e.g., in App/Layout alongside <Routes />). */}
    </main>
  );
};

export default Home;
