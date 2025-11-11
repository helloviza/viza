// src/components/VisaServiceSection.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

function useMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 850;
}

export default function VisaServicesSection() {
  const isMobile = useMobile();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  // Localized content
  const services = useMemo(
    () => [
      { number: 1, title: t("services.cards.0.title"), desc: t("services.cards.0.desc") },
      { number: 2, title: t("services.cards.1.title"), desc: t("services.cards.1.desc") },
      { number: 3, title: t("services.cards.2.title"), desc: t("services.cards.2.desc") },
      { number: 4, title: t("services.cards.3.title"), desc: t("services.cards.3.desc") },
    ],
    [t]
  );

  const whyTitle   = t("services.why.title");
  const whyLine1   = t("services.why.line1");
  const whySignoff = t("services.why.signoff");

  // --- Responsive style (unchanged essence)
  const wrapperStyle = isMobile
    ? {
        display: "flex",
        flexDirection: "column",
        background: "#f6f6f6",
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
        padding: "0 0 0 0",
        fontFamily: baseFont,
        alignItems: "stretch",
        minHeight: "auto",
      }
    : {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr) 1.1fr",
        gap: "0px",
        background: "#f6f6f6",
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
        padding: "0 0 0 0",
        minHeight: "340px",
        fontFamily: baseFont,
        alignItems: "stretch",
      };

  return (
    <section id="visa-services" style={wrapperStyle} dir={isRTL ? "rtl" : "ltr"}>
      {services.map((item, i) => (
        <div
          key={i}
          style={{
            padding: isMobile ? "2rem 6vw 1.3rem 6vw" : "2.5rem 2vw 2.5rem 2vw",
            borderRight:
              !isMobile && i < services.length - 1
                ? "1px solid #ddd"
                : "none",
            borderBottom:
              isMobile && i < services.length - 1
                ? "1px solid #eee"
                : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : (isRTL ? "flex-end" : "flex-start"),
            minWidth: 0,
            background: "#f6f6f6",
            textAlign: isMobile ? "center" : (isRTL ? "right" : "left"),
          }}
        >
          <div
            style={{
              width: isMobile ? 48 : 70,
              height: isMobile ? 48 : 70,
              borderRadius: "50%",
              background: "#00477f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "1.35rem" : "2.2rem",
              fontWeight: 600,
              marginBottom: isMobile ? "1.3rem" : "2.7rem",
              fontFamily: baseFont,
              marginTop: isMobile ? "0.05rem" : "0.2rem",
            }}
          >
            {item.number}
          </div>
          <div>
            <div
              style={{
                fontSize: isMobile ? "1.25rem" : "2.1rem",
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: isMobile ? "0.7rem" : "1.3rem",
                color: "#00477f",
                fontFamily: baseFont,
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: isMobile ? "0.97rem" : "1.2rem",
                color: "#d06549",
                fontWeight: 400,
                fontFamily: baseFont,
                lineHeight: 1.25,
                marginTop: isMobile ? "0.45rem" : "auto",
                marginBottom: isMobile ? "0.3rem" : 0,
                maxWidth: isMobile ? 300 : "unset",
              }}
            >
              {item.desc}
            </div>
          </div>
        </div>
      ))}

      {/* Why block */}
      <div
        style={{
          padding: isMobile ? "2rem 6vw 2rem 6vw" : "2.5rem 2vw",
          background: "#f6f6f6",
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : (isRTL ? "flex-end" : "flex-start"),
          justifyContent: "flex-start",
          borderTop: isMobile ? "1px solid #eee" : "none",
          textAlign: isMobile ? "center" : (isRTL ? "right" : "left"),
        }}
      >
        <div
          style={{
            fontFamily: baseFont,
            fontSize: isMobile ? "1.12rem" : "1.55rem",
            fontWeight: 700,
            marginBottom: isMobile ? "0.7rem" : "1.1rem",
            color: "#00477f",
          }}
        >
          {whyTitle}
        </div>
        <div
          style={{
            minHeight: isMobile ? "70px" : "120px",
            width: "100%",
            fontFamily: baseFont,
            fontSize: isMobile ? "0.97rem" : "1.13rem",
            color: "#d06549",
            background: "transparent",
            padding: 0,
            border: "none",
            margin: 0,
          }}
        >
          <p style={{ margin: 0 }}>
            {whyLine1}
            <br />
            <span style={{ color: "#aaa", fontSize: isMobile ? "0.85rem" : "1rem" }}>
              — {whySignoff}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
