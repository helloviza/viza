import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import allCountries from "../data/allCountries";

const BookingPanel = forwardRef(function BookingPanel({ }, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [appearanceCount, setAppearanceCount] = useState(0);
  const timersRef = useRef([]);

  // Controlled state for form
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [visaRequiredBy, setVisaRequiredBy] = useState("");
  const [visaType, setVisaType] = useState("");

  const navigate = useNavigate();

  // Expose openPanel for manual opening
  useImperativeHandle(ref, () => ({
    openPanel: () => setIsOpen(true)
  }));

  // Auto-appearance logic
  useEffect(() => {
    if (appearanceCount >= 3) return;

    // Setup all timers on mount, will trigger only if not yet shown 3 times
    if (appearanceCount === 0) {
      // Show after 3s
      timersRef.current[0] = setTimeout(() => {
        setIsOpen(true);
        setAppearanceCount(1);
      }, 3000);
    } else if (appearanceCount === 1) {
      // After 1st close, show again after 4s
      timersRef.current[1] = setTimeout(() => {
        setIsOpen(true);
        setAppearanceCount(2);
      }, 4000);
    } else if (appearanceCount === 2) {
      // After 2nd close, show again after 5s
      timersRef.current[2] = setTimeout(() => {
        setIsOpen(true);
        setAppearanceCount(3);
      }, 5000);
    }

    // Cleanup on unmount
    return () => timersRef.current.forEach(timer => clearTimeout(timer));
    // eslint-disable-next-line
  }, [appearanceCount]);

  // Panel close handler
  const handleClose = () => setIsOpen(false);

  // Form submit handler
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
    handleClose();
  };

  return (
    <div style={{ ...styles.overlay, top: isOpen ? 0 : "-100%" }}>
      <button style={styles.closeButton} onClick={handleClose}>×</button>
      <h2 style={styles.heading}>Explore your Gateway, Book your Visa</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label>Origin Country</label>
            <select value={origin} onChange={e => setOrigin(e.target.value)} required>
              <option value="">India</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label>Destination Country</label>
            <select value={destination} onChange={e => setDestination(e.target.value)} required>
              <option value="">Please select</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label>Earliest departure</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label>Visa Required by</label>
            <input type="date" value={visaRequiredBy} onChange={e => setVisaRequiredBy(e.target.value)} required />
          </div>
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
});

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
    color: "#00477f",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    color: "#00477f",
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
