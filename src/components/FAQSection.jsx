// src/components/FAQSection.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

const FAQS = [
  {
    q: "How long does the visa process take?",
    a: "Processing times vary by country and visa type. Most e-visas are processed within 2–7 business days. We always display the estimated processing time clearly before you apply. Rush processing is available for select destinations.",
  },
  {
    q: "Is my personal information secure on HelloViza?",
    a: "Absolutely. We use enterprise-grade SSL encryption and comply with GDPR and Indian data protection regulations. Your documents and personal information are never shared with third parties without your explicit consent.",
  },
  {
    q: "What happens if my visa is rejected?",
    a: "In the rare case of a rejection, our team will analyse the reason and help you reapply at no extra service charge. We maintain a 99.2% approval rate thanks to our expert document review process.",
  },
  {
    q: "Can I track my visa application status?",
    a: "Yes! Once your application is submitted, you'll receive a tracking link via email and SMS. You can check real-time status updates anytime through your HelloViza dashboard.",
  },
  {
    q: "Do you offer group or family visa applications?",
    a: "Yes, we handle individual, family, and corporate group applications. For groups of 5 or more, we offer dedicated account managers and priority processing at competitive rates.",
  },
  {
    q: "What documents do I need to apply?",
    a: "Document requirements vary by country and visa type. After you select your destination and visa type, our system will generate a personalized checklist. Common documents include a valid passport, recent photographs, travel itinerary, and proof of funds.",
  },
  {
    q: "Are there any hidden charges?",
    a: "Never. Our pricing is fully transparent — you see the government visa fee, our service fee, and any applicable taxes before you pay. No surprises at checkout.",
  },
  {
    q: "What is the transfer service?",
    a: "Our transfer service provides professional airport pickups and drops, city transfers, and inter-city travel in premium vehicles. You can book it alongside your visa or independently for any destination we cover.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        border: isOpen ? `1.5px solid ${ACCENT}` : "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: isOpen ? "0 8px 24px rgba(208,101,73,0.1)" : "none",
        background: isOpen ? "rgba(208,101,73,0.02)" : "#fff",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span
          className="font-bold text-base leading-snug"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: isOpen ? ACCENT : BRAND,
            fontSize: "1.08rem",
          }}
        >
          {faq.q}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: isOpen ? ACCENT : "rgba(0,71,127,0.08)",
            transform: isOpen ? "rotate(45deg)" : "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke={isOpen ? "#fff" : BRAND} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? 300 : 0 }}
      >
        <div className="px-6 pb-5">
          <p
            className="text-gray-500 text-sm leading-relaxed m-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

const FAQSection=()=> {
  const [openIdx, setOpenIdx] = useState(0);
  const { t } = useTranslation();

  const navigate=useNavigate();
  return (
    <section className="py-16 lg:py-20" style={{ background: "#f8f9fc" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <p
            className="text-[#d06549] text-sm font-bold uppercase tracking-[0.18em] mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Got Questions?
          </p>
          <h2
            className="font-black text-[#00477f] leading-none mb-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
              letterSpacing: "-1px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Everything you need to know about our visa & travel services
          </p>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div
          className="mt-10 rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #00477f 0%, #005fa3 100%)" }}
        >
          <p
            className="text-white font-black text-xl mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Still have questions?
          </p>
          <p className="text-white/70 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Our visa experts are available 24/7 to help you
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
  onClick={() => navigate("/contact")}
  className="px-6 py-2.5 rounded-xl bg-white font-black text-[#00477f] text-sm transition-all duration-200 hover:scale-105"
  style={{
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
  }}
>
  Contact Us
</button>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl font-black text-white text-sm transition-all duration-200 hover:scale-105"
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "1rem",
                background: "#25d366",
                textDecoration: "none",
              }}
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


export default FAQSection;
