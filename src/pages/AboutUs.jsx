// src/pages/AboutUs.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Upload your images/animations (GIF, SVG, PNG, etc.) to /public/uploads/
const handImg = "/uploads/your_hand_animation.gif";
const globeImg = "/uploads/your_globe_animation.gif";
const circleImg = "/uploads/your_circle_animation.gif";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Responsive padding for header safety
const headerSafePadding = {
  height:
    typeof window !== "undefined" && window.innerWidth < 700 ? 82 : 32,
};

export default function AboutUs() {
  const { t } = useTranslation();

  const hasWindow = typeof window !== "undefined";
  const w = hasWindow ? window.innerWidth : 1200;

  const lt540 = w < 540;
  const lt700 = w < 700;
  const lt900 = w < 900;

  // Small helper for "module" header bar, PlumTrips-style flavour
  const ModuleHeader = ({ left, right }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: lt540 ? 10 : 11,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: "#66758f",
        marginBottom: 12,
      }}
    >
      <span>{left}</span>
      <span style={{ color: "#d06549" }}>{right}</span>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: baseFont,
        background: "#f4f6fb",
        color: "#181a1b",
        minHeight: "100vh",
      }}
    >
      {/* top safe space for header */}
      <div style={headerSafePadding} />

      {/* === HERO · VISA EXPERIENCE LAYER === */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: lt700 ? "32px 18px 40px" : "56px 24px 60px",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            display: "flex",
            flexDirection: lt900 ? "column" : "row",
            gap: lt700 ? 26 : 40,
            alignItems: "center",
          }}
        >
          {/* Left: copy */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid rgba(0,71,127,0.25)",
                background: "rgba(255,255,255,0.9)",
                fontSize: lt540 ? 10 : 11,
                textTransform: "uppercase",
                letterSpacing: 1.4,
                color: "#00477f",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "999px",
                  background:
                    "radial-gradient(circle, #2ecc71 0%, #2ecc71 40%, transparent 70%)",
                }}
              />
              {t("about.hero.badge")}
            </div>

            <h1
              style={{
                marginTop: 14,
                marginBottom: 10,
                fontSize: lt540 ? 22 : 34,
                lineHeight: 1.15,
                fontWeight: 700,
                color: "#031631",
              }}
            >
              {t("about.hero.titleLine1")}{" "}
              <span style={{ color: "#d06549" }}>
                {t("about.hero.titleHighlight")}
              </span>{" "}
              {t("about.hero.titleLine2")}
            </h1>

            <p
              style={{
                marginTop: 10,
                maxWidth: 520,
                fontSize: lt540 ? 13 : 15,
                lineHeight: 1.55,
                color: "#4d5b74",
              }}
            >
              {t("about.hero.subtitle")}
            </p>

            {/* chips */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                fontSize: lt540 ? 10 : 11,
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 12px",
                  border: "1px solid rgba(0,71,127,0.25)",
                  background: "rgba(255,255,255,0.85)",
                  color: "#00477f",
                  fontWeight: 500,
                }}
              >
                {t("about.hero.chips.visaOs")}
              </span>
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 12px",
                  border: "1px solid rgba(208,101,73,0.26)",
                  background: "rgba(208,101,73,0.06)",
                  color: "#d06549",
                  fontWeight: 500,
                }}
              >
                {t("about.hero.chips.humanExperts")}
              </span>
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 12px",
                  border: "1px solid rgba(3,22,49,0.12)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#37445a",
                  fontWeight: 500,
                }}
              >
                {t("about.hero.chips.travelConfidence")}
              </span>
            </div>
          </div>

          {/* Right: “Visa panel” with hand image */}
          <div
            style={{
              flex: 1,
              minWidth: lt900 ? "100%" : 360,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                borderRadius: 24,
                padding: lt540 ? 16 : 20,
                background:
                  "linear-gradient(145deg, #ffffff, #f1f4fb, #e6edf9)",
                boxShadow:
                  "0 18px 55px rgba(0,71,127,0.16), 0 0 0 1px rgba(255,255,255,0.8)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "#66758f",
                  marginBottom: 6,
                }}
              >
                <span>{t("about.hero.panel.labelLeft")}</span>
                <span style={{ color: "#2ecc71", fontWeight: 600 }}>
                  {t("about.hero.panel.labelRight")}
                </span>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#061a34",
                  position: "relative",
                  padding: 14,
                  minHeight: 140,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    color: "#ecf4ff",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "#a6c9ff",
                      marginBottom: 4,
                    }}
                  >
                    {t("about.hero.panel.title")}
                  </div>
                  <p style={{ margin: 0 }}>
                    {t("about.hero.panel.body")}
                  </p>
                </div>

                <div
                  style={{
                    width: lt540 ? 80 : 110,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={handImg}
                    alt={t("about.images.handAlt")}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                      opacity: 0.98,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                  gap: 8,
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                <MetricChip
                  big={t("about.hero.metrics.onTime.big")}
                  label={t("about.hero.metrics.onTime.label")}
                />
                <MetricChip
                  big={t("about.hero.metrics.travelers.big")}
                  label={t("about.hero.metrics.travelers.label")}
                />
                <MetricChip
                  big={t("about.hero.metrics.countries.big")}
                  label={t("about.hero.metrics.countries.label")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === VISION / MISSION MODULE === */}
      <section
        style={{
          borderTop: "1px solid #dde5f2",
          background: "#ffffff",
          padding: lt700 ? "26px 18px 36px" : "40px 24px 48px",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <ModuleHeader
            left={t("about.visionMission.moduleLabelLeft")}
            right={t("about.visionMission.moduleLabelRight")}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: lt700 ? "1fr" : "1fr 1fr",
              gap: 20,
            }}
          >
            {/* Vision */}
            <div
              style={{
                borderRadius: 20,
                padding: lt540 ? 16 : 22,
                background: "linear-gradient(135deg,#f8fafc,#edf3ff)",
                border: "1px solid #dde5f2",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  color: "#66758f",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "999px",
                    background:
                      "radial-gradient(circle,#2ecc71 0%,#2ecc71 40%,transparent 70%)",
                  }}
                />
                {t("about.vision.titleTag")}
              </div>
              <h2
                style={{
                  margin: "8px 0 4px",
                  fontSize: lt540 ? 16 : 19,
                  fontWeight: 600,
                  color: "#031631",
                }}
              >
                {t("about.vision.title")}
              </h2>
              <p
                style={{
                  fontSize: lt540 ? 13 : 14,
                  lineHeight: 1.6,
                  color: "#4d5b74",
                }}
              >
                {t("about.vision.body1")}
              </p>
              <p
                style={{
                  marginTop: 8,
                  fontSize: lt540 ? 11 : 12,
                  lineHeight: 1.5,
                  color: "#7a89a4",
                }}
              >
                {t("about.vision.body2")}
              </p>
            </div>

            {/* Mission */}
            <div
              style={{
                borderRadius: 20,
                padding: lt540 ? 16 : 22,
                background: "linear-gradient(135deg,#fdf7f4,#ffe9e0)",
                border: "1px solid rgba(208,101,73,0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  color: "#7a4b3b",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "999px",
                    background:
                      "radial-gradient(circle,#d06549 0%,#d06549 40%,transparent 70%)",
                  }}
                />
                {t("about.mission.titleTag")}
              </div>
              <h2
                style={{
                  margin: "8px 0 4px",
                  fontSize: lt540 ? 16 : 19,
                  fontWeight: 600,
                  color: "#4b260f",
                }}
              >
                {t("about.mission.title")}
              </h2>
              <p
                style={{
                  fontSize: lt540 ? 13 : 14,
                  lineHeight: 1.6,
                  color: "#5b3a2b",
                }}
              >
                {t("about.mission.body1")}
              </p>
              <p
                style={{
                  marginTop: 8,
                  fontSize: lt540 ? 11 : 12,
                  lineHeight: 1.5,
                  color: "#8a5f4e",
                }}
              >
                {t("about.mission.body2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === ORIGIN STORY + HOW WE HELP === */}
      <section
        style={{
          background: "#f7f9ff",
          padding: lt700 ? "28px 18px 40px" : "40px 24px 52px",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <ModuleHeader
            left={t("about.origin.moduleLabelLeft")}
            right={t("about.origin.moduleLabelRight")}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: lt700 ? "1fr" : "1.3fr 1.4fr",
              gap: 28,
              alignItems: "flex-start",
            }}
          >
            {/* Origin story */}
            <div>
              <h2
                style={{
                  fontSize: lt540 ? 17 : 20,
                  fontWeight: 600,
                  color: "#031631",
                  marginBottom: 10,
                }}
              >
                {t("about.origin.title")}
              </h2>
              <p
                style={{
                  fontSize: lt540 ? 13 : 14,
                  color: "#4d5b74",
                  lineHeight: 1.6,
                }}
              >
                {t("about.origin.body1")}
              </p>
              <ul
                style={{
                  marginTop: 10,
                  paddingLeft: 18,
                  fontSize: lt540 ? 12 : 13,
                  color: "#5a6a86",
                  lineHeight: 1.55,
                }}
              >
                <li>{t("about.origin.bullets.0")}</li>
                <li>{t("about.origin.bullets.1")}</li>
                <li>{t("about.origin.bullets.2")}</li>
                <li>{t("about.origin.bullets.3")}</li>
              </ul>
              <p
                style={{
                  marginTop: 10,
                  fontSize: lt540 ? 13 : 14,
                  color: "#4d5b74",
                  lineHeight: 1.6,
                }}
              >
                {t("about.origin.body2")}
              </p>
            </div>

            {/* How Helloviza helps – cards */}
            <div
              style={{
                borderRadius: 22,
                padding: lt540 ? 16 : 20,
                background:
                  "linear-gradient(135deg,#ffffff,#f1f4ff 55%,#e5f4ff)",
                border: "1px solid #dde5f2",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1.3,
                  color: "#66758f",
                  marginBottom: 10,
                }}
              >
                {t("about.howWeHelp.kicker")}
              </div>
              <p
                style={{
                  fontSize: lt540 ? 13 : 14,
                  color: "#4d5b74",
                  marginBottom: 14,
                }}
              >
                {t("about.howWeHelp.body")}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: lt700 ? "1fr" : "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    key: "guidedVisa",
                    icon: "🧭",
                  },
                  {
                    key: "documentLayer",
                    icon: "📁",
                  },
                  {
                    key: "statusClarity",
                    icon: "🔔",
                  },
                  {
                    key: "globalAssist",
                    icon: "🌍",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      borderRadius: 16,
                      padding: 12,
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(0,71,127,0.08)",
                      boxShadow:
                        "0 8px 20px rgba(3,22,49,0.03)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#031631",
                      }}
                    >
                      {t(`about.howWeHelp.cards.${item.key}.title`)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        color: "#5a6a86",
                        lineHeight: 1.5,
                      }}
                    >
                      {t(`about.howWeHelp.cards.${item.key}.body`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === GLOBAL FOOTPRINT / GLOBE SECTION === */}
      <section
        style={{
          background: "#ffffff",
          padding: lt700 ? "30px 18px 40px" : "44px 24px 52px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <ModuleHeader
            left={t("about.global.moduleLabelLeft")}
            right={t("about.global.moduleLabelRight")}
          />

          <img
            src={globeImg}
            alt={t("about.images.globeAlt")}
            style={{
              width: lt700 ? 220 : 320,
              maxWidth: "95vw",
              marginBottom: 16,
            }}
          />

          <h2
            style={{
              fontSize: lt540 ? 16 : 20,
              fontWeight: 600,
              color: "#031631",
            }}
          >
            {t("about.global.title")}
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: lt540 ? 12 : 14,
              color: "#4d5b74",
              lineHeight: 1.6,
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t("about.global.body")}
          </p>
        </div>
      </section>

      {/* === PRINCIPLES / GUARDRAILS === */}
      <section
        style={{
          borderTop: "1px solid #dde5f2",
          background: "#f4f6fb",
          padding: lt700 ? "30px 18px 42px" : "42px 24px 54px",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <ModuleHeader
            left={t("about.principles.moduleLabelLeft")}
            right={t("about.principles.moduleLabelRight")}
          />

          <h2
            style={{
              fontSize: lt540 ? 17 : 20,
              fontWeight: 600,
              color: "#031631",
              marginBottom: 6,
            }}
          >
            {t("about.principles.title")}
          </h2>
          <p
            style={{
              maxWidth: 620,
              fontSize: lt540 ? 12 : 14,
              color: "#4d5b74",
              lineHeight: 1.6,
              marginBottom: 18,
            }}
          >
            {t("about.principles.body")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: lt700 ? "1fr" : "repeat(3,minmax(0,1fr))",
              gap: 14,
            }}
          >
            {[
              "clarityFirst",
              "humanInLoop",
              "respectTimeMoney",
              "honestExpectations",
              "inclusiveSupport",
              "longTermView",
            ].map((key) => (
              <div
                key={key}
                style={{
                  borderRadius: 18,
                  padding: lt540 ? 12 : 14,
                  background: "#ffffff",
                  border: "1px solid rgba(0,71,127,0.08)",
                  boxShadow:
                    "0 10px 26px rgba(3,22,49,0.04)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#031631",
                    marginBottom: 4,
                  }}
                >
                  {t(`about.principles.items.${key}.title`)}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#5a6a86",
                    lineHeight: 1.5,
                  }}
                >
                  {t(`about.principles.items.${key}.body`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA + CIRCLE IMAGE === */}
      <section
        style={{
          background: "#ffffff",
          padding: lt700 ? "36px 18px 46px" : "44px 24px 60px",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <img
            src={circleImg}
            alt={t("about.images.circleAlt")}
            style={{
              width: lt700 ? 220 : 320,
              maxWidth: "95vw",
              marginBottom: 20,
            }}
          />
          <h2
            style={{
              fontSize: lt540 ? 17 : 22,
              fontWeight: 700,
              color: "#003366",
              marginBottom: 8,
            }}
          >
            {t("about.cta.title")}
          </h2>
          <p
            style={{
              fontSize: lt540 ? 12 : 14,
              color: "#4d5b74",
              maxWidth: 520,
              margin: "0 auto 20px",
              lineHeight: 1.6,
            }}
          >
            {t("about.cta.body")}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <Link to="/go-for-visa" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: lt540 ? "8px 18px" : "12px 30px",
                  background: "#003366",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 999,
                  fontSize: lt540 ? 12 : 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,51,102,0.25)",
                }}
              >
                {t("common.buttons.reserveVisa")}
              </button>
            </Link>

            <Link to="/contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: lt540 ? "8px 18px" : "12px 26px",
                  background: "#ffffff",
                  color: "#003366",
                  fontWeight: 600,
                  borderRadius: 999,
                  fontSize: lt540 ? 12 : 13,
                  border: "1px solid rgba(0,51,102,0.28)",
                  cursor: "pointer",
                }}
              >
                {t("common.buttons.contactSupport")}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Small metric chip used in hero panel */
function MetricChip({ big, label }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: 8,
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(0,71,127,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#003366",
        }}
      >
        {big}
      </div>
      <div
        style={{
          fontSize: 10,
          marginTop: 2,
          color: "#66758f",
        }}
      >
        {label}
      </div>
    </div>
  );
}
