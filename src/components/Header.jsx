import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/helloviza-logo.png";
import flightIcon from "../assets/flight-icon.png";

const HERO_HEIGHT = window.innerHeight;

const Header = ({ onFlightClick }) => {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    // On mount or login state change
    const userStr = localStorage.getItem("helloviza_user");
    setUser(userStr ? JSON.parse(userStr) : null);
  }, [localStorage.getItem("helloviza_user")]); // Update on user login/logout

  const linkColor = inHero ? "#d06549" : "#000000";

  const handleVisaServicesClick = (e) => {
    e.preventDefault();
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
      >
        <Link to="/" style={{ ...styles.logoLink }}>
          <img src={logo} alt="helloviza logo" style={styles.logo} />
        </Link>
        <nav style={styles.nav}>
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
              <span style={{ ...styles.link, color: "#16a34a" }}>
                Hi, {user.firstName || user.email.split("@")[0]}
              </span>
              <span
                style={{ ...styles.link, color: "#b83030", marginLeft: "1.2rem", cursor: "pointer" }}
                onClick={() => {
                  localStorage.removeItem("helloviza_user");
                  localStorage.removeItem("helloviza_token");
                  window.location.reload();
                }}
              >
                Logout
              </span>
            </>
          ) : (
            <Link to="/login" style={{ ...styles.link, color: linkColor }}>
              Login / Sign Up
            </Link>
          )}
        </nav>
      </header>
    </>
  );
};

const styles = { /* ...your same styles... */ };

export default Header;
