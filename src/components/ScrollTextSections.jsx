import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const ScrollTextSections = () => {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 650;

  // Responsive padding, font size, etc
  const sectionPad = isMobile ? "80px 10vw 34px 10vw" : "4rem 0";
  const headingSize = isMobile ? "2rem" : "3rem";
  const paraSize = isMobile ? "1.05rem" : "1.2rem";
  const minHeight = isMobile ? "56vh" : undefined;
  const contentMaxWidth = isMobile ? "98vw" : "800px";
  const textAlign = isMobile ? "center" : "left";

  return (
    <>
      {/* Section 2 */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          color: "#fff",
          zIndex: 2,
          position: "relative",
          width: "100vw",
          boxSizing: "border-box",
          padding: sectionPad,
          minHeight,
          textAlign,
          fontFamily: baseFont,
        }}
      >
        <div style={{ maxWidth: contentMaxWidth, margin: "0 auto" }}>
          <h2
            style={{
              fontWeight: 700,
              marginBottom: "1.5rem",
              fontSize: headingSize,
              lineHeight: 1.12,
              letterSpacing: "-1px",
              fontFamily: baseFont,
              textAlign:"Center",
            }}
          >
            Where the Sky<br />Meets the Earth
          </h2>
          <p
            style={{
              lineHeight: 1.56,
              opacity: 0.96,
              margin: 0,
              maxWidth: "98vw",
              fontSize: paraSize,
              fontFamily: baseFont,
              textAlign:"left",
            }}
          >
            Travel to places where nature’s beauty and human wonder come together in perfect harmony. Let your curiosity guide you to new heights, where unforgettable experiences and breathtaking destinations await.
          </p>
        </div>
      </section>
    </>
  );
};

export default ScrollTextSections;
