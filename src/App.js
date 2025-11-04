// src/App.js
import React, { useState, useRef, useLayoutEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

/* ==== Core Components ==== */
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import EmailOTPVerify from "./pages/EmailOTPVerify";
import TrackVisaApplication from "./pages/TrackVisaApplication";
import ContactSection from "./components/ContactSection";
import BackgroundBreakSection from "./components/BackgroundBreakSection";
import BookingPanel from "./components/BookingPanel";
import VisaFooterBlock from "./components/VisaFooterBlock";
import ScrollTextSections from "./components/ScrollTextSections";
import ExploreSection from "./components/ExploreSection";
import VisaServicesSection from "./components/VisaServicesSection";
import VisaCountryGrid from "./components/VisaCountryGrid";
import VisaStatsSection from "./components/VisaStatsSection";
import ScrollToHeroButton from "./components/ScrollToHeroButton";
import ScrollToTop from "./components/ScrollToTop";
import WelcomePopup from "./components/WelcomePopup";

/* ==== Static Pages ==== */
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

/* ==== Auth Context ==== */
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ==== Helpers for post-login redirect (cross-domain safe) ==== */
const LOGIN_REDIRECT_KEY = "postLoginRedirect";
const VISA_HOST = "https://visa.helloviza.com";
const WWW_HOST = "https://www.helloviza.com";
const DEFAULT_VISA = `${VISA_HOST}/qr-visa?autostart=1`;

function isAllowedAbsolute(u) {
  try {
    const url = new URL(u);
    return url.origin === VISA_HOST || url.origin === WWW_HOST;
  } catch {
    return false;
  }
}

/** Build ABSOLUTE https://visa.../qr-visa with preserved query & autostart=1 */
function buildVisaQrFrom(urlish) {
  try {
    const base = new URL("/qr-visa", VISA_HOST);
    const src = new URL(urlish, VISA_HOST); // tolerate relative input
    const sp = new URLSearchParams(src.search);
    if (!sp.has("autostart")) sp.set("autostart", "1");
    base.search = sp.toString();
    return base.toString();
  } catch {
    return DEFAULT_VISA;
  }
}

/** Stash ?next (or ?from) EARLY without stripping absolute hosts */
function stashRedirectFromQuery(search) {
  const sp = new URLSearchParams(search);
  const candidate = sp.get("next") || sp.get("from");
  if (!candidate) return;

  if (isAllowedAbsolute(candidate) || candidate.startsWith("/")) {
    sessionStorage.setItem(LOGIN_REDIRECT_KEY, candidate);
  } else {
    // Unknown origins → normalize to safe visa QR
    sessionStorage.setItem(LOGIN_REDIRECT_KEY, buildVisaQrFrom(candidate));
  }
}

/** Resolve and clear saved redirect. Returns ABSOLUTE for cross-domain, else relative (rare). */
function popRedirectOrHome() {
  const saved = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY);

  if (!saved) return DEFAULT_VISA;

  // Absolute allowed → keep absolute
  if (isAllowedAbsolute(saved)) return saved;

  // Legacy local paths → normalize to visa QR (preserving query if present)
  if (
    saved.startsWith("/go/visa") ||
    saved.startsWith("/go-for-visa") ||
    saved.startsWith("/qr-visa") ||
    saved.startsWith("/")
  ) {
    return buildVisaQrFrom(saved);
  }

  // Fallback
  return DEFAULT_VISA;
}

/* ==== Protected Route Wrapper ==== */
function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* ==== Login Route Guard ==== */
/* If user is already authenticated and visits /login,
   immediately redirect to saved ?next= (absolute visa URL) or safe default. */
function LoginRoute({ onLogin }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // stash ?next= as soon as we hit /login (preserves absolute)
  React.useEffect(() => {
    stashRedirectFromQuery(location.search);
  }, [location.search]);

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      const target = popRedirectOrHome();
      if (/^https?:\/\//i.test(target)) {
        // Cross-domain bounce: avoid back-loop
        window.location.replace(target);
      } else {
        navigate(target, { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return <Login onLogin={onLogin} />;
}

/* ==== Application Shell ==== */
function AppShell() {
  const { user, refresh, logout } = useAuth();

  const bookingPanelRef = useRef();
  const modalPanelRef = useRef();

  const openBookingPanel = () => bookingPanelRef.current?.openPanel?.();
  const openModalBookingPanel = () => modalPanelRef.current?.openPanel?.();

  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useLayoutEffect(() => {
    if (user) {
      const closed = localStorage.getItem("welcomePopupClosed");
      setShowWelcomePopup(!closed);
    } else {
      setShowWelcomePopup(false);
    }
  }, [user]);

  async function handleLogin(u) {
    try {
      localStorage.setItem("helloviza_user", JSON.stringify(u));
      localStorage.setItem("hv_user", JSON.stringify(u));
      sessionStorage.setItem("hv_user", JSON.stringify(u));
    } catch {}
    await refresh();
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

  const firstName =
    (user?.name || "")
      .trim()
      .split(" ")
      .filter(Boolean)[0] || "there";

  return (
    <>
      <Header onFlightClick={openBookingPanel} user={user} onLogout={handleLogout} />
      <BookingPanel ref={bookingPanelRef} />
      <BookingPanel ref={modalPanelRef} mode="modal" />
      <ScrollToTop />

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
        <Route path="/login" element={<LoginRoute onLogin={handleLogin} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/verify-email" element={<EmailOTPVerify />} />

        {/* ===== Account Section ===== */}
        <Route
          path="/account/profile"
          element={
            <RequireAuth user={user}>
              <MyProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/account/documents"
          element={
            <RequireAuth user={user}>
              <Documents />
            </RequireAuth>
          }
        />
        <Route
          path="/account/visa-history"
          element={
            <RequireAuth user={user}>
              <VisaHistory />
            </RequireAuth>
          }
        />
        <Route
          path="/account/wishlist"
          element={
            <RequireAuth user={user}>
              <Wishlist />
            </RequireAuth>
          }
        />
        <Route
          path="/account/wallet"
          element={
            <RequireAuth user={user}>
              <Wallet />
            </RequireAuth>
          }
        />
        <Route
          path="/account/referrals"
          element={
            <RequireAuth user={user}>
              <Referrals />
            </RequireAuth>
          }
        />
        <Route
          path="/account/settings"
          element={
            <RequireAuth user={user}>
              <Settings />
            </RequireAuth>
          }
        />
        <Route
          path="/account/saved"
          element={
            <RequireAuth user={user}>
              <SavedApplications />
            </RequireAuth>
          }
        />

        {/* Back-compat */}
        <Route path="/my-profile" element={<Navigate to="/account/profile" replace />} />

        {/* ===== Visa Handoff (internal → external) ===== */}
        <Route path="/go/visa" element={<VisaHandoff user={user} />} />
        <Route path="/go-for-visa" element={<Navigate to="/go/visa" replace />} />

        {/* ===== Static Pages ===== */}
        <Route
          path="/contact"
          element={
            <>
              <ContactSection />
              <BackgroundBreakSection />
            </>
          }
        />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/trackyourvisaapplication" element={<TrackVisaApplication />} />
      </Routes>

      <ScrollToHeroButton />
      <VisaFooterBlock />
    </>
  );
}

/* ==== Root Export ==== */
export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
