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
  boxSizing: "border-box"
};

const labelStyle = {
  fontFamily: baseFont,
  fontWeight: 700,
  fontSize: "1.13rem",
  marginBottom: ".32rem",
  color: "#00477f",
  letterSpacing: ".02em"
};

export default function ContactSection() {
  const [subject, setSubject] = useState("");

  // For demonstration, use state for mobile/email if you want to handle form values
  const [mobile, setMobile] = useState("");
  const [extraEmail, setExtraEmail] = useState("");

  // When submitting, add your logic here to handle the extra fields if needed
  function handleSubmit(e) {
    e.preventDefault();
    // your logic here
  }

  // Show extra fields if login/signup selected
  const showExtra = subject === "login" || subject === "signup";

  return (
    <section style={{
      width: "100vw",
      maxWidth: "100%",
      background: "#fff",
      padding: "4.5rem 0",
      fontFamily: baseFont,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "97vw",
        maxWidth: "1100px",
        display: "flex",
        flexDirection: "row",
        gap: "3vw",
        background: "#fff",
        borderRadius: "0px",
        boxShadow: "0 8px 32px 0 rgba(32,32,32,0.08)",
        padding: "3rem 2rem",
        alignItems: "flex-start"
      }}>
        {/* Left: Info */}
        <div style={{
          flex: "1 1 33%",
          minWidth: 260,
          maxWidth: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}>
          <h1 style={{
            fontSize: "3.8rem",
            fontWeight: 700,
            margin: "0 0 1.2rem 0",
            lineHeight: 0.98,
            color: "#00477f",
            letterSpacing: "-1px"
          }}>Contact</h1>
          <div style={{marginBottom: "1.3rem"}}>
            <div style={{
              fontSize: "1rem", fontWeight: 700, color: "#00477f", marginBottom: ".11rem",
              letterSpacing: ".02em", textTransform: "uppercase"
            }}>E–MAIL ADDRESS</div>
            <div style={{
              fontSize: "1.2rem", color: "#d06549", fontWeight: 700,
              letterSpacing: "-.02em", marginTop: ".1rem"
            }}>hello@helloviza.com</div>
          </div>
          <div>
            <div style={{
              fontSize: "1rem", fontWeight: 700, color: "#00477f", marginBottom: ".11rem",
              letterSpacing: ".02em", textTransform: "uppercase"
            }}>WORKING HOURS</div>
            <div style={{
              fontSize: "1.2rem", color: "#d06549", fontWeight: 700,
              letterSpacing: "-.02em", marginTop: ".1rem"
            }}>Monday – Sunday, 9 AM – 8 PM, IST</div>
          </div>
        </div>

        {/* Right: Form */}
        <form
          style={{
            flex: "1 1 67%",
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            gap: "1.08rem",
            background: "transparent"
          }}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div style={{display: "flex", gap: "1.3rem", marginBottom: ".4rem"}}>
            <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
              <label style={labelStyle}>First Name*</label>
              <input style={inputStyle} type="text" placeholder="Enter name" required />
            </div>
            <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
              <label style={labelStyle}>Last Name*</label>
              <input style={inputStyle} type="text" placeholder="Enter last name" required />
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <label style={labelStyle}>Email Address*</label>
            <input style={inputStyle} type="email" placeholder="Enter e-mail" required />
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
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

          {/* Show extra fields only for login/signup */}
          {showExtra && (
            <>
              <div style={{display: "flex", flexDirection: "column"}}>
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
              <div style={{display: "flex", flexDirection: "column"}}>
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

          <div style={{display: "flex", flexDirection: "column"}}>
            <label style={labelStyle}>Message*</label>
            <textarea
              style={{ ...inputStyle, minHeight: 104, maxHeight: 240 }}
              rows={5}
              placeholder="Enter message"
              required
            />
          </div>
          <button type="submit" style={{
            marginTop: "1.1rem",
            width: "100%",
            padding: "1.2rem",
            background: "#00477f",
            color: "#fff",
            fontWeight: 700,
            fontFamily: baseFont,
            border: "none",
            borderRadius: "0px",
            fontSize: "1.25rem",
            letterSpacing: "0.01em",
            cursor: "pointer",
            transition: "background .18s"
          }}>Submit Your Query</button>
        </form>
      </div>
    </section>
  );
}
