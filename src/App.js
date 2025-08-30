// helloviza/client/src/App.js
'use strict';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ContactSection from './components/ContactSection';
import BackgroundBreakSection from './components/BackgroundBreakSection';
import BookingPanel from './components/BookingPanel';
import VisaFooterBlock from './components/VisaFooterBlock';
import ScrollTextSections from './components/ScrollTextSections';
import ExploreSection from './components/ExploreSection';
import VisaServicesSection from './components/VisaServicesSection';
import VisaCountryGrid from './components/VisaCountryGrid';
import VisaStatsSection from './components/VisaStatsSection';
import ScrollToHeroButton from './components/ScrollToHeroButton';
import GoForVisa from './pages/GoForVisa';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Careers from './pages/Careers';
import AboutUs from './pages/AboutUs';
import MyProfile from './pages/MyProfile';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import EmailOTPVerify from './pages/EmailOTPVerify';
import TrackVisaApplication from './pages/TrackVisaApplication';
import ScrollToTop from './components/ScrollToTop';
import WelcomePopup from './components/WelcomePopup';

import { AuthProvider, RequireAuth, useAuth } from './context/AuthContext';

/**
 * Inner app uses server-truth auth from AuthContext.
 * AuthProvider handles:
 *  - consuming #sso= token
 *  - calling /api/auth/me with credentials
 *  - exposing { user, loading, refresh, logout }
 */
function AppShell() {
  const { user, loading, refresh, logout } = useAuth();

  // Panels
  const bookingPanelRef = useRef();
  const modalPanelRef = useRef();
  const openBookingPanel = () => bookingPanelRef.current?.openPanel?.();
  const openModalBookingPanel = () => modalPanelRef.current?.openPanel?.();

  // Welcome popup (based on authenticated user)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  useLayoutEffect(() => {
    if (user) {
      const closed = localStorage.getItem('welcomePopupClosed');
      setShowWelcomePopup(!closed);
    } else {
      setShowWelcomePopup(false);
    }
  }, [user]);

  // Keep this to make Login.jsx feel responsive; then refresh from server
  async function handleLogin(u) {
    try {
      localStorage.setItem('helloviza_user', JSON.stringify(u));
    } catch {}
    await refresh(); // pull server truth (/api/auth/me) after cookie is set
  }

  function handleLogout() {
    try {
      localStorage.removeItem('helloviza_user');
      localStorage.removeItem('hv_token'); // optional cleanup of Bearer
      localStorage.removeItem('helloviza_token'); // legacy key, if any
    } catch {}
    setShowWelcomePopup(false);
    // AuthContext.logout() clears cookie server-side
    logout();
  }

  const firstName =
    (user?.name || '')
      .trim()
      .split(' ')
      .filter(Boolean)[0] || 'there';

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
            localStorage.setItem('welcomePopupClosed', 'true');
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

        {/* Login keeps onLogin to update UI fast; AuthContext will re-probe /me */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/verify-email" element={<EmailOTPVerify />} />
        <Route path="/my-profile" element={<MyProfile />} />

        {/* Landing page after SSO / protected by server-truth auth */}
        <Route
          path="/go-for-visa"
          element={
            <RequireAuth>
              <GoForVisa user={user} loadingAuth={loading} />
            </RequireAuth>
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

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
