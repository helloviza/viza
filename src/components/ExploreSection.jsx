// src/components/ExploreSection.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const ExploreSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section
      style={{
        width: "100vw",
        background: "#f6f6f6",
        fontFamily: baseFont,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        position: "relative",
        padding: "2.8vw 0",
        margin: 0,
        borderBottom: "5px solid #000",
        minHeight: 0,
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Info block */}
      <div
        style={{
          flex: "0 0 38vw",
          minWidth: "330px",
          maxWidth: "580px",
          display: "flex",
          alignItems: "center",
          // flip paddings for RTL
          paddingLeft: isRTL ? "1vw" : "3.8vw",
          paddingRight: isRTL ? "3.8vw" : "1vw",
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
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("explore.blurb")}
        </div>
      </div>

      {/* Heading block */}
      <div
        style={{
          flex: "1 1 62vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isRTL ? "flex-end" : "flex-start",
          height: "100%",
          // main side padding mirrored for RTL
          paddingLeft: isRTL ? 0 : "3vw",
          paddingRight: isRTL ? "3vw" : 0,
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
            textAlign: isRTL ? "right" : "left",
            wordBreak: "break-word",
          }}
        >
          {/* keep the italic word inline so Arabic can choose to style or not */}
          {t("explore.heading.before")}{" "}
          <span style={{ fontStyle: "italic" }}>{t("explore.heading.italic")}</span>
          <br />
          {t("explore.heading.after")}
        </h1>
      </div>

      {/* Drag to Navigate (mirrored in RTL) */}
      <div
        style={{
          position: "absolute",
          right: isRTL ? "auto" : "3vw",
          left: isRTL ? "3vw" : "auto",
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
        {t("explore.dragHint")}
      </div>
    </section>
  );
};

export default ExploreSection;
