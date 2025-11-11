import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaPassport,
  FaHistory,
  FaBookmark,
  FaHeart,
  FaWallet,
  FaUserFriends,
  FaCog,
} from "react-icons/fa";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

export default function AccountSidebar() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("ar");

  const links = [
    { to: "/account/profile", labelKey: "account.profile.tabs.profile", icon: <FaUser /> },
    { to: "/account/documents", labelKey: "account.documents.title", icon: <FaPassport /> },
    { to: "/account/visa-history", labelKey: "account.visaHistory.title", icon: <FaHistory /> },
    { to: "/account/saved", labelKey: "account.savedApplications.title", icon: <FaBookmark /> },
    { to: "/account/wishlist", labelKey: "account.wishlist.title", icon: <FaHeart /> },
    { to: "/account/wallet", labelKey: "account.wallet.title", icon: <FaWallet /> },
    { to: "/account/referrals", labelKey: "account.referrals.title", icon: <FaUserFriends /> },
    { to: "/account/settings", labelKey: "account.settings.title", icon: <FaCog /> },
  ];

  return (
    <aside
      style={{
        ...S.sidebar,
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* You can add a dedicated i18n key later if you want this translated */}
      <h2 style={S.title}>{t("nav.user", "My Account")}</h2>

      <nav style={S.nav}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            style={({ isActive }) => {
              const base = {
                ...S.link,
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: isRTL ? "flex-end" : "flex-start",
              };
              const active = isActive
                ? {
                    ...S.activeLink,
                    transform: isRTL ? "translateX(-4px)" : "translateX(4px)",
                  }
                : {};
              return { ...base, ...active };
            }}
          >
            <span style={S.icon}>{item.icon}</span>
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

/* ===== Styling ===== */
const S = {
  sidebar: {
    width: 250,
    minHeight: "100vh",
    background: "linear-gradient(180deg, #00477f, #0d2340)",
    padding: "2rem 1rem",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: baseFont,
    position: "sticky",
    top: 120, // aligns below fixed header
    marginTop: "50px",
    boxShadow: "4px 0 10px rgba(0,0,0,0.25)",
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: "2rem",
    borderBottom: "2px solid rgba(255,255,255,0.2)",
    paddingBottom: ".8rem",
    letterSpacing: 0.5,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  link: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.85)",
    fontWeight: 600,
    fontSize: 17,
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: ".7rem 1rem",
    borderRadius: 10,
    position: "relative",
    background:
      "linear-gradient(90deg, rgba(208,101,73,0) 0%, rgba(255,255,255,0.08) 100%)",
    transition: "all 0.35s ease",
  },
  activeLink: {
    background: "linear-gradient(90deg, #d06549, #00477f)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
  },
  icon: {
    fontSize: 18,
    color: "#fff",
    transition: "transform 0.3s ease",
  },
};

/* ===== Hover Enhancements via Inline Style Injection ===== */
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    aside a:hover {
      background: linear-gradient(90deg, rgba(208,101,73,0.8), rgba(0,71,127,0.9));
      color: #fff !important;
    }
    aside a:hover span {
      transform: scale(1.15);
    }
  `;
  document.head.appendChild(styleEl);
}
