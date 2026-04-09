// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────
//  Main page — assembles all sections in order:
//  Header → HeroSection → PopularVisaDestinations → WhyChooseHelloviza
//  → DiscoverDestinations → ReviewsSection → FAQSection → ContactUs → Footer
// ─────────────────────────────────────────────────────────────────
import React from "react";
import { useRef } from "react";
import AnnouncementBar        from "../components/AnnouncementBar";




import NewHeader from "../components/NewHeader";
import WhyChooseHelloViza from "../components/WhyChooseHelloViza";
// import ContactUs from "../components/ContactUs";
import DiscoverDestinations from "../components/DiscoverDestinations";
import NewFooter from "../components/NewFooter";
import HeroSection from "../components/HeroSection";
import PopularVisaDestination from "../components/PopularVisaDestination";
import ReviewSections from "../components/ReviewSections";
import FAQSection from "../components/FAQSection";




const NewHome=({ user, onLogout }) =>{
  const discoverRef=useRef(null);
  return (
    <>
      {/* Fixed global announcement bar (optional — keep if you have AnnouncementBar) */}
      <AnnouncementBar />

      {/* Fixed header — sits above everything */}
      <NewHeader user={user} onLogout={onLogout} onContinue={() => {
    discoverRef.current?.scrollIntoView({ behavior: "smooth" }); }}
      />

      {/* ① Hero — video BG + service tiles + sky-meets-earth + explore strip */}
      <HeroSection user={user} onContinue={() => {
    discoverRef.current?.scrollIntoView({ behavior: "smooth" });
  }}  />

      {/* ② Popular Visa Destinations — static + API-ready */}
      <PopularVisaDestination />

      {/* ③ Why Choose HelloViza — feature grid + stats */}
      <WhyChooseHelloViza/>

      {/* ④ Discover Your Destination — paginated API grid */}
      <div ref={discoverRef}>
      <DiscoverDestinations />
      </div>
      {/* ⑤ Customer Reviews */}
      <ReviewSections />

      {/* ⑥ FAQ */}
      <FAQSection />

      {/* ⑦ Contact Us with form
      <ContactUs/> */}

      {/* ⑧ Footer */}
      <NewFooter />
    </>
  );
}



export default NewHome;
