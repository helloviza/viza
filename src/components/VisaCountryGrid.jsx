import React from "react";
import { useNavigate } from "react-router-dom"; // <-- Add at the top of VisaCountryGrid.jsx
const countries = [
  { img: "/images/uae.jpg", name: "UAE", price: "₹ Apply to see price" },
  { img: "/images/thailand.jpg", name: "Thailand", price: "₹ Apply to see price" },
  { img: "/images/malaysia.jpg", name: "Malaysia", price: "₹ Apply to see price" },
  { img: "/images/singapore.jpg", name: "Singapore", price: "₹ Apply to see price" },
  { img: "/images/argentina.jpg", name: "Argentina", price: "₹ Apply to see price" },
  { img: "/images/armenia.jpg", name: "Armenia", price: "₹ Apply to see price" },
  { img: "/images/azerbaijan.jpg", name: "Azerbaijan", price: "₹ Apply to see price" },
  { img: "/images/bahrain.jpg", name: "Bahrain", price: "₹ Apply to see price" },
  { img: "/images/benin.jpg", name: "Benin", price: "₹ Apply to see price" },
  { img: "/images/colombia.jpg", name: "Colombia", price: "₹ Apply to see price" },
  { img: "/images/cote_divoire.jpg", name: "Cote D' Ivoire", price: "₹ Apply to see price" },
  { img: "/images/djibouti.jpg", name: "Djibouti", price: "₹ Apply to see price" },
  { img: "/images/georgia.jpg", name: "Georgia", price: "₹ Apply to see price" },
  { img: "/images/kazakhstan.jpg", name: "Kazakhstan", price: "₹ Apply to see price" },
  { img: "/images/kyrgyzstan.jpg", name: "Kyrgyzstan Republic", price: "₹ Apply to see price" },
  { img: "/images/lesotho.jpg", name: "Lesotho", price: "₹ Apply to see price" },
  { img: "/images/moldova.jpg", name: "Moldova", price: "₹ Apply to see price" },
  { img: "/images/new_zealand.jpg", name: "New Zealand", price: "₹ Apply to see price" },
  { img: "/images/oman.jpg", name: "Oman", price: "₹ Apply to see price" },
  { img: "/images/papua_new_guinea.jpg", name: "Papua New Guinea", price: "₹ Apply to see price" },
  { img: "/images/russia.jpg", name: "Russian Federation", price: "₹ Apply to see price" },
  { img: "/images/south_korea.jpg", name: "South Korea", price: "₹ Apply to see price" },
  { img: "/images/taiwan.jpg", name: "Taiwan", price: "₹ Apply to see price" },
  { img: "/images/turkey.jpg", name: "Turkey", price: "₹ Apply to see price" },
  { img: "/images/uganda.jpg", name: "Uganda", price: "₹ Apply to see price" },
  { img: "/images/uzbekistan.jpg", name: "Uzbekistan", price: "₹ Apply to see price" },
  { img: "/images/zambia.jpg", name: "Zambia", price: "₹ Apply to see price" },
  { img: "/images/barbados.jpg", name: "Barbados", price: "₹ Apply to see price" },
  { img: "/images/bhutan.jpg", name: "Bhutan", price: "₹ Apply to see price" },
  { img: "/images/dominica.jpg", name: "Dominica", price: "₹ Apply to see price" },
  { img: "/images/grenada.jpg", name: "Grenada", price: "₹ Apply to see price" },
  { img: "/images/haiti.jpg", name: "Haiti", price: "₹ Apply to see price" },
  { img: "/images/hong_kong.jpg", name: "Hong Kong", price: "₹ Apply to see price" },
  { img: "/images/maldives.jpg", name: "Maldives", price: "₹ Apply to see price" },
  { img: "/images/mauritius.jpg", name: "Mauritius", price: "₹ Apply to see price" },
  { img: "/images/montserrat.jpg", name: "Montserrat", price: "₹ Apply to see price" },
  { img: "/images/nepal.jpg", name: "Nepal", price: "₹ Apply to see price" },
  { img: "/images/niue.jpg", name: "Niue Island", price: "₹ Apply to see price" },
  { img: "/images/saint_vincent.jpg", name: "Saint Vincent & the Grenadines", price: "₹ Apply to see price" },
  { img: "/images/samoa.jpg", name: "Samoa", price: "₹ Apply to see price" },
  { img: "/images/senegal.jpg", name: "Senegal", price: "₹ Apply to see price" },
  { img: "/images/serbia.jpg", name: "Serbia", price: "₹ Apply to see price" },
  { img: "/images/trinidad_tobago.jpg", name: "Trinidad & Tobago", price: "₹ Apply to see price" },
  { img: "/images/angola.jpg", name: "Angola", price: "₹ Apply to see price" },
  { img: "/images/bolivia.jpg", name: "Bolivia", price: "₹ Apply to see price" },
  { img: "/images/cabo_verde.jpg", name: "Cabo Verde", price: "₹ Apply to see price" },
  { img: "/images/cameroon.jpg", name: "Cameroon Union Republic", price: "₹ Apply to see price" },
  { img: "/images/cook_islands.jpg", name: "Cook Islands", price: "₹ Apply to see price" },
  { img: "/images/fiji.jpg", name: "Fiji", price: "₹ Apply to see price" },
  { img: "/images/guinea_bissau.jpg", name: "Guinea Bissau", price: "₹ Apply to see price" },
  { img: "/images/indonesia.jpg", name: "Indonesia", price: "₹ Apply to see price" },
  { img: "/images/iran.jpg", name: "Iran", price: "₹ Apply to see price" },
  { img: "/images/jamaica.jpg", name: "Jamaica", price: "₹ Apply to see price" },
  { img: "/images/jordan.jpg", name: "Jordan", price: "₹ Apply to see price" },
  { img: "/images/kiribati.jpg", name: "Kiribati", price: "₹ Apply to see price" },
  { img: "/images/laos.jpg", name: "Laos", price: "₹ Apply to see price" },
  { img: "/images/madagascar.jpg", name: "Madagascar", price: "₹ Apply to see price" },
  { img: "/images/mauritania.jpg", name: "Mauritania", price: "₹ Apply to see price" },
  { img: "/images/nigeria.jpg", name: "Nigeria", price: "₹ Apply to see price" },
  { img: "/images/qatar.jpg", name: "Qatar", price: "₹ Apply to see price" },
  { img: "/images/marshall_islands.jpg", name: "Republic of Marshall Islands", price: "₹ Apply to see price" },
  { img: "/images/reunion_island.jpg", name: "Reunion Island", price: "₹ Apply to see price" },
  { img: "/images/rwanda.jpg", name: "Rwanda", price: "₹ Apply to see price" },
  { img: "/images/seychelles.jpg", name: "Seychelles", price: "₹ Apply to see price" },
  { img: "/images/somalia.jpg", name: "Somalia", price: "₹ Apply to see price" },
  { img: "/images/tunisia.jpg", name: "Tunisia", price: "₹ Apply to see price" },
  { img: "/images/tuvalu.jpg", name: "Tuvalu", price: "₹ Apply to see price" },
  { img: "/images/vanuatu.jpg", name: "Vanuatu", price: "₹ Apply to see price" },
  { img: "/images/zimbabwe.jpg", name: "Zimbabwe", price: "₹ Apply to see price" },
  { img: "/images/kenya.jpg", name: "Kenya", price: "₹ Apply to see price" },
  { img: "/images/myanmar.jpg", name: "Myanmar", price: "₹ Apply to see price" },
  { img: "/images/saint_lucia.jpg", name: "Saint Lucia", price: "₹ Apply to see price" },
  { img: "/images/sri_lanka.jpg", name: "Sri Lanka", price: "₹ Apply to see price" },
  { img: "/images/suriname.jpg", name: "Suriname", price: "₹ Apply to see price" },
  { img: "/images/tajikistan.jpg", name: "Tajikistan", price: "₹ Apply to see price" },
  { img: "/images/tanzania.jpg", name: "Tanzania", price: "₹ Apply to see price" },
  { img: "/images/vietnam.jpg", name: "Vietnam", price: "₹ Apply to see price" },
  { img: "/images/ethiopia.jpg", name: "Ethiopia", price: "₹ Apply to see price" },
  { img: "/images/cambodia.jpg", name: "Cambodia", price: "₹ Apply to see price" },
];

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const CountryCard = React.memo(function CountryCard({ img, name, price, onApply }) {
  return (
    <div style={styles.card}>
      <img src={img} alt={name} style={styles.img} loading="lazy" />
      <div style={styles.cardContent}>
        <div style={styles.country}>{name}</div>
        <div style={styles.price}>{price}</div>
        <button onClick={() => onApply(name)} style={styles.applyBtn}>
          Apply Now
        </button>
      </div>
    </div>
  );
});

const VisaCountryGrid = () => {
  const navigate = useNavigate();

  function handleApply(country) {
    // ✅ Correct target path: /go/visa
    const params = new URLSearchParams({
      from: "IN",
      to: country,
      autostart: "1",
    });
    const nextUrl = `/go/visa?${params.toString()}`;

    try {
      const stored =
        localStorage.getItem("helloviza_user") ||
        localStorage.getItem("hv_user") ||
        sessionStorage.getItem("hv_user");

      if (!stored) {
        // Not logged in → redirect to login with next param
        const encodedNext = encodeURIComponent(nextUrl);
        navigate(`/login?next=${encodedNext}`);
      } else {
        // Logged in → go directly
        navigate(nextUrl);
      }
    } catch {
      navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Popular Visa Destinations</h2>
      <div style={styles.grid}>
        {countries.map((c, idx) => (
          <CountryCard
            key={c.name + idx}
            img={c.img}
            name={c.name}
            price={c.price}
            onApply={handleApply}
          />
        ))}
      </div>
    </section>
  );
};

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
    color: "#00477f",
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
  },
};

export default VisaCountryGrid;