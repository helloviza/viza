// src/components/Header.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";
import flightIcon from "../assets/flight-icon.png";

/* ===== Inline SVG icons ===== */
const IconWrap = ({ children }) => <span className="menuItem">{children}</span>;

const GlobeIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a12 12 0 0 1 0 18" />
    <path d="M12 3a12 12 0 0 0 0 18" />
  </svg>
);

const PassportIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8 15h8" />
  </svg>
);

const PlaneIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 21l2.5-7.5 7.5-2.5-16-6 4.5 7.5L3 14.5l5.5 1.5 2 5z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 0 1 16 0" />
    <rect x="3" y="12" width="4" height="7" rx="2" />
    <rect x="17" y="12" width="4" height="7" rx="2" />
    <path d="M7 19a5 5 0 0 0 5 3 5 5 0 0 0 5-3" />
  </svg>
);

const UserIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c2-3 5-4 8-4s6 1 8 4" />
  </svg>
);

/* ===== Helpers for name & cache ===== */
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

/* =================================================== */
export default function Header({ onFlightClick, user, onLogout }) {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Use parent `user` if provided; otherwise read from localStorage so refresh works.
  const [effectiveUser, setEffectiveUser] = useState(() => user || getCachedUser());

  const location = useLocation();
  const navigate = useNavigate();
  const hoveringHeaderRef = useRef(false);

  /* ===== Keep effectiveUser synced with parent + localStorage updates ===== */
  useEffect(() => {
    const sync = () => setEffectiveUser(user || getCachedUser());
    sync(); // run once now

    const onStorage = (e) => {
      if (!e || e.key === "hv_user") sync();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  /* ===== Scroll + visibility behavior ===== */
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
    if (effectiveUser) navigate("/go/visa");
    else navigate("/login?next=/go/visa");
  }, [navigate, effectiveUser]);

  const handleLogoutClick = useCallback(() => {
    setDropdownOpen(false);
    setShowMobileNav(false);
    onLogout?.();
    navigate("/");
  }, [navigate, onLogout]);

  const glassStyle = inHero
    ? { background: "rgba(255,255,255,.75)", borderColor: "rgba(255,255,255,.35)", boxShadow: "0 18px 38px rgba(0,0,0,.18)" }
    : { background: "rgba(255,255,255,.80)", borderColor: "rgba(255,255,255,.66)", boxShadow: "0 22px 44px rgba(0,0,0,.18)" };

  /* =================================================== */
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
            <Link to="/" style={styles.logoLink}>
              <img src={logo} alt="helloviza logo" style={styles.logo} />
            </Link>

            {/* ===== Desktop Navigation ===== */}
            <nav className="desktop-nav" style={styles.nav}>
              <button style={{ ...styles.linkButton, color: linkColor }} onClick={handleVisaServicesClick}>
                <IconWrap><GlobeIcon /></IconWrap> Visa Services
              </button>
              <button style={{ ...styles.linkButton, color: linkColor }} onClick={handleGoForVisaClick}>
                <IconWrap><PassportIcon /></IconWrap> Go for Visa
              </button>
              <a href="https://www.plumtrips.com" style={{ ...styles.link, color: linkColor }} target="_blank" rel="noopener noreferrer">
                <IconWrap><PlaneIcon /></IconWrap> Book Flight
              </a>
              <Link to="/contact" style={{ ...styles.link, color: linkColor }}>
                <IconWrap><HeadsetIcon /></IconWrap> Support / Contact
              </Link>

              {/* ===== User Menu ===== */}
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
                      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: linkColor }}>
                        <div style={{
                          backgroundColor: "#d06549", color: "#fff", borderRadius: "50%",
                          width: 32, height: 32, display: "flex", justifyContent: "center",
                          alignItems: "center", fontWeight: "bold", fontSize: 16,
                        }}>
                          {initial}
                        </div>
                        <span>{displayName || "User"} ▼</span>
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
                <Link to="/login" style={{ ...styles.link, color: linkColor }}>
                  <IconWrap><UserIcon /></IconWrap> Login / Sign Up
                </Link>
              )}
            </nav>

            {/* ===== Mobile Menu Icon ===== */}
            <div className="mobile-menu-icon" style={{ display: "none" }} onClick={() => setShowMobileNav(true)}>
              <svg width="32" height="32" fill={linkColor}>
                <rect y="6" width="32" height="4" rx="2" />
                <rect y="14" width="32" height="4" rx="2" />
                <rect y="22" width="32" height="4" rx="2" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE Drawer ===== */}
      {showMobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
          <div className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowMobileNav(false)}>×</button>

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

      {/* ===== Inline Styles ===== */}
      <style>{`
        .menuItem{display:inline-flex;align-items:center;gap:8px;}
        .menuIcon{width:18px;height:18px;}
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
          color:#00477f;font-size:1.13rem;font-weight:600;text-decoration:none;
          background:none;border:none;text-align:left;cursor:pointer;padding:.7rem 0;
          font-family:'Barlow Condensed',Arial,sans-serif;
        }
        .logout-btn{color:#d06549;}
        @keyframes slideInRight{from{transform:translateX(80%);}to{transform:translateX(0);}}
      `}</style>
    </>
  );
}

/* ===== JS Styles ===== */
const styles = {
  flightIconWrapper: { position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
    zIndex: 1001, background: "#00477f", borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    padding: "0.5rem 1rem" },
  flightIcon: { height: 24, width: 24, cursor: "pointer" },
  header: { position: "fixed", top: ".2rem", left: 0, right: 0, display: "flex",
    justifyContent: "center", alignItems: "center", color: "#000", zIndex: 1000, width: "100%" },
  logoLink: { display: "flex", alignItems: "center", textDecoration: "none", marginRight: "1rem" },
  logo: { height: 56, objectFit: "contain" },
  nav: { display: "flex", gap: "2rem", alignItems: "center" },
  link: { textDecoration: "none", fontWeight: 500, fontSize: "1rem", cursor: "pointer",
    transition: "color .3s", fontFamily: "'Barlow Condensed',Arial,sans-serif",
    display: "inline-flex", alignItems: "center", gap: 8 },
  linkButton: { background: "none", border: "none", fontWeight: 500, fontSize: "1rem",
    cursor: "pointer", transition: "color .3s", fontFamily: "'Barlow Condensed',Arial,sans-serif",
    display: "inline-flex", alignItems: "center", gap: 8 },
  dropdownMenu: {
    position: "absolute", top: "100%", right: 0, backgroundColor: "#fff", color: "#00477f",
    boxShadow: "0 10px 20px rgba(0,0,0,0.18)", borderRadius: 10, minWidth: 200, zIndex: 3000,
    border: "1px solid #eef2f7", overflow: "hidden",
  },
  dropdownItem: {
    display: "block", padding: "12px 18px", color: "#00477f", textDecoration: "none",
    borderBottom: "1px solid #eef2f7", fontWeight: 600, fontFamily: "'Barlow Condensed',Arial,sans-serif",
    transition: "background .2s", fontSize: 16,
  },
  dropdownLogout: {
    width: "100%",
    padding: "12px 18px",
    background: "none",
    border: "none",
    color: "#d06549",
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "left",
    fontFamily: "'Barlow Condensed', Arial, sans-serif",
  },
};
