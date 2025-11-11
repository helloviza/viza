// src/pages/Careers.jsx

import React from "react";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Replace with your own team/culture images or use Unsplash placeholders
const teamImg1 = "/images/team1.jpg";
const teamImg2 = "/images/team2.jpg";

const PERK_DEFS = [
  {
    icon: "🌏",
    titleKey: "careers.perks.remote.title",
    descKey: "careers.perks.remote.desc",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    titleKey: "careers.perks.family.title",
    descKey: "careers.perks.family.desc",
  },
  {
    icon: "💻",
    titleKey: "careers.perks.equipment.title",
    descKey: "careers.perks.equipment.desc",
  },
  {
    icon: "🌴",
    titleKey: "careers.perks.leave.title",
    descKey: "careers.perks.leave.desc",
  },
  {
    icon: "📈",
    titleKey: "careers.perks.growth.title",
    descKey: "careers.perks.growth.desc",
  },
  {
    icon: "🏆",
    titleKey: "careers.perks.pay.title",
    descKey: "careers.perks.pay.desc",
  },
  {
    icon: "🩺",
    titleKey: "careers.perks.health.title",
    descKey: "careers.perks.health.desc",
  },
  {
    icon: "🎉",
    titleKey: "careers.perks.offsites.title",
    descKey: "careers.perks.offsites.desc",
  },
];

const JOB_DEFS = [
  {
    titleKey: "careers.jobs.fullStack.title",
    locationKey: "careers.jobs.fullStack.location",
    link: "#",
  },
  {
    titleKey: "careers.jobs.customerSuccess.title",
    locationKey: "careers.jobs.customerSuccess.location",
    link: "#",
  },
  {
    titleKey: "careers.jobs.marketing.title",
    locationKey: "careers.jobs.marketing.location",
    link: "#",
  },
];

// Simple helper for responsive tweaks
function getWidth() {
  if (typeof window !== "undefined") return window.innerWidth;
  return 1200; // fallback desktop
}

export default function Careers() {
  const { t } = useTranslation();
  const w = getWidth();
  const mobile = w < 700;
  const tab = w < 1050;

  return (
    <div
      style={{
        fontFamily: baseFont,
        background: "linear-gradient(180deg,#f5f7fb 0%,#f7fafc 40%,#e6edf7 100%)",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        color: "#001b33",
      }}
    >
      {/* Safe padding for mobile header */}
      <div style={{ height: mobile ? 82 : 36 }} />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: mobile ? "24px 5vw 18px 5vw" : "110px 18px 28px 18px",
        }}
      >
        {/* HERO: PEOPLE + PURPOSE */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "minmax(0,1.5fr) minmax(0,1.2fr)",
            gap: mobile ? 22 : 34,
            alignItems: "center",
            marginBottom: mobile ? 40 : 64,
          }}
        >
          {/* Left: copy */}
          <div>
            <span
              style={{
                color: "#00976f",
                letterSpacing: "1.7px",
                fontWeight: 700,
                fontSize: mobile ? 12 : 13,
                textTransform: "uppercase",
                marginBottom: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#2ecc71",
                  boxShadow: "0 0 0 4px rgba(46,204,113,0.25)",
                }}
              />
              {t("careers.hero.badge", "CAREERS · TEAM HELLOVIZA")}
            </span>

            <h1
              style={{
                fontSize: mobile ? 28 : 44,
                fontWeight: 800,
                margin: "14px 0 10px 0",
                color: "#00477f",
                letterSpacing: "-0.05em",
                lineHeight: 1.08,
              }}
            >
              {t("careers.hero.titleLine1", "Build the visa layer")}
              <br />
              <span style={{ color: "#d06549" }}>
                {t("careers.hero.titleHighlight", "that travelers actually trust.")}
              </span>
            </h1>

            <p
              style={{
                fontSize: mobile ? 15 : 18,
                color: "#42526b",
                margin: "6px 0 0 0",
                maxWidth: 560,
                fontWeight: 400,
                lineHeight: 1.35,
              }}
            >
              {t(
                "careers.hero.subtitle",
                "At Helloviza, we blend travel operations, design, and technology to make visas feel clear, predictable, and human. If you love solving real-world problems for travelers, you’ll feel at home here."
              )}
            </p>

            {/* Chips / tags */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                fontSize: mobile ? 11 : 12,
              }}
            >
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,71,127,0.18)",
                  background: "#ffffff",
                  color: "#00477f",
                  fontWeight: 600,
                }}
              >
                {t("careers.hero.chips.visaLayer", "Visa-first travel layer")}
              </span>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(208,101,73,0.35)",
                  background: "rgba(208,101,73,0.06)",
                  color: "#c7583f",
                  fontWeight: 600,
                }}
              >
                {t("careers.hero.chips.remote", "Remote-friendly & flexible")}
              </span>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,151,111,0.3)",
                  background: "rgba(0,151,111,0.06)",
                  color: "#00976f",
                  fontWeight: 600,
                }}
              >
                {t("careers.hero.chips.builderMindset", "Builder mindset over titles")}
              </span>
            </div>
          </div>

          {/* Right: culture panel */}
          <div
            style={{
              borderRadius: mobile ? 18 : 26,
              background:
                "radial-gradient(circle at 0 0, rgba(208,101,73,0.1), transparent 55%), #03152a",
              border: "1px solid rgba(15,35,64,0.9)",
              padding: mobile ? 16 : 22,
              boxShadow: "0 20px 60px rgba(3,21,42,0.65)",
              color: "#f4f7ff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: mobile ? 10 : 11,
                color: "#7b8ba7",
                marginBottom: 8,
              }}
            >
              <span>{t("careers.hero.panel.labelLeft", "MODULE · Team Culture")}</span>
              <span style={{ color: "#59f3c3", fontWeight: 600 }}>
                {t("careers.hero.panel.labelRight", "LIVE")}
              </span>
            </div>

            <div
              style={{
                fontSize: mobile ? 12 : 13,
                letterSpacing: "1.6px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#9fb7ff",
                marginBottom: 6,
              }}
            >
              {t("careers.hero.panel.kicker", "What it feels like to work here")}
            </div>

            <h2
              style={{
                fontSize: mobile ? 17 : 20,
                fontWeight: 700,
                margin: "6px 0 6px",
              }}
            >
              {t(
                "careers.hero.panel.title",
                "A small, focused team shipping meaningful work."
              )}
            </h2>

            <p
              style={{
                fontSize: mobile ? 12 : 14,
                color: "#ccd5ff",
                margin: "4px 0 12px",
                lineHeight: 1.4,
              }}
            >
              {t(
                "careers.hero.panel.body",
                "You’ll work closely with founders, product, and operations to solve real traveler problems, with ownership over your craft and space to do the best work of your career."
              )}
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: mobile ? 11 : 12,
                color: "#a6b7dd",
              }}
            >
              <li style={{ marginBottom: 4 }}>• {t("careers.hero.panel.point1", "Lean, high-context team. Less bureaucracy, more building.")}</li>
              <li style={{ marginBottom: 4 }}>• {t("careers.hero.panel.point2", "Work that directly impacts real journeys, not vanity dashboards.")}</li>
              <li>• {t("careers.hero.panel.point3", "We default to trust, clarity, and kindness in how we work.")}</li>
            </ul>
          </div>
        </section>

        {/* PHOTOS / TEAM VIBES */}
        <section
          style={{
            display: "flex",
            gap: mobile ? 12 : 28,
            marginBottom: mobile ? 32 : 54,
            flexDirection: mobile ? "column" : "row",
            flexWrap: mobile ? "nowrap" : "wrap",
          }}
        >
          <img
            src={teamImg1}
            alt={t("careers.images.team1Alt", "Helloviza team collaborating")}
            style={{
              borderRadius: mobile ? 14 : 20,
              width: "100%",
              maxWidth: mobile ? "100%" : 520,
              minHeight: mobile ? 120 : 220,
              objectFit: "cover",
              boxShadow: "0 14px 48px rgba(0,71,127,0.35)",
              flex: 1,
            }}
          />
          <img
            src={teamImg2}
            alt={t("careers.images.team2Alt", "Helloviza team during an offsite")}
            style={{
              borderRadius: mobile ? 14 : 20,
              width: "100%",
              maxWidth: mobile ? "100%" : 520,
              minHeight: mobile ? 120 : 220,
              objectFit: "cover",
              boxShadow: "0 14px 48px rgba(208,101,73,0.35)",
              flex: 1,
            }}
          />
        </section>

        {/* PERKS GRID */}
        <section style={{ marginBottom: mobile ? 40 : 70 }}>
          <div
            style={{
              color: "#00477f",
              fontWeight: 700,
              letterSpacing: "1.6px",
              marginBottom: 10,
              textTransform: "uppercase",
              fontSize: mobile ? 13 : 14,
            }}
          >
            {t("careers.perks.label", "PERKS & BENEFITS")}
          </div>
          <h2
            style={{
              fontSize: mobile ? 22 : 30,
              fontWeight: 700,
              color: "#002c55",
              marginBottom: 12,
              lineHeight: 1.16,
            }}
          >
            {t("careers.perks.title", "Why build your career at Helloviza?")}
          </h2>
          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "#5b6783",
              marginBottom: mobile ? 18 : 22,
              maxWidth: 620,
              lineHeight: 1.35,
            }}
          >
            {t(
              "careers.perks.subtitle",
              "We’re small by design, generous with ownership, and intentional about how we work together — across cities, time zones, and roles."
            )}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile
                ? "1fr"
                : tab
                ? "1fr 1fr"
                : "repeat(auto-fit, minmax(210px, 1fr))",
              gap: mobile ? 18 : 26,
            }}
          >
            {PERK_DEFS.map((perk, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  marginBottom: 6,
                  padding: mobile ? "14px 12px" : "18px 16px",
                  borderRadius: 18,
                  background: "#ffffff",
                  boxShadow: "0 10px 34px rgba(0,71,127,0.08)",
                  border: "1px solid rgba(0,71,127,0.06)",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 8 }}>{perk.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: mobile ? 15 : 17,
                    color: "#00477f",
                    marginBottom: 4,
                  }}
                >
                  {t(perk.titleKey)}
                </div>
                <div
                  style={{
                    color: "#6a778e",
                    fontSize: mobile ? 13 : 14,
                    lineHeight: 1.35,
                  }}
                >
                  {t(perk.descKey)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JOB LISTINGS */}
        <section style={{ marginBottom: mobile ? 46 : 80 }}>
          <div
            style={{
              color: "#00477f",
              fontWeight: 700,
              letterSpacing: "1.6px",
              marginBottom: 10,
              textTransform: "uppercase",
              fontSize: mobile ? 13 : 14,
            }}
          >
            {t("careers.jobs.label", "OPEN ROLES")}
          </div>
          <h2
            style={{
              fontSize: mobile ? 20 : 28,
              fontWeight: 700,
              color: "#00477f",
              marginBottom: 10,
            }}
          >
            {t("careers.jobs.title", "Current openings")}
          </h2>
          <p
            style={{
              color: "#444",
              fontSize: mobile ? 13 : 16,
              marginBottom: 18,
              lineHeight: 1.35,
              maxWidth: 520,
            }}
          >
            {t(
              "careers.jobs.subtitle",
              "We’re always keen to meet thoughtful builders across product, engineering, design, and operations. Here are some of the roles we’re hiring for right now."
            )}
          </p>

          <div
            style={{
              borderRadius: 18,
              background: "#ffffff",
              border: "1px solid rgba(0,71,127,0.08)",
              boxShadow: "0 10px 30px rgba(0,71,127,0.06)",
              padding: mobile ? 14 : 18,
            }}
          >
            {JOB_DEFS.map((job, idx) => (
              <div
                key={idx}
                style={{
                  padding: mobile ? "10px 4px" : "12px 4px",
                  borderBottom:
                    idx === JOB_DEFS.length - 1
                      ? "none"
                      : "1px dashed rgba(0,71,127,0.12)",
                  display: "flex",
                  alignItems: mobile ? "flex-start" : "center",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <a
                    href={job.link}
                    style={{
                      color: "#00477f",
                      fontWeight: 700,
                      fontSize: mobile ? 15 : 17,
                      textDecoration: "none",
                    }}
                  >
                    {t(job.titleKey)}
                  </a>
                  <div
                    style={{
                      color: "#7b8294",
                      marginTop: 2,
                      fontSize: mobile ? 12 : 13,
                    }}
                  >
                    {t(job.locationKey)}
                  </div>
                </div>
                <a
                  href={job.link}
                  style={{
                    padding: mobile ? "6px 12px" : "7px 16px",
                    borderRadius: 999,
                    border: "1px solid #00477f",
                    background: "transparent",
                    color: "#00477f",
                    fontWeight: 700,
                    fontSize: mobile ? 11 : 12,
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {t("careers.jobs.viewRoleCta", "View role")}
                </a>
              </div>
            ))}

            <p
              style={{
                marginTop: 10,
                fontSize: mobile ? 11 : 12,
                color: "#7b8294",
              }}
            >
              {t(
                "careers.jobs.note",
                "Don’t see a perfect fit? Send us a note with your profile and what you’d like to work on."
              )}
            </p>
          </div>
        </section>

        {/* CTA BANNER */}
        <section
          style={{
            background:
              "linear-gradient(110deg, #d06549 0%, #e98f64 35%, #00477f 105%)",
            borderRadius: mobile ? 18 : 26,
            padding: mobile ? "18px 16px" : "26px 26px",
            boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
            color: "#fff",
            marginBottom: 30,
          }}
        >
          <h3
            style={{
              fontWeight: 800,
              fontSize: mobile ? 17 : 24,
              marginBottom: 10,
              lineHeight: 1.18,
            }}
          >
            {t(
              "careers.cta.title",
              "Help us make cross-border travel feel simple and honest."
            )}
          </h3>
          <p
            style={{
              fontSize: mobile ? 13 : 15,
              maxWidth: 600,
              marginBottom: 18,
              lineHeight: 1.35,
            }}
          >
            {t(
              "careers.cta.body",
              "If you’re excited by messy real-world problems, enjoy working closely with a small team, and care about travelers having calmer journeys, we’d love to hear from you."
            )}
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <a
              href="mailto:careers@helloviza.com"
              style={{
                padding: mobile ? "9px 16px" : "10px 24px",
                background: "#ffffff",
                color: "#00477f",
                fontWeight: 700,
                borderRadius: 999,
                fontSize: mobile ? 13 : 15,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(3,21,42,0.35)",
              }}
            >
              {t("careers.cta.primary", "Email your resume")}
            </a>
            <a
              href="/contact"
              style={{
                padding: mobile ? "8px 14px" : "9px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.7)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: mobile ? 12 : 14,
                textDecoration: "none",
              }}
            >
              {t("careers.cta.secondary", "Talk to the team")}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
