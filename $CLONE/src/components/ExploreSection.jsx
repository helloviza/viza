import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const ExploreSection = () => (
  <section
    style={{
      width: "100vw",
      background: "#f6f6f6",
      fontFamily: baseFont,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end", // Hug content to the bottom, but not stretch to full viewport!
      position: "relative",
      padding: "2.8vw 0", // Top+bottom padding only
      margin: 0,
      borderBottom: "5px solid #000",
      minHeight: 0, // NOT 48vh
    }}
  >
    {/* Info block: left aligned */}
    <div
      style={{
        flex: "0 0 38vw",
        minWidth: "330px",
        maxWidth: "580px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "3.8vw",
        paddingRight: "1vw",
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 400,
          color: "#d06549",
          lineHeight: 1.14,
          letterSpacing: "0.01em",
        }}
      >
        Embark on a seamless journey to the world’s most exclusive destinations. From hidden valleys to pristine coastlines, our bespoke visa services unlock extraordinary escapes, crafted with elegance to inspire your next adventure.
      </div>
    </div>

    {/* Heading block: right aligned */}
    <div
      style={{
        flex: "1 1 62vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100%",
        paddingLeft: "3vw",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "4vw",
          fontWeight: 700,
          margin: 0,
          lineHeight: 0.98,
          color: "#00477f",
          letterSpacing: "-1px",
          textAlign: "left",
          wordBreak: "break-word",
        }}
      >
        Explore <span style={{ fontStyle: "italic" }}>Worlds</span>
        <br />
        Beyond Imagination
      </h1>
    </div>

    {/* Drag to Navigate */}
    <div
      style={{
        position: "absolute",
        right: "3vw",
        bottom: "3vw",
        fontFamily: baseFont,
        color: "#999",
        fontSize: ".75rem",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        zIndex: 10,
      }}
    >
      DRAG TO NAVIGATE
    </div>
  </section>
);

export default ExploreSection;
