import React from "react";
import qrCode from "../assets/whatsapp-qr.png"; // Adjust path as needed

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const VisaFooterBlock = () => (
  <div>
    {/* === VISA DESTINATIONS SECTION === */}
    <section style={styles.section}>
      {/* Left Column */}
      <div style={styles.leftCol}>
        <h1 style={styles.heading}>Visa destinations</h1>
        <div style={styles.textBlock}>
          <p>
            Discover visa destinations that inspire your next adventure.<br />
            Explore curated visa options for every kind of traveler.<br />
            Your journey begins here.
          </p>
        </div>
        <button style={styles.button}>Discover visa destinations</button>
      </div>
      {/* Right Column */}
      <div style={styles.rightCol}>
       <h1 style={styles.newsHeading}>
  <span style={{ fontWeight: 700 }}>Helloviza.com</span>
</h1>
        <div style={styles.subtext}>
          If you are using a mobile device, simply click on the QR code.
        </div>
        <img
          src={qrCode}
          alt="WhatsApp Newsletter QR"
          style={styles.qrImg}
        />
        <div style={styles.rightTextBlock}>
          Every destination is a new chapter; chase the story that sets your heart free.
        </div>
        <form style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email address"
          />
          <button type="submit" style={styles.subscribeBtn}>Subscribe</button>
        </form>
      </div>
    </section>

    {/* === VISIBLE DIVIDER === */}
    <div style={styles.divider}></div>

    {/* === FOOTER SECTION === */}
    <footer style={styles.footer}>
      {/* Columns */}
      <div style={styles.row}>
        <div style={styles.col}>
          <div style={styles.headingFooter}>DISCOVER</div>
          <a href="/" style={styles.link}>Home</a>
          <a href="/blog" style={styles.link}>Blog</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </div>
        <div style={styles.col}>
          <div style={styles.headingFooter}>MANAGEMENT</div>
          <a href="/about" style={styles.link}>About Us</a>
          <a href="/careers" style={styles.link}>Career</a>
        </div>
        <div style={styles.col}>
          <div style={styles.headingFooter}>OUR SERVICE</div>
          <a href="#" style={styles.link}>Book my Visa</a>
          <a href="#" style={styles.link}>Hot Visa Destination</a>
        </div>
        <div style={styles.col}>
          <div style={styles.headingFooter}>SOCIAL MEDIA</div>
          <a href="#" style={styles.link}>Instagram</a>
          <a href="#" style={styles.link}>YouTube</a>
          <a href="#" style={styles.link}>Facebook</a>
        </div>
      </div>
      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <div style={styles.left}>&copy; {new Date().getFullYear()} Helloviza, All rights reserved</div>
        <div style={styles.center}>
          <a href="/privacy" style={styles.bottomLink}>Privacy Policy</a>
          <a href="/terms" style={styles.bottomLink}>Terms of Use</a>
          <a href="/Newsroom" style={styles.bottomLink}>Newsroom</a>
        </div>
        <div style={styles.right}>
          <a href="#" style={styles.bottomCredit}>Helloviza’s website</a>
        </div>
      </div>
    </footer>
  </div>
);

const styles = {
  // --- VISA DESTINATIONS SECTION ---
  section: {
    display: "flex",
    flexDirection: "row",
    background: "#d06549",
    color: "#fff",
    padding: "2.4rem 3vw 1.6rem 3vw",
    minHeight: "352px",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "4vw",
    fontFamily: baseFont,
    borderBottom: "1px solid #222",
  },
  leftCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingRight: "2.4vw",
    minWidth: "232px",
    maxWidth: "424px",
    rowGap: "1rem",
    fontFamily: baseFont,
  },
  heading: {
    fontSize: "1.84rem",
    fontWeight: 700,
    margin: 0,
    marginBottom: "0.72rem",
    lineHeight: 1.08,
    letterSpacing: ".01em",
    fontFamily: baseFont,
  },
  textBlock: {
    fontSize: "0.90rem",
    fontWeight: 400,
    marginBottom: "0.8rem",
    lineHeight: 1.34,
    maxWidth: 336,
    fontFamily: baseFont,
  },
  button: {
    fontSize: "0.94rem",
    fontWeight: 500,
    background: "#f3f3f3",
    color: "#00477f",
    border: "none",
    borderRadius: "8px",
    padding: "0.6rem 1.2rem",
    cursor: "pointer",
    marginTop: "0.24rem",
    minWidth: 176,
    minHeight: 33,
    textAlign: "center",
    fontFamily: baseFont,
  },
  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    minWidth: "232px",
    maxWidth: "424px",
    paddingLeft: "2.4vw",
    rowGap: "0.8rem",
    fontFamily: baseFont,
  },
  newsHeading: {
    fontSize: "1.52rem",
    fontWeight: 600,
    margin: 0,
    marginBottom: "0.4rem",
    lineHeight: 1.1,
    fontFamily: baseFont,
  },
  subtext: {
    color: "#ffffff",
    fontSize: "0.8rem",
    fontWeight: 400,
    marginBottom: "0.48rem",
    fontFamily: baseFont,
  },
  qrImg: {
    width: 88,
    height: 88,
    background: "#fff",
    borderRadius: "7px",
    border: "2px solid #fff",
    marginBottom: "0.56rem",
    marginTop: "0.24rem",
    objectFit: "contain",
    display: "block",
  },
  rightTextBlock: {
    fontSize: "0.8rem",
    fontWeight: 400,
    marginBottom: "0.8rem",
    maxWidth: 296,
    lineHeight: 1.26,
    fontFamily: baseFont,
  },
  form: {
    display: "flex",
    width: "100%",
    maxWidth: 272,
    gap: "0.32rem",
    fontFamily: baseFont,
  },
  input: {
    flex: 1,
    padding: "0.56rem",
    fontSize: "0.8rem",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    background: "#ffffff",
    color: "#00477f",
    fontFamily: baseFont,
  },
  subscribeBtn: {
    padding: "0.56rem 0.96rem",
    fontSize: "0.8rem",
    background: "#f3f3f3",
    color: "#00477f",
    borderRadius: "6px",
    border: "none",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: baseFont,
  },

  // --- DIVIDER STYLE ---
  divider: {
    width: "100%",
    height: "6px",
    background: "linear-gradient(90deg, #fff 0%, #48b4e0 80%, #fff 100%)",
    boxShadow: "0 1px 18px #48b4e080, 0 0px 0 #000, 0 2px 24px #fff2",
    margin: "0",
    border: "none",
    outline: "none",
  },

  // --- FOOTER SECTION ---
  footer: {
    background: "#d06549",
    color: "#fff",
    width: "100vw",
    padding: "0 0 0.32rem 0",
    margin: 0,
    boxSizing: "border-box",
    borderTop: "1px solid #222",
    fontFamily: baseFont,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "2.4rem 2.8vw 0.96rem 2.8vw",
    margin: 0,
    borderBottom: "1px solid #222",
    fontFamily: baseFont,
  },
  col: {
    flex: "1 1 0",
    minWidth: "128px",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.56rem",
    fontFamily: baseFont,
  },
  headingFooter: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1.2rem",
    marginBottom: "0.8rem",
    marginTop: 0,
    letterSpacing: "0.016em",
    textTransform: "uppercase",
    fontFamily: baseFont,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 400,
    fontSize: "0.98rem",
    cursor: "pointer",
    fontFamily: baseFont,
  },
  bottomBar: {
    width: "100vw",
    margin: 0,
    padding: "0.8rem 2.8vw 0.32rem 2.8vw",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#d06549",
    fontFamily: baseFont,
  },
  left: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.96rem",
    fontFamily: baseFont,
  },
  center: {
    display: "flex",
    gap: "1.6vw",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    fontFamily: baseFont,
  },
  bottomLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.88rem",
    fontWeight: 400,
    margin: "0 0.56vw",
    display: "inline-block",
    fontFamily: baseFont,
  },
  right: {
    color: "#ffffff",
    fontWeight: 400,
    fontSize: "0.88rem",
    minWidth: 112,
    textAlign: "right",
    fontFamily: baseFont,
  },
  bottomCredit: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 400,
    fontSize: "0.88rem",
    fontFamily: baseFont,
  }
};

export default VisaFooterBlock;
