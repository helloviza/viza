// src/components/Header.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";
import flightIcon from "../assets/flight-icon.png";

/* =====================================
   Inline SVG icons (size normalized)
===================================== */
const IconWrap = ({ children }) => <span className="menuItem">{children}</span>;

const GlobeIcon = () => (
  <svg style={NAV_ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a12 12 0 0 1 0 18" />
    <path d="M12 3a12 12 0 0 0 0 18" />
  </svg>
);

const PassportIcon = () => (
  <svg style={NAV_ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8 15h8" />
  </svg>
);

const PlaneIcon = () => (
  <svg style={NAV_ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.5 21l2.5-7.5 7.5-2.5-16-6 4.5 7.5L3 14.5l5.5 1.5 2 5z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg style={NAV_ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12a8 8 0 0 1 16 0" />
    <rect x="3" y="12" width="4" height="7" rx="2" />
    <rect x="17" y="12" width="4" height="7" rx="2" />
    <path d="M7 19a5 5 0 0 0 5 3 5 5 0 0 0 5-3" />
  </svg>
);

const UserIcon = () => (
  <svg style={NAV_ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c2-3 5-4 8-4s6 1 8 4" />
  </svg>
);

/* =====================================
   Typographic system for header items
===================================== */
const BASE_FONT = "'Barlow Condensed', Arial, sans-serif";

const NAV_ITEM = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: BASE_FONT,
  fontWeight: 900,            // keep BOLD
  fontSize: "14px",           // single source of truth
  lineHeight: "1.15",
  letterSpacing: "0.02em",
  color: "#d06549",
  textDecoration: "none",
  verticalAlign: "middle",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const NAV_LABEL = {
  display: "inline-block",
  fontFamily: BASE_FONT,
  fontWeight: 600,
  fontSize: "15px",
  lineHeight: "1.15",
  letterSpacing: "0.02em",
};

const NAV_ICON = {
  width: 26,
  height: 26,
  flex: "0 0 auto",
  color: "currentColor",
};

/* ===== Helpers ===== */
function getCachedUser() {
  try {
    const raw = localStorage.getItem("hv_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function pickDisplayName(u) {
  if (!u) return "";
  const p = u.profile || {};
  const first =
    p.firstName ||
    u.firstName ||
    (typeof u.name === "string" && u.name.split(" ")[0]) ||
    "";
  if (first && first.trim()) return first.trim();
  const email = u.email || p.email;
  if (email && email.includes("@")) return email.split("@")[0];
  return "";
}

/* ===== Keys ===== */
const VISA_INTENT_KEY = "HV:VISA_INTENT_TS";
const LOGIN_REDIRECT_KEY = "postLoginRedirect";

/* =================================================== */
export default function Header({ onFlightClick, user, onLogout }) {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [effectiveUser, setEffectiveUser] = useState(() => user || getCachedUser());

  const location = useLocation();
  const navigate = useNavigate();
  const hoveringHeaderRef = useRef(false);

  useEffect(() => {
    const sync = () => setEffectiveUser(user || getCachedUser());
    sync();
    const onStorage = (e) => { if (!e || e.key === "hv_user") sync(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  useEffect(() => {
    const HERO_HEIGHT = window.innerHeight;
    let timeout;
    let lastScrollY = window.scrollY;

    const handleUserActivity = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScrollY);
      const scrollingDown = y > lastScrollY;
      lastScrollY = y;

      if (y < HERO_HEIGHT - 60) {
        setInHero(true);
        setVisible(true);
        return;
      }
      setInHero(false);

      if (dropdownOpen || showMobileNav || hoveringHeaderRef.current) {
        setVisible(true);
        return;
      }
      if (delta < 12) return;

      if (scrollingDown) {
        setVisible(false);
        clearTimeout(timeout);
        timeout = setTimeout(() => setVisible(true), 1800);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleUserActivity, { passive: true });
    window.addEventListener("mousemove", handleUserActivity);
    handleUserActivity();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
    };
  }, [dropdownOpen, showMobileNav]);

  const linkColor = inHero ? "#d06549" : "#000000";

  /* ===== Navigation handlers ===== */
  const handleVisaServicesClick = useCallback(() => {
    setShowMobileNav(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("visa-services");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      const section = document.getElementById("visa-services");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname, navigate]);

  const handleGoForVisaClick = useCallback(() => {
    setShowMobileNav(false);

    if (effectiveUser) {
      // Logged in → direct handoff
      window.location.href = "https://visa.helloviza.com";
      return;
    }
    // Not logged in → mark intent and go to login
    try {
      sessionStorage.setItem(VISA_INTENT_KEY, String(Date.now()));
    } catch {}
    navigate("/login?next=/go/visa");
  }, [navigate, effectiveUser]);

  const handleLogoutClick = useCallback(() => {
    setDropdownOpen(false);
    setShowMobileNav(false);

    try {
      sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
      localStorage.removeItem(LOGIN_REDIRECT_KEY);

      sessionStorage.removeItem(VISA_INTENT_KEY);
      localStorage.removeItem(VISA_INTENT_KEY);

      sessionStorage.removeItem("hv_user");
      localStorage.removeItem("hv_user");
      localStorage.removeItem("helloviza_user");
      localStorage.removeItem("hv_token");
    } catch {}

    onLogout?.();
    navigate("/");
  }, [navigate, onLogout]);

  const glassStyle = inHero
    ? { background: "rgba(255,255,255,.75)", borderColor: "rgba(255,255,255,.35)", boxShadow: "0 18px 38px rgba(0,0,0,.18)" }
    : { background: "rgba(255,255,255,.80)", borderColor: "rgba(255,255,255,.66)", boxShadow: "0 22px 44px rgba(0,0,0,.18)" };

  return (
    <>
      {/* Center flight icon */}
      <div style={styles.flightIconWrapper}>
        <img src={flightIcon} alt="Flight Icon" style={styles.flightIcon} onClick={onFlightClick} />
      </div>

      <header
        onMouseEnter={() => (hoveringHeaderRef.current = true)}
        onMouseLeave={() => (hoveringHeaderRef.current = false)}
        style={{
          ...styles.header,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-40px)",
          transition: "opacity 0.4s, transform 0.4s",
        }}
      >
        <div className="glassWrap">
          <div className="glassPill" style={glassStyle}>
            <Link to="/" style={styles.logoLink} aria-label="Home">
              <img src={logo} alt="helloviza logo" style={styles.logo} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav" style={styles.nav}>
              <button style={{ ...NAV_ITEM, color: linkColor }} onClick={handleVisaServicesClick} aria-label="Visa Services">
                <IconWrap><GlobeIcon /></IconWrap>
                <span style={NAV_LABEL}>Visa Services</span>
              </button>

              <button style={{ ...NAV_ITEM, color: linkColor }} onClick={handleGoForVisaClick} aria-label="Go for Visa">
                <IconWrap><PassportIcon /></IconWrap>
                <span style={NAV_LABEL}>Go for Visa</span>
              </button>

              <a href="https://www.plumtrips.com" style={{ ...NAV_ITEM, color: linkColor }} target="_blank" rel="noopener noreferrer" aria-label="Book Flight">
                <IconWrap><PlaneIcon /></IconWrap>
                <span style={NAV_LABEL}>Book Flight</span>
              </a>

              <Link to="/contact" style={{ ...NAV_ITEM, color: linkColor }} aria-label="Support / Contact">
                <IconWrap><HeadsetIcon /></IconWrap>
                <span style={NAV_LABEL}>Support / Contact</span>
              </Link>

              {/* User Menu */}
              {effectiveUser ? (
                <div
                  style={{ position: "relative", display: "inline-block" }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {(() => {
                    const displayName = pickDisplayName(effectiveUser);
                    const initial = (displayName?.[0] || "U").toUpperCase();
                    return (
                      <div style={{ ...NAV_ITEM, color: linkColor }}>
                        <div style={{
                          backgroundColor: "#d06549", color: "#fff", borderRadius: "50%",
                          width: 32, height: 32, display: "flex", justifyContent: "center",
                          alignItems: "center", fontWeight: 900, fontSize: 16,
                        }}>
                          {initial}
                        </div>
                        <span style={NAV_LABEL}>{displayName || "User"} ▼</span>
                      </div>
                    );
                  })()}

                  {dropdownOpen && (
                    <div style={styles.dropdownMenu}>
                      <Link to="/account/profile" style={styles.dropdownItem}>My Profile</Link>
                      <Link to="/account/visa-history" style={styles.dropdownItem}>My Visa History</Link>
                      <Link to="/account/wallet" style={styles.dropdownItem}>My Wallet</Link>
                      <Link to="/account/documents" style={styles.dropdownItem}>My Documents</Link>
                      <Link to="/account/wishlist" style={styles.dropdownItem}>My Future Wishlist</Link>
                      <hr style={{ margin: 0, borderColor: "rgba(0,0,0,0.1)" }} />
                      <button onClick={handleLogoutClick} style={styles.dropdownLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ ...NAV_ITEM, color: linkColor }} aria-label="Login / Sign Up">
                  <IconWrap><UserIcon /></IconWrap>
                  <span style={NAV_LABEL}>Login / Sign Up</span>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Icon */}
            <div className="mobile-menu-icon" style={{ display: "none" }} onClick={() => setShowMobileNav(true)} aria-label="Open menu">
              <svg width="32" height="32" fill={linkColor} aria-hidden="true">
                <rect y="6" width="32" height="4" rx="2" />
                <rect y="14" width="32" height="4" rx="2" />
                <rect y="22" width="32" height="4" rx="2" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {showMobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
          <div className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowMobileNav(false)} aria-label="Close menu">×</button>

            <button onClick={handleVisaServicesClick} className="mobile-link-btn">
              <IconWrap><GlobeIcon /></IconWrap> Visa Services
            </button>
            <button onClick={handleGoForVisaClick} className="mobile-link-btn">
              <IconWrap><PassportIcon /></IconWrap> Go for Visa
            </button>
            <a href="https://www.plumtrips.com" target="_blank" rel="noopener noreferrer" className="mobile-link-btn">
              <IconWrap><PlaneIcon /></IconWrap> Book Flight
            </a>
            <Link to="/contact" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">
              <IconWrap><HeadsetIcon /></IconWrap> Support / Contact
            </Link>

            {effectiveUser ? (
              <>
                <Link to="/account/profile" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">My Profile</Link>
                <Link to="/account/visa-history" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">My Visa History</Link>
                <Link to="/account/wallet" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">My Wallet</Link>
                <Link to="/account/documents" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">My Documents</Link>
                <Link to="/account/wishlist" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">My Future Wishlist</Link>
                <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setShowMobileNav(false)} className="mobile-link-btn">
                <IconWrap><UserIcon /></IconWrap> Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .menuItem{display:inline-flex;align-items:center;gap:8px;}
        .glassWrap{width:100%;display:flex;justify-content:center;pointer-events:none;}
        .glassPill{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;
          width:min(1180px,92vw);padding:10px 18px;border-radius:999px;
          border:1px solid rgba(255,255,255,.35);
          backdrop-filter:blur(10px) saturate(1.15);
          -webkit-backdrop-filter:blur(10px) saturate(1.15);
        }
        @media(max-width:920px){
          .desktop-nav{display:none!important;}
          .mobile-menu-icon{display:block!important;cursor:pointer;position:absolute;top:18px;right:16px;z-index:1201;}
        }
        @media(min-width:921px){
          .desktop-nav{display:flex!important;}
          .mobile-menu-icon{display:none!important;}
        }
        .mobile-nav-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.28);
          z-index:1200;display:flex;justify-content:flex-end;}
        .mobile-nav{background:#fff;width:77vw;max-width:320px;height:100%;
          padding:32px 18px 22px 26px;box-shadow:-2px 0 18px #0001;
          display:flex;flex-direction:column;gap:20px;position:relative;animation:slideInRight .3s;}
        .close-btn{position:absolute;top:10px;right:14px;background:none;border:none;
          font-size:2.2rem;cursor:pointer;color:#d06549;}
        .mobile-link-btn,.mobile-nav a,.logout-btn{
          color:#00477f;font-size:1.13rem;font-weight:700;text-decoration:none;
          background:none;border:none;text-align:left;cursor:pointer;padding:.7rem 0;
          font-family:${BASE_FONT};
        }
        .logout-btn{color:#d06549;}
        @keyframes slideInRight{from{transform:translateX(80%);}to{transform:translateX(0);}}
      `}</style>
    </>
  );
}

/* ===== JS Styles ===== */
const styles = {
  flightIconWrapper: {
    position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
    zIndex: 1001, background: "#00477f", borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    padding: "0.5rem 1rem"
  },
  flightIcon: { height: 24, width: 24, cursor: "pointer" },
  header: {
    position: "fixed", top: ".2rem", left: 0, right: 0, display: "flex",
    justifyContent: "center", alignItems: "center", color: "#000", zIndex: 1000, width: "100%"
  },
  logoLink: { display: "flex", alignItems: "center", textDecoration: "none", marginRight: "1rem" },
  logo: { height: 56, objectFit: "contain" },
  nav: { display: "flex", gap: "2rem", alignItems: "center" },

  dropdownMenu: {
    position: "absolute", top: "100%", right: 0, background: "#fff", borderRadius: 10, padding: 10,
    boxShadow: "0 10px 20px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", minWidth: 220, zIndex: 1001
  },
  dropdownItem: { padding: "8px 12px", textDecoration: "none", color: "#00477f", fontWeight: 700, fontFamily: BASE_FONT },
  dropdownLogout: {
    padding: "8px 12px", background: "transparent", border: "none", color: "#d06549",
    textAlign: "left", fontWeight: 800, cursor: "pointer", fontFamily: BASE_FONT
  },
};
