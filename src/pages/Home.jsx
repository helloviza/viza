import React, { useEffect, useState, useRef } from "react";
import "../styles/Home.css";
import bgImg from "../assets/hero-bg.jpg"; // kept as a fallback only
import VisaSearchNeo from "../components/VisaSearchNeo";

function ResultsList({ items = [] }) {
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
        }}
      >
        Visa Options
      </h3>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "1fr",
        }}
      >
        {items.map((v, idx) => (
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
                }}
              >
                {v.route
                  ? v.route
                  : `${v.country || "Destination"} — ${
                      v.type || v.visaType || "Visa"
                    }`}
              </div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', Arial, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#00477f",
                }}
              >
                {v.currency === "INR" || !v.currency ? "₹" : v.currency}{" "}
                {v.fees ||
                  (v.fee ? String(v.fee).replace(/[^\d]/g, "") : "") ||
                  "—"}
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
              {v.processing_time && <span>Processing: {v.processing_time}</span>}
              {v.processing && !v.processing_time && (
                <span>Processing: {v.processing}</span>
              )}
              {v.validity && <span>Validity: {v.validity}</span>}
              {v.stay && <span>Stay: {v.stay}</span>}
              {v.type && !v.visaType && <span>Type: {v.type}</span>}
              {v.visaType && <span>Type: {v.visaType}</span>}
            </div>
            {Array.isArray(v.requirements) && v.requirements.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  color: "#64748b",
                  fontFamily: "'Barlow Condensed', Arial, sans-serif",
                }}
              >
                Requirements: {v.requirements.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const Home = () => {
  const [showBg, setShowBg] = useState(true);
  const [results, setResults] = useState([]);
  const bgRef = useRef(null);

  useEffect(() => {
    const sectionHeight =
      typeof window !== "undefined" ? window.innerHeight : 700;
    const onScroll = () => setShowBg(window.scrollY < sectionHeight * 2 - 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mount Three.js background lazily into .hero-bg
  useEffect(() => {
    let engine;
    const el = bgRef.current;
    if (!el) return;

    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Fallback: keep static image
      el.style.backgroundImage = `url(${bgImg})`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      return;
    }

    let cancelled = false;
    import("../lib/three/heroBackground").then((mod) => {
      if (cancelled) return;
      if (!mod.isWebGLAvailable || !mod.isWebGLAvailable()) {
        // Fallback: static image
        el.style.backgroundImage = `url(${bgImg})`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        return;
      }
      engine = mod.createHeroBackground(el, {
        noiseUrl: "/assets/noise.png",
      });
    });

    return () => {
      cancelled = true;
      if (engine && engine.destroy) engine.destroy();
    };
  }, []);

  return (
    <>
      <div className="hero-wrapper" id="hero">
        {/* Background layer (now a Three.js canvas container) */}
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
        <div className="hero-content">
          <div className="text-block">
            <h1>
              Your Gateway to
              <br />
              The World
            </h1>
            <p>
              Behind every visa lies a world of endless possibilities. Visa
              Services simplifies your journey, unlocking seamless travel,
              unforgettable adventures, and hassle-free exploration wherever
              your dreams take you
            </p>
          </div>

          <div style={{ width: "100%", marginTop: 16 }}>
            <VisaSearchNeo onResults={setResults} />
          </div>
        </div>
      </div>

      <ResultsList items={results} />
    </>
  );
};

export default Home;
