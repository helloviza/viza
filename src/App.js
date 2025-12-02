// src/App.js
import React, { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

/* ==== Core Components ==== */
import Header from "./components/Header";
import AnnouncementBar from "./components/AnnouncementBar";
import BackgroundBreakSection from "./components/BackgroundBreakSection";
import BookingPanel from "./components/BookingPanel";
import VisaFooterBlock from "./components/VisaFooterBlock";
import ScrollToHeroButton from "./components/ScrollToHeroButton";
import ScrollToTop from "./components/ScrollToTop";
import WelcomePopup from "./components/WelcomePopup";

/* ==== Home & Sections (Home never renders footer) ==== */
import Home from "./pages/Home";
import ScrollTextSections from "./components/ScrollTextSections";
import ExploreSection from "./components/ExploreSection";
import VisaServicesSection from "./components/VisaServicesSection";
import VisaCountryGrid from "./components/VisaCountryGrid";
import VisaStatsSection from "./components/VisaStatsSection";

/* ==== Auth Pages ==== */
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import EmailOTPVerify from "./pages/EmailOTPVerify";

/* ==== Static Pages ==== */
import ContactSection from "./components/ContactSection";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import AboutUs from "./pages/AboutUs";

/* ==== Account Pages ==== */
import MyProfile from "./pages/account/MyProfile";
import Documents from "./pages/account/Documents";
import VisaHistory from "./pages/account/VisaHistory";
import Wishlist from "./pages/account/Wishlist";
import Wallet from "./pages/account/Wallet";
import Referrals from "./pages/account/Referrals";
import Settings from "./pages/account/Settings";
import SavedApplications from "./pages/account/SavedApplications";

/* ==== Internal Hand-off ==== */
import VisaHandoff from "./pages/VisaHandoff";

/* ==== Admin ==== */
import AdminLoginGate from "./pages/admin/AdminLoginGate";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfiles from "./pages/admin/Profiles";
import AdminCountryPrices from "./pages/admin/AdminCountryPrices";
import AdminOffers from "./pages/admin/Offers";
import AdminUserStats from "./pages/admin/UserStats";

/* ==== Auth Context ==== */
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ============================================================
   ✅ Admin access helpers
============================================================ */
function normEmail(v) {
  return String(v || "").trim().toLowerCase();
}
function pickEmail(u) {
  return normEmail(u?.email || u?.profile?.email || u?.user?.email || "");
}
function isAdminRole(role) {
  const r = String(role || "").toLowerCase().trim();
  return r === "super-admin" || r === "super_admin" || r === "superadmin" || r === "admin";
}
function isEditorRole(role) {
  const r = String(role || "").toLowerCase().trim();
  return r === "content-editor" || r === "content_editor" || r === "editor";
}

const ADMIN_ALLOWLIST = new Set(["hello@helloviza.com", "imran.ali@helloviza.com"]);

function canAccessAdmin(user) {
  const email = pickEmail(user);
  return ADMIN_ALLOWLIST.has(email) || isAdminRole(user?.role) || isEditorRole(user?.role);
}

/* ============================================================
   ✅ next= param support (for visa.helloviza.com bounce-back)
============================================================ */
function getNextFromSearch(search) {
  try {
    const sp = new URLSearchParams(search || "");
    const next = (sp.get("next") || "").trim();
    return next || "";
  } catch {
    return "";
  }
}

function isSafeNextUrl(nextUrl) {
  // Only allow redirecting to our subdomain(s) to prevent open-redirect abuse
  // Add localhost cases if you ever test visa on local.
  const allow = [
    "https://visa.helloviza.com",
    "http://visa.helloviza.com",
  ];

  try {
    const u = new URL(nextUrl);
    const origin = u.origin;
    return allow.includes(origin);
  } catch {
    return false;
  }
}

/* ============================================================
   ✅ Protected Route Wrappers with "booting"
============================================================ */
function RequireAuth({ user, booting, children }) {
  const location = useLocation();
  if (booting) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function RequireAdmin({ user, booting, children }) {
  const location = useLocation();
  if (booting) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!canAccessAdmin(user)) return <Navigate to="/account/profile" replace />;
  return children;
}

/* ==== Floating Admin Shortcut ==== */
function AdminQuickAccess({ user }) {
  const navigate = useNavigate();
  if (!user || !canAccessAdmin(user)) return null;

  const wrap = {
    position: "fixed",
    right: 16,
    bottom: 18,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const pill = {
    border: "1px solid rgba(2,9,23,.12)",
    borderRadius: 999,
    padding: "10px 14px",
    background: "#0b2a4a",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(2,9,23,.18)",
    fontFamily: "'Barlow Condensed', Arial, sans-serif",
    fontSize: 16,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
  };

  const pillGhost = { ...pill, background: "#ffffff", color: "#0b2a4a" };

  return (
    <div style={wrap}>
      <button type="button" style={pill} onClick={() => navigate("/admin")}>
        Admin Panel
      </button>
      <button type="button" style={pillGhost} onClick={() => navigate("/admin/country-prices")}>
        Edit Country Prices
      </button>
    </div>
  );
}

/* ==== Application Shell ==== */
function AppShell() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Prevent redirect-bounce on hard refresh
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await refresh();
      } catch {}
      if (alive) setBooting(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const bookingPanelRef = useRef();
  const modalPanelRef = useRef();

  const openBookingPanel = () => bookingPanelRef.current?.openPanel?.();
  const openModalBookingPanel = () => modalPanelRef.current?.openPanel?.();

  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const firstName =
    (user?.name || "")
      .trim()
      .split(" ")
      .filter(Boolean)[0] || "there";

  useLayoutEffect(() => {
    if (user && !isAdminRoute) {
      const closed = localStorage.getItem("welcomePopupClosed");
      setShowWelcomePopup(!closed);
    } else {
      setShowWelcomePopup(false);
    }
  }, [user, isAdminRoute]);

  // ✅ supports /login?next=... for cross-subdomain handoff
  const nextFromQuery = useMemo(() => getNextFromSearch(location.search), [location.search]);

  const postLoginTarget = useMemo(() => {
    const wanted = location?.state?.from?.pathname;
    if (wanted) return wanted;
    if (user && canAccessAdmin(user)) return "/admin";
    return "/account/profile";
  }, [location?.state?.from?.pathname, user]);

  async function handleLogin(u) {
    try {
      localStorage.setItem("helloviza_user", JSON.stringify(u));
      localStorage.setItem("hv_user", JSON.stringify(u));
      sessionStorage.setItem("hv_user", JSON.stringify(u));
    } catch {}

    await refresh();

    // ✅ If login URL has next=https://visa.helloviza.com/..., go there immediately
    if (nextFromQuery && isSafeNextUrl(nextFromQuery)) {
      window.location.assign(nextFromQuery);
      return;
    }

    navigate(postLoginTarget, { replace: true });
  }

  function handleLogout() {
    try {
      localStorage.removeItem("helloviza_user");
      localStorage.removeItem("hv_user");
      localStorage.removeItem("hv_token");
    } catch {}
    setShowWelcomePopup(false);
    logout();
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {!isAdminRoute && (
        <>
          <Header onFlightClick={openBookingPanel} user={user} onLogout={handleLogout} />
          <AnnouncementBar />

          <BookingPanel ref={bookingPanelRef} />
          <BookingPanel ref={modalPanelRef} mode="modal" />

          <AdminQuickAccess user={user} />

          {showWelcomePopup && (
            <WelcomePopup
              message={`Hello ${firstName}, Welcome onboard!

We’re beyond thrilled to have you join the Helloviza family! You’re now part of a vibrant, creative, and inspiring community that’s all about connection, growth, and making every moment sparkle. 🌟
You’re a unique spark in our universe, and we can’t wait to see the incredible energy you bring. Dive in, explore, and let’s create something extraordinary together!
With all the love and excitement,
The Helloviza Community 💖`}
              onClose={() => {
                setShowWelcomePopup(false);
                localStorage.setItem("welcomePopupClosed", "true");
              }}
            />
          )}
        </>
      )}

      <ScrollToTop />

      <main style={{ flex: 1, display: "block" }}>
        <Routes>
          {/* ===== Home ===== */}
          <Route
            path="/"
            element={
              <>
                <Home onDiscoverNow={openModalBookingPanel} />
                <ScrollTextSections />
                <ExploreSection />
                <VisaServicesSection />
                <VisaCountryGrid />
                <VisaStatsSection />
              </>
            }
          />

          {/* ===== Auth ===== */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
          <Route path="/verify-email" element={<EmailOTPVerify />} />

          {/* ===== Account Section ===== */}
          <Route
            path="/account/profile"
            element={
              <RequireAuth user={user} booting={booting}>
                <MyProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/account/documents"
            element={
              <RequireAuth user={user} booting={booting}>
                <Documents />
              </RequireAuth>
            }
          />
          <Route
            path="/account/visa-history"
            element={
              <RequireAuth user={user} booting={booting}>
                <VisaHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/account/wishlist"
            element={
              <RequireAuth user={user} booting={booting}>
                <Wishlist />
              </RequireAuth>
            }
          />
          <Route
            path="/account/wallet"
            element={
              <RequireAuth user={user} booting={booting}>
                <Wallet />
              </RequireAuth>
            }
          />
          <Route
            path="/account/referrals"
            element={
              <RequireAuth user={user} booting={booting}>
                <Referrals />
              </RequireAuth>
            }
          />
          <Route
            path="/account/settings"
            element={
              <RequireAuth user={user} booting={booting}>
                <Settings />
              </RequireAuth>
            }
          />
          <Route
            path="/account/saved"
            element={
              <RequireAuth user={user} booting={booting}>
                <SavedApplications />
              </RequireAuth>
            }
          />

          {/* Back-compat */}
          <Route path="/my-profile" element={<Navigate to="/account/profile" replace />} />

          {/* ===== Visa Handoff ===== */}
          <Route path="/go/visa" element={<VisaHandoff user={user} />} />
          <Route path="/go-for-visa" element={<Navigate to="/go/visa" replace />} />

          {/* ===== Admin ===== */}
          <Route
            path="/admin"
            element={
              <RequireAdmin user={user} booting={booting}>
                <AdminLoginGate />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="country-prices" element={<AdminCountryPrices />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="user-stats" element={<AdminUserStats />} />
          </Route>

          {/* ===== Static Pages ===== */}
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <BackgroundBreakSection />
          <VisaFooterBlock />
          <ScrollToHeroButton />
        </>
      )}
    </div>
  );
}

/* ==== Root with AuthProvider ==== */
export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
