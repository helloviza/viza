// client/src/pages/Home.jsx
import React from "react";
import "../styles/Home.css";
import bgImg from "../assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="hero-wrapper" id="hero">
      {/* Fixed background image layer */}
      <div className="hero-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>

      {/* Foreground content */}
      <div className="hero-content">
        <div className="text-block">
          <h1>Your Gateway to<br />The World</h1>
          <p>
            Behind every visa lies a world of endless possibilities. Visa Services simplifies your journey, unlocking seamless travel, unforgettable adventures, and hassle-free exploration wherever your dreams take you
          </p>
          <button>Discover Now</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
