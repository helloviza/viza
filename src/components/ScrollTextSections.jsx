import React from "react";

const ScrollTextSections = () => {
  return (
    <>
      <section style={{ ...styles.section, ...styles.fadeIn }}>
        <div style={styles.content}>
          <h2 style={styles.heading}>A Window to<br />New Adventures</h2>
          <p style={styles.para}>
            The path to discovery is limitless, offering views of landscapes yet to be explored. Every journey starts with curiosity, and helloviza is here to turn that curiosity into unforgettable experiences.
          </p>
        </div>
      </section>

      <section style={{ ...styles.section, ...styles.fadeIn }}>
        <div style={styles.content}>
          <h2 style={styles.heading}>Where the Sky<br />Meets the Earth</h2>
          <p style={styles.para}>
            Travel to places where nature’s beauty and human wonder come together in perfect harmony. Let your curiosity guide you to new heights, where unforgettable experiences and breathtaking destinations await.
          </p>
        </div>
      </section>
    </>
  );
};

const styles = {
  section: {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "4rem",
  background: "transparent", // 🧊 transparent over fixed background
  color: "#ffffff",
  textAlign: "left",
  zIndex: 2,
  position: "relative",
},
  content: {
    maxWidth: "800px",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  para: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
    opacity: 0.9,
  },
  fadeIn: {
    animation: "fade-in 1s ease forwards",
    opacity: 0,
  },
};

export default ScrollTextSections;
