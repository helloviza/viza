// src/components/Header.jsx
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import logo from "../assets/helloviza-logo.png";
// import flightIcon from "../assets/flight-icon.png";
// import { getCookie } from "../utils/geo";
// import { normalizeLang, applyHtmlLangDir, pushDL } from "../utils/lang";

// /**
//  * IMPORTANT:
//  * 1) Put your new PNG here (example name). Update the filename to whatever you add in /src/assets/
//  *    Example: /src/assets/hello-plus.png
//  */
// import plumtripsCta from "../assets/hello-plus.png";

// /* =====================================
//    Small inline SVG icons (premium look)
// ===================================== */
// const IconWrap = ({ children }) => <span className="menuItem">{children}</span>;

// /** Luxurious world-mark:
//  *  - No outer circle/badge
//  *  - Balanced meridians/parallels
//  *  - Tiny “continent” strokes for character
//  *  - Rounded caps/joins for a refined feel
//  */
// const LuxWorldIcon = ({ size = 18, color = "currentColor", stroke = 2 }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={color}
//     strokeWidth={stroke}
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     aria-hidden="true"
//   >
//     {/* open-hemisphere silhouette */}
//     <path d="M4 12c1.8-4.7 6-8 8.9-8 4.7 0 9.1 4.4 9.1 9.1 0 4.5-3.4 8-7.4 8.9" />
//     {/* meridians */}
//     <path d="M12 4.2c-2.6 3.3-2.6 12.3 0 15.6" />
//     <path d="M12 4.2c2.6 3.3 2.6 12.3 0 15.6" />
//     {/* parallels */}
//     <path d="M5.2 9.4c2 .8 4.6 1.2 6.8 1.2s4.8-.4 6.8-1.2" />
//     <path d="M5.8 15.2c1.9-.7 4.3-1 6.2-1s4.3.3 6.2 1" />
//     {/* subtle continents touches */}
//     <path d="M8.6 8.6l1 .6 1-.4" />
//     <path d="M15.4 8.4l.8.6" />
//     <path d="M13.6 16.2l-1 .6" />
//   </svg>
// );

// const NAV_ICON = { width: 22, height: 22, flex: "0 0 auto", color: "currentColor" };

// const PassportIcon = () => (
//   <svg
//     style={NAV_ICON}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     aria-hidden="true"
//   >
//     <rect x="5" y="3" width="14" height="18" rx="2" />
//     <circle cx="12" cy="10" r="3" />
//     <path d="M8 15h8" />
//   </svg>
// );

// const HeadsetIcon = () => (
//   <svg
//     style={NAV_ICON}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     aria-hidden="true"
//   >
//     <path d="M4 12a8 8 0 0 1 16 0" />
//     <rect x="3" y="12" width="4" height="7" rx="2" />
//     <rect x="17" y="12" width="4" height="7" rx="2" />
//     <path d="M7 19a5 5 0 0 0 5 3 5 5 0 0 0 5-3" />
//   </svg>
// );

// const UserIcon = () => (
//   <svg
//     style={NAV_ICON}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.8"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     aria-hidden="true"
//   >
//     <circle cx="12" cy="8" r="4" />
//     <path d="M4 20c2-3 5-4 8-4s6 1 8 4" />
//   </svg>
// );

// /* =====================================
//    Typography (header)
// ===================================== */
// const BASE_FONT = "'Barlow Condensed', Arial, sans-serif";

// const NAV_ITEM = {
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "10px",
//   fontFamily: BASE_FONT,
//   fontWeight: 900,
//   fontSize: "14px",
//   lineHeight: "1.15",
//   letterSpacing: "0.02em",
//   color: "#d06549",
//   textDecoration: "none",
//   verticalAlign: "middle",
//   WebkitFontSmoothing: "antialiased",
//   MozOsxFontSmoothing: "grayscale",
//   background: "transparent",
//   border: "none",
//   cursor: "pointer",
// };

// const NAV_LABEL = {
//   display: "inline-block",
//   fontFamily: BASE_FONT,
//   fontWeight: 600,
//   fontSize: "15px",
//   lineHeight: "1.15",
//   letterSpacing: "0.02em",
// };

// /* ===== Helpers ===== */
// function getCachedUser() {
//   try {
//     const raw = localStorage.getItem("hv_user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }
// function pickDisplayName(u) {
//   if (!u) return "";
//   const p = u.profile || {};
//   const first = p.firstName || u.firstName || (typeof u.name === "string" && u.name.split(" ")[0]) || "";
//   if (first && first.trim()) return first.trim();
//   const email = u.email || p.email;
//   if (email && email.includes("@")) return email.split("@")[0];
//   return "";
// }

// const VISA_INTENT_KEY = "HV:VISA_INTENT_TS";
// const LOGIN_REDIRECT_KEY = "postLoginRedirect";

// /* ===== Modal: Language & Region (EN/AR only) ===== */
// const LANG_OPTIONS = [
//   { code: "en", label: "English", subtitle: "English" },
//   { code: "ar", label: "العربية", subtitle: "Arabic" },
// ];

// const REGION_OPTIONS = [
//   { code: "ZZ", name: "Unknown / Global" },
//   { code: "AE", name: "United Arab Emirates" },
//   { code: "SA", name: "Saudi Arabia" },
//   { code: "QA", name: "Qatar" },
//   { code: "KW", name: "Kuwait" },
//   { code: "BH", name: "Bahrain" },
//   { code: "OM", name: "Oman" },
//   { code: "US", name: "United States" },
//   { code: "GB", name: "United Kingdom" },
// ];

// export default function Header({ onFlightClick, user, onLogout }) {
//   const { i18n, t } = useTranslation();

//   const [visible, setVisible] = useState(true);
//   const [inHero, setInHero] = useState(true);
//   const [showMobileNav, setShowMobileNav] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [effectiveUser, setEffectiveUser] = useState(() => user || getCachedUser());
//   const [viewerCountry, setViewerCountry] = useState(() => (getCookie("viewerCountry") || "ZZ").toUpperCase());

//   // modal
//   const [showLangModal, setShowLangModal] = useState(false);
//   const [draftLang, setDraftLang] = useState(() => normalizeLang(i18n.language));
//   const [draftRegion, setDraftRegion] = useState(() => (getCookie("viewerCountry") || "ZZ").toUpperCase());

//   const location = useLocation();
//   const navigate = useNavigate();
//   const hoveringHeaderRef = useRef(false);

//   // user sync
//   useEffect(() => {
//     const sync = () => setEffectiveUser(user || getCachedUser());
//     sync();
//     const onStorage = (e) => {
//       if (!e || e.key === "hv_user") sync();
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, [user]);

//   // keep viewerCountry fresh if cookie changes
//   useEffect(() => {
//     const id = setInterval(() => {
//       const c = (getCookie("viewerCountry") || "ZZ").toUpperCase();
//       setViewerCountry((prev) => (prev !== c ? c : prev));
//     }, 4000);
//     return () => clearInterval(id);
//   }, []);

//   // show/hide on scroll
//   useEffect(() => {
//     const HERO_HEIGHT = window.innerHeight;
//     let timeout;
//     let lastScrollY = window.scrollY;

//     const handleUserActivity = () => {
//       const y = window.scrollY;
//       const delta = Math.abs(y - lastScrollY);
//       const scrollingDown = y > lastScrollY;
//       lastScrollY = y;

//       if (y < HERO_HEIGHT - 60) {
//         setInHero(true);
//         setVisible(true);
//         return;
//       }
//       setInHero(false);

//       if (dropdownOpen || showMobileNav || hoveringHeaderRef.current) {
//         setVisible(true);
//         return;
//       }
//       if (delta < 12) return;

//       if (scrollingDown) {
//         setVisible(false);
//         clearTimeout(timeout);
//         timeout = setTimeout(() => setVisible(true), 1800);
//       } else {
//         setVisible(true);
//       }
//     };

//     window.addEventListener("scroll", handleUserActivity, { passive: true });
//     window.addEventListener("mousemove", handleUserActivity);
//     handleUserActivity();

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("scroll", handleUserActivity);
//       window.removeEventListener("mousemove", handleUserActivity);
//     };
//   }, [dropdownOpen, showMobileNav]);

//   // ensure html lang/dir tracks i18n
//   useEffect(() => applyHtmlLangDir(i18n.language), [i18n.language]);

//   const linkColor = inHero ? "#d06549" : "#000000";

//   /* ===== Nav handlers ===== */
//   const handleVisaServicesClick = useCallback(() => {
//     setShowMobileNav(false);
//     if (location.pathname !== "/") {
//       navigate("/");
//       setTimeout(() => {
//         const section = document.getElementById("visa-services");
//         if (section) section.scrollIntoView({ behavior: "smooth" });
//       }, 400);
//     } else {
//       const section = document.getElementById("visa-services");
//       if (section) section.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [location.pathname, navigate]);

//   const handleGoForVisaClick = useCallback(() => {
//     setShowMobileNav(false);
//     if (effectiveUser) {
//       window.location.href = "https://visa.helloviza.com";
//       return;
//     }
//     try {
//       sessionStorage.setItem(VISA_INTENT_KEY, String(Date.now()));
//     } catch {}
//     navigate("/login?next=/go/visa");
//   }, [navigate, effectiveUser]);

//   const handlePlumtripsClick = useCallback(() => {
//     setShowMobileNav(false);
//     window.location.href = "https://www.plumtrips.com";

//   }, []);

//   const handleLogoutClick = useCallback(() => {
//     setDropdownOpen(false);
//     setShowMobileNav(false);
//     try {
//       sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
//       localStorage.removeItem(LOGIN_REDIRECT_KEY);
//       sessionStorage.removeItem(VISA_INTENT_KEY);
//       localStorage.removeItem(VISA_INTENT_KEY);
//       sessionStorage.removeItem("hv_user");
//       localStorage.removeItem("hv_user");
//       localStorage.removeItem("helloviza_user");
//       localStorage.removeItem("hv_token");
//     } catch {}
//     onLogout?.();
//     navigate("/");
//   }, [navigate, onLogout]);

//   /* ===== Language modal actions ===== */
//   const openLangModal = () => {
//     setDraftLang(normalizeLang(i18n.language));
//     setDraftRegion((getCookie("viewerCountry") || "ZZ").toUpperCase());
//     setShowLangModal(true);
//   };

//   const applyLangModal = async () => {
//     const prev = normalizeLang(i18n.language);
//     if (draftLang !== prev) {
//       await i18n.changeLanguage(draftLang);
//       applyHtmlLangDir(draftLang);
//       try {
//         localStorage.setItem("i18nextLng", draftLang);
//       } catch {}
//       pushDL("language_manual_set", {
//         language_code: draftLang,
//         previous_language: prev,
//         viewer_country: draftRegion,
//       });
//     }
//     setShowLangModal(false);
//   };

//   const glassStyle = inHero
//     ? {
//         background: "rgba(255,255,255,0)",  //Main  Scroll at Above Section
//         borderColor: "rgba(255,255,255,.35)",
//         boxShadow: "0 18px 38px rgba(0,0,0,.18)",
//       }
//     : {
//         background: "rgba(255,255,255,.80)",  //Inner Scroolll
//         borderColor: "rgba(255,255,255,.66)",
//         boxShadow: "0 22px 44px rgba(0,0,0,.18)",
//       };

//   return (
//     <>
//       {/* Center flight icon */}
//       <div style={styles.flightIconWrapper}>
//         <img src={flightIcon} alt="Flight Icon" style={styles.flightIcon} onClick={onFlightClick} />
//       </div>

//       <header
//         onMouseEnter={() => (hoveringHeaderRef.current = true)}
//         onMouseLeave={() => (hoveringHeaderRef.current = false)}
//         style={{
//           ...styles.header,
//           opacity: visible ? 1 : 0,
//           transform: visible ? "translateY(0)" : "translateY(-40px)",
//           transition: "opacity 0.4s, transform 0.4s",
//         }}
//       >
//         <div className="glassWrap">
//           <div className="glassPill" style={glassStyle}>
//             <Link to="/" style={styles.logoLink} aria-label="Home">
//               <img src={logo} alt="helloviza logo" style={styles.logo} />
//             </Link>

//             {/* Desktop Navigation */}
//             <nav className="desktop-nav" style={styles.nav}>
//               <button
//                 style={{ ...NAV_ITEM, color: linkColor }}
//                 onClick={handleVisaServicesClick}
//                 aria-label={t("nav.visaServices")}
//               >
//                 <IconWrap>
//                   <LuxWorldIcon size={20} color="currentColor" stroke={2} />
//                 </IconWrap>
//                 <span style={NAV_LABEL}>{t("nav.visaServices")}</span>
//               </button>

//               <button
//                 style={{ ...NAV_ITEM, color: linkColor }}
//                 onClick={handleGoForVisaClick}
//                 aria-label={t("nav.goForVisa")}
//               >
//                 <IconWrap>
//                   <PassportIcon />
//                 </IconWrap>
//                 <span style={NAV_LABEL}>{t("nav.goForVisa")}</span> 
//               </button>

//               <Link to="/contact" style={{ ...NAV_ITEM, color: linkColor }} aria-label={t("nav.supportContact")}>
//                 <IconWrap>
//                   <HeadsetIcon />
//                 </IconWrap>
//                 <span style={NAV_LABEL}>{t("nav.supportContact")}</span>
//               </Link>

//               {/* Language/Region trigger — icon only (no circle/bg/border) */}
//               <button
//                 type="button" 
//                 onClick={openLangModal}
//                 aria-label={t("nav.languageRegion")}
//                 style={styles.globeLinkBtn}
//                 title={t("nav.languageRegion")}
//               >
//                 <LuxWorldIcon size={18} color="#1b5b84" stroke={2} />
//               </button>

//               {/* User Menu */}
//               {effectiveUser ? (
//                 <div
//                   style={{ position: "relative", display: "inline-block" }}
//                   onMouseEnter={() => setDropdownOpen(true)}
//                   onMouseLeave={() => setDropdownOpen(false)}
//                 >
//                   {(() => {
//                     const displayName = pickDisplayName(effectiveUser);
//                     const initial = (displayName?.[0] || "U").toUpperCase();
//                     return (
//                       <div style={{ ...NAV_ITEM, color: linkColor }}>
//                         <div
//                           style={{
//                             backgroundColor: "#d06549",
//                             color: "#fff",
//                             borderRadius: "50%",
//                             width: 30,
//                             height: 30,
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             fontWeight: 900,
//                             fontSize: 15,
//                           }}
//                         >
//                           {initial}
//                         </div>
//                         <span style={NAV_LABEL}>{displayName || t("nav.user")} ▼</span>
//                       </div>
//                     );
//                   })()}

//                   {dropdownOpen && (
//                     <div style={styles.dropdownMenu}>
//                       <Link to="/account/profile" style={styles.dropdownItem}>
//                         {t("nav.myProfile")}
//                       </Link>
//                       <Link to="/account/visa-history" style={styles.dropdownItem}>
//                         {t("nav.myVisaHistory")}
//                       </Link>
//                       <Link to="/account/wallet" style={styles.dropdownItem}>
//                         {t("nav.myWallet")}
//                       </Link>
//                       <Link to="/account/documents" style={styles.dropdownItem}>
//                         {t("nav.myDocuments")}
//                       </Link>
//                       <Link to="/account/wishlist" style={styles.dropdownItem}>
//                         {t("nav.myFutureWishlist")}
//                       </Link>
//                       <hr style={{ margin: 0, borderColor: "rgba(0,0,0,0.1)" }} />
//                       <button onClick={handleLogoutClick} style={styles.dropdownLogout}>
//                         {t("nav.logout")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link to="/login" style={{ ...NAV_ITEM, color: linkColor }} aria-label={t("nav.login")}>
//                   <IconWrap>
//                     <UserIcon />
//                   </IconWrap>
//                   <span style={NAV_LABEL}>{t("nav.login")}</span>
//                 </Link>
//               )}

//               {/* NEW: PlumTrips CTA logo button at end (replaces Book Flight) */}
//               <button
//                 type="button"
//                 onClick={handlePlumtripsClick}
//                 className="helloPlusBtn"
//                 style={styles.plumBtn}
//                 aria-label="Open PlumTrips"
//                 title="Open PlumTrips"
//               >
//                 <img
//                   src={plumtripsCta}
//                   alt="PlumTrips"
//                   className="helloPlusImg"
//                   style={styles.plumBtnImg}
//                 />
//               </button>
//             </nav>

//             {/* Mobile Menu Icon */}
//             <div
//               className="mobile-menu-icon"
//               style={{ display: "none" }}
//               onClick={() => setShowMobileNav(true)}
//               aria-label="Open menu"
//             >
//               <svg width="32" height="32" fill={linkColor} aria-hidden="true">
//                 <rect y="6" width="32" height="4" rx="2" />
//                 <rect y="14" width="32" height="4" rx="2" />
//                 <rect y="22" width="32" height="4" rx="2" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Drawer */}
//       {showMobileNav && (
//         <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
//           <div className="mobile-nav" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={() => setShowMobileNav(false)} aria-label="Close menu">
//               ×
//             </button>

//             <button onClick={handleVisaServicesClick} className="mobile-link-btn">
//               <IconWrap>
//                 <LuxWorldIcon size={20} />
//               </IconWrap>{" "}
//               {t("nav.visaServices")}
//             </button>
//             <button onClick={handleGoForVisaClick} className="mobile-link-btn">
//               <IconWrap>
//                 <PassportIcon />
//               </IconWrap>{" "}
//               {t("nav.goForVisa")}
//             </button>
//             <Link to="/contact" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">
//               <IconWrap>
//                 <HeadsetIcon />
//               </IconWrap>{" "}
//               {t("nav.supportContact")}
//             </Link>

//             {/* Mobile entry to open modal */}
//             <button className="mobile-link-btn" onClick={openLangModal}>
//               <IconWrap>
//                 <LuxWorldIcon size={18} />
//               </IconWrap>{" "}
//               {t("nav.languageRegion")}
//             </button>

//             {/* Mobile: PlumTrips CTA */}
//             <button className="mobile-plum-btn" onClick={handlePlumtripsClick} aria-label="Open PlumTrips">
//               <img src={plumtripsCta} alt="PlumTrips" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Language & Region Modal (EN/AR only) */}
//       {showLangModal && (
//         <div
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="langRegionTitle"
//           className="lr-overlay"
//           onClick={() => setShowLangModal(false)}
//         >
//           <div className="lr-dialog" onClick={(e) => e.stopPropagation()}>
//             <div className="lr-header">
//               <h3 id="langRegionTitle">Language and region</h3>
//               <button className="lr-close" aria-label="Close" onClick={() => setShowLangModal(false)}>
//                 ×
//               </button>
//             </div>

//             {/* Suggested */}
//             <div className="lr-section">
//               <div className="lr-label">Suggested languages</div>
//               <div className="lr-suggest-grid">
//                 {LANG_OPTIONS.map((opt) => (
//                   <button
//                     key={opt.code}
//                     className={`lr-chip ${draftLang === opt.code ? "active" : ""}`}
//                     onClick={() => setDraftLang(opt.code)}
//                   >
//                     <div className="lr-chip-main">{opt.label}</div>
//                     <div className="lr-chip-sub">{opt.subtitle}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Choose */}
//             <div className="lr-section">
//               <div className="lr-label">Choose a language and region</div>

//               <div className="lr-form">
//                 <div className="lr-field">
//                   <div className="lr-field-label">Language</div>
//                   <select className="lr-select" value={draftLang} onChange={(e) => setDraftLang(e.target.value)}>
//                     {LANG_OPTIONS.map((o) => (
//                       <option key={o.code} value={o.code}>
//                         {o.label} ({o.subtitle})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="lr-field">
//                   <div className="lr-field-label">Country</div>
//                   <select
//                     className="lr-select"
//                     value={draftRegion}
//                     onChange={(e) => setDraftRegion(e.target.value.toUpperCase())}
//                   >
//                     {REGION_OPTIONS.map((r) => (
//                       <option key={r.code} value={r.code}>
//                         {r.code} — {r.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="lr-footer">
//               <button className="lr-btn ghost" onClick={() => setShowLangModal(false)}>
//                 Cancel
//               </button>
//               <button className="lr-btn primary" onClick={applyLangModal}>
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .menuItem{display:inline-flex;align-items:center;gap:8px;}
//         .glassWrap{width:100%;display:flex;justify-content:center;pointer-events:none;}
//         .glassPill{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;
//           width:min(1180px,92vw);padding:10px 18px;border-radius:999px;
//           border:1px solid rgba(255,255,255,.35);
//           backdrop-filter:blur(10px) saturate(1.15);
//           -webkit-backdrop-filter:blur(10px) saturate(1.15);
//         }

//         /* ===== hello+ CTA animation (premium + subtle) ===== */
//         .helloPlusBtn{
//           position: relative;
//           isolation: isolate;
//           border-radius: 999px;
//         }
//         .helloPlusImg{
//           animation: hvBreathe 3.6s ease-in-out infinite;
//           transform-origin: center;
//           will-change: transform, opacity, filter;
//           filter: drop-shadow(0 10px 18px rgba(0,0,0,0.12));
//           position: relative;
//           z-index: 1;
//         }
//         .helloPlusBtn::after{
//           content:"";
//           position:absolute;
//           inset: 2px;
//           border-radius: 999px;
//           background: linear-gradient(
//             120deg,
//             rgba(255,255,255,0) 0%,
//             rgba(255,255,255,0.22) 35%,
//             rgba(255,255,255,0) 70%
//           );
//           transform: translateX(-120%);
//           opacity: .0;
//           pointer-events:none;
//           animation: hvShine 5.8s ease-in-out infinite;
//           z-index: 0;
//         }
//         @keyframes hvBreathe{
//           0%, 100% { opacity: 0.92; transform: translateY(0) scale(1); }
//           50%      { opacity: 1;    transform: translateY(-1px) scale(1.012); }
//         }
//         @keyframes hvShine{
//           0%   { opacity: 0; transform: translateX(-120%); }
//           45%  { opacity: 0; transform: translateX(-120%); }
//           60%  { opacity: 0.18; transform: translateX(120%); }
//           100% { opacity: 0; transform: translateX(120%); }
//         }
//         .helloPlusBtn:hover .helloPlusImg{
//           transform: translateY(-1px) scale(1.02);
//           filter: drop-shadow(0 14px 26px rgba(0,0,0,0.16));
//         }
//         @media (prefers-reduced-motion: reduce){
//           .helloPlusImg, .helloPlusBtn::after{ animation: none !important; }
//         }

//         @media(max-width:920px){
//           .desktop-nav{display:none!important;}
//           .mobile-menu-icon{display:block!important;cursor:pointer;position:absolute;top:18px;right:16px;z-index:1201;}
//         }
//         @media(min-width:921px){
//           .desktop-nav{display:flex!important;}
//           .mobile-menu-icon{display:none!important;}
//         }

//         .mobile-nav-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.28);
//           z-index:1200;display:flex;justify-content:flex-end;}
//         .mobile-nav{background:#fff;width:77vw;max-width:320px;height:100%;
//           padding:32px 18px 22px 26px;box-shadow:-2px 0 18px #0001;
//           display:flex;flex-direction:column;gap:20px;position:relative;animation:slideInRight .3s;}
//         .close-btn{position:absolute;top:10px;right:14px;background:none;border:none;
//           font-size:2.2rem;cursor:pointer;color:#d06549;}
//         .mobile-link-btn,.mobile-nav a,.logout-btn{
//           color:#00477f;font-size:1.13rem;font-weight:700;text-decoration:none;
//           background:none;border:none;text-align:left;cursor:pointer;padding:.7rem 0;
//           font-family:${BASE_FONT};
//         }

//         .mobile-plum-btn{
//           margin-top:10px;
//           background: transparent;
//           border: none;
//           padding: 0;
//           cursor: pointer;
//           align-self: flex-start;
//         }
//         .mobile-plum-btn img{
//           height: 44px;
//           width: auto;
//           display:block;
//           filter: drop-shadow(0 8px 16px rgba(0,0,0,0.12));
//         }

//         .logout-btn{color:#d06549;}
//         @keyframes slideInRight{from{transform:translateX(80%);}to{transform:translateX(0);}}
//       `}</style>

//       {/* Modal styles */}
//       <style>{`
//         .lr-overlay{
//           position:fixed;inset:0;background:rgba(0,0,0,.35);
//           display:flex;align-items:center;justify-content:center;z-index:1400;
//         }
//         .lr-dialog{
//           width:min(880px,94vw); background:#fff; border-radius:16px;
//           box-shadow:0 24px 60px rgba(0,0,0,.25); padding:18px 20px 14px;
//           font-family: ${BASE_FONT};
//         }
//         .lr-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
//         .lr-header h3{margin:0;color:#1b5b84;font-weight:700;letter-spacing:.02em}
//         .lr-close{background:none;border:none;font-size:28px;cursor:pointer;color:#4b4b4b;line-height:1}
//         .lr-section{margin-top:16px}
//         .lr-label{color:#1b5b84;font-weight:600;font-size:16px;margin:6px 0 10px}
//         .lr-suggest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;}
//         .lr-chip{
//           background:#fff;border:1px solid #d06549;color:#1b5b84;border-radius:12px;
//           padding:10px 12px;text-align:left;cursor:pointer;
//           transition:box-shadow .15s ease, background .15s ease;
//           font-weight:400;
//         }
//         .lr-chip.active{background:#f7fbff; box-shadow:0 8px 18px rgba(0,0,0,.06);}
//         .lr-chip-main{font-size:16px;line-height:1.2}
//         .lr-chip-sub{font-size:12px;opacity:.8;margin-top:2px}
//         .lr-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px}
//         @media(max-width:640px){ .lr-form{grid-template-columns:1fr;} }
//         .lr-field-label{color:#1b5b84;font-weight:400;margin-bottom:6px}
//         .lr-select{
//           width:100%;font-size:15px;border:1px solid #d06549;border-radius:12px;
//           padding:10px 12px;color:#1b5b84;font-weight:400;background:#fff;
//           appearance:none;
//         }
//         .lr-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
//         .lr-btn{border-radius:10px;padding:10px 16px;font-size:15px;cursor:pointer;border:1px solid transparent;font-weight:600}
//         .lr-btn.primary{background:#00477f;color:#fff;border-color:#00477f}
//         .lr-btn.ghost{background:#fff;color:#00477f;border-color:#00477f}
//       `}</style>
//     </>
//   );
// }

// /* ===== JS Styles ===== */
// const styles = {
//   flightIconWrapper: {
//     position: "fixed",
//     top: 0,
//     left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 1001,
//     background: "#00477f",
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//     padding: "0.36rem 0.8rem",
//   },
//   flightIcon: { height: 22, width: 22, cursor: "pointer" },
//   header: {
//     position: "fixed",
//     top: ".2rem",
//     left: 0,
//     right: 0,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     color: "#000",
//     zIndex: 1000,
//     width: "100%",
//   },
//   logoLink: { display: "flex", alignItems: "center", textDecoration: "none", marginRight: "1rem" },
//   logo: { height: 56, objectFit: "contain" },
//   nav: { display: "flex", gap: "1.1rem", alignItems: "center" },

//   // icon-only button for language/region (no circle, no border)
//   globeLinkBtn: {
//     background: "transparent",
//     border: "none",
//     padding: 0,
//     margin: 0,
//     lineHeight: 1,
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     color: "#1b5b84",
//   },

//   // NEW: hello+ pill button wrapper
//   plumBtn: {
//     background: "transparent",
//     border: "none",
//     padding: 0,
//     marginLeft: "4px",
//     cursor: "pointer",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   plumBtnImg: {
//     height: 44,
//     width: "auto",
//     display: "block",
//     borderRadius: 999,
//   },

//   dropdownMenu: {
//     position: "absolute",
//     top: "100%",
//     right: 0,
//     background: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     boxShadow: "0 10px 20px rgba(0,0,0,.12)",
//     display: "flex",
//     flexDirection: "column",
//     minWidth: 220,
//     zIndex: 1001,
//   },
//   dropdownItem: { padding: "8px 12px", textDecoration: "none", color: "#00477f", fontWeight: 700, fontFamily: BASE_FONT },
//   dropdownLogout: {
//     padding: "8px 12px",
//     background: "transparent",
//     border: "none",
//     color: "#d06549",
//     textAlign: "left",
//     fontWeight: 800,
//     cursor: "pointer",
//     fontFamily: BASE_FONT,
//   },
// };


// src/components/Header.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCookie } from "../utils/geo";
import { normalizeLang, applyHtmlLangDir, pushDL } from "../utils/lang";

const ACCENT   = "#d06549";   // orange — used for ALL icons
const BASE_FONT = "'Barlow Condensed', Arial, sans-serif";

/* ── Icons ── */
const LuxWorldIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12c1.8-4.7 6-8 8.9-8 4.7 0 9.1 4.4 9.1 9.1 0 4.5-3.4 8-7.4 8.9" />
    <path d="M12 4.2c-2.6 3.3-2.6 12.3 0 15.6" />
    <path d="M12 4.2c2.6 3.3 2.6 12.3 0 15.6" />
    <path d="M5.2 9.4c2 .8 4.6 1.2 6.8 1.2s4.8-.4 6.8-1.2" />
    <path d="M5.8 15.2c1.9-.7 4.3-1 6.2-1s4.3.3 6.2 1" />
  </svg>
);

const HeadsetIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12a8 8 0 0 1 16 0" />
    <rect x="3" y="12" width="4" height="7" rx="2" />
    <rect x="17" y="12" width="4" height="7" rx="2" />
    <path d="M7 19a5 5 0 0 0 5 3 5 5 0 0 0 5-3" />
  </svg>
);

const UserIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c2-3 5-4 8-4s6 1 8 4" />
  </svg>
);

/* ── Helpers ── */
function getCachedUser() {
  try {
    const raw = localStorage.getItem("hv_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function pickDisplayName(u) {
  if (!u) return "";
  const p = u.profile || {};
  const first = p.firstName || u.firstName || (typeof u.name === "string" && u.name.split(" ")[0]) || "";
  if (first && first.trim()) return first.trim();
  const email = u.email || p.email;
  if (email && email.includes("@")) return email.split("@")[0];
  return "";
}

const VISA_INTENT_KEY    = "HV:VISA_INTENT_TS";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";

const LANG_OPTIONS = [
  { code: "en", label: "English",  subtitle: "English" },
  { code: "ar", label: "العربية", subtitle: "Arabic"  },
];

const REGION_OPTIONS = [
  { code: "ZZ", name: "Unknown / Global"        },
  { code: "AE", name: "United Arab Emirates"    },
  { code: "SA", name: "Saudi Arabia"            },
  { code: "QA", name: "Qatar"                   },
  { code: "KW", name: "Kuwait"                  },
  { code: "BH", name: "Bahrain"                 },
  { code: "OM", name: "Oman"                    },
  { code: "US", name: "United States"           },
  { code: "GB", name: "United Kingdom"          },
];

/* ════════════════════════════════════════════ */
export default function Header({ onFlightClick, user, onLogout }) {
  const { i18n, t } = useTranslation();

  const [visible,       setVisible      ] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [dropdownOpen,  setDropdownOpen ] = useState(false);
  const [effectiveUser, setEffectiveUser] = useState(() => user || getCachedUser());

  const [showLangModal, setShowLangModal] = useState(false);
  const [draftLang,     setDraftLang    ] = useState(() => normalizeLang(i18n.language));
  const [draftRegion,   setDraftRegion  ] = useState(() => (getCookie("viewerCountry") || "ZZ").toUpperCase());

  const navigate          = useNavigate();
  const hoveringHeaderRef = useRef(false);

  /* user sync */
  useEffect(() => {
    const sync = () => setEffectiveUser(user || getCachedUser());
    sync();
    const onStorage = (e) => { if (!e || e.key === "hv_user") sync(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  /* hide on scroll-down, show on scroll-up */
  useEffect(() => {
    let lastY = window.scrollY;
    let timeout;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY);
      const down  = y > lastY;
      lastY = y;

      if (dropdownOpen || showMobileNav || hoveringHeaderRef.current) {
        setVisible(true); return;
      }
      if (delta < 12) return;

      if (down) {
        setVisible(false);
        clearTimeout(timeout);
        timeout = setTimeout(() => setVisible(true), 1800);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timeout); window.removeEventListener("scroll", onScroll); };
  }, [dropdownOpen, showMobileNav]);

  useEffect(() => applyHtmlLangDir(i18n.language), [i18n.language]);

  /* ── handlers ── */
  const handleLogoutClick = useCallback(() => {
    setDropdownOpen(false);
    setShowMobileNav(false);
    try {
      [LOGIN_REDIRECT_KEY, VISA_INTENT_KEY, "hv_user", "helloviza_user", "hv_token"]
        .forEach(k => { sessionStorage.removeItem(k); localStorage.removeItem(k); });
    } catch {}
    onLogout?.();
    navigate("/");
  }, [navigate, onLogout]);

  const openLangModal = () => {
    setDraftLang(normalizeLang(i18n.language));
    setDraftRegion((getCookie("viewerCountry") || "ZZ").toUpperCase());
    setShowLangModal(true);
  };

  const applyLangModal = async () => {
    const prev = normalizeLang(i18n.language);
    if (draftLang !== prev) {
      await i18n.changeLanguage(draftLang);
      applyHtmlLangDir(draftLang);
      try { localStorage.setItem("i18nextLng", draftLang); } catch {}
      pushDL("language_manual_set", { language_code: draftLang, previous_language: prev, viewer_country: draftRegion });
    }
    setShowLangModal(false);
  };

  /* ── Hamburger lines color: always orange ── */
  const burgerColor = ACCENT;

  return (
    <>
      {/* ════ HEADER ════ */}
      <header
        onMouseEnter={() => (hoveringHeaderRef.current = true)}
        onMouseLeave={() => (hoveringHeaderRef.current = false)}
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          right:           0,
          zIndex:          1000,
          display:         "flex",
          justifyContent:  "center",
          alignItems:      "center",
          width:           "100%",
          /* ↓ always fully transparent — no background at all */
          background:      "transparent",
          border:          "none",
          boxShadow:       "none",
          backdropFilter:  "none",
          WebkitBackdropFilter: "none",
          opacity:         visible ? 1 : 0,
          transform:       visible ? "translateY(0)" : "translateY(-40px)",
          transition:      "opacity 0.4s, transform 0.4s",
        }}
      >
        <div style={{
          width:       "100%",
          display:     "flex",
          alignItems:  "center",
          padding:     "10px 24px",
          boxSizing:   "border-box",
        }}>

          {/* Spacer pushes nav to the right — no logo */}
          <div style={{ flex: 1 }} />

          {/* ── Desktop Nav (3 icon buttons only) ── */}
          <nav className="hv-desktop-nav" style={{ display: "flex", gap: "6px", alignItems: "center" }}>

            {/* Language */}
            <button type="button" className="hv-icon-btn" onClick={openLangModal}
              aria-label={t("nav.languageRegion")} title={t("nav.languageRegion")}>
              <LuxWorldIcon size={22} />
            </button>

            {/* Contact */}
            <Link to="/contact" className="hv-icon-btn"
              aria-label={t("nav.supportContact")} title={t("nav.supportContact")}>
              <HeadsetIcon size={22} />
            </Link>

            {/* User / Login */}
            {effectiveUser ? (
              <div style={{ position: "relative", display: "inline-block" }}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}>
                <button className="hv-icon-btn hv-avatar-btn"
                  aria-label={t("nav.user")} title={pickDisplayName(effectiveUser) || t("nav.user")}>
                  <span className="hv-avatar">
                    {(pickDisplayName(effectiveUser)?.[0] || "U").toUpperCase()}
                  </span>
                </button>

                {dropdownOpen && (
                  <div style={styles.dropdownMenu}>
                    <Link to="/account/profile"      style={styles.dropdownItem}>{t("nav.myProfile")}</Link>
                    <Link to="/account/visa-history" style={styles.dropdownItem}>{t("nav.myVisaHistory")}</Link>
                    <Link to="/account/wallet"       style={styles.dropdownItem}>{t("nav.myWallet")}</Link>
                    <Link to="/account/documents"    style={styles.dropdownItem}>{t("nav.myDocuments")}</Link>
                    <Link to="/account/wishlist"     style={styles.dropdownItem}>{t("nav.myFutureWishlist")}</Link>
                    <hr style={{ margin: 0, borderColor: "rgba(0,0,0,0.1)" }} />
                    <button onClick={handleLogoutClick} style={styles.dropdownLogout}>{t("nav.logout")}</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hv-icon-btn"
                aria-label={t("nav.login")} title={t("nav.login")}>
                <UserIcon size={22} />
              </Link>
            )}
          </nav>

          {/* ── Mobile: hamburger only ── */}
          <div className="hv-mobile-right" style={{ display: "none", alignItems: "center", gap: "8px" }}>
            <div
              role="button" tabIndex={0}
              aria-label="Open menu"
              onClick={() => setShowMobileNav(true)}
              onKeyDown={(e) => e.key === "Enter" && setShowMobileNav(true)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect x="2" y="5"    width="24" height="3" rx="1.5" fill={burgerColor} />
                <rect x="2" y="12.5" width="24" height="3" rx="1.5" fill={burgerColor} />
                <rect x="2" y="20"   width="24" height="3" rx="1.5" fill={burgerColor} />
              </svg>
            </div>
          </div>

        </div>
      </header>

      {/* ════ Mobile Drawer ════ */}
      {showMobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
          <div className="mobile-nav" onClick={(e) => e.stopPropagation()}>

            <div style={styles.drawerHeader}>
              <span style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.2rem", color: "#00477f" }}>
                Menu
              </span>
              <button className="close-btn" onClick={() => setShowMobileNav(false)} aria-label="Close menu">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M2 2l18 18M20 2L2 20" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div style={styles.drawerDivider} />

            <button className="mobile-link-btn" onClick={openLangModal}>
              <LuxWorldIcon size={19} />
              <span>{t("nav.languageRegion")}</span>
            </button>

            <Link to="/contact" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">
              <HeadsetIcon size={19} />
              <span>{t("nav.supportContact")}</span>
            </Link>

            {effectiveUser ? (
              <>
                <div style={styles.drawerDivider} />
                <Link to="/account/profile"      onClick={() => setShowMobileNav(false)} className="mobile-link-btn"><UserIcon size={19} /><span>{t("nav.myProfile")}</span></Link>
                <Link to="/account/visa-history" onClick={() => setShowMobileNav(false)} className="mobile-link-btn"><span style={{ width: 19 }} /><span>{t("nav.myVisaHistory")}</span></Link>
                <Link to="/account/wallet"       onClick={() => setShowMobileNav(false)} className="mobile-link-btn"><span style={{ width: 19 }} /><span>{t("nav.myWallet")}</span></Link>
                <Link to="/account/documents"    onClick={() => setShowMobileNav(false)} className="mobile-link-btn"><span style={{ width: 19 }} /><span>{t("nav.myDocuments")}</span></Link>
                <Link to="/account/wishlist"     onClick={() => setShowMobileNav(false)} className="mobile-link-btn"><span style={{ width: 19 }} /><span>{t("nav.myFutureWishlist")}</span></Link>
                <div style={styles.drawerDivider} />
                <button className="mobile-link-btn logout-btn" onClick={handleLogoutClick}>
                  <span>{t("nav.logout")}</span>
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">
                <UserIcon size={19} />
                <span>{t("nav.login")}</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ════ Language Modal ════ */}
      {showLangModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="langRegionTitle"
          className="lr-overlay" onClick={() => setShowLangModal(false)}>
          <div className="lr-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="lr-header">
              <h3 id="langRegionTitle">Language and region</h3>
              <button className="lr-close" aria-label="Close" onClick={() => setShowLangModal(false)}>×</button>
            </div>

            <div className="lr-section">
              <div className="lr-label">Suggested languages</div>
              <div className="lr-suggest-grid">
                {LANG_OPTIONS.map((opt) => (
                  <button key={opt.code}
                    className={`lr-chip ${draftLang === opt.code ? "active" : ""}`}
                    onClick={() => setDraftLang(opt.code)}>
                    <div className="lr-chip-main">{opt.label}</div>
                    <div className="lr-chip-sub">{opt.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lr-section">
              <div className="lr-label">Choose a language and region</div>
              <div className="lr-form">
                <div className="lr-field">
                  <div className="lr-field-label">Language</div>
                  <select className="lr-select" value={draftLang} onChange={(e) => setDraftLang(e.target.value)}>
                    {LANG_OPTIONS.map((o) => <option key={o.code} value={o.code}>{o.label} ({o.subtitle})</option>)}
                  </select>
                </div>
                <div className="lr-field">
                  <div className="lr-field-label">Country</div>
                  <select className="lr-select" value={draftRegion} onChange={(e) => setDraftRegion(e.target.value.toUpperCase())}>
                    {REGION_OPTIONS.map((r) => <option key={r.code} value={r.code}>{r.code} — {r.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="lr-footer">
              <button className="lr-btn ghost"   onClick={() => setShowLangModal(false)}>Cancel</button>
              <button className="lr-btn primary"  onClick={applyLangModal}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ Global Styles ════ */}
      <style>{`
        /* Icon buttons — transparent bg, orange stroke icons */
        .hv-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(208,101,73,0.35);
          background: rgba(208,101,73,0.08);
          cursor: pointer;
          color: ${ACCENT};
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          text-decoration: none;
          padding: 0;
          flex-shrink: 0;
        }
        .hv-icon-btn:hover {
          background: rgba(208,101,73,0.18);
          border-color: rgba(208,101,73,0.55);
          transform: translateY(-1px);
        }

        /* Avatar */
        .hv-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${ACCENT};
          color: #fff;
          font-weight: 900;
          font-size: 14px;
          font-family: ${BASE_FONT};
        }
        .hv-avatar-btn {
          width: auto !important;
          padding: 4px !important;
          background: transparent !important;
          border: none !important;
        }

        /* Desktop / Mobile breakpoints */
        @media (min-width: 921px) {
          .hv-desktop-nav  { display: flex !important; }
          .hv-mobile-right { display: none !important; }
        }
        @media (max-width: 920px) {
          .hv-desktop-nav  { display: none !important; }
          .hv-mobile-right { display: flex !important; }
        }

        /* Mobile Drawer */
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.38);
          z-index: 1200;
          display: flex;
          justify-content: flex-end;
          overscroll-behavior: contain;
        }
        .mobile-nav {
          background: #fff;
          width: min(82vw, 340px);
          height: 100dvh;
          padding: 0 0 env(safe-area-inset-bottom, 16px);
          box-shadow: -4px 0 28px rgba(0,0,0,0.14);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          animation: slideInRight .28s cubic-bezier(0.22,1,0.36,1);
        }
        .close-btn {
          background: none; border: none; cursor: pointer;
          padding: 4px; display: flex; align-items: center;
          border-radius: 8px; transition: background 0.15s;
        }
        .close-btn:hover { background: rgba(208,101,73,0.08); }

        .mobile-link-btn,
        .mobile-nav a.mobile-link-btn,
        .logout-btn {
          color: #00477f;
          font-size: 1.05rem;
          font-weight: 700;
          text-decoration: none;
          background: none; border: none; text-align: left;
          cursor: pointer;
          padding: 14px 24px;
          font-family: ${BASE_FONT};
          display: flex; align-items: center; gap: 12px;
          transition: background 0.15s;
          width: 100%; box-sizing: border-box;
          min-height: 52px;
        }
        .mobile-link-btn:hover,
        .mobile-nav a.mobile-link-btn:hover { background: rgba(0,71,127,0.05); }
        .logout-btn { color: ${ACCENT} !important; }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1;   }
        }

        /* Language Modal */
        .lr-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.38);
          display: flex; align-items: center; justify-content: center;
          z-index: 1400; padding: 16px; box-sizing: border-box;
        }
        .lr-dialog {
          width: min(880px, 100%);
          background: #fff; border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,.22);
          padding: 18px 20px 14px;
          font-family: ${BASE_FONT};
          max-height: calc(100dvh - 32px);
          overflow-y: auto;
        }
        .lr-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .lr-header h3 { margin: 0; color: #1b5b84; font-weight: 700; letter-spacing: .02em; }
        .lr-close { background: none; border: none; font-size: 28px; cursor: pointer; color: #4b4b4b; line-height: 1; padding: 0 4px; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .lr-section { margin-top: 16px; }
        .lr-label { color: #1b5b84; font-weight: 600; font-size: 16px; margin: 6px 0 10px; }
        .lr-suggest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
        .lr-chip { background: #fff; border: 1px solid ${ACCENT}; color: #1b5b84; border-radius: 12px; padding: 10px 12px; text-align: left; cursor: pointer; transition: box-shadow .15s, background .15s; min-height: 48px; }
        .lr-chip.active { background: #f7fbff; box-shadow: 0 8px 18px rgba(0,0,0,.06); }
        .lr-chip-main { font-size: 16px; line-height: 1.2; }
        .lr-chip-sub { font-size: 12px; opacity: .8; margin-top: 2px; }
        .lr-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px; }
        @media (max-width: 540px) { .lr-form { grid-template-columns: 1fr; } }
        .lr-field-label { color: #1b5b84; font-weight: 400; margin-bottom: 6px; }
        .lr-select { width: 100%; font-size: 15px; border: 1px solid ${ACCENT}; border-radius: 12px; padding: 10px 12px; color: #1b5b84; background: #fff; appearance: none; min-height: 48px; }
        .lr-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
        .lr-btn { border-radius: 10px; padding: 10px 20px; font-size: 15px; cursor: pointer; border: 1px solid transparent; font-weight: 600; min-height: 44px; }
        .lr-btn.primary { background: #00477f; color: #fff; border-color: #00477f; }
        .lr-btn.ghost   { background: #fff; color: #00477f; border-color: #00477f; }
      `}</style>
    </>
  );
}

/* ── JS Styles ── */
const styles = {
  dropdownMenu: {
    position: "absolute", top: "calc(100% + 8px)", right: 0,
    background: "#fff", borderRadius: 12, padding: "8px 0",
    boxShadow: "0 12px 32px rgba(0,0,0,.14)",
    display: "flex", flexDirection: "column", minWidth: 230,
    zIndex: 1001, border: "1px solid rgba(0,71,127,0.1)",
  },
  dropdownItem: {
    padding: "10px 16px", textDecoration: "none",
    color: "#00477f", fontWeight: 700, fontFamily: BASE_FONT, fontSize: "0.95rem",
    transition: "background 0.12s",
  },
  dropdownLogout: {
    padding: "10px 16px", background: "transparent", border: "none",
    color: ACCENT, textAlign: "left", fontWeight: 800,
    cursor: "pointer", fontFamily: BASE_FONT, fontSize: "0.95rem", width: "100%",
  },
  drawerHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 20px 14px 24px",
    borderBottom: "1px solid rgba(0,71,127,0.08)",
  },
  drawerDivider: {
    height: 1, background: "rgba(0,71,127,0.08)", margin: "4px 0", flexShrink: 0,
  },
};