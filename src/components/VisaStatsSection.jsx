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

const VisaStateSection = () => (
  <section style={styles.section}>
    <div style={styles.grid}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          style={{
            ...styles.card,
            background: stat.bg,
            color: stat.color,
            boxShadow:
              stat.bg === "#fff"
                ? "0 8px 32px 0 rgba(32,32,32,0.07)"
                : "0 8px 32px 0 rgba(32,32,32,0.09)",
          }}
        >
          <div style={styles.bigText}>{stat.big}</div>
          <div style={styles.headingText}>{stat.heading}</div>
          <div style={styles.subText}>
            {stat.sub.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const styles = {
  section: {
    width: "100vw",
    background: "transparent",
    fontFamily: baseFont,
    padding: "2rem 0 2.7rem 0",
    display: "flex",
    justifyContent: "center",
  },
  grid: {
    display: "flex",
    gap: "2.3rem",
    width: "90vw",
    maxWidth: 1250,
    justifyContent: "center",
  },
  card: {
    flex: 1,
    minWidth: 320,
    maxWidth: 440,
    borderRadius: "2rem",
    padding: "3.2rem 2.1rem 2.5rem 2.1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bigText: {
    fontSize: "3.1rem",
    fontWeight: 800,
    letterSpacing: "-.02em",
    textAlign: "center",
    lineHeight: 1,
    marginBottom: "0.1rem",
  },
  headingText: {
    fontSize: "1.6rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "0.45rem",
    letterSpacing: ".01em",
    lineHeight: 1.1,
  },
  subText: {
    fontSize: "1.25rem",
    fontWeight: 400,
    textAlign: "left",
    marginTop: "0.4rem",
    color: "inherit",
    width: "100%",
    maxWidth: 320,
    lineHeight: 1.21,
    letterSpacing: ".01em",
  },
};

export default VisaStateSection;
