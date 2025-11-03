// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";
import flightIcon from "../assets/flight-icon.png";

const HERO_HEIGHT = typeof window !== "undefined" ? window.innerHeight : 500;

/* ===== Inline SVG icons (inherit currentColor) ===== */
const IconWrap = ({ children }) => (
  <span className="menuItem">{children}</span>
);

const GlobeIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a12 12 0 0 1 0 18" />
    <path d="M12 3a12 12 0 0 0 0 18" />
  </svg>
);

const PassportIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8 15h8" />
  </svg>
);

const PlaneIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.5 21l2.5-7.5 7.5-2.5-16-6 4.5 7.5L3 14.5l5.5 1.5 2 5z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12a8 8 0 0 1 16 0" />
    <rect x="3" y="12" width="4" height="7" rx="2" />
    <rect x="17" y="12" width="4" height="7" rx="2" />
    <path d="M7 19a5 5 0 0 0 5 3 5 5 0 0 0 5-3" />
  </svg>
);

const UserIcon = () => (
  <svg className="menuIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c2-3 5-4 8-4s6 1 8 4" />
  </svg>
);
/* =================================================== */

export default function Header({ onFlightClick, user, onLogout }) {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Prevent hide while hovering header
  const hoveringHeaderRef = useRef(false);

  useEffect(() => {
    let timeout;
    let lastScrollY = window.scrollY;

    const handleUserActivity = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScrollY);
      const scrollingDown = y > lastScrollY;
      lastScrollY = y;

      // Always show while within hero
      if (y < HERO_HEIGHT - 60) {
        setInHero(true);
        setVisible(true);
        return;
      }
      setInHero(false);

      // Don't hide while interacting
      if (dropdownOpen || showMobileNav || hoveringHeaderRef.current) {
        setVisible(true);
        return;
      }

      // Ignore micro scroll jitter
      if (delta < 12) return;

      // Hide only when scrolling down; show on scroll up
      if (scrollingDown) {
        setVisible(false);
        clearTimeout(timeout);
        timeout = setTimeout(() => setVisible(true), 1800); // bring back after pause
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

  const handleVisaServicesClick = (e) => {
    e.preventDefault();
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
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowMobileNav(false);
    if (onLogout) onLogout();
    navigate("/");
  };

  // Dynamic glass: lighter in hero, stronger after scroll
  const glassStyle = inHero
    ? {
        background: "rgba(255,255,255,.75)",
        borderColor: "rgba(255,255,255,.35)",
        boxShadow: "0 18px 38px rgba(0,0,0,.18)",
      }
    : {
        background: "rgba(255,255,255,.80)",
        borderColor: "rgba(255,255,255,.66)",
        boxShadow: "0 22px 44px rgba(0,0,0,.18)",
      };

  return (
    <>
      {/* Fixed center flight CTA (unchanged) */}
      <div style={styles.flightIconWrapper}>
        <img
          src={flightIcon}
          alt="Flight Icon"
          style={styles.flightIcon}
          onClick={onFlightClick}
        />
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
        className="hv-header"
      >
        {/* GLASS OVERLAY WRAP */}
        <div className="glassWrap">
          <div className="glassPill" style={glassStyle}>
            <Link to="/" style={styles.logoLink}>
              <img src={logo} alt="helloviza logo" style={styles.logo} />
            </Link>

            <nav className="desktop-nav" style={styles.nav}>
              <a
                href="#visa-services"
                style={{ ...styles.link, color: linkColor }}
                onClick={handleVisaServicesClick}
              >
                <IconWrap><GlobeIcon /></IconWrap>
                Visa Services
              </a>

              <Link to="/go-for-visa" style={{ ...styles.link, color: linkColor }}>
                <IconWrap><PassportIcon /></IconWrap>
                Go for Visa
              </Link>

              <a
                href="https://www.plumtrips.com"
                style={{ ...styles.link, color: linkColor }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWrap><PlaneIcon /></IconWrap>
                Book Flight
              </a>

              <Link to="/contact" style={{ ...styles.link, color: linkColor }}>
                <IconWrap><HeadsetIcon /></IconWrap>
                Support / Contact
              </Link>

              {user ? (
                <div
                  style={{ position: "relative", display: "inline-block" }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      color: linkColor,
                      fontFamily: "'Barlow Condensed', Arial, sans-serif",
                      userSelect: "none",
                    }}
                  >
                    {/* Avatar bubble */}
                    <div
                      style={{
                        backgroundColor: "#d06549",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: 16,
                        textTransform: "uppercase",
                      }}
                    >
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <span>{user.name || user.email} ▼</span>
                  </div>

                  {dropdownOpen && (
                    <div
                      onMouseEnter={() => setDropdownOpen(true)}   // keep open when inside
                      onMouseLeave={() => setDropdownOpen(false)}  // close only when leaving panel
                      style={{
                        position: "absolute",
                        top: "100%",              // flush to trigger (no external gap)
                        right: 0,
                        backgroundColor: "#fff",
                        color: "#00477f",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
                        borderRadius: "10px",
                        minWidth: "180px",
                        zIndex: 3000,
                        fontFamily: "'Barlow Condensed', Arial, sans-serif",
                        overflow: "hidden",
                        border: "1px solid #eef2f7",
                        paddingTop: 8,            // visual spacing INSIDE the panel
                      }}
                    >
                      {/* Invisible hover bridge to prevent flicker */}
                      <div
                        style={{
                          position: "absolute",
                          top: -10, left: 0, right: 0, height: 10,
                        }}
                      />

                      {[
                        { label: "My Profile", path: "/my-profile" },
                        { label: "My Visa History", path: "/my-visa-history" },
                        { label: "My Wallet", path: "/my-wallet" },
                        { label: "My Documents", path: "/my-documents" },
                        { label: "My Future Wishlist", path: "/my-future-wishlist" },
                      ].map(({ label, path }, i) => (
                        <Link
                          key={i}
                          to={path}
                          style={styles.dropdownItem}
                          onClick={() => setDropdownOpen(false)}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#d06549")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#00477f")}
                        >
                          {label}
                        </Link>
                      ))}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogoutClick();
                        }}
                        style={styles.dropdownLogout}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#a53828")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#d06549")}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ ...styles.link, color: linkColor }}>
                  <IconWrap><UserIcon /></IconWrap>
                  Login / Sign Up
                </Link>
              )}
            </nav>

            {/* MOBILE burger */}
            <div
              className="mobile-menu-icon"
              style={{ display: "none" }}
              onClick={() => setShowMobileNav(true)}
            >
              <svg width="32" height="32" fill={linkColor}>
                <rect y="6" width="32" height="4" rx="2" />
                <rect y="14" width="32" height="4" rx="2" />
                <rect y="22" width="32" height="4" rx="2" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE drawer */}
      {showMobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
          <div className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowMobileNav(false)}>
              ×
            </button>
            <Link to="/" onClick={() => setShowMobileNav(false)}>
              <span className="menuItem"><GlobeIcon /></span> Home
            </Link>
            <a href="#visa-services" onClick={handleVisaServicesClick}>
              <span className="menuItem"><GlobeIcon /></span> Visa Services
            </a>
            <Link to="/go-for-visa" onClick={() => setShowMobileNav(false)}>
              <span className="menuItem"><PassportIcon /></span> Go for Visa
            </Link>
            <a href="https://www.plumtrips.com" target="_blank" rel="noopener noreferrer">
              <span className="menuItem"><PlaneIcon /></span> Book Flight
            </a>
            <Link to="/contact" onClick={() => setShowMobileNav(false)}>
              <span className="menuItem"><HeadsetIcon /></span> Support / Contact
            </Link>
            {user ? (
              <>
                <span><span className="menuItem"><UserIcon /></span> Hello, {user.name || user.email}</span>
                <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setShowMobileNav(false)}>
                <span className="menuItem"><UserIcon /></span> Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .menuItem{ display:inline-flex; align-items:center; gap:8px; }
        .menuIcon{ width:18px; height:18px; display:inline-block; vertical-align:middle; flex-shrink:0; }

        /* Overlay scaffold */
        .glassWrap{
          width:100%;
          display:flex;
          justify-content:center;
          pointer-events:none; /* header overlay doesn't block hero interactions */
        }
        .glassPill{
          pointer-events:auto; /* re-enable inside */
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:1rem;
          width:min(1180px, 92vw);
          padding:10px 18px;           /* pill height */
          border-radius:999px;         /* round pill */
          border:1px solid rgba(255,255,255,.35);
          backdrop-filter: blur(10px) saturate(1.15);
          -webkit-backdrop-filter: blur(10px) saturate(1.15);
          transition: background .25s ease, border-color .25s ease, box-shadow .25s ease;
          overflow: visible; /* keep dropdown fully visible */
        }

        @media (max-width: 920px) {
          .desktop-nav { display: none !important; }
          .hv-header {
            background: transparent !important;
            border-bottom: none;
            padding: 0; /* pill controls spacing */
          }
          .glassPill{
            border-radius:18px;
            width:100%;
            margin:0 10px;
            padding:12px 14px;
            background: rgba(255,255,255,.95); /* solid-ish for readability */
            border:1px solid #eef2f7;
            box-shadow: 0 10px 24px rgba(0,0,0,.10);
          }
          .mobile-menu-icon {
            display: block !important;
            cursor: pointer;
            position: absolute;
            top: 18px;
            right: 16px;
            z-index: 1201;
          }
        }

        @media (min-width: 921px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-icon { display: none !important; }
          .hv-header {
            background: transparent !important;
            border-bottom: none;
            padding: 1.2rem 0; /* overall top/bottom spacing for overlay */
          }
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.28);
          z-index: 1200;
          display: flex; justify-content: flex-end;
        }
        .mobile-nav {
          background: #fff;
          width: 77vw;
          max-width: 320px;
          height: 100%;
          padding: 32px 18px 22px 26px;
          box-shadow: -2px 0 18px #0001;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          z-index: 1201;
          animation: slideInRight 0.3s;
        }
        .close-btn {
          position: absolute;
          top: 10px; right: 14px;
          background: none;
          border: none;
          font-size: 2.2rem;
          cursor: pointer;
          color: #d06549;
        }
        .mobile-nav a, .mobile-nav button, .mobile-nav span {
          color: #003366;
          font-size: 1.13rem;
          font-weight: 600;
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 0.7rem 0;
          font-family: 'Barlow Condensed', Arial, sans-serif;
        }
        .mobile-nav .logout-btn { color: #d06549; }
        @keyframes slideInRight {
          from { transform: translateX(80%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

const styles = {
  flightIconWrapper: {
    position: "fixed",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1001,
    background: "#00477f",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    padding: "0.5rem 1rem",
  },
  flightIcon: {
    height: "24px",
    width: "24px",
    cursor: "pointer",
  },
  header: {
    position: "fixed",
    top: ".2rem", // adjust for distance from top
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
    zIndex: 1000,
    width: "100%",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    marginRight: "1rem",
  },
  logo: {
    height: "56px",
    objectFit: "contain",
  },
  nav: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "color 0.3s",
    fontFamily: "'Barlow Condensed', Arial, sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  dropdownItem: {
    display: "block",
    padding: "0.8rem 1rem",
    color: "#00477f",
    textDecoration: "none",
    fontWeight: "normal",
    cursor: "pointer",
    borderBottom: "1px solid #eef2f7",
    transition: "color 0.2s ease",
  },
  dropdownLogout: {
    width: "100%",
    padding: "0.8rem 1rem",
    background: "none",
    border: "none",
    color: "#d06549",
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "left",
    transition: "color 0.2s ease",
  },
};
