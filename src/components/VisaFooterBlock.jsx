import React from "react";
import qrCode from "../assets/whatsapp-qr.png"; // Adjust path as needed

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Responsive helpers
function useScreenSize() {
  if (typeof window === "undefined") return { mobile: false, tab: false, width: 1200 };
  const width = window.innerWidth;
  return {
    mobile: width < 700,
    tab: width < 1050,
    width,
  };
}

const VisaFooterBlock = () => {
  const { mobile, tab } = useScreenSize();

  // --- MOBILE overrides ---
  const colStack = mobile;
  const padSection = mobile ? "1.5rem 3vw 1rem 3vw" : "2.4rem 3vw 1.6rem 3vw";
  const rowDir = colStack ? "column" : "row";
  const align = colStack ? "center" : "flex-start";
  const qrSize = mobile ? 66 : 88;
  const footerRowDir = mobile ? "column" : "row";
  const padFooter = mobile ? "1.5rem 4vw 1rem 4vw" : "2.4rem 2.8vw 0.96rem 2.8vw";
  const bottomBarPad = mobile ? "0.8rem 4vw 0.32rem 4vw" : "0.8rem 2.8vw 0.32rem 2.8vw";
  const colAlign = mobile ? "center" : "flex-start";
  const colGap = mobile ? "1.5rem" : 0;
  const dividerHeight = mobile ? 3 : 6;

  // --- RENDER ---
  return (
    <div>
      {/* === VISA DESTINATIONS SECTION === */}
      <section
        style={{
          display: "flex",
          flexDirection: rowDir,
          background: "#d06549",
          color: "#fff",
          padding: padSection,
          minHeight: mobile ? "auto" : "352px",
          width: "100%",
          justifyContent: "space-between",
          alignItems: align,
          gap: colStack ? "2.2rem" : "4vw",
          fontFamily: baseFont,
          borderBottom: "1px solid #222",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: colAlign,
            justifyContent: "center",
            paddingRight: colStack ? 0 : "2.4vw",
            minWidth: 232,
            maxWidth: 424,
            rowGap: "1rem",
            fontFamily: baseFont,
            marginBottom: colStack ? "2.2rem" : 0,
            textAlign: colStack ? "center" : "left",
            gap: colGap,
          }}
        >
          <h1
            style={{
              fontSize: mobile ? "1.25rem" : "1.84rem",
              fontWeight: 700,
              margin: 0,
              marginBottom: "0.52rem",
              lineHeight: 1.08,
              letterSpacing: ".01em",
              fontFamily: baseFont,
            }}
          >
            Visa destinations
          </h1>
          <div
            style={{
              fontSize: mobile ? "0.88rem" : "0.96rem",
              fontWeight: 400,
              marginBottom: "0.7rem",
              lineHeight: 1.34,
              maxWidth: mobile ? 320 : 336,
              fontFamily: baseFont,
            }}
          >
            <p style={{ margin: 0 }}>
              Discover visa destinations that inspire your next adventure.<br />
              Explore curated visa options for every kind of traveler.<br />
              Your journey begins here.
            </p>
          </div>
          <button
            style={{
              fontSize: mobile ? "0.92rem" : "0.98rem",
              fontWeight: 500,
              background: "#f3f3f3",
              color: "#00477f",
              border: "none",
              borderRadius: "8px",
              padding: mobile ? "0.52rem 0.8rem" : "0.6rem 1.2rem",
              cursor: "pointer",
              marginTop: "0.15rem",
              minWidth: 146,
              minHeight: 30,
              textAlign: "center",
              fontFamily: baseFont,
              width: mobile ? "100%" : "auto",
            }}
          >
            Discover visa destinations
          </button>
        </div>
        {/* Right Column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: colAlign,
            justifyContent: "center",
            minWidth: 232,
            maxWidth: 424,
            paddingLeft: colStack ? 0 : "2.4vw",
            rowGap: "0.8rem",
            fontFamily: baseFont,
            textAlign: colStack ? "center" : "left",
          }}
        >
          <h1
            style={{
              fontSize: mobile ? "1.07rem" : "1.52rem",
              fontWeight: 600,
              margin: 0,
              marginBottom: "0.4rem",
              lineHeight: 1.1,
              fontFamily: baseFont,
            }}
          >
            <span style={{ fontWeight: 700 }}>Helloviza.com</span>
          </h1>
          <div
            style={{
              color: "#ffffff",
              fontSize: mobile ? "0.7rem" : "0.8rem",
              fontWeight: 400,
              marginBottom: "0.34rem",
              fontFamily: baseFont,
            }}
          >
            If you are using a mobile device, simply click on the QR code.
          </div>
          <img
            src={qrCode}
            alt="WhatsApp Newsletter QR"
            style={{
              width: qrSize,
              height: qrSize,
              background: "#fff",
              borderRadius: "7px",
              border: "2px solid #fff",
              marginBottom: "0.38rem",
              marginTop: "0.19rem",
              objectFit: "contain",
              display: "block",
              marginLeft: colStack ? "auto" : undefined,
              marginRight: colStack ? "auto" : undefined,
            }}
          />
          <div
            style={{
              fontSize: mobile ? "0.72rem" : "0.8rem",
              fontWeight: 400,
              marginBottom: "0.65rem",
              maxWidth: 296,
              lineHeight: 1.26,
              fontFamily: baseFont,
              marginLeft: colStack ? "auto" : undefined,
              marginRight: colStack ? "auto" : undefined,
            }}
          >
            Every destination is a new chapter; chase the story that sets your heart free.
          </div>
          <form
            style={{
              display: "flex",
              width: "100%",
              maxWidth: mobile ? 220 : 272,
              gap: "0.32rem",
              fontFamily: baseFont,
              flexDirection: colStack ? "column" : "row",
              margin: colStack ? "0 auto" : 0,
            }}
          >
            <input
              style={{
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
              }}
              type="email"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              style={{
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
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* === VISIBLE DIVIDER === */}
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
      ></div>

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
            <div
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: mobile ? "1rem" : "1.2rem",
                marginBottom: "0.6rem",
                marginTop: 0,
                letterSpacing: "0.016em",
                textTransform: "uppercase",
                fontFamily: baseFont,
              }}
            >
              DISCOVER
            </div>
            <a href="/" style={footerLinkStyle}>Home</a>
            <a href="/blog" style={footerLinkStyle}>Blog</a>
            <a href="/contact" style={footerLinkStyle}>Contact</a>
          </div>
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
            <div
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: mobile ? "1rem" : "1.2rem",
                marginBottom: "0.6rem",
                marginTop: 0,
                letterSpacing: "0.016em",
                textTransform: "uppercase",
                fontFamily: baseFont,
              }}
            >
              MANAGEMENT
            </div>
            <a href="/about" style={footerLinkStyle}>About Us</a>
            <a href="/careers" style={footerLinkStyle}>Career</a>
          </div>
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
            <div
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: mobile ? "1rem" : "1.2rem",
                marginBottom: "0.6rem",
                marginTop: 0,
                letterSpacing: "0.016em",
                textTransform: "uppercase",
                fontFamily: baseFont,
              }}
            >
              OUR SERVICE
            </div>
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
            <div
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: mobile ? "1rem" : "1.2rem",
                marginBottom: "0.6rem",
                marginTop: 0,
                letterSpacing: "0.016em",
                textTransform: "uppercase",
                fontFamily: baseFont,
              }}
            >
              SOCIAL MEDIA
            </div>
            <a href="#" style={footerLinkStyle}>Instagram</a>
            <a href="#" style={footerLinkStyle}>YouTube</a>
            <a href="#" style={footerLinkStyle}>Facebook</a>
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

// Footer link style
const footerLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 400,
  fontSize: "0.98rem",
  cursor: "pointer",
  fontFamily: "'Barlow Condensed', Arial, sans-serif",
};
// Bottom link style
const bottomLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "0.88rem",
  fontWeight: 400,
  margin: "0 0.3vw",
  display: "inline-block",
  fontFamily: "'Barlow Condensed', Arial, sans-serif",
};
// Bottom credit style
const bottomCreditStyle = {
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 400,
  fontSize: "0.88rem",
  fontFamily: "'Barlow Condensed', Arial, sans-serif",
};

export default VisaFooterBlock;
