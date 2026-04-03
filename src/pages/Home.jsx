// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnnouncementBar from "../components/AnnouncementBar";
import VisaTilesSection from "../components/VisaTilesSection";


/* ─────────────────────────────────────────
   Results List
───────────────────────────────────────── */
function ResultsList({ items = [] }) {
  const { t } = useTranslation();
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto mt-6 px-6">
      <h3 className="text-[#00477f] text-2xl font-extrabold mb-3 text-start">
        {t("home.results.title")}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((v, idx) => {
          const title =
            v.route ??
            `${v.country || t("home.results.fallbackDestination")} — ${
              v.type || v.visaType || t("home.results.fallbackVisa")
            }`;
          return (
            <div
              key={v.id || `${v.country || v.route}-${idx}`}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-center gap-3 flex-wrap">
                <span className="font-extrabold text-lg text-slate-900">{title}</span>
                <span className="font-extrabold text-[#00477f]">
                  {(v.currency === "INR" || !v.currency ? "₹" : v.currency) + " "}
                  {v.fees || (v.fee ? String(v.fee).replace(/[^\d]/g, "") : "") || "—"}
                </span>
              </div>
              <div className="flex gap-4 flex-wrap mt-2 text-slate-500 text-sm">
                {v.processing_time && <span>{t("home.results.processing")} {v.processing_time}</span>}
                {v.processing && !v.processing_time && <span>{t("home.results.processing")} {v.processing}</span>}
                {v.validity && <span>{t("home.results.validity")} {v.validity}</span>}
                {v.stay && <span>{t("home.results.stay")} {v.stay}</span>}
                {v.type && !v.visaType && <span>{t("home.results.type")} {v.type}</span>}
                {v.visaType && <span>{t("home.results.type")} {v.visaType}</span>}
              </div>
              {Array.isArray(v.requirements) && v.requirements.length > 0 && (
                <div className="mt-2 text-slate-400 text-sm text-start">
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


/* ─────────────────────────────────────────
   Home Page
───────────────────────────────────────── */
const Home = ({ user }) => {
  const { t } = useTranslation();
  const [showBg, setShowBg] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const sectionHeight = typeof window !== "undefined" ? window.innerHeight : 700;
    const onScroll = () => setShowBg(window.scrollY < sectionHeight * 2 - 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />

      <main id="home-main">

        {/* ── Video Background (fixed) ── */}
        <div
          className="fixed inset-0 w-full h-screen -z-10 overflow-hidden pointer-events-none"
          style={{
            opacity: showBg ? 1 : 0,
            transition: "opacity .7s cubic-bezier(.7,0,.3,1)",
            willChange: "opacity",
          }}
        >
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
          <video
            autoPlay muted loop playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/helloviza.webm" type="video/webm" />
            <source src="/videos/helloviza.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Hero Section ── */}
        <section
          id="hero"
          className="relative z-10 w-full min-h-screen flex items-center"
        >
          {/*
            flex-col      → mobile: text top, tiles bottom
            md:flex-row   → 768px+: text LEFT | tiles RIGHT  ← side by side
          */}
          <div className="
            w-full max-w-[1280px] mx-auto
            pt-24
            flex flex-col md:flex-row
            items-center
            gap-8 md:gap-10 lg:gap-14
          ">   
          

            {/* ── LEFT: Text ── */}
            <div className="w-full md:w-1/2 text-center md:text-left text-white shrink-0">
              <h1 className="font-extrabold leading-[1.05] text-[2rem] sm:text-[2.5rem] md:text-[2.8rem] lg:text-[3.2rem] mb-3">
                <span>{t("home.hero.titleLine1")}</span>
                <br />
                <span>{t("home.hero.titleLine2")}</span>
              </h1>
              <p className="text-white/85 leading-relaxed text-sm sm:text-base md:text-lg max-w-sm mx-auto md:mx-0">
                {t("home.hero.subtitle")}
              </p>
            </div>

            {/* ── RIGHT: Visa Tiles (now normal flow, not fixed) ── */}
            <div className="w-full md:w-1/2 shrink-0">
              <VisaTilesSection user={user} />
            </div>

          </div>
        </section>

        {/* <ResultsList items={results} /> */}
      </main>
    </>
  );
};

export default Home;