import React from "react";
import { Link } from "react-router-dom"; // <-- Add at the top of VisaCountryGrid.jsx
const countries = [
  { img: "/images/uae.jpg", name: "UAE", price: "₹4,999" },
  { img: "/images/thailand.jpg", name: "Thailand", price: "₹3,499" },
  { img: "/images/malaysia.jpg", name: "Malaysia", price: "₹2,999" },
  { img: "/images/singapore.jpg", name: "Singapore", price: "₹5,499" },
  { img: "/images/argentina.jpg", name: "Argentina", price: "₹X,XXX" },
  { img: "/images/armenia.jpg", name: "Armenia", price: "₹X,XXX" },
  { img: "/images/azerbaijan.jpg", name: "Azerbaijan", price: "₹X,XXX" },
  { img: "/images/bahrain.jpg", name: "Bahrain", price: "₹X,XXX" },
  { img: "/images/benin.jpg", name: "Benin", price: "₹X,XXX" },
  { img: "/images/colombia.jpg", name: "Colombia", price: "₹X,XXX" },
  { img: "/images/cote_divoire.jpg", name: "Cote D' Ivoire", price: "₹X,XXX" },
  { img: "/images/djibouti.jpg", name: "Djibouti", price: "₹X,XXX" },
  { img: "/images/georgia.jpg", name: "Georgia", price: "₹X,XXX" },
  { img: "/images/kazakhstan.jpg", name: "Kazakhstan", price: "₹X,XXX" },
  { img: "/images/kyrgyzstan.jpg", name: "Kyrgyzstan Republic", price: "₹X,XXX" },
  { img: "/images/lesotho.jpg", name: "Lesotho", price: "₹X,XXX" },
  { img: "/images/moldova.jpg", name: "Moldova", price: "₹X,XXX" },
  { img: "/images/new_zealand.jpg", name: "New Zealand", price: "₹X,XXX" },
  { img: "/images/oman.jpg", name: "Oman", price: "₹X,XXX" },
  { img: "/images/papua_new_guinea.jpg", name: "Papua New Guinea", price: "₹X,XXX" },
  { img: "/images/russia.jpg", name: "Russian Federation", price: "₹X,XXX" },
  { img: "/images/south_korea.jpg", name: "South Korea", price: "₹X,XXX" },
  { img: "/images/taiwan.jpg", name: "Taiwan", price: "₹X,XXX" },
  { img: "/images/turkey.jpg", name: "Turkey", price: "₹X,XXX" },
  { img: "/images/uganda.jpg", name: "Uganda", price: "₹X,XXX" },
  { img: "/images/uzbekistan.jpg", name: "Uzbekistan", price: "₹X,XXX" },
  { img: "/images/zambia.jpg", name: "Zambia", price: "₹X,XXX" },
  { img: "/images/barbados.jpg", name: "Barbados", price: "₹X,XXX" },
  { img: "/images/bhutan.jpg", name: "Bhutan", price: "₹X,XXX" },
  { img: "/images/dominica.jpg", name: "Dominica", price: "₹X,XXX" },
  { img: "/images/grenada.jpg", name: "Grenada", price: "₹X,XXX" },
  { img: "/images/haiti.jpg", name: "Haiti", price: "₹X,XXX" },
  { img: "/images/hong_kong.jpg", name: "Hong Kong", price: "₹X,XXX" },
  { img: "/images/maldives.jpg", name: "Maldives", price: "₹X,XXX" },
  { img: "/images/mauritius.jpg", name: "Mauritius", price: "₹X,XXX" },
  { img: "/images/montserrat.jpg", name: "Montserrat", price: "₹X,XXX" },
  { img: "/images/nepal.jpg", name: "Nepal", price: "₹X,XXX" },
  { img: "/images/niue.jpg", name: "Niue Island", price: "₹X,XXX" },
  { img: "/images/saint_vincent.jpg", name: "Saint Vincent & the Grenadines", price: "₹X,XXX" },
  { img: "/images/samoa.jpg", name: "Samoa", price: "₹X,XXX" },
  { img: "/images/senegal.jpg", name: "Senegal", price: "₹X,XXX" },
  { img: "/images/serbia.jpg", name: "Serbia", price: "₹X,XXX" },
  { img: "/images/trinidad_tobago.jpg", name: "Trinidad & Tobago", price: "₹X,XXX" },
  { img: "/images/angola.jpg", name: "Angola", price: "₹X,XXX" },
  { img: "/images/bolivia.jpg", name: "Bolivia", price: "₹X,XXX" },
  { img: "/images/cabo_verde.jpg", name: "Cabo Verde", price: "₹X,XXX" },
  { img: "/images/cameroon.jpg", name: "Cameroon Union Republic", price: "₹X,XXX" },
  { img: "/images/cook_islands.jpg", name: "Cook Islands", price: "₹X,XXX" },
  { img: "/images/fiji.jpg", name: "Fiji", price: "₹X,XXX" },
  { img: "/images/guinea_bissau.jpg", name: "Guinea Bissau", price: "₹X,XXX" },
  { img: "/images/indonesia.jpg", name: "Indonesia", price: "₹X,XXX" },
  { img: "/images/iran.jpg", name: "Iran", price: "₹X,XXX" },
  { img: "/images/jamaica.jpg", name: "Jamaica", price: "₹X,XXX" },
  { img: "/images/jordan.jpg", name: "Jordan", price: "₹X,XXX" },
  { img: "/images/kiribati.jpg", name: "Kiribati", price: "₹X,XXX" },
  { img: "/images/laos.jpg", name: "Laos", price: "₹X,XXX" },
  { img: "/images/madagascar.jpg", name: "Madagascar", price: "₹X,XXX" },
  { img: "/images/mauritania.jpg", name: "Mauritania", price: "₹X,XXX" },
  { img: "/images/nigeria.jpg", name: "Nigeria", price: "₹X,XXX" },
  { img: "/images/qatar.jpg", name: "Qatar", price: "₹X,XXX" },
  { img: "/images/marshall_islands.jpg", name: "Republic of Marshall Islands", price: "₹X,XXX" },
  { img: "/images/reunion_island.jpg", name: "Reunion Island", price: "₹X,XXX" },
  { img: "/images/rwanda.jpg", name: "Rwanda", price: "₹X,XXX" },
  { img: "/images/seychelles.jpg", name: "Seychelles", price: "₹X,XXX" },
  { img: "/images/somalia.jpg", name: "Somalia", price: "₹X,XXX" },
  { img: "/images/tunisia.jpg", name: "Tunisia", price: "₹X,XXX" },
  { img: "/images/tuvalu.jpg", name: "Tuvalu", price: "₹X,XXX" },
  { img: "/images/vanuatu.jpg", name: "Vanuatu", price: "₹X,XXX" },
  { img: "/images/zimbabwe.jpg", name: "Zimbabwe", price: "₹X,XXX" },
  { img: "/images/kenya.jpg", name: "Kenya", price: "₹X,XXX" },
  { img: "/images/myanmar.jpg", name: "Myanmar", price: "₹X,XXX" },
  { img: "/images/saint_lucia.jpg", name: "Saint Lucia", price: "₹X,XXX" },
  { img: "/images/sri_lanka.jpg", name: "Sri Lanka", price: "₹X,XXX" },
  { img: "/images/suriname.jpg", name: "Suriname", price: "₹X,XXX" },
  { img: "/images/tajikistan.jpg", name: "Tajikistan", price: "₹X,XXX" },
  { img: "/images/tanzania.jpg", name: "Tanzania", price: "₹X,XXX" },
  { img: "/images/vietnam.jpg", name: "Vietnam", price: "₹X,XXX" },
  { img: "/images/ethiopia.jpg", name: "Ethiopia", price: "₹X,XXX" },
  { img: "/images/cambodia.jpg", name: "Cambodia", price: "₹X,XXX" },
];

// Memoized Card Component (prevents unnecessary re-renders)
const CountryCard = React.memo(function CountryCard({ img, name, price }) {
  return (
    <div style={styles.card}>
      <img src={img} alt={name} style={styles.img} loading="lazy" />
      <div style={styles.cardContent}>
        <div style={styles.country}>{name}</div>
        <div style={styles.price}>{price}</div>
        <a href="/go-for-visa" style={styles.applyBtn}>Apply Now</a>
      </div>
    </div>
  );
});

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const VisaCountryGrid = () => (
  <section style={styles.section}>
    <h2 style={styles.title}>Popular Visa Destinations</h2>
    <div style={styles.grid}>
      {countries.map((c, idx) => (
        <CountryCard key={c.name + idx} img={c.img} name={c.name} price={c.price} />
      ))}
    </div>
  </section>
);

const styles = {
  section: {
    width: "100vw",
    padding: "3rem 0 1.5rem 0",
    background: "#fff",
    fontFamily: baseFont,
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "2rem",
    letterSpacing: ".01em",
    color: "#00477f", // example: dark text color
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "2.3rem",
    width: "90vw",
    maxWidth: 1150,
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "0px",
    boxShadow: "0 2px 24px 0 rgba(64,64,64,0.11)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    transition: "transform .19s",
    minHeight: 300,
  },
  img: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: "0px 0px 0 0",
  },
  cardContent: {
    padding: "1.3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  country: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "0.3rem",
    color: "#1b1b1b",
    letterSpacing: ".01em",
  },
  price: {
    fontSize: "1.1rem",
    color: "#d06549",
    fontWeight: 600,
    marginBottom: "1.1rem",
  },
  applyBtn: {
    background: "#00477f",
    color: "#ffffff",
    padding: "0.9rem 2.3rem",
    border: "none",
    borderRadius: "0px",
    fontFamily: baseFont,
    fontWeight: 600,
    fontSize: "1.1rem",
    letterSpacing: ".01em",
    textDecoration: "none",
    cursor: "pointer",
    marginTop: "auto",
    transition: "background .15s",
    display: "inline-block",
  },
};

export default VisaCountryGrid;
