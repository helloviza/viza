// src/components/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/helloviza-logo.png"; // Image logo from old Header

/* ── Social Icons ── */
const LinkedInIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const HamburgerIcon = ({ color = "#00477f" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="2.5" rx="1.25" fill={color}/>
    <rect x="2" y="11" width="20" height="2.5" rx="1.25" fill={color}/>
    <rect x="2" y="17" width="20" height="2.5" rx="1.25" fill={color}/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

/* ── Constants ── */
const SOCIAL_LINKS = [
  { name: "LinkedIn",  href: "https://linkedin.com/company/helloviza",  Icon: LinkedInIcon },
  { name: "X",         href: "https://x.com/helloviza",                 Icon: XIcon },
  { name: "Facebook",  href: "https://facebook.com/helloviza",           Icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com/helloviza",          Icon: InstagramIcon },
  { name: "YouTube",   href: "https://youtube.com/@helloviza",           Icon: YouTubeIcon },
];

/* ── 1. LANGUAGE: Available languages with API locale codes ── */
const LANG_OPTIONS = [
  { code: "en", label: "English",  apiLocale: "en-US" },
  { code: "ar", label: "العربية", apiLocale: "ar-AE" },
];

/* ── Security helpers ── */
const LOGIN_REDIRECT_KEY = "postLoginRedirect";
const VISA_INTENT_KEY    = "HV:VISA_INTENT_TS";

/** 2. AUTH: Read cached user from localStorage safely */
function getCachedUser() {
  try {
    const raw = localStorage.getItem("hv_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 2. AUTH: Get best display name from user object */
function pickDisplayName(u) {
  if (!u) return "";
  const p = u.profile || {};
  const first =
    p.firstName ||
    u.firstName ||
    (typeof u.name === "string" && u.name.split(" ")[0]) ||
    "";
  if (first && first.trim()) return first.trim();
  const email = u.email || p.email;
  if (email && email.includes("@")) return email.split("@")[0];
  return "";
}

/** 2. AUTH: Sanitise redirect targets to prevent open-redirect attacks */
function sanitiseRedirect(raw) {
  if (!raw) return "/";
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

const BASE_FONT = "'Inter', sans-serif";

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function NewHeader({ user, onLogout }) {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  /* 1. LANGUAGE: draft state for modal */
  const [currentLang, setCurrentLang]   = useState(() => localStorage.getItem("hv_lang") || "en");
  const [draftLang, setDraftLang]       = useState(currentLang);

  /* 2. AUTH: merge prop user with localStorage cache; sync on storage events */
  const [effectiveUser, setEffectiveUser] = useState(() => user || getCachedUser());

  const navigate  = useNavigate();
  const location  = useLocation();
  const dropdownRef = useRef(null);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body scroll when mobile drawer open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* 2. AUTH: Keep effectiveUser in sync with prop changes and storage events */
  useEffect(() => {
    const sync = () => setEffectiveUser(user || getCachedUser());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [user]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Close dropdown on route change ── */
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  /* 1. LANGUAGE: Apply lang to <html> for RTL/LTR support */
  useEffect(() => {
    const opt = LANG_OPTIONS.find((o) => o.code === currentLang) || LANG_OPTIONS[0];
    document.documentElement.lang = opt.apiLocale;
    document.documentElement.dir  = currentLang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("hv_lang", currentLang); } catch {}
  }, [currentLang]);

  /* 1. LANGUAGE: Save language choice — calls i18n API if available */
  const applyLanguage = useCallback(async () => {
    const opt = LANG_OPTIONS.find((o) => o.code === draftLang) || LANG_OPTIONS[0];

    /* If app uses i18next (optional — safe no-op if not present) */
    if (window.__i18n && typeof window.__i18n.changeLanguage === "function") {
      await window.__i18n.changeLanguage(draftLang);
    }

    setCurrentLang(draftLang);
    setShowLangModal(false);
  }, [draftLang]);

  /* 2. AUTH: Logout — clears all auth tokens and redirects */
  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    try {
      /* Clear all auth-related storage keys */
      [
        "hv_user", "hv_token", "helloviza_user",
        LOGIN_REDIRECT_KEY, VISA_INTENT_KEY,
      ].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch {}
    onLogout?.();
    navigate("/");
  }, [navigate, onLogout]);

  const displayName = pickDisplayName(effectiveUser);
  const initial     = (displayName?.[0] || "U").toUpperCase();
  const currentLangLabel = LANG_OPTIONS.find((o) => o.code === currentLang)?.label || "English";

  return (
    <>
      {/* ════════════════════════════════════════════════
          SINGLE UNIFIED HEADER BAR
      ════════════════════════════════════════════════ */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        fontFamily: BASE_FONT,
        background: "#f1f1f1",
        boxShadow: scrolled ? "0 2px 18px rgba(0,71,127,0.10)" : "none",
        transition: "box-shadow 0.3s",
        borderBottom: "1px solid #e8eef5",
      }}>
        <div style={styles.barInner}>

          {/* LEFT: Socials + Email */}
          <div style={styles.leftSection} className="hv-desktop-only">
            <div style={styles.socials}>
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  style={styles.socialLink}
                  onMouseEnter={e => e.currentTarget.style.color = "#d06549"}
                  onMouseLeave={e => e.currentTarget.style.color = "#00477f"}
                >
                  <Icon />
                </a>
              ))}
            </div>
            <span style={styles.email}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              hello@helloviza.com
            </span>
          </div>

          {/* CENTER: Image logo (from old Header) */}
          <Link to="/" style={styles.logoWrap} aria-label="helloviza home">
            <img src={logo} alt="helloviza" style={styles.logoImg} />
          </Link>

          {/* RIGHT: Language + Auth + Mobile burger */}
          <div style={styles.rightSection}>

            {/* 1. LANGUAGE: Selector button (desktop) */}
            <button
              className="hv-desktop-only"
              style={styles.langBtn}
              onClick={() => { setDraftLang(currentLang); setShowLangModal(true); }}
              aria-label="Change language"
            >
              <GlobeIcon />
              <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 4 }}>{currentLangLabel}</span>
              <ChevronDown />
            </button>

            {/* 2. AUTH: User menu or Login */}
            {effectiveUser ? (
              <div ref={dropdownRef} style={{ position: "relative" }} className="hv-desktop-only">
                <button
                  style={styles.userBtn}
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar circle with initial */}
                  <div style={styles.avatar}>{initial}</div>
                  {/* 3. USERNAME: Display name */}
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#00477f", marginLeft: 6 }}>
                    {displayName || "Account"}
                  </span>
                  <ChevronDown />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div style={styles.dropdown}>
                    <Link to="/account/profile"      style={styles.dropItem} onClick={() => setDropdownOpen(false)}>My Profile</Link>
                    <Link to="/account/visa-history" style={styles.dropItem} onClick={() => setDropdownOpen(false)}>My Visa History</Link>
                    <Link to="/account/wallet"       style={styles.dropItem} onClick={() => setDropdownOpen(false)}>My Wallet</Link>
                    <Link to="/account/documents"    style={styles.dropItem} onClick={() => setDropdownOpen(false)}>My Documents</Link>
                    <Link to="/account/wishlist"     style={styles.dropItem} onClick={() => setDropdownOpen(false)}>My Wishlist</Link>
                    <div style={{ height: 1, background: "#e8eef5", margin: "4px 0" }} />
                    <button style={styles.logoutItem} onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={styles.loginBtn}
                className="hv-desktop-only"
                onClick={() => {
                  /* 2. AUTH: Save intended destination before redirecting to login */
                  const dest = sanitiseRedirect(location.pathname + location.search);
                  if (dest !== "/" && dest !== "/login") {
                    try { sessionStorage.setItem(LOGIN_REDIRECT_KEY, dest); } catch {}
                  }
                }}
              >
                Login
              </Link>
            )}

            {/* Mobile: hamburger */}
            <button
              className="hv-mobile-only"
              style={styles.hamburgerBtn}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div style={styles.drawerOverlay} onClick={() => setMobileOpen(false)}>
          <div style={styles.drawer} onClick={e => e.stopPropagation()}>

            {/* Drawer header with logo */}
            <div style={styles.drawerHead}>
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <img src={logo} alt="helloviza" style={{ height: 36, objectFit: "contain" }} />
              </Link>
              <button style={styles.closeBtn} onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d06549" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div style={styles.drawerDivider} />

            {/* 2. AUTH: Mobile user info or login */}
            {effectiveUser ? (
              <div style={{ padding: "14px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={styles.avatar}>{initial}</div>
                  <span style={{ fontWeight: 700, color: "#00477f", fontSize: 16 }}>{displayName}</span>
                </div>
                <Link to="/account/profile"      style={styles.drawerLink} onClick={() => setMobileOpen(false)}>My Profile</Link>
                <Link to="/account/visa-history" style={styles.drawerLink} onClick={() => setMobileOpen(false)}>My Visa History</Link>
                <Link to="/account/wallet"       style={styles.drawerLink} onClick={() => setMobileOpen(false)}>My Wallet</Link>
                <Link to="/account/documents"    style={styles.drawerLink} onClick={() => setMobileOpen(false)}>My Documents</Link>
                <Link to="/account/wishlist"     style={styles.drawerLink} onClick={() => setMobileOpen(false)}>My Wishlist</Link>
                <button style={{ ...styles.drawerLink, color: "#d06549", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{ ...styles.loginBtn, margin: "14px 20px", display: "inline-block" }}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}

            <div style={styles.drawerDivider} />

            {/* 1. LANGUAGE: Mobile language selector */}
            <div style={{ padding: "14px 20px" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#00477f", fontSize: 14 }}>Language</p>
              <div style={{ display: "flex", gap: 8 }}>
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 8,
                      border: `1.5px solid ${currentLang === opt.code ? "#00477f" : "#dce8f3"}`,
                      background: currentLang === opt.code ? "#00477f" : "#f1f1f1",
                      color: currentLang === opt.code ? "#f1f1f1" : "#00477f",
                      fontFamily: BASE_FONT,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                    onClick={() => { setCurrentLang(opt.code); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.drawerDivider} />

            {/* Socials */}
            <div style={{ display: "flex", gap: 16, padding: "14px 20px" }}>
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#00477f" }} aria-label={name}>
                  <Icon />
                </a>
              ))}
            </div>

            <div style={styles.drawerDivider} />

            <p style={{ padding: "10px 20px", fontSize: 13, color: "#4a6880", margin: 0 }}>
              hello@helloviza.com
            </p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          1. LANGUAGE: Modal (desktop)
      ════════════════════════════════════════════════ */}
      {showLangModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowLangModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose language"
        >
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "#00477f", fontFamily: BASE_FONT, fontWeight: 800, fontSize: 20 }}>
                Language
              </h3>
              <button
                onClick={() => setShowLangModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#4a6880", fontSize: 22 }}
                aria-label="Close"
              >×</button>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => setDraftLang(opt.code)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: `2px solid ${draftLang === opt.code ? "#00477f" : "#dce8f3"}`,
                    background: draftLang === opt.code ? "#f0f6ff" : "#f1f1f1",
                    color: draftLang === opt.code ? "#00477f" : "#4a6880",
                    fontFamily: BASE_FONT,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{opt.apiLocale}</div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setShowLangModal(false)}
                style={{ ...styles.modalBtn, background: "#f1f1f1", color: "#00477f", border: "1.5px solid #00477f" }}
              >
                Cancel
              </button>
              <button
                onClick={applyLanguage}
                style={{ ...styles.modalBtn, background: "#00477f", color: "#fff", border: "none" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .hv-desktop-only { display: flex !important; }
        .hv-mobile-only  { display: none  !important; }

        @media (max-width: 860px) {
          .hv-desktop-only { display: none  !important; }
          .hv-mobile-only  { display: flex  !important; }
        }

        @keyframes hvSlideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

/* ════════════════════════════════════════════════
   Styles
════════════════════════════════════════════════ */
const BASE = "'Inter', sans-serif";

const styles = {
  /* Single unified bar */
  barInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 28px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flex: "0 0 auto",
  },
  socials: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  socialLink: {
    color: "#00477f",
    display: "flex",
    alignItems: "center",
    transition: "color 0.18s",
    textDecoration: "none",
  },
  email: {
    fontSize: 12,
    color: "#4a6880",
    fontFamily: BASE,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },

  /* 3. LOGO: Center image logo */
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    flex: "1 1 auto",
  },
  logoImg: {
    height: 42,
    objectFit: "contain",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
  },

  /* 1. LANGUAGE */
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 10px",
    borderRadius: 8,
    border: "1px solid #dce8f3",
    background: "transparent",
    color: "#00477f",
    fontFamily: BASE,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "border-color 0.2s",
  },

  /* 2. AUTH: Avatar circle */
  avatar: {
    backgroundColor: "#d06549",
    color: "#fff",
    borderRadius: "50%",
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 900,
    fontSize: 14,
    fontFamily: BASE,
    flexShrink: 0,
  },

  /* 2. AUTH: User button */
  userBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "transparent",
    border: "1px solid #dce8f3",
    borderRadius: 8,
    padding: "4px 10px 4px 6px",
    cursor: "pointer",
    fontFamily: BASE,
    transition: "border-color 0.2s",
  },

  /* 2. AUTH: Dropdown */
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#f1f1f1",
    borderRadius: 10,
    padding: "8px",
    boxShadow: "0 10px 28px rgba(0,71,127,0.13)",
    display: "flex",
    flexDirection: "column",
    minWidth: 200,
    zIndex: 1001,
    border: "1px solid #e8eef5",
  },
  dropItem: {
    padding: "9px 12px",
    textDecoration: "none",
    color: "#00477f",
    fontWeight: 600,
    fontFamily: BASE,
    fontSize: 14,
    borderRadius: 6,
    display: "block",
    transition: "background 0.15s",
  },
  logoutItem: {
    padding: "9px 12px",
    background: "transparent",
    border: "none",
    color: "#d06549",
    textAlign: "left",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: BASE,
    fontSize: 14,
    borderRadius: 6,
    width: "100%",
  },

  loginBtn: {
    background: "#d06549",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
    fontFamily: BASE,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.04em",
    padding: "8px 20px",
    transition: "background 0.18s",
    whiteSpace: "nowrap",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },

  hamburgerBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 6,
  },

  /* Mobile Drawer */
  drawerOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 1200,
    display: "flex",
    justifyContent: "flex-end",
  },
  drawer: {
    width: "min(84vw, 330px)",
    height: "100%",
    background: "#f1f1f1",
    boxShadow: "-4px 0 28px rgba(0,71,127,0.13)",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    animation: "hvSlideIn 0.26s cubic-bezier(0.22,1,0.36,1)",
  },
  drawerHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px 14px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 4,
    borderRadius: 6,
  },
  drawerDivider: {
    height: 1,
    background: "#e8eef5",
  },
  drawerLink: {
    display: "block",
    padding: "10px 0",
    color: "#00477f",
    fontFamily: BASE,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: "none",
    borderBottom: "1px solid #f0f6fc",
  },

  /* Language Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 1400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "min(480px, 92vw)",
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
    fontFamily: BASE,
  },
  modalBtn: {
    padding: "10px 22px",
    borderRadius: 8,
    fontFamily: BASE,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
};