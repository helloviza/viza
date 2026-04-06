import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ACCENT = "#d06549";
const ACCENT_LIGHT = "#f5e8e4";
const ACCENT_BORDER = "#e8b09a";

const countries = [
  { code: "GB", name: "United Kingdom", phone: "+44" },
  { code: "US", name: "United States", phone: "+1" },
  { code: "DE", name: "Germany", phone: "+49" },
  { code: "FR", name: "France", phone: "+33" },
  { code: "AE", name: "UAE", phone: "+971" },
  { code: "IN", name: "India", phone: "+91" },
];

const HOST = typeof window !== "undefined" ? window.location.hostname : "";
const IS_LOCAL = HOST === "localhost" || HOST === "127.0.0.1";
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (IS_LOCAL ? "http://localhost:8080" : "https://api.helloviza.com");

const vehicles = [
  {
    id: "sedan",
    name: "Standard Sedan",
    pax: "Up to 4 Pax",
    icon: (
      <svg viewBox="0 0 40 24" fill="none" className="w-10 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 17h32M6 17l4-8h16l4 8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11" cy="19" r="2"/>
        <circle cx="29" cy="19" r="2"/>
      </svg>
    ),
    color: "text-gray-400",
  },
  {
    id: "suv",
    name: "Premium SUV",
    pax: "Up to 6 Pax",
    description: "Spacious and comfortable for families or groups with extra bags.",
    icon: (
      <svg viewBox="0 0 40 24" fill="none" className="w-10 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 17h34M5 17l5-10h18l5 10" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="19" r="2"/>
        <circle cx="28" cy="19" r="2"/>
        <path d="M10 10h20" strokeLinecap="round"/>
      </svg>
    ),
    color: "text-orange-500",
  },
  {
    id: "luxury",
    name: "Luxury Executive",
    pax: "Up to 3 Pax",
    icon: (
      <svg viewBox="0 0 40 24" fill="none" className="w-10 h-6" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 17h36M5 17l6-9h14l6 9" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="19" r="2"/>
        <circle cx="28" cy="19" r="2"/>
        <path d="M12 10h16M8 14h24" strokeLinecap="round"/>
      </svg>
    ),
    color: "text-yellow-500",
  },
];

/* ═══════════════════════════════════════════════════════════════
   OTP BOX COMPONENT (Reusable)
═══════════════════════════════════════════════════════════════ */
function OtpBox({ value, onChange }) {
  const refs = useRef([]);
  const chars = (value || "").split("").concat(["", "", "", ""]).slice(0, 4);

  function handleKey(i, e) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...chars];
      if (next[i]) next[i] = "";
      else if (i > 0) { next[i - 1] = ""; refs.current[i - 1]?.focus(); }
      onChange(next.join(""));
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < 3) refs.current[i + 1]?.focus();
    else if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const next = [...chars]; next[i] = e.key;
      onChange(next.join(""));
      if (i < 3) refs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const next = p.split("").concat(["", "", "", ""]).slice(0, 4);
    onChange(next.join(""));
    refs.current[Math.min(p.length, 3)]?.focus();
  }

  return (
    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "0.75rem" }}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={ch} onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: "3.2rem", height: "3.6rem",
            textAlign: "center", fontSize: "1.6rem", fontWeight: 900,
            borderRadius: "0.75rem",
            border: ch ? "2.5px solid #d06549" : "2px solid #c9def3",
            background: ch ? "#fff5f2" : "#e6f0ff",
            color: "#00477f", outline: "none",
            boxShadow: ch ? "0 2px 12px rgba(208,101,73,.2)" : "inset 0 1px 2px rgba(0,0,0,.04)",
            transition: "all .15s",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE VERIFICATION MODAL (Reusable)
═══════════════════════════════════════════════════════════════ */
function MobileVerificationModal({ show, mobile, countryCode, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => { if (show && !otpSent) sendOtp(); }, [show]); // eslint-disable-line

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  async function sendOtp() {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/send-otp-mobile`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ mobile, countryCode, type: "transfer" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true); setTimer(30);
    } catch (err) { setError(err.message || "Failed to send OTP"); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (otp.length < 4) return setError("Please enter all 4 digits");
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/otpMobile/verify-otp-mobile`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ mobile, countryCode, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Invalid OTP");
      onVerified();
    } catch (err) { setError(err.message || "OTP verification failed"); setOtp(""); }
    finally { setLoading(false); }
  }

  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", padding: "1rem" }}>
      <div style={{ position: "relative", background: "#fff", borderRadius: "1.5rem", boxShadow: "0 32px 80px rgba(0,71,127,.25)", width: "100%", maxWidth: "22rem", padding: "2.25rem 2rem", animation: "fadeIn .25s ease-out" }}>

        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", width: "2rem", height: "2rem", borderRadius: "50%", border: "none", background: "#e6f0ff", color: "#00477f", fontWeight: 900, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ✕
        </button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <div style={{ width: "5rem", height: "5rem", borderRadius: "1.25rem", background: "linear-gradient(135deg,#e6f0ff,#c9def3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", boxShadow: "0 4px 20px rgba(0,71,127,.15)" }}>
            📱
          </div>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: 900, color: "#00477f", letterSpacing: "-.02em", marginBottom: ".25rem" }}>
          Verify Your Number
        </h2>
        <p style={{ textAlign: "center", fontSize: ".875rem", color: "#5a7a9a", marginBottom: "1.5rem" }}>
          OTP sent to <strong style={{ color: "#00477f" }}>{countryCode} {mobile}</strong>
        </p>

        {error && (
          <div style={{ background: "#ffefef", border: "1px solid #ffc9c9", color: "#a40000", borderRadius: ".75rem", padding: ".625rem 1rem", marginBottom: "1rem", fontSize: ".875rem", fontWeight: 700, textAlign: "center" }}>
            {error}
          </div>
        )}

        <OtpBox value={otp} onChange={setOtp} />

        <button onClick={verifyOtp} disabled={loading || otp.length < 4}
          style={{
            marginTop: "1.5rem", width: "100%", padding: ".9rem", borderRadius: "1rem",
            border: "none", fontWeight: 900, fontSize: "1rem", cursor: otp.length < 4 ? "not-allowed" : "pointer",
            color: "#fff", transition: "all .2s",
            background: otp.length === 4 ? ACCENT : "#b0c8e0",
            boxShadow: otp.length === 4 ? "0 6px 20px rgba(208,101,73,.35)" : "none",
            opacity: loading ? .7 : 1,
          }}>
          {loading ? "Verifying…" : "Confirm & Continue"}
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: ".875rem" }}>
          {timer > 0
            ? <span style={{ color: "#8aa5c0" }}>Resend in <strong style={{ color: "#00477f" }}>{timer}s</strong></span>
            : <button onClick={sendOtp} disabled={loading}
                style={{ background: "none", border: "none", color: ACCENT, fontWeight: 900, textDecoration: "underline", cursor: "pointer", fontSize: ".875rem" }}>
                Resend Code
              </button>}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform: scale(.96) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PASSENGER DETAILS MODAL
═══════════════════════════════════════════════════════════════ */
function PassengerDetailsModal({ show, paxCount, onClose, onSubmit, countryCode }) {
  const [passengers, setPassengers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState("");
  const [mobileVerified, setMobileVerified] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show && passengers.length === 0) {
      const newPassengers = Array(paxCount).fill(null).map((_, i) => ({
        id: i,
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        verified: false,
      }));
      setPassengers(newPassengers);
      setCurrentStep(0);
    }
  }, [show, paxCount]);

  const isFirstPassenger = currentStep === 0;
  const currentPassenger = passengers[currentStep];

  if (!currentPassenger) return null;

  const handlePassengerChange = (field, value) => {
    setPassengers((p) => {
      const updated = [...p];
      updated[currentStep] = { ...updated[currentStep], [field]: value };
      return updated;
    });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validateStep = () => {
    const e = {};
    if (!currentPassenger.name.trim()) e.name = "Name is required";
    if (!currentPassenger.age) e.age = "Age is required";
    if (!currentPassenger.gender) e.gender = "Gender is required";
    
    // Only first passenger needs phone, email and verification
    if (isFirstPassenger) {
      if (!currentPassenger.phone.trim()) e.phone = "Phone is required";
      else if (!/^\d{7,15}$/.test(currentPassenger.phone)) e.phone = "Enter valid phone number";
      if (!currentPassenger.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentPassenger.email)) e.email = "Enter valid email";
      if (!mobileVerified[currentStep]) e.verified = "Please verify your phone number";
    }
    return e;
  };

  const handleVerifyClick = () => {
    if (!currentPassenger.phone || !/^\d{7,15}$/.test(currentPassenger.phone)) {
      setErrors((p) => ({ ...p, phone: "Enter valid phone number first" }));
      return;
    }
    setVerifyingPhone(currentPassenger.phone);
    setShowVerifyModal(true);
  };

  const handleVerified = () => {
    setMobileVerified((p) => ({ ...p, [currentStep]: true }));
    setShowVerifyModal(false);
  };

  const handleNext = () => {
    const e = validateStep();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (currentStep < passengers.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      onSubmit(passengers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!show) return null;

  return (
    <>
      <MobileVerificationModal
        show={showVerifyModal}
        mobile={verifyingPhone}
        countryCode={countryCode}
        onClose={() => setShowVerifyModal(false)}
        onVerified={handleVerified}
      />

      <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", padding: "1rem" }}>
        <div style={{ position: "relative", background: "#fff", borderRadius: "1.5rem", boxShadow: "0 32px 80px rgba(0,71,127,.25)", width: "100%", maxWidth: "26rem", padding: "2rem", animation: "fadeIn .25s ease-out" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#00477f", margin: 0, letterSpacing: "-.02em" }}>
                Passenger {currentStep + 1} of {paxCount}
              </h2>
              <p style={{ fontSize: ".85rem", color: "#5a7a9a", margin: "0.25rem 0 0" }}>
                {isFirstPassenger ? "Primary passenger (with contact details)" : "Additional passenger"}
              </p>
            </div>
            <button onClick={onClose} style={{ width: "2rem", height: "2rem", borderRadius: "50%", border: "none", background: "#e6f0ff", color: "#00477f", fontWeight: 900, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ height: "3px", background: "#e6f0ff", borderRadius: "9999px", marginBottom: "1.5rem", overflow: "hidden" }}>
            <div style={{ height: "100%", background: ACCENT, width: `${((currentStep + 1) / paxCount) * 100}%`, transition: "width .3s ease" }} />
          </div>

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>

            {/* Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
              <label style={{ fontSize: ".75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a7a9a" }}>
                Full Name *
              </label>
              <input
                type="text"
                value={currentPassenger.name}
                onChange={(e) => handlePassengerChange("name", e.target.value)}
                placeholder="John Doe"
                style={{
                  width: "100%", padding: ".75rem 1rem", borderRadius: ".75rem",
                  border: errors.name ? "1.5px solid #d06549" : "1.5px solid #c9def3",
                  background: errors.name ? "#fff5f2" : "#e6f0ff",
                  color: "#0b315c", fontWeight: 600, fontSize: ".9rem",
                  outline: "none", transition: "all .18s", fontFamily: "inherit",
                }}
              />
              {errors.name && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{errors.name}</span>}
            </div>

            {/* Age */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
              <label style={{ fontSize: ".75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a7a9a" }}>
                Age *
              </label>
              <input
                type="number"
                value={currentPassenger.age}
                onChange={(e) => handlePassengerChange("age", e.target.value)}
                placeholder="25"
                min="1"
                max="120"
                style={{
                  width: "100%", padding: ".75rem 1rem", borderRadius: ".75rem",
                  border: errors.age ? "1.5px solid #d06549" : "1.5px solid #c9def3",
                  background: errors.age ? "#fff5f2" : "#e6f0ff",
                  color: "#0b315c", fontWeight: 600, fontSize: ".9rem",
                  outline: "none", transition: "all .18s", fontFamily: "inherit",
                }}
              />
              {errors.age && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{errors.age}</span>}
            </div>

            {/* Gender */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
              <label style={{ fontSize: ".75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a7a9a" }}>
                Gender *
              </label>
              <select
                value={currentPassenger.gender}
                onChange={(e) => handlePassengerChange("gender", e.target.value)}
                style={{
                  width: "100%", padding: ".75rem 1rem", borderRadius: ".75rem",
                  border: errors.gender ? "1.5px solid #d06549" : "1.5px solid #c9def3",
                  background: errors.gender ? "#fff5f2" : "#e6f0ff",
                  color: "#0b315c", fontWeight: 600, fontSize: ".9rem",
                  outline: "none", transition: "all .18s", fontFamily: "inherit",
                  appearance: "none", cursor: "pointer",
                }}
              >
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{errors.gender}</span>}
            </div>

            {/* First passenger only: Phone + Email */}
            {isFirstPassenger && (
              <>
                {/* Phone */}
                <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
                  <label style={{ fontSize: ".75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a7a9a" }}>
                    Phone Number *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: ".875rem", top: "50%", transform: "translateY(-50%)", fontSize: ".875rem", fontWeight: 900, color: "#00477f", pointerEvents: "none" }}>
                      {countryCode}
                    </span>
                    <input
                      type="tel"
                      value={currentPassenger.phone}
                      onChange={(e) => handlePassengerChange("phone", e.target.value.replace(/\D/g, "").slice(0, 15))}
                      placeholder="1234567890"
                      style={{
                        width: "100%", padding: ".75rem 1rem .75rem 2.75rem", borderRadius: ".75rem",
                        border: errors.phone ? "1.5px solid #d06549" : "1.5px solid #c9def3",
                        background: errors.phone ? "#fff5f2" : "#e6f0ff",
                        color: "#0b315c", fontWeight: 600, fontSize: ".9rem",
                        outline: "none", transition: "all .18s", fontFamily: "inherit",
                        paddingRight: mobileVerified[currentStep] ? "3rem" : "1rem",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyClick}
                      style={{
                        position: "absolute", right: ".5rem", top: "50%", transform: "translateY(-50%)",
                        fontSize: ".75rem", fontWeight: 900, padding: ".4rem .75rem", borderRadius: ".5rem",
                        border: "none", cursor: "pointer", transition: "all .2s",
                        ...(mobileVerified[currentStep]
                          ? { background: "#d1fae5", color: "#065f46" }
                          : { background: ACCENT, color: "#fff", boxShadow: `0 2px 8px rgba(208,101,73,.4)` }),
                      }}>
                      {mobileVerified[currentStep] ? "✓ Done" : "Verify"}
                    </button>
                  </div>
                  {errors.phone && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{errors.phone}</span>}
                  {errors.verified && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{errors.verified}</span>}
                </div>

                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
                  <label style={{ fontSize: ".75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", color: "#5a7a9a" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={currentPassenger.email}
                    onChange={(e) => handlePassengerChange("email", e.target.value)}
                    placeholder="john@example.com"
                    style={{
                      width: "100%", padding: ".75rem 1rem", borderRadius: ".75rem",
                      border: errors.email ? "1.5px solid #d06549" : "1.5px solid #c9def3",
                      background: errors.email ? "#fff5f2" : "#e6f0ff",
                      color: "#0b315c", fontWeight: 600, fontSize: ".9rem",
                      outline: "none", transition: "all .18s", fontFamily: "inherit",
                    }}
                  />
                  {errors.email && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#d06549" }}>{errors.email}</span>}
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: ".75rem" }}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              style={{
                flex: 1, padding: ".9rem", borderRadius: ".75rem", border: "1.5px solid #c9def3",
                background: currentStep === 0 ? "#f0f4f8" : "#fff", color: currentStep === 0 ? "#8aa5c0" : "#00477f",
                fontWeight: 900, fontSize: ".9rem", cursor: currentStep === 0 ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}>
              Back
            </button>
            <button
              onClick={handleNext}
              style={{
                flex: 1, padding: ".9rem", borderRadius: ".75rem", border: "none",
                background: ACCENT, color: "#fff",
                fontWeight: 900, fontSize: ".9rem", cursor: "pointer",
                transition: "all .2s",
                boxShadow: `0 4px 12px rgba(208,101,73,.3)`,
              }}>
              {currentStep === passengers.length - 1 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform: scale(.96) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs mt-1.5" style={{ color: "#e03c2f" }}>
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
      {msg}
    </p>
  );
}

export default function TransferForTaxi() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [planningMode, setPlanningMode] = useState("standard");
  const [landingDate, setLandingDate] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [transferTime, setTransferTime] = useState("");
  const [tourDetails, setTourDetails] = useState("");
  const [pax, setPax] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [apiEnabled, setApiEnabled] = useState(false);
  const [prices, setPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [passengers, setPassengers] = useState([]);

  const selected = vehicles.find((v) => v.id === selectedVehicle);
  const isStandard = planningMode === "standard";

  const handleCountryChange = (code) => {
    setCountry(code);
    const selected = countries.find((c) => c.code === code);
    if (selected) setCountryCode(selected.phone);
    clearError("country");
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!country) e.country = "Please select a country.";
    if (!landingDate) e.landingDate = "Landing date & time is required.";
    if (!pickup.trim()) e.pickup = "Pick-up point is required.";
    if (!dropoff.trim()) e.dropoff = "Drop destination is required.";
    if (!transferTime) e.transferTime = "Transfer time is required.";
    if (!pax || pax < 1) e.pax = "At least 1 passenger required.";
    if (!selectedVehicle) e.vehicle = "Please select a vehicle type.";
    
    // Custom only: Tour Details
    if (!isStandard && !tourDetails.trim()) {
      e.tourDetails = "Tour/Activity details are required.";
    }
    
    return e;
  };

  const summaryVehicle = selected || vehicles.find((v) => v.id === "sedan");
  const summaryPax = pax;
  const summaryPrice = summaryVehicle ? prices?.[summaryVehicle.id] : null;

  const resetForm = () => {
    setCountry("");
    setCountryCode("+91");
    setPlanningMode("standard");
    setLandingDate("");
    setPickup("");
    setDropoff("");
    setTourDetails("");
    setTransferTime("");
    setPax(1);
    setSelectedVehicle("");
    setPrices(null);
    setApiEnabled(false);
    setErrors({});
    setSubmitError("");
    setPassengers([]);
  };

  const handlePassengerSubmit = async (passengersList) => {
    setShowPassengerModal(false);
    setPassengers(passengersList);

    // Submit the transfer with passenger details
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/transfer/create-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          country,
          pickupPoint: pickup,
          dropPoint: dropoff,
          landingDate,
          transferTime,
          tourDetails: !isStandard ? tourDetails : undefined,
          planningMode,
          paxCount: pax,
          vehicleType: selectedVehicle,
          price: summaryPrice,
          passengers: passengersList.map((p) => ({
            name: p.name,
            age: p.age,
            gender: p.gender,
            phone: countryCode + p.phone,
            email: p.email,
            isPrimaryPassenger: p.id === 0,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong.');
        return;
      }

      setBookingConfirmed(data);
      resetForm();
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    // Show passenger modal for BOTH standard and custom modes
    setShowPassengerModal(true);
  };

  // Booking Confirmation Message
  if (bookingConfirmed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #fdf6f3 0%, #fef9f7 100%)" }}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 max-w-md w-full text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: ACCENT_LIGHT }}
          >
            <svg className="w-8 h-8" style={{ color: ACCENT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Received!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your transfer request has been submitted successfully. A confirmation mail has been sent on your registered email id.
          </p>

          <div className="rounded-xl p-4 mb-2" style={{ background: ACCENT_LIGHT }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
              Booking Reference
            </p>
            <p className="text-xl font-black" style={{ color: ACCENT }}>
              {bookingConfirmed.bookingId}
            </p>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Status: <span className="font-semibold text-gray-600 capitalize">{bookingConfirmed.status}</span>
          </p>

          <button
            onClick={() => setBookingConfirmed(null)}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors"
            style={{ background: "#1f2937" }}
          >
            Book Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fdf6f3 0%, #fef9f7 100%)", fontFamily: "'Inter', sans-serif" }}>

      {/* Passenger Modal */}
      <PassengerDetailsModal
        show={showPassengerModal}
        paxCount={pax}
        countryCode={countryCode}
        onClose={() => setShowPassengerModal(false)}
        onSubmit={handlePassengerSubmit}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-12 pb-4 md:pb-6">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: ACCENT }} className="text-sm">★</span>
          <span style={{ color: ACCENT }} className="text-xs font-bold tracking-widest uppercase">Premium Transfer Service</span>
        </div>
        <h1 className="text-2xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
          Book Your{" "}
          <span style={{ color: ACCENT }}>Seamless</span>{" "}
          Transfer
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-md mb-5">
          Experience first-class airport transfers with professional drivers and a luxury fleet tailored to your needs.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10 md:pb-16 flex flex-col md:flex-row gap-6 md:gap-8 items-start">

        {/* Left Form */}
        <div className="w-full md:flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">

          {/* Country + Planning Mode */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-5 md:mb-7">
            <div className="w-full md:flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Country <span style={{ color: ACCENT }}>*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600">
                  {country}
                </span>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full border rounded-xl pl-12 pr-4 py-3 text-gray-800 appearance-none bg-white text-sm focus:outline-none"
                  style={{ borderColor: errors.country ? "#e03c2f" : "#e5e7eb" }}
                >
                  <option value="">Choose…</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
              </div>
              <FieldError msg={errors.country} />
            </div>

            <div className="w-full md:flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Planning Mode</label>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setPlanningMode("standard")}
                  className="flex-1 py-3 text-sm font-medium transition-all duration-200"
                  style={
                    planningMode === "standard"
                      ? { background: ACCENT, color: "#fff" }
                      : { background: "#fff", color: "#6b7280" }
                  }
                >
                  Standard
                </button>
                <button
                  onClick={() => setPlanningMode("custom")}
                  className="flex-1 py-3 text-sm transition-all duration-200"
                  style={
                    planningMode === "custom"
                      ? { background: ACCENT, color: "#fff" }
                      : { background: "#fff", color: "#6b7280" }
                  }
                >
                  Custom Planning
                </button>
              </div>
            </div>
          </div>

          {/* Landing Date & Time */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <span style={{ color: ACCENT }}>✈</span> Landing Date &amp; Time <span style={{ color: ACCENT }}>*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.8"/>
                  <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.8"/>
                </svg>
              </span>
              <input
                type="datetime-local"
                value={landingDate}
                onChange={(e) => { setLandingDate(e.target.value); clearError("landingDate"); }}
                className="w-full border rounded-xl pl-11 pr-4 py-3 text-gray-800 text-sm focus:outline-none"
                style={{ borderColor: errors.landingDate ? "#e03c2f" : "#e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT_BORDER)}
                onBlur={(e) => (e.target.style.borderColor = errors.landingDate ? "#e03c2f" : "#e5e7eb")}
              />
            </div>
            <FieldError msg={errors.landingDate} />
          </div>

          {/* Pick-up Point */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pick-up Point <span style={{ color: ACCENT }}>*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="10" r="3"/>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
              </span>
              <input
                type="text"
                value={pickup}
                onChange={(e) => { setPickup(e.target.value); clearError("pickup"); }}
                placeholder="e.g. Heathrow Airport T2"
                className="w-full border rounded-xl pl-11 pr-10 py-3 text-gray-800 text-sm focus:outline-none"
                style={{ borderColor: errors.pickup ? "#e03c2f" : "#e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT_BORDER)}
                onBlur={(e) => (e.target.style.borderColor = errors.pickup ? "#e03c2f" : "#e5e7eb")}
              />
              {pickup && (
                <button onClick={() => setPickup("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                  </svg>
                </button>
              )}
            </div>
            <FieldError msg={errors.pickup} />
          </div>

          {/* Drop Destination */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Drop Destination <span style={{ color: ACCENT }}>*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="10" r="3"/>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
              </span>
              <input
                type="text"
                value={dropoff}
                onChange={(e) => { setDropoff(e.target.value); clearError("dropoff"); }}
                placeholder="e.g. 10 Downing Street, London"
                className="w-full border rounded-xl pl-11 pr-10 py-3 text-gray-800 text-sm focus:outline-none"
                style={{ borderColor: errors.dropoff ? "#e03c2f" : "#e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT_BORDER)}
                onBlur={(e) => (e.target.style.borderColor = errors.dropoff ? "#e03c2f" : "#e5e7eb")}
              />
              {dropoff && (
                <button onClick={() => setDropoff("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                  </svg>
                </button>
              )}
            </div>
            <FieldError msg={errors.dropoff} />
          </div>

          {/* Transfer Time + Pax (both Standard and Custom) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-5 md:mb-7">
            <div className="w-full md:flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span style={{ color: ACCENT }}>
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.8"/>
                    <path d="M12 7v5l3 3" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                Transfer Time <span style={{ color: ACCENT }}>*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.8"/>
                    <path d="M12 7v5l3 3" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="datetime-local"
                  value={transferTime}
                  onChange={(e) => { setTransferTime(e.target.value); clearError("transferTime"); }}
                  className="w-full border rounded-xl pl-10 pr-3 py-3 text-gray-800 text-sm focus:outline-none"
                  style={{ borderColor: errors.transferTime ? "#e03c2f" : "#e5e7eb" }}
                  onFocus={(e) => (e.target.style.borderColor = ACCENT_BORDER)}
                  onBlur={(e) => (e.target.style.borderColor = errors.transferTime ? "#e03c2f" : "#e5e7eb")}
                />
              </div>
              <p className="flex items-center gap-1 text-xs mt-1" style={{ color: ACCENT }}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {isStandard ? "Usually 45 mins after landing" : "Specify exact time for your tour pickup"}
              </p>
              <FieldError msg={errors.transferTime} />
            </div>

            <div className="w-full md:flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span style={{ color: ACCENT }}>
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Total Pax Count <span style={{ color: ACCENT }}>*</span>
              </label>
              <div
                className="flex items-center border rounded-xl overflow-hidden"
                style={{ borderColor: errors.pax ? "#e03c2f" : "#e5e7eb" }}
              >
                <button onClick={() => { setPax(Math.max(1, pax - 1)); clearError("pax"); }} className="px-5 py-3 text-gray-500 hover:bg-gray-50 text-lg font-light transition-colors">−</button>
                <span className="flex-1 text-center text-gray-800 font-semibold text-sm">{pax}</span>
                <button onClick={() => { setPax(pax + 1); clearError("pax"); }} className="px-5 py-3 text-gray-500 hover:bg-gray-50 text-lg font-light transition-colors">+</button>
              </div>
              <FieldError msg={errors.pax} />
            </div>
          </div>

          {/* Custom only: Tour/Activity Details */}
          {!isStandard && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tour/Activity Details <span style={{ color: ACCENT }}>*</span>
              </label>
              <textarea
                value={tourDetails}
                onChange={(e) => { setTourDetails(e.target.value); clearError("tourDetails"); }}
                placeholder="Describe your tour itinerary, activities, sightseeing spots, duration, etc."
                rows="3"
                className="w-full border rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none resize-none"
                style={{ borderColor: errors.tourDetails ? "#e03c2f" : "#e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT_BORDER)}
                onBlur={(e) => (e.target.style.borderColor = errors.tourDetails ? "#e03c2f" : "#e5e7eb")}
              />
              <FieldError msg={errors.tourDetails} />
            </div>
          )}

          {/* Vehicle Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type of Vehicle Required <span style={{ color: ACCENT }}>*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {vehicles.map((v) => {
                const isSelected = selectedVehicle === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVehicle(v.id); clearError("vehicle"); }}
                    className="relative rounded-xl border-2 p-4 text-left transition-all duration-200"
                    style={
                      isSelected
                        ? { borderColor: ACCENT, background: ACCENT_LIGHT }
                        : {
                            borderColor: errors.vehicle ? "#fca5a5" : "#e5e7eb",
                            background: "#fff",
                          }
                    }
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ACCENT }}>
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                    <div className="flex md:block items-center gap-3">
                      <div className={`flex-shrink-0 mb-0 md:mb-3 ${v.color}`}>{v.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                          </svg>
                          {v.pax}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <FieldError msg={errors.vehicle} />
          </div>

          {/* Error message if any */}
          {submitError && (
            <div className="mb-4 p-3 rounded-lg" style={{ background: "#fee", color: "#c00", fontSize: "0.875rem", fontWeight: 600 }}>
              {submitError}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-base"
            style={{ background: submitting ? "#9ca3af" : "#1f2937", cursor: submitting ? "not-allowed" : "pointer" }}
          >
            {submitting ? "Processing..." : "Submit Transfer Request"}
            {!submitting && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {Object.keys(errors).length > 0 && (
            <p className="text-center text-xs mt-3" style={{ color: "#e03c2f" }}>
              Please fill in all required fields marked with *.
            </p>
          )}
        </div>

        {/* Right Order Summary */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>

          {/* Back To Home */}
          <div className="bg-white rounded-2xl border p-4 flex items-center justify-between" style={{ borderColor: "#f0e8e3" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #e8b09a" }}>
                <svg width="15" height="15" fill="none" stroke="#d06549" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <Link to="/">
                <p className="font-bold text-sm" style={{ color: "#1a1a1a" }}>Back To Home</p>
              </Link>
            </div>
            <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-2xl border p-4 flex items-center justify-between" style={{ borderColor: "#f0e8e3" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "2px solid #e8b09a" }}>
                <svg width="15" height="15" fill="none" stroke="#d06549" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round"/>
                </svg>
              </div>
              <Link to="/contact">
                <p className="font-bold text-sm" style={{ color: "#1a1a1a" }}>Need Help?</p>
                <p className="text-xs" style={{ color: "#aaa" }}>Our 24/7 support is here for you.</p>
              </Link>
            </div>
            <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Order Summary Card */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0e8e3", background: "#fff" }}>

            {/* Header */}
            <div style={{ background: "#d06549", padding: "20px 20px 16px" }}>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: "rgba(255,255,255,0.18)" }}>
                  <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <path d="M9 9h6M9 13h4" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="font-black" style={{ fontSize: 16, color: "#fff" }}>Order Summary</h2>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginLeft: 42 }}>Your transfer at a glance</p>
            </div>

            {/* Body */}
            <div style={{ padding: 16 }}>

              {/* Route Block */}
              <div className="rounded-xl mb-4" style={{ background: "#fdf6f3", border: "1px solid #f5ddd2", padding: "14px" }}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="rounded-full flex-shrink-0" style={{ width: 9, height: 9, background: "#22c55e", display: "block" }}/>
                    <span style={{ width: 1.5, height: 10, background: "#ddd", display: "block", margin: "2px 0" }}/>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider" style={{ fontSize: 10, color: "#c08878", marginBottom: 2 }}>Pickup</p>
                    <p style={{ fontSize: 12, color: "#444", lineHeight: 1.4 }}>{pickup || "Not specified"}</p>
                  </div>
                </div>
                <div style={{ borderTop: "1.5px dashed #f0d0c0", margin: "10px 0" }}/>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className="rounded-full flex-shrink-0" style={{ width: 9, height: 9, background: "#ef4444", display: "block" }}/>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider" style={{ fontSize: 10, color: "#c08878", marginBottom: 2 }}>Dropoff</p>
                    <p style={{ fontSize: 12, color: "#444", lineHeight: 1.4 }}>{dropoff || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 42, height: 42, background: "#fdf0eb", border: "1.5px solid #f5ddd2" }}>
                  <svg viewBox="0 0 40 24" fill="none" width="28" height="17" stroke="#d06549" strokeWidth="1.5">
                    <path d="M3 17h34M5 17l5-10h18l5 10" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="19" r="2"/>
                    <circle cx="28" cy="19" r="2"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: 13, color: "#1a1a1a" }}>{summaryVehicle?.name || "No vehicle selected"}</p>
                  <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                    <svg width="11" height="11" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24" style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }}>
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    {summaryPax} Passenger{summaryPax > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "#f5ece8", marginBottom: 12 }}/>

              {/* Trust Badges */}
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-2" style={{ fontSize: 11, color: "#888" }}>
                  <svg width="13" height="13" fill="none" stroke="#d06549" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Secure Payment
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 11, color: "#888" }}>
                  <svg width="13" height="13" fill="none" stroke="#d06549" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round"/>
                  </svg>
                  Verified Drivers
                </div>
              </div>

              {/* Perks */}
              <ul className="mb-4" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {["Free 60 min waiting time", "No hidden fees", "Flight tracking included"].map((item) => (
                  <li key={item} className="flex items-center gap-2" style={{ fontSize: 12, color: "#555" }}>
                    <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: "#d06549", display: "block" }}/>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CX Note */}
              {!apiEnabled && (
                <div className="rounded-xl text-center" style={{ background: "#fdf0eb", border: "1px solid #f5ddd2", padding: "10px 14px" }}>
                  <svg width="13" height="13" fill="none" stroke="#a0523a" strokeWidth="2" viewBox="0 0 24 24" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 11, color: "#a0523a", fontWeight: 600 }}>
                    Our Customer Experience Team will call you shortly
                  </span>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}