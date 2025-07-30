import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ScrollTextSections from "./components/ScrollTextSections";
import BookingPanelScheduler from "./components/BookingPanelScheduler";
import VisaFooterBlock from "./components/VisaFooterBlock";
import ExploreSection from "./components/ExploreSection";
import VisaCountryGrid from "./components/VisaCountryGrid";
import VisaStatsSection from "./components/VisaStatsSection";
import ScrollToHeroButton from "./components/ScrollToHeroButton";
import GoForVisa from "./pages/GoForVisa";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ContactSection from "./components/ContactSection";
import BackgroundBreakSection from "./components/BackgroundBreakSection";
import VisaServicesSection from "./components/VisaServicesSection";

function ProtectedRoute({ isLoggedIn, children, redirectTo = "/login" }) {
  const location = useLocation();
  return isLoggedIn ? (
    children
  ) : (
    <Navigate to={`${redirectTo}?from=${location.pathname}`} replace />
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("helloviza_user")
  );
  const bookingPanelRef = useRef();

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function openBookingPanel() {
    if (bookingPanelRef.current && bookingPanelRef.current.openPanel) {
      bookingPanelRef.current.openPanel();
    }
  }

  return (
    <Router>
      <Header onFlightClick={openBookingPanel} />
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
        <Route
          path="/go-for-visa"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <GoForVisa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => {
                handleLogin();
                const params = new URLSearchParams(window.location.search);
                const from = params.get("from");
                if (from) window.location.replace(from);
                else window.location.replace("/");
              }}
            />
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/contact"
          element={
            <>
              <ContactSection />
              <BackgroundBreakSection />
            </>
          }
        />
        {/* Add more routes here */}
      </Routes>

      <ScrollToHeroButton />
      <VisaFooterBlock />
    </Router>
  );
}

export default App;
