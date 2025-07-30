import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const services = [
  {
    number: 1,
    title: "Tourist Visa",
    desc: "Experience seamless travel for holidays and tourism across the globe.",
  },
  {
    number: 2,
    title: "Business Visa",
    desc: "Accelerate your international business journeys with dedicated support.",
  },
  {
    number: 3,
    title: "Student Visa",
    desc: "Unlock global education opportunities with our expert visa guidance.",
  },
  {
    number: 4,
    title: "Family Visa",
    desc: "Bring your loved ones closer—smooth family visa processing for all destinations.",
  },
];

export default function VisaServicesSection() {
  return (
    <section id="visa-services" style={styles.wrapper}>
      {services.map((item, i) => (
        <div style={styles.col} key={i}>
          <div style={styles.circle}>{item.number}</div>
          <div>
            <div style={styles.title}>{item.title}</div>
            <div style={styles.desc}>{item.desc}</div>
          </div>
        </div>
      ))}
      <div style={styles.textAreaCol}>
        <div style={styles.textAreaTitle}>Why Choose Helloviza?</div>
        <div style={styles.textArea}>
          {/* Replace this with your own text */}
          <p>
            Your trusted partner for global visas. Fast, reliable, and always by your side.
            <br />
            <span style={{ color: "#aaa", fontSize: "1rem" }}>— Your custom text goes here</span>
          </p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
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
  },
  col: {
    padding: "2.5rem 2vw 2.5rem 2vw",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    minWidth: 0,
    background: "#f6f6f6",
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "#00477f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.2rem",
    fontWeight: 600,
    marginBottom: "2.7rem",
    fontFamily: baseFont,
    marginTop: "0.2rem",
  },
  title: {
    fontSize: "2.1rem",
    fontWeight: 600,
    lineHeight: 1.1,
    marginBottom: "1.3rem",
    color: "#00477f",
    fontFamily: baseFont,
  },
  desc: {
    fontSize: "1.2rem",
    color: "#d06549",
    fontWeight: 400,
    fontFamily: baseFont,
    lineHeight: 1.25,
    marginTop: "auto",
  },
  textAreaCol: {
    padding: "2.5rem 2vw",
    background: "#f6f6f6",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  textAreaTitle: {
    fontFamily: baseFont,
    fontSize: "1.55rem",
    fontWeight: 700,
    marginBottom: "1.1rem",
    color: "#111",
  },
  textArea: {
    minHeight: "120px",
    width: "100%",
    fontFamily: baseFont,
    fontSize: "1.13rem",
    color: "#222",
    background: "transparent",
    padding: 0,
    border: "none",
    margin: 0,
  },
};
