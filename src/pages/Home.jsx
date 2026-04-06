// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnnouncementBar from "../components/AnnouncementBar";
import VisaTilesSection from "../components/VisaTilesSection";


/* ─────────────────────────────────────────
   Results List - Fully Responsive
───────────────────────────────────────── */
// function ResultsList({ items = [] }) {
//   const { t } = useTranslation();
//   if (!items || items.length === 0) return null;

//   return (
//     <section className="w-full">
//       {/* Responsive padding container */}
//       <div className="
//         w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
//         py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16
//       ">
//         {/* Max width wrapper */}
//         <div className="w-full max-w-7xl mx-auto">
//           <h3 className="
//             text-[#00477f] font-extrabold
//             text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl
//             mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8
//             text-start leading-tight
//           ">
//             {t("home.results.title")}
//           </h3>

//           {/* Results grid - responsive spacing */}
//           <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-4 lg:gap-4.5">
//             {items.map((v, idx) => {
//               const title =
//                 v.route ??
//                 `${v.country || t("home.results.fallbackDestination")} — ${
//                   v.type || v.visaType || t("home.results.fallbackVisa")
//                 }`;
              
//               return (
//                 <div
//                   key={v.id || `${v.country || v.route}-${idx}`}
//                   className="
//                     w-full bg-white border border-gray-200 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl
//                     p-3 sm:p-4 md:p-5 lg:p-6
//                     hover:shadow-md transition-shadow duration-200
//                   "
//                 >
//                   {/* Title and fees row - responsive flex */}
//                   <div className="
//                     flex flex-col sm:flex-row sm:justify-between sm:items-center
//                     gap-2 sm:gap-3 md:gap-4
//                   ">
//                     <span className="
//                       font-extrabold text-base sm:text-lg md:text-lg lg:text-xl
//                       text-slate-900
//                       break-words
//                     ">
//                       {title}
//                     </span>
//                     <span className="
//                       font-extrabold text-[#00477f]
//                       text-base sm:text-lg md:text-lg lg:text-xl
//                       whitespace-nowrap
//                     ">
//                       {(v.currency === "INR" || !v.currency ? "₹" : v.currency) + " "}
//                       {v.fees || (v.fee ? String(v.fee).replace(/[^\d]/g, "") : "") || "—"}
//                     </span>
//                   </div>

//                   {/* Details row - responsive text size and wrapping */}
//                   <div className="
//                     flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5
//                     mt-3 sm:mt-3 md:mt-4 lg:mt-4
//                     text-slate-500 text-xs sm:text-sm md:text-sm lg:text-sm
//                   ">
//                     {v.processing_time && (
//                       <span className="flex-shrink-0">
//                         {t("home.results.processing")} {v.processing_time}
//                       </span>
//                     )}
//                     {v.processing && !v.processing_time && (
//                       <span className="flex-shrink-0">
//                         {t("home.results.processing")} {v.processing}
//                       </span>
//                     )}
//                     {v.validity && (
//                       <span className="flex-shrink-0">
//                         {t("home.results.validity")} {v.validity}
//                       </span>
//                     )}
//                     {v.stay && (
//                       <span className="flex-shrink-0">
//                         {t("home.results.stay")} {v.stay}
//                       </span>
//                     )}
//                     {v.type && !v.visaType && (
//                       <span className="flex-shrink-0">
//                         {t("home.results.type")} {v.type}
//                       </span>
//                     )}
//                     {v.visaType && (
//                       <span className="flex-shrink-0">
//                         {t("home.results.type")} {v.visaType}
//                       </span>
//                     )}
//                   </div>

//                   {/* Requirements section - responsive padding */}
//                   {Array.isArray(v.requirements) && v.requirements.length > 0 && (
//                     <div className="
//                       mt-3 sm:mt-3 md:mt-4 lg:mt-4
//                       text-slate-400 text-xs sm:text-sm md:text-sm lg:text-sm
//                       text-start
//                     ">
//                       <span className="font-medium">
//                         {t("home.results.requirements")}
//                       </span>
//                       {" "}
//                       <span className="text-slate-400">{v.requirements.join(", ")}</span>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


/* ─────────────────────────────────────────
   Home Page - Fully Responsive
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

      <main id="home-main" className="w-full overflow-x-hidden">

        {/* ── Video Background (fixed) ── */}
        <div
          className="
            fixed inset-0 w-full h-screen -z-10
            overflow-hidden pointer-events-none
          "
          style={{
            opacity: showBg ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.7, 0, 0.3, 1)",
            willChange: "opacity",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
          
          {/* Video element with proper sizing */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="
              absolute inset-0 w-full h-full
              object-cover
            "
          >
            <source
              src="https://hellovizavideo.s3.ap-south-1.amazonaws.com/helloviza.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* ── Hero Section - Fully Responsive ── */}
        <section
          id="hero"
          className="
            relative z-10 w-full
            min-h-screen md:min-h-[100svh]
            flex items-center justify-center
            overflow-hidden
          "
        >
          {/* Main container with responsive padding */}
          <div
            className="
              w-full h-full
              px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10
              py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24
              flex items-center justify-center
            "
          >
            {/* Content wrapper with max width */}
            <div
              className="
                w-full max-w-7xl
                grid grid-cols-1 md:grid-cols-2
                gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16
                items-center
                auto-rows-max md:auto-rows-max
              "
            >
              {/* ── LEFT: Text Section ── */}
              <div className="
                w-full
                flex flex-col items-center md:items-start
                justify-center
                text-center md:text-left
                text-white
                order-2 md:order-1
              ">
                {/* Hero Title - Responsive sizing */}
                <h1 className="
                  font-extrabold leading-tight
                  text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8
                  max-w-sm xs:max-w-md sm:max-w-lg md:max-w-none
                  mx-auto md:mx-0
                  drop-shadow-lg
                ">
                  <span className="block">{t("home.hero.titleLine1")}</span>
                  <span className="block">{t("home.hero.titleLine2")}</span>
                </h1>

                {/* Hero Subtitle - Responsive sizing */}
                <p className="
                  text-white/85 font-light
                  text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
                  leading-relaxed sm:leading-relaxed md:leading-relaxed
                  max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl
                  mx-auto md:mx-0
                  drop-shadow
                ">
                  {t("home.hero.subtitle")}
                </p>
              </div>

              {/* ── RIGHT: Tiles Section ── */}
              <div className="
                w-full
                flex justify-center md:justify-end
                order-1 md:order-2
                px-2 sm:px-4 md:px-0
              ">
                <div className="
                  w-full
                  max-w-xs sm:max-w-sm md:max-w-none
                  flex justify-center md:justify-end
                ">
                  <VisaTilesSection user={user} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Results Section (if needed) ── */}
        {/* <ResultsList items={results} /> */}

      </main>
    </>
  );
};

export default Home;