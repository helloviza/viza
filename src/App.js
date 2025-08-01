import React, { useState, useRef } from "react";
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
import Careers from './pages/Careers';
import AboutUs from './pages/AboutUs';

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
      return null; // fallback if localStorage data is corrupted
    }
  });

  // Two refs: one for header flight (slide), one for Discover Now (modal)
  const bookingPanelRef = useRef();
  const modalPanelRef = useRef();

  // Save user info on login
  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("helloviza_user", JSON.stringify(userData));
  }

  // Clear user info on logout
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("helloviza_user");
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

  return (
    <>
      <Header onFlightClick={openBookingPanel} user={user} onLogout={handleLogout} />
      {/* Slide-down Booking Panel (header/flight icon) */}
      <BookingPanel ref={bookingPanelRef} />
      {/* Modal Popup Booking Panel (for Discover Now) */}
      <BookingPanel ref={modalPanelRef} mode="modal" />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Pass trigger function to Home page */}
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
      </Routes>

      <ScrollToHeroButton />
      <VisaFooterBlock />
    </>
  );
}
