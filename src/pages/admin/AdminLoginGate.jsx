// helloviza/client/src/pages/admin/AdminLoginGate.jsx
import React, { useEffect, useMemo } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

function isAdminRole(role) {
  const r = String(role || "").toLowerCase().trim();
  return r === "super-admin" || r === "content-editor" || r === "admin";
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    fontFamily: baseFont,
    background:
      "radial-gradient(1200px 800px at 20% 10%, rgba(208,101,73,.20), transparent 60%), radial-gradient(900px 700px at 85% 20%, rgba(88,199,255,.16), transparent 55%), linear-gradient(180deg, #071a2d 0%, #061425 45%, #050e1a 100%)",
    color: "#eaf2ff",
    position: "relative",
    overflowX: "hidden",
  },

  // subtle AI grid overlay
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
    backgroundSize: "56px 56px",
    maskImage: "radial-gradient(circle at 30% 10%, rgba(0,0,0,1) 0%, rgba(0,0,0,.45) 55%, rgba(0,0,0,0) 85%)",
    pointerEvents: "none",
    opacity: 0.55,
  },

  container: {
    position: "relative",
    width: "min(1200px, 94vw)",
    margin: "0 auto",
    padding: "22px 0 40px",
  },

  topbar: {
    position: "sticky",
    top: 14,
    zIndex: 50,
    borderRadius: 22,
    padding: "18px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    background: "rgba(9, 26, 44, 0.78)",
    border: "1px solid rgba(255,255,255,.12)",
    boxShadow: "0 18px 50px rgba(0,0,0,.35)",
    backdropFilter: "blur(14px)",
  },

  brand: { display: "flex", flexDirection: "column", gap: 4 },

  title: { fontSize: 34, fontWeight: 800, letterSpacing: 0.4, lineHeight: 1.05 },

  subtitle: { fontSize: 16, color: "rgba(234,242,255,.78)" },

  nav: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  tab: (active) => ({
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.16)",
    background: active ? "#ffffff" : "rgba(255,255,255,.06)",
    color: active ? "#061425" : "#eaf2ff",
    textDecoration: "none",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.2,
    boxShadow: active ? "0 12px 28px rgba(255,255,255,.16)" : "none",
    transition: "transform .15s ease, background .15s ease, box-shadow .15s ease",
    whiteSpace: "nowrap",
  }),

  actions: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  btn: (variant = "ghost") => ({
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.16)",
    cursor: "pointer",
    fontFamily: baseFont,
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.2,
    background: variant === "primary" ? "linear-gradient(135deg, #d06549 0%, #ffb199 100%)" : "rgba(255,255,255,.06)",
    color: variant === "primary" ? "#061425" : "#eaf2ff",
    boxShadow: variant === "primary" ? "0 14px 40px rgba(208,101,73,.28)" : "none",
    whiteSpace: "nowrap",
  }),

  contentWrap: {
    marginTop: 18,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.04)",
    boxShadow: "0 18px 60px rgba(0,0,0,.35)",
    backdropFilter: "blur(10px)",
    padding: "18px",
  },
};

export default function AdminLoginGate() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleLabel = useMemo(() => String(user?.role || "user"), [user?.role]);

  useEffect(() => {
    // Make sure cookie-backed session is reflected
    refresh?.().catch?.(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isAdminRole(user.role)) {
      navigate("/account/profile", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    // if hit /admin directly without login
    return (
      <div style={styles.page}>
        <div style={styles.grid} />
        <div style={styles.container}>
          <div style={styles.topbar}>
            <div style={styles.brand}>
              <div style={styles.title}>Helloviza Admin</div>
              <div style={styles.subtitle}>Please login to continue.</div>
            </div>
            <button
              style={styles.btn("primary")}
              type="button"
              onClick={() => navigate("/login", { replace: true, state: { from: location } })}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      <div style={styles.container}>
        {/* ✅ Single Admin Header (ONLY here) */}
        <div style={styles.topbar}>
          <div style={styles.brand}>
            <div style={styles.title}>Helloviza Admin</div>
            <div style={styles.subtitle}>
              Logged in as <b>{user.email}</b> · role: <b>{roleLabel}</b>
            </div>
          </div>

          <div style={styles.nav}>
            <NavLink end to="/admin" style={({ isActive }) => styles.tab(isActive)}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/country-prices" style={({ isActive }) => styles.tab(isActive)}>
              Country Prices
            </NavLink>
            <NavLink to="/admin/offers" style={({ isActive }) => styles.tab(isActive)}>
              Offers
            </NavLink>
            <NavLink to="/admin/profiles" style={({ isActive }) => styles.tab(isActive)}>
              Profiles
            </NavLink>
            <button type="button" style={styles.btn("ghost")} onClick={() => navigate("/")}>
              Back to Site
            </button>
            <button
              type="button"
              style={styles.btn("primary")}
              onClick={() => {
                logout?.();
                navigate("/", { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ✅ Admin Pages render here */}
        <div style={styles.contentWrap}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
