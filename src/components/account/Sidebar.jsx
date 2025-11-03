import React from "react";
import { NavLink } from "react-router-dom";
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
  const links = [
    { to: "/account/profile", label: "My Profile", icon: <FaUser /> },
    { to: "/account/documents", label: "Documents", icon: <FaPassport /> },
    { to: "/account/visa-history", label: "Visa History", icon: <FaHistory /> },
    { to: "/account/saved", label: "Saved Applications", icon: <FaBookmark /> },
    { to: "/account/wishlist", label: "Wishlist", icon: <FaHeart /> },
    { to: "/account/wallet", label: "Wallet", icon: <FaWallet /> },
    { to: "/account/referrals", label: "Referrals", icon: <FaUserFriends /> },
    { to: "/account/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <aside style={S.sidebar}>
      <h2 style={S.title}>My Account</h2>
      <nav style={S.nav}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            style={({ isActive }) => ({
              ...S.link,
              ...(isActive ? S.activeLink : {}),
            })}
          >
            <span style={S.icon}>{item.icon}</span>
            {item.label}
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
    top: 120, // ✅ aligns below fixed header
    marginTop: "50px", // ensure no double offset
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
    transform: "translateX(4px)",
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
      transform: translateX(3px);
    }
    aside a:hover span {
      transform: scale(1.15);
    }
  `;
  document.head.appendChild(styleEl);
}
