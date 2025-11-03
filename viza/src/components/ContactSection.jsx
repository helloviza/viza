import React, { useState } from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const inputStyle = {
  fontFamily: baseFont,
  fontSize: "1.1rem",
  background: "#d8e7f3",
  border: "none",
  outline: "none",
  borderRadius: "0px",
  padding: "1.1rem 1.25rem",
  marginBottom: 0,
  color: "#1b1b1b",
  fontWeight: 400,
  width: "100%",
  resize: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: baseFont,
  fontWeight: 700,
  fontSize: "1.13rem",
  marginBottom: ".32rem",
  color: "#00477f",
  letterSpacing: ".02em",
};

export default function ContactSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [mobile, setMobile] = useState("");
  const [extraEmail, setExtraEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const showExtra = subject === "login" || subject === "signup";

  async function handleSubmit(e) {
    e.preventDefault();
    setStatusMsg("");
    setLoading(true);

    // Prepare payload for backend
    const payload = {
      firstName,
      lastName,
      email,
      subject,
      message,
      loginMobile: showExtra ? mobile : "",
      loginEmail: showExtra ? extraEmail : "",
    };

    try {
      const response = await fetch(
        "https://api.helloviza.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        setStatusMsg("✅ Your query has been submitted!");
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setSubject("");
        setMobile("");
        setExtraEmail("");
        setMessage("");
      } else {
        setStatusMsg(data.message || "❌ Something went wrong.");
      }
    } catch (err) {
      setStatusMsg("❌ Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        width: "100vw",
        maxWidth: "100%",
        background: "#fff",
        padding: window.innerWidth <= 700 ? "100px 0 28px 0" : "4.5rem 0",
        fontFamily: baseFont,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "97vw",
          maxWidth: "1100px",
          display: "flex",
          flexDirection: window.innerWidth <= 900 ? "column" : "row",
          gap: window.innerWidth <= 900 ? "1.2rem" : "3vw",
          background: "#fff",
          borderRadius: "0px",
          boxShadow: "0 8px 32px 0 rgba(32,32,32,0.08)",
          padding: window.innerWidth <= 700 ? "2.2rem 1rem" : "3rem 2rem",
          alignItems: window.innerWidth <= 900 ? "center" : "flex-start",
        }}
      >
        {/* Left: Info */}
        <div
          style={{
            flex: "1 1 33%",
            minWidth: 200,
            maxWidth: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: window.innerWidth <= 900 ? "center" : "flex-start",
            marginBottom: window.innerWidth <= 900 ? "2rem" : 0,
            textAlign: window.innerWidth <= 900 ? "center" : "left",
          }}
        >
          <h1
            style={{
              fontSize: window.innerWidth <= 700 ? "2.2rem" : "3.8rem",
              fontWeight: 700,
              margin: "0 0 1.2rem 0",
              lineHeight: 0.98,
              color: "#00477f",
              letterSpacing: "-1px",
            }}
          >
            Contact
          </h1>
          <div style={{ marginBottom: "1.3rem" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#00477f",
                marginBottom: ".11rem",
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              E–MAIL ADDRESS
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                color: "#d06549",
                fontWeight: 700,
                letterSpacing: "-.02em",
                marginTop: ".1rem",
              }}
            >
              hello@helloviza.com
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#00477f",
                marginBottom: ".11rem",
                letterSpacing: ".02em",
                textTransform: "uppercase",
              }}
            >
              WORKING HOURS
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                color: "#d06549",
                fontWeight: 700,
                letterSpacing: "-.02em",
                marginTop: ".1rem",
              }}
            >
              Monday – Sunday, 9 AM – 8 PM, IST
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <form
          style={{
            flex: "1 1 67%",
            minWidth: window.innerWidth <= 700 ? "100%" : 320,
            display: "flex",
            flexDirection: "column",
            gap: "1.08rem",
            background: "transparent",
          }}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div
            style={{
              display: window.innerWidth <= 700 ? "block" : "flex",
              gap: window.innerWidth <= 700 ? "0" : "1.3rem",
              marginBottom: ".4rem",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", marginBottom: window.innerWidth <= 700 ? "1rem" : 0 }}>
              <label style={labelStyle}>First Name*</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>Last Name*</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter last name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Email Address*</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="Enter e-mail"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Subject*</label>
            <select
              style={inputStyle}
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
            >
              <option value="">Select subject</option>
              <option value="vaa">Visa Application Assistance</option>
              <option value="ptq">Processing Time Queries</option>
              <option value="sdr">Specific Destination Requirements</option>
              <option value="cts">Customized Travel Solutions</option>
              <option value="fpi">Fee and Payment Information</option>
              <option value="login">Unable to Login</option>
              <option value="signup">Failed to do Signup</option>
              <option value="cr">Consultation Requests</option>
              <option value="partner">Partnership Requirement</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          {showExtra && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Mobile Number*</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  required
                  onChange={e => setMobile(e.target.value)}
                  pattern="[0-9]{10,15}"
                  maxLength={15}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Email ID*</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="Enter email id"
                  value={extraEmail}
                  required
                  onChange={e => setExtraEmail(e.target.value)}
                />
              </div>
            </>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Message*</label>
            <textarea
              style={{ ...inputStyle, minHeight: 104, maxHeight: 240 }}
              rows={5}
              placeholder="Enter message"
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: "1.1rem",
              width: "100%",
              padding: window.innerWidth <= 700 ? "0.7rem" : "1.2rem",
              background: "#00477f",
              color: "#fff",
              fontWeight: 700,
              fontFamily: baseFont,
              border: "none",
              borderRadius: "0px",
              fontSize: window.innerWidth <= 700 ? "1.05rem" : "1.25rem",
              letterSpacing: "0.01em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background .18s",
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Your Query"}
          </button>
          {statusMsg && (
            <div
              style={{
                marginTop: "1rem",
                color: statusMsg.startsWith("✅") ? "#087d41" : "#d06549",
                fontWeight: 700,
                fontSize: "1.1rem",
                minHeight: 30,
              }}
            >
              {statusMsg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
