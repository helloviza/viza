import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";
import flightIcon from "../assets/flight-icon.png";

const HERO_HEIGHT = window.innerHeight; // Hero section height (100vh)

const Header = ({ onFlightClick }) => {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const handleUserActivity = () => {
      const scrollY = window.scrollY;
      // Check if in Hero section
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

    // Also check on mount (refresh at top)
    handleUserActivity();

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
    };
  }, []);

  // Choose color: blue in Hero, black otherwise
  const linkColor = inHero ? "#d06549" : "#000000";

  // Handler for Visa Services scroll
  const handleVisaServicesClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("visa-services");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 400); // Wait for home to mount
    } else {
      const section = document.getElementById("visa-services");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Flight icon at very top center */}
      <div style={styles.flightIconWrapper}>
        <img
          src={flightIcon}
          alt="Flight Icon"
          style={styles.flightIcon}
          onClick={onFlightClick}
        />
      </div>

      {/* Main Header Navigation */}
      <header
        style={{
          ...styles.header,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-40px)",
          transition: "opacity 0.4s, transform 0.4s",
        }}
      >
        <Link to="/" style={{ ...styles.logoLink }}>
          <img src={logo} alt="helloviza logo" style={styles.logo} />
        </Link>

        <nav style={styles.nav}>
          {/* Only change for Visa Services link */}
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
          <Link to="/login" style={{ ...styles.link, color: linkColor }}>
            Login / Sign Up
          </Link>
        </nav>
      </header>
    </>
  );
};

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
    padding: "1.2rem 3rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "transparent",
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
  },
  link: {
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "color 0.3s",
    fontFamily: "'Barlow Condensed', Arial, sans-serif",
  },
};

export default Header;
