import React, { useState, useRef, useLayoutEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
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
import GoForVisa from "./pages/GoForVisa";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import AboutUs from "./pages/AboutUs";
import MyProfile from "./pages/MyProfile";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import EmailOTPVerify from "./pages/EmailOTPVerify";
import TrackVisaApplication from "./pages/TrackVisaApplication";
import ScrollToTop from "./components/ScrollToTop";
import WelcomePopup from "./components/WelcomePopup";
// import ReturnLoginPopup from "./components/ReturnLoginPopup"; // No longer needed unless you want it

function ProtectedRoute({ isLoggedIn, children, redirectTo = "/login" }) {
  const location = useLocation();
  return isLoggedIn ? (
    children
  ) : (
    <Navigate to={`${redirectTo}?from=${location.pathname}`} replace />
  );
}

export default function App() {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("helloviza_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // State to track welcome popup
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Two refs: one for header flight (slide), one for Discover Now (modal)
  const bookingPanelRef = useRef();
  const modalPanelRef = useRef();

  useLayoutEffect(() => {
    if (user) {
      const welcomeClosed = localStorage.getItem("welcomePopupClosed");
      if (!welcomeClosed) {
        setShowWelcomePopup(true);
      } else {
        setShowWelcomePopup(false);
      }
    } else {
      setShowWelcomePopup(false);
    }
  }, [user]);

  // Save user info on login
  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("helloviza_user", JSON.stringify(userData));
    // Reset popup state for new user if you want:
    // localStorage.removeItem("welcomePopupClosed");
  }

  // Clear user info on logout
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("helloviza_user");
    setShowWelcomePopup(false);
    // localStorage.removeItem("welcomePopupClosed"); // Only do this if you want popup again on next login
  }

  // Open booking panel (called from header icon)
  function openBookingPanel() {
    if (bookingPanelRef.current?.openPanel) {
      bookingPanelRef.current.openPanel();
    }
  }

  // Open modal booking panel (called from Home Discover Now)
  function openModalBookingPanel() {
    if (modalPanelRef.current?.openPanel) {
      modalPanelRef.current.openPanel();
    }
  }

  // Helper to get user's first name or fallback
  const getFirstName = () => {
    if (!user?.name) return "there";
    return user.name.split(" ")[0];
  };

  return (
    <>
      <Header onFlightClick={openBookingPanel} user={user} onLogout={handleLogout} />
      <BookingPanel ref={bookingPanelRef} />
      <BookingPanel ref={modalPanelRef} mode="modal" />

      <ScrollToTop />

      {showWelcomePopup && (
        <WelcomePopup
          message={`Hello, ${getFirstName()}! Hello, amazing soul!

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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/verify-email" element={<EmailOTPVerify />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route
          path="/go-for-visa"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <GoForVisa user={user} />
            </ProtectedRoute>
          }
        />
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
