import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

/**
 * NOTE:
 *  - `key`: i18n key under "countries.<key>"
 *  - `defaultName`: stable English name used for URLs/back-end
 *  - `img`: path as before
 *  - price label is translated via t('visaCountryGrid.applyToSeePrice', { defaultValue: '₹ Apply to see price' })
 */
const countries = [
  { img: "/images/uae.jpg", key: "UAE", defaultName: "UAE" },
  { img: "/images/thailand.jpg", key: "Thailand", defaultName: "Thailand" },
  { img: "/images/malaysia.jpg", key: "Malaysia", defaultName: "Malaysia" },
  { img: "/images/singapore.jpg", key: "Singapore", defaultName: "Singapore" },
  { img: "/images/argentina.jpg", key: "Argentina", defaultName: "Argentina" },
  { img: "/images/armenia.jpg", key: "Armenia", defaultName: "Armenia" },
  { img: "/images/azerbaijan.jpg", key: "Azerbaijan", defaultName: "Azerbaijan" },
  { img: "/images/bahrain.jpg", key: "Bahrain", defaultName: "Bahrain" },
  { img: "/images/benin.jpg", key: "Benin", defaultName: "Benin" },
  { img: "/images/colombia.jpg", key: "Colombia", defaultName: "Colombia" },
  { img: "/images/cote_divoire.jpg", key: "CoteDIvoire", defaultName: "Cote D' Ivoire" },
  { img: "/images/djibouti.jpg", key: "Djibouti", defaultName: "Djibouti" },
  { img: "/images/georgia.jpg", key: "Georgia", defaultName: "Georgia" },
  { img: "/images/kazakhstan.jpg", key: "Kazakhstan", defaultName: "Kazakhstan" },
  { img: "/images/kyrgyzstan.jpg", key: "KyrgyzstanRepublic", defaultName: "Kyrgyzstan Republic" },
  { img: "/images/lesotho.jpg", key: "Lesotho", defaultName: "Lesotho" },
  { img: "/images/moldova.jpg", key: "Moldova", defaultName: "Moldova" },
  { img: "/images/new_zealand.jpg", key: "NewZealand", defaultName: "New Zealand" },
  { img: "/images/oman.jpg", key: "Oman", defaultName: "Oman" },
  { img: "/images/papua_new_guinea.jpg", key: "PapuaNewGuinea", defaultName: "Papua New Guinea" },
  { img: "/images/russia.jpg", key: "RussianFederation", defaultName: "Russian Federation" },
  { img: "/images/south_korea.jpg", key: "SouthKorea", defaultName: "South Korea" },
  { img: "/images/taiwan.jpg", key: "Taiwan", defaultName: "Taiwan" },
  { img: "/images/turkey.jpg", key: "Turkey", defaultName: "Turkey" },
  { img: "/images/uganda.jpg", key: "Uganda", defaultName: "Uganda" },
  { img: "/images/uzbekistan.jpg", key: "Uzbekistan", defaultName: "Uzbekistan" },
  { img: "/images/zambia.jpg", key: "Zambia", defaultName: "Zambia" },
  { img: "/images/barbados.jpg", key: "Barbados", defaultName: "Barbados" },
  { img: "/images/bhutan.jpg", key: "Bhutan", defaultName: "Bhutan" },
  { img: "/images/dominica.jpg", key: "Dominica", defaultName: "Dominica" },
  { img: "/images/grenada.jpg", key: "Grenada", defaultName: "Grenada" },
  { img: "/images/haiti.jpg", key: "Haiti", defaultName: "Haiti" },
  { img: "/images/hong_kong.jpg", key: "HongKong", defaultName: "Hong Kong" },
  { img: "/images/maldives.jpg", key: "Maldives", defaultName: "Maldives" },
  { img: "/images/mauritius.jpg", key: "Mauritius", defaultName: "Mauritius" },
  { img: "/images/montserrat.jpg", key: "Montserrat", defaultName: "Montserrat" },
  { img: "/images/nepal.jpg", key: "Nepal", defaultName: "Nepal" },
  { img: "/images/niue.jpg", key: "NiueIsland", defaultName: "Niue Island" },
  { img: "/images/saint_vincent.jpg", key: "SaintVincentGrenadines", defaultName: "Saint Vincent & the Grenadines" },
  { img: "/images/samoa.jpg", key: "Samoa", defaultName: "Samoa" },
  { img: "/images/senegal.jpg", key: "Senegal", defaultName: "Senegal" },
  { img: "/images/serbia.jpg", key: "Serbia", defaultName: "Serbia" },
  { img: "/images/trinidad_tobago.jpg", key: "TrinidadTobago", defaultName: "Trinidad & Tobago" },
  { img: "/images/angola.jpg", key: "Angola", defaultName: "Angola" },
  { img: "/images/bolivia.jpg", key: "Bolivia", defaultName: "Bolivia" },
  { img: "/images/cabo_verde.jpg", key: "CaboVerde", defaultName: "Cabo Verde" },
  { img: "/images/cameroon.jpg", key: "CameroonUnionRepublic", defaultName: "Cameroon Union Republic" },
  { img: "/images/cook_islands.jpg", key: "CookIslands", defaultName: "Cook Islands" },
  { img: "/images/fiji.jpg", key: "Fiji", defaultName: "Fiji" },
  { img: "/images/guinea_bissau.jpg", key: "GuineaBissau", defaultName: "Guinea Bissau" },
  { img: "/images/indonesia.jpg", key: "Indonesia", defaultName: "Indonesia" },
  { img: "/images/iran.jpg", key: "Iran", defaultName: "Iran" },
  { img: "/images/jamaica.jpg", key: "Jamaica", defaultName: "Jamaica" },
  { img: "/images/jordan.jpg", key: "Jordan", defaultName: "Jordan" },
  { img: "/images/kiribati.jpg", key: "Kiribati", defaultName: "Kiribati" },
  { img: "/images/laos.jpg", key: "Laos", defaultName: "Laos" },
  { img: "/images/madagascar.jpg", key: "Madagascar", defaultName: "Madagascar" },
  { img: "/images/mauritania.jpg", key: "Mauritania", defaultName: "Mauritania" },
  { img: "/images/nigeria.jpg", key: "Nigeria", defaultName: "Nigeria" },
  { img: "/images/qatar.jpg", key: "Qatar", defaultName: "Qatar" },
  { img: "/images/marshall_islands.jpg", key: "RepublicOfMarshallIslands", defaultName: "Republic of Marshall Islands" },
  { img: "/images/reunion_island.jpg", key: "ReunionIsland", defaultName: "Reunion Island" },
  { img: "/images/rwanda.jpg", key: "Rwanda", defaultName: "Rwanda" },
  { img: "/images/seychelles.jpg", key: "Seychelles", defaultName: "Seychelles" },
  { img: "/images/somalia.jpg", key: "Somalia", defaultName: "Somalia" },
  { img: "/images/tunisia.jpg", key: "Tunisia", defaultName: "Tunisia" },
  { img: "/images/tuvalu.jpg", key: "Tuvalu", defaultName: "Tuvalu" },
  { img: "/images/vanuatu.jpg", key: "Vanuatu", defaultName: "Vanuatu" },
  { img: "/images/zimbabwe.jpg", key: "Zimbabwe", defaultName: "Zimbabwe" },
  { img: "/images/kenya.jpg", key: "Kenya", defaultName: "Kenya" },
  { img: "/images/myanmar.jpg", key: "Myanmar", defaultName: "Myanmar" },
  { img: "/images/saint_lucia.jpg", key: "SaintLucia", defaultName: "Saint Lucia" },
  { img: "/images/sri_lanka.jpg", key: "SriLanka", defaultName: "Sri Lanka" },
  { img: "/images/suriname.jpg", key: "Suriname", defaultName: "Suriname" },
  { img: "/images/tajikistan.jpg", key: "Tajikistan", defaultName: "Tajikistan" },
  { img: "/images/tanzania.jpg", key: "Tanzania", defaultName: "Tanzania" },
  { img: "/images/vietnam.jpg", key: "Vietnam", defaultName: "Vietnam" },
  { img: "/images/ethiopia.jpg", key: "Ethiopia", defaultName: "Ethiopia" },
  { img: "/images/cambodia.jpg", key: "Cambodia", defaultName: "Cambodia" },
];

const CountryCard = React.memo(function CountryCard({ img, label, price, onApply, applyText }) {
  return (
    <div style={styles.card}>
      <img src={img} alt={label} style={styles.img} loading="lazy" />
      <div style={styles.cardContent}>
        <div style={styles.country}>{label}</div>
        <div style={styles.price}>{price}</div>
        <button onClick={onApply} style={styles.applyBtn} aria-label={`${label} - ${applyText}`}>
          {applyText}
        </button>
      </div>
    </div>
  );
});

const VisaCountryGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  function handleApply(countryParam) {
    const params = new URLSearchParams({
      from: "IN",
      to: countryParam, // keep English for downstream services
      autostart: "1",
    });
    const nextUrl = `/go/visa?${params.toString()}`;

    try {
      const stored =
        localStorage.getItem("helloviza_user") ||
        localStorage.getItem("hv_user") ||
        sessionStorage.getItem("hv_user");
      if (!stored) {
        navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
      } else {
        navigate(nextUrl);
      }
    } catch {
      navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }

  const title = t("visaCountryGrid.title", { defaultValue: "Popular Visa Destinations" });
  const priceLabel = t("visaCountryGrid.applyToSeePrice", { defaultValue: "₹ Apply to see price" });
  const applyText = t("common.applyNow", { defaultValue: "Apply Now" });

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>{title}</h2>
      <div style={styles.grid}>
        {countries.map((c, idx) => {
          const label = t(`countries.${c.key}`, { defaultValue: c.defaultName });
          return (
            <CountryCard
              key={c.key + idx}
              img={c.img}
              label={label}
              price={priceLabel}
              applyText={applyText}
              onApply={() => handleApply(c.defaultName)}
            />
          );
        })}
      </div>
    </section>
  );
};

const styles = {
  section: {
    width: "100vw",
    padding: "3rem 0 1.5rem 0",
    background: "rgba(248, 232, 238, 0.50)",
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
    background: "#ABE0F0",
    borderRadius: "0px",
    boxShadow: "0 2px 18px 0 rgba(64,64,64,0.11)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    transition: "transform .19s",
    minHeight: 200,
  },
  img: {
    width: "100%",
    height: 120,
    objectFit: "cover",
  },
  cardContent: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  country: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "0.3rem",
    color: "#1b1b1b",
    letterSpacing: ".01em",
  },
  price: {
    fontSize: ".9rem",
    color: "#d06549",
    fontWeight: 600,
    marginBottom: ".8rem",
  },
  applyBtn: {
    background: "#00477f",
    color: "#ffffff",
    padding: "0.9rem 1.3rem",
    lineHeight: .2,
    border: "none",
    borderRadius: "100px",
    fontFamily: baseFont,
    fontWeight: 600,
    fontSize: "1rem",
    letterSpacing: ".01em",
    textDecoration: "none",
    cursor: "pointer",
    marginTop: "auto",
    transition: "background .15s",
  },
};

export default VisaCountryGrid;
