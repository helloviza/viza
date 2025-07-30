import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import allCountries from "../data/allCountries";

const BookingPanel = ({ isOpen, onClose }) => {
  // Controlled state for form
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [visaRequiredBy, setVisaRequiredBy] = useState("");
  const [visaType, setVisaType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      origin,
      destination,
      start: startDate,
      visaBy: visaRequiredBy,
      type: visaType,
    });
    navigate(`/go-for-visa?${params.toString()}`);
    if (onClose) onClose();
  };

  return (
    <div style={{ ...styles.overlay, top: isOpen ? 0 : "-100%" }}>
      <button style={styles.closeButton} onClick={onClose}>×</button>
      <h2 style={styles.heading}>Explore your Gateway, Book your Visa</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          {/* Origin Country */}
          <div style={styles.inputGroup}>
            <label>Origin Country</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} required>
              <option value="">India</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          {/* Destination Country */}
          <div style={styles.inputGroup}>
            <label>Destination Country</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} required>
              <option value="">Please select</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          {/* Earliest departure */}
          <div style={styles.inputGroup}>
            <label>Earliest departure</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          {/* Visa Required by */}
          <div style={styles.inputGroup}>
            <label>Visa Required by</label>
            <input type="date" value={visaRequiredBy} onChange={e => setVisaRequiredBy(e.target.value)} required />
          </div>
          {/* Visa Type */}
          <div style={styles.inputGroup}>
            <label>Visa Type</label>
            <select value={visaType} onChange={e => setVisaType(e.target.value)} required>
              <option value="">Please select</option>
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Student Visa">Student Visa</option>
              <option value="Family Visa">Family Visa</option>
            </select>
          </div>
          <div style={styles.buttonWrapper}>
            <button style={styles.searchBtn} type="submit">
              Book your Visa »
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: "-100%",
    left: 0,
    right: 0,
    background: "#f8f8f8",
    padding: "2rem",
    zIndex: 9999,
    transition: "top 0.5s ease-in-out",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "1rem",
    right: "2rem",
    background: "#00477f",
    color: "#fff",
    border: "none",
    fontSize: "1.5rem",
    borderRadius: "0 0 8px 8px",
    padding: "0.3rem 1rem",
    cursor: "pointer",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    fontFamily: "inherit",
    color: "#00477f", // example: dark text color
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    color: "#00477f", // example: dark text color
  },
  buttonWrapper: {
    gridColumn: "span 2",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  searchBtn: {
    background: "#00477f",
    color: "#fff",
    border: "none",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default BookingPanel;
