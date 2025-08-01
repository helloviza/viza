import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import allCountries from "../data/allCountries";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const mystyle = {
  backdrop: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.18)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
  },
  panel: {
    background: "#f8f8f8",
    borderRadius: "0.7rem",
    boxShadow: "0 4px 32px rgba(0,0,0,0.19)",
    padding: "2.2rem 2.3rem 2.0rem 2.3rem",
    width: "min(1100px, 92vw)",
    minWidth: "320px",
    maxWidth: "99vw",
    margin: "1rem",
    position: "relative",
    fontFamily: baseFont,
    boxSizing: "border-box",
  },
  panelMobile: {
    width: "100vw",
    maxWidth: "100vw",
    minWidth: 0,
    padding: "1rem 0.2rem 1rem 0.2rem",
    borderRadius: "0.4rem",
    margin: 0,
  },
  closeButton: {
    position: "absolute",
    top: "1.2rem",
    right: "2.3rem",
    background: "#00477f",
    color: "#fff",
    border: "none",
    fontSize: "2.2rem",
    borderRadius: "0.4rem",
    padding: "0.18rem 1.2rem",
    cursor: "pointer",
    zIndex: 10,
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
    color: "#00477f",
    fontFamily: baseFont,
    textAlign: "left",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr) 1.2fr 1.2fr",
    gap: "1.1rem 1.5rem",
    alignItems: "end",
  },
  gridMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    color: "#00477f",
    fontSize: "1.08rem",
    fontFamily: baseFont,
    marginBottom: "0.7rem",
    width: "100%",
    boxSizing: "border-box",
  },
  inputGroupWide: {
    gridColumn: "1 / 3",
    display: "flex",
    flexDirection: "column",
    color: "#00477f",
    fontSize: "1.08rem",
    fontFamily: baseFont,
    marginBottom: "0.7rem",
    width: "100%",
    boxSizing: "border-box",
  },
  buttonWrapper: {
    gridColumn: "3 / 5",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: "1.1rem",
    width: "100%",
  },
  buttonWrapperMobile: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: "0.7rem",
    width: "100%",
  },
  searchBtn: {
    background: "#00477f",
    color: "#fff",
    border: "none",
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    cursor: "pointer",
    borderRadius: "0.4rem",
    fontWeight: 700,
    fontFamily: baseFont,
    boxShadow: "0 2px 10px #00336622",
    width: "100%",
    maxWidth: 340,
  },
  select: {
    padding: "0.8rem",
    fontFamily: baseFont,
    fontSize: "1.04rem",
    borderRadius: "0.32rem",
    border: "1px solid #ccd8ef",
    marginTop: "0.1rem",
    marginBottom: "0.2rem",
    background: "#fff",
    color: "#00477f",
    width: "100%",
    boxSizing: "border-box",
    appearance: "none",
  },
  input: {
    padding: "0.8rem",
    fontFamily: baseFont,
    fontSize: "1.04rem",
    borderRadius: "0.32rem",
    border: "1px solid #ccd8ef",
    marginTop: "0.1rem",
    marginBottom: "0.2rem",
    background: "#fff",
    color: "#00477f",
    width: "100%",
    boxSizing: "border-box",
  },
  // Slide styles (unchanged)
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
  slideCloseButton: {
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
  slideHeading: {
    fontSize: "1.35rem",
    fontWeight: "600",
    marginBottom: "1.2rem",
    fontFamily: baseFont,
    color: "#00477f",
  },
  slideGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
  },
  slideInputGroup: {
    display: "flex",
    flexDirection: "column",
    color: "#00477f",
    fontSize: "1rem",
    fontFamily: baseFont,
  },
  slideButtonWrapper: {
    gridColumn: "span 2",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  slideSearchBtn: {
    background: "#00477f",
    color: "#fff",
    border: "none",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "0.4rem",
  },
};

const BookingPanel = forwardRef(function BookingPanel(props, ref) {
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [visaRequiredBy, setVisaRequiredBy] = useState("");
  const [visaType, setVisaType] = useState("");

  const navigate = useNavigate();

  // Expose openPanel/closePanel for parent (props.mode to distinguish style)
  useImperativeHandle(ref, () => ({
    openPanel: () => setIsOpen(true),
    closePanel: () => setIsOpen(false),
  }));

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

  // Use JS media query for fully correct mobile detection
  const isMobile = window.innerWidth < 650;
  const isModal = props.mode === "modal";

  if (!isOpen) return null;

  return isModal ? (
    // MODAL POPUP VERSION (centered, overlay)
    <div style={mystyle.backdrop}>
      <div
        style={{
          ...mystyle.panel,
          ...(isMobile ? mystyle.panelMobile : {}),
        }}
      >
        <button style={mystyle.closeButton} onClick={handleClose}>×</button>
        <h2 style={mystyle.heading}>Explore your Gateway, Book your Visa</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%", boxSizing: "border-box" }}>
          <div
            style={isMobile ? mystyle.gridMobile : mystyle.grid}
          >
            <div style={mystyle.inputGroup}>
              <label>Origin Country</label>
              <select
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                required
                style={mystyle.select}
              >
                <option value="">Select Country</option>
                {allCountries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div style={mystyle.inputGroup}>
              <label>Destination Country</label>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                required
                style={mystyle.select}
              >
                <option value="">Please select</option>
                {allCountries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div style={mystyle.inputGroup}>
              <label>Earliest departure</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                style={mystyle.input}
              />
            </div>
            <div style={mystyle.inputGroup}>
              <label>Visa Required by</label>
              <input
                type="date"
                value={visaRequiredBy}
                onChange={e => setVisaRequiredBy(e.target.value)}
                required
                style={mystyle.input}
              />
            </div>
            <div style={mystyle.inputGroupWide}>
              <label>Visa Type</label>
              <select
                value={visaType}
                onChange={e => setVisaType(e.target.value)}
                required
                style={mystyle.select}
              >
                <option value="">Please select</option>
                <option value="Tourist Visa">Tourist Visa</option>
                <option value="Business Visa">Business Visa</option>
                <option value="Student Visa">Student Visa</option>
                <option value="Family Visa">Family Visa</option>
              </select>
            </div>
            <div style={isMobile ? mystyle.buttonWrapperMobile : mystyle.buttonWrapper}>
              <button style={mystyle.searchBtn} type="submit">
                🔍 Book your Visa »
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    // SLIDE-DOWN PANEL VERSION (desktop)
    <div style={{ ...mystyle.overlay, top: isOpen ? 0 : "-100%" }}>
      <button style={mystyle.slideCloseButton} onClick={handleClose}>×</button>
      <h2 style={mystyle.slideHeading}>Explore your Gateway, Book your Visa</h2>
      <form onSubmit={handleSubmit}>
        <div style={mystyle.slideGrid}>
          <div style={mystyle.slideInputGroup}>
            <label>Origin Country</label>
            <select
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              required
              style={mystyle.select}
            >
              <option value="">Select Country</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div style={mystyle.slideInputGroup}>
            <label>Destination Country</label>
            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
              style={mystyle.select}
            >
              <option value="">Please select</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div style={mystyle.slideInputGroup}>
            <label>Earliest departure</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              style={mystyle.input}
            />
          </div>
          <div style={mystyle.slideInputGroup}>
            <label>Visa Required by</label>
            <input
              type="date"
              value={visaRequiredBy}
              onChange={e => setVisaRequiredBy(e.target.value)}
              required
              style={mystyle.input}
            />
          </div>
          <div style={mystyle.slideInputGroup}>
            <label>Visa Type</label>
            <select
              value={visaType}
              onChange={e => setVisaType(e.target.value)}
              required
              style={mystyle.select}
            >
              <option value="">Please select</option>
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Student Visa">Student Visa</option>
              <option value="Family Visa">Family Visa</option>
            </select>
          </div>
          <div style={mystyle.slideButtonWrapper}>
            <button style={mystyle.slideSearchBtn} type="submit">
              Book your Visa »
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});

export default BookingPanel;
