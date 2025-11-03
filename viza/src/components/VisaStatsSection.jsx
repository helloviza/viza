import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const stats = [
  {
    bg: "#ffffff",
    color: "#1b1b1b",
    big: "99.2%",
    heading: "Visas On Time",
    sub: "Visa delivered before\ntravel date",
  },
  {
    bg: "#d06549",
    color: "#fff",
    big: "5L+",
    heading: "Processed",
    sub: "Processed for travelers worldwide",
  },
  {
    bg: "#00477f",
    color: "#fff",
    big: "4.81★",
    heading: "Rating",
    sub: "Industry’s highest rating for customer\nservice & reliability",
  },
];

const VisaStatusSection = () => {
  // Responsive: Use window width to tweak layout inline (optional, you could use CSS too)
  const isMobile = window.innerWidth <= 650;

  return (
    <section style={mystyle.section}>
      <div
        style={{
          ...mystyle.grid,
          ...(isMobile ? mystyle.gridMobile : {}),
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              ...mystyle.card,
              ...(isMobile ? mystyle.cardMobile : {}),
              background: stat.bg,
              color: stat.color,
              boxShadow:
                stat.bg === "#fff"
                  ? "0 8px 32px 0 rgba(32,32,32,0.07)"
                  : "0 8px 32px 0 rgba(32,32,32,0.09)",
            }}
          >
            <div style={mystyle.bigText}>{stat.big}</div>
            <div style={mystyle.headingText}>{stat.heading}</div>
            <div style={mystyle.subText}>
              {stat.sub.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const mystyle = {
  section: {
    width: "100vw",
    background: "transparent",
    fontFamily: baseFont,
    padding: "2.1rem 0 2.7rem 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    gap: "2.1rem",
    width: "92vw",
    maxWidth: 1150,
    justifyContent: "center",
    alignItems: "stretch",
  },
  gridMobile: {
    flexDirection: "column",
    gap: "1.1rem",
    width: "97vw",
    maxWidth: 420,
    alignItems: "center",
  },
  card: {
    flex: 1,
    minWidth: 270,
    maxWidth: 360,
    borderRadius: "1.5rem",
    padding: "2.3rem 1.3rem 1.8rem 1.3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    transition: "box-shadow .13s, transform .13s",
    textAlign: "center",
  },
  cardMobile: {
    minWidth: 0,
    maxWidth: 340,
    borderRadius: "1rem",
    padding: "1.1rem 0.9rem 1.2rem 0.9rem",
    margin: "0 auto",
  },
  bigText: {
    fontSize: "2.1rem",
    fontWeight: 800,
    letterSpacing: "-.01em",
    lineHeight: 1,
    marginBottom: "0.12rem",
    wordBreak: "break-word",
  },
  headingText: {
    fontSize: "1.18rem",
    fontWeight: 700,
    marginBottom: "0.3rem",
    letterSpacing: ".01em",
    lineHeight: 1.1,
    wordBreak: "break-word",
  },
  subText: {
    fontSize: "0.95rem",
    fontWeight: 400,
    marginTop: "0.25rem",
    color: "inherit",
    width: "100%",
    maxWidth: 320,
    lineHeight: 1.21,
    letterSpacing: ".01em",
    textAlign: "center",
    opacity: 0.93,
    wordBreak: "break-word",
  },
};

export default VisaStatusSection;
