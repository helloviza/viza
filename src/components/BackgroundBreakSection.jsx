import React from "react";
import bgImage from "../assets/contact-bg.jpg";

const BackgroundBreakSection = () => (
  <section style={{
    width: "100vw",
    minHeight: "350px",
    background: `url(${bgImage}) center center/cover no-repeat`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }}>
    {/* Optional: Add content or just leave as a break/transition section */}
    <div style={{
      width: "100vw",
      height: "100%",
      background: "rgba(0,0,0,0.13)", // Optional overlay for effect
      position: "absolute",
      top: 0, left: 0
    }}/>
    <div style={{
      position: "relative",
      color: "#fff",
      fontFamily: "'Barlow Condensed', Arial, sans-serif",
      fontSize: "2rem",
      zIndex: 2
    }}>
      {/* Optional: Inspirational quote or nothing */}
      {/* Example: "Your next journey starts here." */}
    </div>
  </section>
);

export default BackgroundBreakSection;
