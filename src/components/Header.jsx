// Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";
import flightIcon from "../assets/flight-icon.png";

const HERO_HEIGHT = typeof window !== "undefined" ? window.innerHeight : 500;

export default function Header({ onFlightClick, user, onLogout }) {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    const handleUserActivity = () => {
      const scrollY = window.scrollY;
      if (scrollY < HERO_HEIGHT - 60) {
        setInHero(true);
        setVisible(true);
        return;
      } else {
        setInHero(false);
      }
      setVisible(false);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setVisible(true);
      }, 1500);
    };

    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);
    handleUserActivity();

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
    };
  }, []);

  const linkColor = inHero ? "#d06549" : "#000000";

  const handleVisaServicesClick = e => {
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
    setShowMobileNav(false);
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <>
      <div style={styles.flightIconWrapper}>
        <img
          src={flightIcon}
          alt="Flight Icon"
          style={styles.flightIcon}
          onClick={onFlightClick}
        />
      </div>

      <header
        style={{
          ...styles.header,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-40px)",
          transition: "opacity 0.4s, transform 0.4s",
        }}
        className="hv-header"
      >
        <Link to="/" style={styles.logoLink}>
          <img src={logo} alt="helloviza logo" style={styles.logo} />
        </Link>

        <nav className="desktop-nav" style={styles.nav}>
          <a
            href="#visa-services"
            style={{ ...styles.link, color: linkColor }}
            onClick={handleVisaServicesClick}
          >
            Visa Services
          </a>
          <Link to="/go-for-visa" style={{ ...styles.link, color: linkColor }}>
            Go for Visa
          </Link>
          <a
            href="https://www.plumtrips.com"
            style={{ ...styles.link, color: linkColor }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Flight
          </a>
          <Link to="/contact" style={{ ...styles.link, color: linkColor }}>
            Support / Contact
          </Link>

          {user ? (
            <>
              <span style={{ ...styles.link, color: linkColor }}>
                Hello, {user.name || user.email}
              </span>
              <button
                onClick={handleLogoutClick}
                style={styles.logoutBtn}
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ ...styles.link, color: linkColor }}>
              Login / Sign Up
            </Link>
          )}
        </nav>

        {/* ---- MOBILE: Hamburger Icon ---- */}
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
      </header>

      {/* ---- MOBILE: Slide Drawer ---- */}
      {showMobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
          <div className="mobile-nav" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowMobileNav(false)}>×</button>
            <Link to="/" onClick={() => setShowMobileNav(false)}>Home</Link>
            <a href="#visa-services" onClick={handleVisaServicesClick}>Visa Services</a>
            <Link to="/go-for-visa" onClick={() => setShowMobileNav(false)}>Go for Visa</Link>
            <a href="https://www.plumtrips.com" target="_blank" rel="noopener noreferrer">Book Flight</a>
            <Link to="/contact" onClick={() => setShowMobileNav(false)}>Support / Contact</Link>
            {user ? (
              <>
                <span>Hello, {user.name || user.email}</span>
                <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setShowMobileNav(false)}>Login / Sign Up</Link>
            )}
          </div>
        </div>
      )}

      {/* --- Responsive Styles (Desktop/Mobile) --- */}
      <style>{`
        @media (max-width: 920px) {
          .desktop-nav { display: none !important; }
          .hv-header {
            background: #fff !important;
            border-bottom: 1px solid #f5f5f5;
            padding: 1.1rem 1.2rem;
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
            padding: 1.2rem 3rem;
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
        .mobile-nav .logout-btn {
          color: #d06549;
        }
        @keyframes slideInRight {
          from { transform: translateX(80%);}
          to { transform: translateX(0);}
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
    top: "1rem",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#000",
    zIndex: 1000,
    width: "100%",
    // Don't set background here, media queries handle it!
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
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#d06549",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    marginLeft: "1rem",
  },
};
