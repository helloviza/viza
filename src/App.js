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
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm"; // Adjust path if needed
import EmailOTPVerify from "./pages/EmailOTPVerify";
import TrackVisaApplication from "./pages/TrackVisaApplication";

// Then use <Route path="/my-profile" element={<MyProfile />} />


import ScrollToTop from "./components/ScrollToTop";
import WelcomePopup from "./components/WelcomePopup";
import ReturnLoginPopup from "./components/ReturnLoginPopup";

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

  // State to track popups
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showReturnLoginPopup, setShowReturnLoginPopup] = useState(false);

  // Two refs: one for header flight (slide), one for Discover Now (modal)
  const bookingPanelRef = useRef();
  const modalPanelRef = useRef();

  useLayoutEffect(() => {
    if (user) {
      let autoCloseTimer;
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup");

      if (!hasSeenWelcome) {
        console.log("Showing Welcome Popup immediately");
        setShowWelcomePopup(true);
        localStorage.setItem("hasSeenWelcomePopup", "true");

        autoCloseTimer = setTimeout(() => {
          setShowWelcomePopup(false);
        }, 10000);
      } else {
        console.log("Showing Return Login Popup immediately");
        setShowReturnLoginPopup(true);

        autoCloseTimer = setTimeout(() => {
          setShowReturnLoginPopup(false);
        }, 10000);
      }

      return () => {
        clearTimeout(autoCloseTimer);
      };
    } else {
      setShowWelcomePopup(false);
      setShowReturnLoginPopup(false);
    }
  }, [user]);

  // Save user info on login
  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("helloviza_user", JSON.stringify(userData));
  }

  // Clear user info on logout
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("helloviza_user");
    setShowWelcomePopup(false);
    setShowReturnLoginPopup(false);
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
          onClose={() => setShowWelcomePopup(false)}
        />
      )}

      {showReturnLoginPopup && (
        <ReturnLoginPopup
          message={`Welcome back, ${getFirstName()}! We’re absolutely delighted to see you return to the Helloviza family! Your presence lights up our community, and we’re thrilled to have you back in the mix. Get ready to dive back into the magic, connect with awesome souls, and continue your journey of inspiration and creativity with us. You’re truly one of a kind, and we can’t wait to see what amazing moments we’ll share next!`}
          onClose={() => setShowReturnLoginPopup(false)}
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
