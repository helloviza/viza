// client/src/components/VisaFooterBlock.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

/** Responsive helper with resize listener (footer-only) */
function useScreenSize() {
  const get = () =>
    typeof window === "undefined"
      ? { mobile: false, width: 1200 }
      : { mobile: window.innerWidth < 700, width: window.innerWidth };
  const [s, setS] = useState(get);
  useEffect(() => {
    const onR = () => setS(get());
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return s;
}

const VisaFooterBlock = () => {
  const { t } = useTranslation("common");
  const { mobile } = useScreenSize();

  const footerRowDir = mobile ? "column" : "row";
  const padFooter = mobile ? "2.4rem 4vw 1rem 4vw" : "2.4rem 2.8vw 0.96rem 2.8vw";
  const bottomBarPad = mobile ? "0.8rem 4vw 0.32rem 4vw" : "0.8rem 2.8vw 0.32rem 2.8vw";
  const colAlign = mobile ? "center" : "flex-start";
  const colStack = mobile;
  const dividerHeight = mobile ? 3 : 6;

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
      {/* Divider above footer */}
      <div
        style={{
          width: "100%",
          height: dividerHeight,
          background: "linear-gradient(90deg, #fff 0%, #48b4e0 80%, #fff 100%)",
          boxShadow: "0 1px 18px #48b4e080, 0 0px 0 #000, 0 2px 24px #fff2",
          margin: 0,
          border: "none",
          outline: "none",
        }}
      />

      {/* === FOOTER === */}
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
          <div style={colWrapStyle(colAlign, colStack, mobile)}>
            <div style={colHeaderStyle(mobile)}>{t("footer.headings.discover", { defaultValue: "DISCOVER" })}</div>
            <Link to="/" style={footerLinkStyle}>{t("footer.links.home", { defaultValue: "Home" })}</Link>
            <Link to="/blog" style={footerLinkStyle}>{t("footer.links.blog", { defaultValue: "Blog" })}</Link>
            <Link to="/contact" style={footerLinkStyle}>{t("footer.links.contact", { defaultValue: "Contact" })}</Link>
          </div>

          {/* MANAGEMENT */}
          <div style={colWrapStyle(colAlign, colStack, mobile)}>
            <div style={colHeaderStyle(mobile)}>{t("footer.headings.management", { defaultValue: "MANAGEMENT" })}</div>
            <Link to="/about" style={footerLinkStyle}>{t("footer.links.about", { defaultValue: "About Us" })}</Link>
            <Link to="/careers" style={footerLinkStyle}>{t("footer.links.careers", { defaultValue: "Career" })}</Link>
          </div>

          {/* OUR SERVICE */}
          <div style={colWrapStyle(colAlign, colStack, mobile)}>
            <div style={colHeaderStyle(mobile)}>{t("footer.headings.ourService", { defaultValue: "OUR SERVICE" })}</div>
            <a
              href="https://www.plumtrips.com"
              style={footerLinkStyle}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.aria.bookFlight", { defaultValue: "Book my Flight on PlumTrips (opens in a new tab)" })}
            >
              {t("footer.links.bookFlight", { defaultValue: "Book my Flight" })}
            </a>
            <a
              href="https://www.plumtrips.com"
              style={footerLinkStyle}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.aria.bookHotel", { defaultValue: "Book my Hotel on PlumTrips (opens in a new tab)" })}
            >
              {t("footer.links.bookHotel", { defaultValue: "Book my Hotel" })}
            </a>
          </div>

          {/* SOCIAL MEDIA */}
          <div style={colWrapStyle(colAlign, colStack, mobile)}>
            <div style={colHeaderStyle(mobile)}>{t("footer.headings.socialMedia", { defaultValue: "SOCIAL MEDIA" })}</div>
            <a
              href="https://instagram.com/helloviza"
              target="_blank"
              rel="noopener noreferrer"
              style={footerLinkStyle}
              aria-label={t("footer.aria.instagram", { defaultValue: "Instagram (opens in a new tab)" })}
            >
              {t("footer.links.instagram", { defaultValue: "Instagram" })}
            </a>
            <a
              href="https://www.youtube.com/@helloviza"
              target="_blank"
              rel="noopener noreferrer"
              style={footerLinkStyle}
              aria-label={t("footer.aria.youtube", { defaultValue: "YouTube (opens in a new tab)" })}
            >
              {t("footer.links.youtube", { defaultValue: "YouTube" })}
            </a>
            <a
              href="https://facebook.com/hellovizaofficial"
              target="_blank"
              rel="noopener noreferrer"
              style={footerLinkStyle}
              aria-label={t("footer.aria.facebook", { defaultValue: "Facebook (opens in a new tab)" })}
            >
              {t("footer.links.facebook", { defaultValue: "Facebook" })}
            </a>
          </div>

          {/* SUBSCRIBE */}
          <div style={colWrapStyle(colAlign, colStack, mobile)}>
            <div style={colHeaderStyle(mobile)}>{t("footer.headings.subscribe", { defaultValue: "SUBSCRIBE" })}</div>
            <div style={{ fontSize: mobile ? "0.7rem" : "0.8rem", opacity: 0.95 }}>
              {t("footer.subscribe.blurb", { defaultValue: "Get updates in your inbox." })}
            </div>
            <form style={subscribeFormStyles.wrapper} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("footer.subscribe.placeholder", { defaultValue: "Enter your email address" })}
                style={subscribeFormStyles.input}
                aria-label={t("footer.subscribe.ariaEmail", { defaultValue: "Email address" })}
              />
              <button type="submit" style={subscribeFormStyles.button}>
                {t("footer.subscribe.button", { defaultValue: "Subscribe" })}
              </button>
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
            alignItems: "center",
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
            © {new Date().getFullYear()} {t("footer.bottom.brand", { defaultValue: "Helloviza" })},{" "}
            {t("footer.bottom.allRights", { defaultValue: "All rights reserved" })}
          </div>

          <div
            style={{
              display: "flex",
              gap: mobile ? "0.4rem" : "1.6vw",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              fontFamily: baseFont,
              flexWrap: "wrap",
            }}
          >
            <Link to="/privacy" style={bottomLinkStyle}>{t("footer.bottom.privacy", { defaultValue: "Privacy Policy" })}</Link>
            <Link to="/terms" style={bottomLinkStyle}>{t("footer.bottom.terms", { defaultValue: "Terms of Use" })}</Link>
            <Link to="/newsroom" style={bottomLinkStyle}>{t("footer.bottom.newsroom", { defaultValue: "Newsroom" })}</Link>
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
            <a
              href="https://www.helloviza.com"
              target="_blank"
              rel="noopener noreferrer"
              style={bottomCreditStyle}
            >
              {t("footer.bottom.linkText", { defaultValue: "Helloviza’s website" })}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ===== Small style helpers ===== */
const colWrapStyle = (align, colStack, mobile) => ({
  flex: "1 1 0",
  minWidth: "128px",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: align,
  gap: mobile ? "0.46rem" : "0.56rem",
  fontFamily: baseFont,
  marginBottom: colStack ? "1.3rem" : 0,
});

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
