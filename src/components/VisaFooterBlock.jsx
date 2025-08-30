// client/src/components/VisaFooterBlock.jsx
import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Responsive helpers
function useScreenSize() {
  if (typeof window === "undefined") return { mobile: false, width: 1200 };
  const width = window.innerWidth;
  return {
    mobile: width < 700,
    width,
  };
}

const VisaFooterBlock = () => {
  const { mobile } = useScreenSize();

  // layout helpers for the FOOTER ONLY
  const footerRowDir = mobile ? "column" : "row";
  const padFooter = mobile ? "2.4rem 4vw 1rem 4vw" : "2.4rem 2.8vw 0.96rem 2.8vw";
  const bottomBarPad = mobile ? "0.8rem 4vw 0.32rem 4vw" : "0.8rem 2.8vw 0.32rem 2.8vw";
  const colAlign = mobile ? "center" : "flex-start";
  const colStack = mobile;
  const dividerHeight = mobile ? 3 : 6;

  // Re-usable styles for the Subscribe form (same look as before)
  const subscribeFormStyles = {
    wrapper: {
      display: "flex",
      width: "100%",
      maxWidth: mobile ? 220 : 272,
      gap: "0.32rem",
      fontFamily: baseFont,
      flexDirection: colStack ? "column" : "row",
      margin: colStack ? "0 auto" : 0,
    },
    input: {
      flex: 1,
      padding: "0.45rem",
      fontSize: mobile ? "0.72rem" : "0.8rem",
      borderRadius: "6px",
      border: "none",
      outline: "none",
      background: "#ffffff",
      color: "#00477f",
      fontFamily: baseFont,
      marginBottom: colStack ? "0.5rem" : 0,
    },
    button: {
      padding: colStack ? "0.5rem 0.8rem" : "0.56rem 0.96rem",
      fontSize: mobile ? "0.7rem" : "0.8rem",
      background: "#f3f3f3",
      color: "#00477f",
      borderRadius: "6px",
      border: "none",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: baseFont,
      width: colStack ? "100%" : "auto",
    },
  };

  return (
    <div>
      {/* Optional divider above footer (kept as-is) */}
      <div
        style={{
          width: "100%",
          height: dividerHeight,
          background: "linear-gradient(90deg, #fff 0%, #48b4e0 80%, #fff 100%)",
          boxShadow: "0 1px 18px #48b4e080, 0 0px 0 #000, 0 2px 24px #fff2",
          margin: "0",
          border: "none",
          outline: "none",
        }}
      />

      {/* === FOOTER SECTION === */}
      <footer
        style={{
          background: "#d06549",
          color: "#fff",
          width: "100vw",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          borderTop: "1px solid #222",
          fontFamily: baseFont,
        }}
      >
        {/* Columns */}
        <div
          style={{
            display: "flex",
            flexDirection: footerRowDir,
            justifyContent: mobile ? "center" : "space-between",
            alignItems: mobile ? "center" : "flex-start",
            padding: padFooter,
            margin: 0,
            borderBottom: "1px solid #222",
            fontFamily: baseFont,
            gap: colStack ? "1.5rem" : 0,
          }}
        >
          {/* DISCOVER */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: "128px",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: colAlign,
              gap: mobile ? "0.46rem" : "0.56rem",
              fontFamily: baseFont,
              marginBottom: colStack ? "1.3rem" : 0,
            }}
          >
            <div style={colHeaderStyle(mobile)}>DISCOVER</div>
            <a href="/" style={footerLinkStyle}>Home</a>
            <a href="/blog" style={footerLinkStyle}>Blog</a>
            <a href="/contact" style={footerLinkStyle}>Contact</a>
          </div>

          {/* MANAGEMENT */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: "128px",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: colAlign,
              gap: mobile ? "0.46rem" : "0.56rem",
              fontFamily: baseFont,
              marginBottom: colStack ? "1.3rem" : 0,
            }}
          >
            <div style={colHeaderStyle(mobile)}>MANAGEMENT</div>
            <a href="/about" style={footerLinkStyle}>About Us</a>
            <a href="/careers" style={footerLinkStyle}>Career</a>
          </div>

          {/* OUR SERVICE */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: "128px",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: colAlign,
              gap: mobile ? "0.46rem" : "0.56rem",
              fontFamily: baseFont,
              marginBottom: colStack ? "1.3rem" : 0,
            }}
          >
            <div style={colHeaderStyle(mobile)}>OUR SERVICE</div>
            <a
              href="https://www.plumtrips.com"
              style={footerLinkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book my Flight
            </a>
            <a
              href="https://www.plumtrips.com"
              style={footerLinkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book my Hotel
            </a>
          </div>

          {/* SOCIAL MEDIA */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: "128px",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: colAlign,
              gap: mobile ? "0.46rem" : "0.56rem",
              fontFamily: baseFont,
              marginBottom: colStack ? "1.3rem" : 0,
            }}
          >
            <div style={colHeaderStyle(mobile)}>SOCIAL MEDIA</div>
            <a href="#" style={footerLinkStyle}>Instagram</a>
            <a href="#" style={footerLinkStyle}>YouTube</a>
            <a href="#" style={footerLinkStyle}>Facebook</a>
          </div>

          {/* SUBSCRIBE (moved here, same UI as before) */}
          <div
            style={{
              flex: "1 1 0",
              minWidth: "128px",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: colAlign,
              gap: mobile ? "0.7rem" : "0.8rem",
              fontFamily: baseFont,
              marginBottom: colStack ? "1.3rem" : 0,
            }}
          >
            <div style={colHeaderStyle(mobile)}>SUBSCRIBE</div>
            <div style={{ fontSize: mobile ? "0.7rem" : "0.8rem", opacity: 0.95 }}>
              Get updates in your inbox.
            </div>
            <form style={subscribeFormStyles.wrapper} onSubmit={(e)=>e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                style={subscribeFormStyles.input}
              />
              <button type="submit" style={subscribeFormStyles.button}>Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            width: "100vw",
            margin: 0,
            padding: bottomBarPad,
            display: "flex",
            flexDirection: footerRowDir,
            justifyContent: "space-between",
            alignItems: mobile ? "center" : "center",
            background: "#d06549",
            fontFamily: baseFont,
            gap: mobile ? "0.6rem" : 0,
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontWeight: 600,
              fontSize: mobile ? "0.88rem" : "0.96rem",
              fontFamily: baseFont,
              textAlign: colStack ? "center" : "left",
              width: mobile ? "100%" : "auto",
            }}
          >
            &copy; {new Date().getFullYear()} Helloviza, All rights reserved
          </div>
          <div
            style={{
              display: "flex",
              gap: mobile ? "0.4rem" : "1.6vw",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              fontFamily: baseFont,
            }}
          >
            <a href="/privacy" style={bottomLinkStyle}>Privacy Policy</a>
            <a href="/terms" style={bottomLinkStyle}>Terms of Use</a>
            <a href="/Newsroom" style={bottomLinkStyle}>Newsroom</a>
          </div>
          <div
            style={{
              color: "#ffffff",
              fontWeight: 400,
              fontSize: mobile ? "0.79rem" : "0.88rem",
              minWidth: 112,
              textAlign: colStack ? "center" : "right",
              fontFamily: baseFont,
              width: mobile ? "100%" : "auto",
            }}
          >
            <a href="#" style={bottomCreditStyle}>Helloviza’s website</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Shared small styles
const colHeaderStyle = (mobile) => ({
  color: "#ffffff",
  fontWeight: 700,
  fontSize: mobile ? "1rem" : "1.2rem",
  marginBottom: "0.6rem",
  marginTop: 0,
  letterSpacing: "0.016em",
  textTransform: "uppercase",
  fontFamily: baseFont,
});

const footerLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 400,
  fontSize: "0.98rem",
  cursor: "pointer",
  fontFamily: baseFont,
};

const bottomLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "0.88rem",
  fontWeight: 400,
  margin: "0 0.3vw",
  display: "inline-block",
  fontFamily: baseFont,
};

const bottomCreditStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 400,
  fontSize: "0.88rem",
  fontFamily: baseFont,
};

export default VisaFooterBlock;
