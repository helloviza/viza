import React, { useState } from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Mock: Check if user is "logged in" (you can replace with real auth check)
const isUserLoggedIn = () => {
  return !!localStorage.getItem("user_logged_in");
};

const GoForVisa = () => {
  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic validation (add your actual login/auth here)
    if (form.email.trim() && form.password.trim()) {
      localStorage.setItem("user_logged_in", "yes");
      setLoggedIn(true);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Show login if not logged in
  if (!loggedIn) {
    return (
      <div style={{
        minHeight: "90vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#fafafa"
      }}>
        <form 
          style={{
            background: "#fff",
            padding: "2.5rem 2.5rem",
            borderRadius: "18px",
            boxShadow: "0 6px 28px 0 rgba(44,44,44,0.09)",
            display: "flex",
            flexDirection: "column",
            minWidth: 330,
            fontFamily: baseFont
          }}
          onSubmit={handleLogin}
        >
          <h2 style={{
            fontFamily: baseFont,
            fontWeight: 700,
            fontSize: "2.3rem",
            marginBottom: "2rem",
            textAlign: "center"
          }}>Login Required</h2>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            style={{
              marginBottom: "1.2rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "0px",
              fontSize: "1.1rem"
            }}
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={{
              marginBottom: "1.8rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "0px",
              fontSize: "1.1rem"
            }}
            value={form.password}
            onChange={handleChange}
            required
          />
          <button 
            type="submit" 
            style={{
              background: "#000",
              color: "#fff",
              padding: "1rem",
              border: "none",
              borderRadius: "0px",
              fontSize: "1.15rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >Login</button>
        </form>
      </div>
    );
  }

  // If logged in, show the Go For Visa widget
  return (
    <div style={{ minHeight: "90vh", padding: "0", background: "#fafafa" }}>
      <h1 style={{
        fontFamily: baseFont,
        padding: "4rem 0 2.2rem 0",
        margin: 0,
        fontSize: "2.4rem",
        fontWeight: 700,
        textAlign: "center"
      }}>Go for Visa</h1>
      {/* Paste your technology partner's iframe/widget below */}
      <iframe
        src="https://your-partner-url.com/partner-widget"
        width="100%"
        height="900"
        style={{ border: "none", borderRadius: "0px", display: "block", margin: "0 auto" }}
        title="Go For Visa Widget"
        allowFullScreen
      />
    </div>
  );
};

export default GoForVisa;
