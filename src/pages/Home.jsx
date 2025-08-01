// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import bgImg from "../assets/hero-bg.jpg";

const Home = ({ onDiscoverNow }) => {
  // 1. State for showing background
  const [showBg, setShowBg] = useState(true);

  useEffect(() => {
    const sectionHeight =
      typeof window !== "undefined" ? window.innerHeight : 700;
    const onScroll = () => {
      // Hide bg after scrolling past 2 full screens (hero + 1 section)
      setShowBg(window.scrollY < sectionHeight * 2 - 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hero-wrapper" id="hero">
      {/* Fixed background image layer (opacity fades out) */}
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url(${bgImg})`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          transition: "opacity .7s cubic-bezier(.7,0,.3,1)",
          opacity: showBg ? 1 : 0,
          pointerEvents: showBg ? "auto" : "none",
          willChange: "opacity",
        }}
      />

      {/* Foreground content */}
      <div className="hero-content">
        <div className="text-block">
          <h1>
            Your Gateway to
            <br />
            The World
          </h1>
          <p>
            Behind every visa lies a world of endless possibilities. Visa Services simplifies your journey, unlocking seamless travel, unforgettable adventures, and hassle-free exploration wherever your dreams take you
          </p>
          <button onClick={onDiscoverNow}>Explore Now 🔎</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
