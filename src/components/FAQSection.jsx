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
        background: isOpen ? "rgba(208,101,73,0.02)" : "#f1f1f1",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span
          className="font-bold text-base leading-snug"
          style={{
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
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
            style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
          >
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-20" style={{ background: "#f1f1f1" }}>
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
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
              fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
              letterSpacing: "-1px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
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
            style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
          >
            Still have questions?
          </p>
          <p className="text-white/70 text-sm mb-6" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
            Our visa experts are available 24/7 to help you
          </p>

          <div className="flex gap-4 justify-center">

            {/* Contact Us — icon only */}
            <button
              onClick={() => navigate("/contact")}
              title="Contact Us"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ flexShrink: 0, border: "none", cursor: "pointer" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="#00477f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 8l10 7 10-7" stroke="#00477f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* WhatsApp — icon only */}
            <a
              href="https://wa.me/8527528363"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Chat"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "#25d366", flexShrink: 0 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 1.89.526 3.66 1.438 5.168L2 22l4.979-1.405A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm-1.4 5.5c-.2-.45-.41-.46-.6-.47H9.4c-.18 0-.47.07-.71.33-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.09 2.78.14.18 1.86 2.96 4.58 4.03 2.27.9 2.73.72 3.22.67.49-.04 1.58-.64 1.81-1.27.22-.62.22-1.15.15-1.26-.07-.1-.25-.16-.52-.28-.27-.13-1.58-.78-1.83-.87-.24-.09-.42-.13-.6.13-.18.27-.68.87-.83 1.05-.15.18-.3.2-.56.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.58-1.5-1.85-.15-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.14-.15.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.13-.59-1.43-.81-1.96Z"
                  fill="white"
                />
              </svg>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;