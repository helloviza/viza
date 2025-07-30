import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const ExploreSection = () => (
  <section style={{
    width: "100vw",
    minHeight: "48vh",
    background: "#f6f6f6",
    fontFamily: baseFont,
    display: "flex",
    alignItems: "center",
    position: "relative",
    padding: 0,
    margin: 0,
    borderBottom: "5px solid #000"
  }}>
    {/* Info block: left aligned */}
    <div style={{
      flex: "0 0 38vw",
      minWidth: "330px",
      maxWidth: "580px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "3.8vw",
      paddingTop: "2.8vw",
      paddingBottom: "2.8vw",
      height: "100%",
    }}>
      <div style={{
        fontSize: "1rem",
        fontWeight: 400,
        color: "#232323",
        lineHeight: 1.14,
        letterSpacing: "0.01em"
      }}>
        Step into a realm where the extraordinary becomes reality. From hidden valleys to untouched coastlines, these are places that defy imagination and stir the soul. Discover the world’s most remarkable wonders, carefully curated to inspire your next unforgettable journey.
      </div>
    </div>

    {/* Heading block: right aligned */}
    <div style={{
      flex: "1 1 62vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      height: "100%",
      paddingLeft: "3vw",
      position: "relative"
    }}>
      <h1 style={{
        fontSize: "5vw",
        fontWeight: 700,
        margin: 0,
        lineHeight: 0.98,
        color: "#181818",
        letterSpacing: "-1px",
        textAlign: "left",
        wordBreak: "break-word"
      }}>
        Explore <span style={{ fontStyle: "italic" }}>Worlds</span>
        <br />
        Beyond Imagination
      </h1>
    </div>

    {/* Drag to Navigate */}
    <div style={{
      position: "absolute",
      right: "3vw",
      bottom: "3vw",
      fontFamily: baseFont,
      color: "#999",
      fontSize: ".75rem",
      fontWeight: 700,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      zIndex: 10
    }}>
      DRAG TO NAVIGATE
    </div>
  </section>
);

export default ExploreSection;
