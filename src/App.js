import React, { useState, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ContactSection from "./components/ContactSection";
import BackgroundBreakSection from "./components/BackgroundBreakSection";
import BookingPanelScheduler from "./components/BookingPanelScheduler";
import VisaFooterBlock from "./components/VisaFooterBlock";
import ScrollTextSections from "./components/ScrollTextSections";
import ExploreSection from "./components/ExploreSection";
import VisaServicesSection from "./components/VisaServicesSection";
import VisaCountryGrid from "./components/VisaCountryGrid";
import VisaStatsSection from "./components/VisaStatsSection";
import ScrollToHeroButton from "./components/ScrollToHeroButton";
import GoForVisa from "./pages/GoForVisa";

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

  const bookingPanelRef = useRef();

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

  // Open booking panel
  function openBookingPanel() {
    if (bookingPanelRef.current?.openPanel) {
      bookingPanelRef.current.openPanel();
    }
  }

  return (
    <>
      <Header onFlightClick={openBookingPanel} user={user} onLogout={handleLogout} />
      <BookingPanelScheduler ref={bookingPanelRef} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
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
      </Routes>

      <ScrollToHeroButton />
      <VisaFooterBlock />
    </>
  );
}
