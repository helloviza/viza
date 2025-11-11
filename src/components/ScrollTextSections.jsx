// src/components/ScrollTextSection.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const ScrollTextSections = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 650;

  // Responsive padding, font size, etc
  const sectionPad = isMobile ? "80px 10vw 34px 10vw" : "4rem 0";
  const headingSize = isMobile ? "2rem" : "3rem";
  const paraSize = isMobile ? "1.05rem" : "1.2rem";
  const minHeight = isMobile ? "56vh" : undefined;
  const contentMaxWidth = isMobile ? "98vw" : "800px";
  const sectionTextAlign = isMobile ? "center" : "left";
  const paragraphAlign = isMobile ? "center" : (isRTL ? "right" : "left");

  // Memoize translated lines so we don't recompute every render
  const [titleL1, titleL2, body] = useMemo(
    () => [
      t("scroll.titleLine1"),
      t("scroll.titleLine2"),
      t("scroll.body"),
    ],
    [t]
  );

  return (
    <>
      {/* Section */}
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
          textAlign: sectionTextAlign,
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
              textAlign: "center", // keep hero heading centered on all sizes
            }}
          >
            {titleL1}<br />{titleL2}
          </h2>

          <p
            style={{
              lineHeight: 1.56,
              opacity: 0.96,
              margin: 0,
              maxWidth: "98vw",
              fontSize: paraSize,
              fontFamily: baseFont,
              textAlign: paragraphAlign,
            }}
          >
            {body}
          </p>
        </div>
      </section>
    </>
  );
};

export default ScrollTextSections;
