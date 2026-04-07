// src/components/PopularVisaDestinations.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

// ── Static fallback data (future-proof: replace with API data) ──
const STATIC_DESTINATIONS = [
  { id: 1,  country: "Dubai",       flag: "🇦🇪", image: "/images/dubai.jpg",       processingTime: "3-5 days", fee: "₹6,500",  popular: true  },
  { id: 2,  country: "Thailand",    flag: "🇹🇭", image: "/images/thailand.jpg",    processingTime: "2-4 days", fee: "₹4,200",  popular: true  },
  { id: 3,  country: "Singapore",   flag: "🇸🇬", image: "/images/singapore.jpg",   processingTime: "4-7 days", fee: "₹5,800",  popular: false },
  { id: 4,  country: "Malaysia",    flag: "🇲🇾", image: "/images/malaysia.jpg",    processingTime: "1-3 days", fee: "₹3,500",  popular: false },
  { id: 5,  country: "USA",         flag: "🇺🇸", image: "/images/usa.jpg",         processingTime: "7-15 days",fee: "₹18,000", popular: true  },
  { id: 6,  country: "UK",          flag: "🇬🇧", image: "/images/uk.jpg",          processingTime: "5-10 days",fee: "₹16,500", popular: false },
  { id: 7,  country: "Maldives",    flag: "🇲🇻", image: "/images/maldives.jpg",    processingTime: "On arrival",fee: "₹0",    popular: false },
  { id: 8,  country: "Australia",   flag: "🇦🇺", image: "/images/australia.jpg",   processingTime: "5-7 days", fee: "₹12,000", popular: false },
];

// ── API fetcher (plug your endpoint here) ──
async function fetchVisaDestinations() {
  // TODO: Replace with your actual API endpoint
  // const res = await fetch("/api/visa-destinations/popular");
  // if (!res.ok) throw new Error("API error");
  // return res.json();
  return null; // returns null → fallback to static
}

// ── Single card ──
function DestCard({ dest, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onClick(dest)}
      className="relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 group"
      style={{
        width: "clamp(160px, 28vw, 200px)",
        height: "clamp(210px, 36vw, 260px)",
        boxShadow: hov
          ? "0 16px 40px rgba(0,71,127,0.22)"
          : "0 4px 16px rgba(0,0,0,0.10)",
        transform: hov ? "translateY(-4px) scale(1.02)" : "none",
        transition: "all 0.25s cubic-bezier(.22,.9,.22,1)",
      }}
    >
      {/*
        Destination card image: 200px × 260px
        Replace src with your actual destination images
      */}
      <img
        src={dest.image}
        alt={dest.country}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Popular badge */}
      {/* {dest.popular && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[0.65rem] font-black uppercase tracking-wider"
          style={{ background: ACCENT, fontFamily: "'Inter', sans-serif" }}>
          Popular
        </div>
      )} */}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xl">{dest.flag}</span>
          <span
            className="text-white font-black text-lg leading-none"
            style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
          >
            {dest.country}
          </span>
        {/* </div>
        <div className="flex justify-between items-center">
          <span className="text-white/75 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
            {dest.processingTime}
          </span>
          <span
            className="text-white font-bold text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {dest.fee}
          </span> */}
        </div>

        {/* Apply button (on hover) */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: hov ? 40 : 0, opacity: hov ? 1 : 0, marginTop: hov ? 8 : 0 }}
        >
          <div
            className="w-full text-center py-1.5 rounded-lg text-white text-sm font-bold"
            style={{ background: ACCENT, fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
          >
            Apply Now →
          </div>
        </div>
      </div>
    </div>
  );
}

const PopularVisaDestination=() =>{
  const navigate    = useNavigate();
  const { t }       = useTranslation();
  const [destinations, setDestinations] = useState(STATIC_DESTINATIONS);
  const [loading, setLoading]           = useState(false);
  // const [activeFilter, setActiveFilter] = useState("All");

 // const FILTERS = ["All", "Asia", "Europe", "Americas", "Middle East"];

  // ── API integration (future-proof) ──
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchVisaDestinations()
      .then((data) => {
        if (!cancelled && data && Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(() => {/* keep static */})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCardClick = (dest) => {
    navigate(`/go/visa?country=${encodeURIComponent(dest.country)}`);
  };

  return (
    <section className="bg-[#f1f1f1] pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Heading row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p
              className="text-[#d06549] text-sm font-bold uppercase tracking-[0.18em] mb-2"
              style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
            >
              {t("visa.popular.eyebrow", { defaultValue: "Trending Now" })}
            </p>
            <h2
              className="font-black text-[#00477f] leading-none m-0"
              style={{
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                letterSpacing: "-0.5px",
              }}
            >
              {t("visa.popular.title", { defaultValue: "Popular Visa Destinations" })}
            </h2>
          </div>

          {/* <button
            onClick={() => navigate("/go/visa")}
            className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              background: BRAND,
              color: "#fff",
            }}
          >
            View All →
          </button> */}
        </div>

        {/* Filter pills */}
         {/* <div className="flex gap-2.5 mb-8 flex-wrap"> */}
          {/* {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.92rem",
                background: activeFilter === f ? BRAND : "rgba(0,71,127,0.07)",
                color: activeFilter === f ? "#fff" : BRAND,
                border: `1.5px solid ${activeFilter === f ? BRAND : "rgba(0,71,127,0.15)"}`,
              }}
            >
              {f}
            </button>
          ))} */}
          {/* Live indicator */}
          {/* <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-xs text-gray-400 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Live Pricing
            </span>
          </div> */}
        {/* </div> */}

        {/* Cards horizontal scroll */}
        <div
          className="overflow-x-auto pb-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: `${ACCENT} transparent` }}
        >
          <div className="flex gap-5" style={{ width: "max-content" }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}
                    className="rounded-2xl flex-shrink-0 animate-pulse bg-gray-200"
                    style={{ width: "clamp(160px, 28vw, 200px)", height: "clamp(210px, 36vw, 260px)" }}/>
                ))
              : destinations.map((dest) => (
                  <DestCard key={dest.id} dest={dest} onClick={handleCardClick} />
                ))
            }
          </div>
        </div>

        {/* Bottom CTA strip */}
        {/* <div
          className="mt-10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-6"
          style={{ background: "linear-gradient(135deg, #00477f 0%, #005fa3 100%)" }}
        >
          <div>
            <p
              className="text-white font-black text-xl leading-tight mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Not sure which visa you need?
            </p>
            <p className="text-white/70 text-sm m-0" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our experts will guide you — free of charge.
            </p>
          </div>
          <button
            onClick={() => navigate("/go/visa")}
            className="px-8 py-3 rounded-xl font-black text-base transition-all duration-200 hover:scale-105 flex-shrink-0"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.1rem",
              background: ACCENT,
              color: "#fff",
              boxShadow: "0 6px 20px rgba(208,101,73,0.4)",
            }}
          >
            Get Free Advice →
          </button>
        </div> */}
      </div>
    </section>
  );
}


export default PopularVisaDestination;
