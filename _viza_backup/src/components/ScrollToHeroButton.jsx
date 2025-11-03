import React, { useState, useEffect } from "react";

const ScrollToHeroButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShow(window.scrollY > 120);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToHero = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- Responsive mystyle for button placement ---
  const btnStyle = {
    position: "fixed",
    right: "2.3vw",
    bottom: window.innerWidth < 650 ? "16vw" : "2.7vw", // higher on mobile for thumb & avoid overlays
    zIndex: 3000,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    borderRadius: "50%",
    boxShadow: "0 6px 24px 0 rgba(32,32,32,0.18)",
    transition: "opacity .18s",
    opacity: 0.92,
    width: window.innerWidth < 650 ? 54 : 44,
    height: window.innerWidth < 650 ? 54 : 44,
    minWidth: 44,
    minHeight: 44,
    display: show ? "block" : "none",
    touchAction: "manipulation",
  };

  return show ? (
    <button
      onClick={scrollToHero}
      style={btnStyle}
      aria-label="Scroll to top"
    >
      <svg
        height={window.innerWidth < 650 ? 54 : 36}
        width={window.innerWidth < 650 ? 54 : 36}
        viewBox="0 0 36 36"
        style={{ display: "block" }}
      >
        <circle cx="18" cy="18" r="18" fill="#000" opacity="0.68" />
        <polyline
          points="12,22 18,14 24,22"
          fill="none"
          stroke="#fff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ) : null;
};

export default ScrollToHeroButton;
