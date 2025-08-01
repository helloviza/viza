import React from "react";
import bgImage from "../assets/contact-bg.jpg";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const mystyle = {
  section: {
    width: "100vw",
    minHeight: 0,
    height: 350,
    maxHeight: 460,
    background: `url(${bgImage}) center center/cover no-repeat`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: 0,
    margin: 0,
  },
  overlay: {
    width: "100vw",
    height: "100%",
    background: "rgba(0,0,0,0.13)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  content: {
    position: "relative",
    color: "#fff",
    fontFamily: baseFont,
    fontSize: "2.2rem",
    zIndex: 2,
    textAlign: "center",
    padding: "0 2vw",
    fontWeight: 700,
    textShadow: "0 2px 24px #0007",
    letterSpacing: ".01em",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "inherit"
  },
  // MOBILE override
  sectionMobile: {
    height: 180,
    minHeight: 0,
    backgroundPosition: "center center",
    backgroundSize: "cover",
  },
  contentMobile: {
    fontSize: "1.18rem",
    padding: "0 5vw",
  },
};

const isMobile = window.innerWidth <= 700;

const BackgroundBreakSection = () => (
  <section
    style={{
      ...mystyle.section,
      ...(isMobile ? mystyle.sectionMobile : {}),
    }}
  >
    <div style={mystyle.overlay} />
    <div
      style={{
        ...mystyle.content,
        ...(isMobile ? mystyle.contentMobile : {}),
      }}
    >
      {/* You can put an inspirational quote or leave blank */}
      {/* Example: */}
      {/* "Your next journey starts here." */}
    </div>
  </section>
);

export default BackgroundBreakSection;
