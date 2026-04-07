// src/components/ReviewsSection.jsx
import React, { useState } from "react";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "/images/avatars/priya.jpg",
    initials: "PS",
    rating: 5,
    visa: "Dubai Visa",
    date: "March 2025",
    review: "Absolutely seamless experience! Got my Dubai visa in just 3 days. The team was super responsive and guided me through every document. 10/10 would recommend to everyone.",
  },
  {
    id: 2,
    name: "Rahul Verma",
    location: "Delhi, India",
    avatar: "/images/avatars/rahul.jpg",
    initials: "RV",
    rating: 5,
    visa: "Singapore Visa",
    date: "February 2025",
    review: "Used HelloViza for Singapore. The process was completely online, tracking was real-time, and the approval came faster than expected. Great service!",
  },
  {
    id: 3,
    name: "Anjali Patel",
    location: "Ahmedabad, India",
    avatar: "/images/avatars/anjali.jpg",
    initials: "AP",
    rating: 5,
    visa: "Thailand Visa",
    date: "January 2025",
    review: "First time applying for an international visa and I was nervous, but HelloViza made it stress-free. Support team was available 24/7. Highly impressed!",
  },
  {
    id: 4,
    name: "Karan Mehta",
    location: "Bangalore, India",
    avatar: "/images/avatars/karan.jpg",
    initials: "KM",
    rating: 4,
    visa: "UK Visa",
    date: "March 2025",
    review: "The UK visa process is complex but HelloViza simplified everything. Document checklist was perfect, no rejections. Would use again for future travel.",
  },
  {
    id: 5,
    name: "Sunita Reddy",
    location: "Hyderabad, India",
    avatar: "/images/avatars/sunita.jpg",
    initials: "SR",
    rating: 5,
    visa: "Maldives Visa",
    date: "February 2025",
    review: "Used the transfer service along with visa — everything was coordinated perfectly. Our driver was on time and the car was spotless. Amazing end-to-end service!",
  },
  {
    id: 6,
    name: "Amit Joshi",
    location: "Pune, India",
    avatar: "/images/avatars/amit.jpg",
    initials: "AJ",
    rating: 5,
    visa: "USA Visa",
    date: "January 2025",
    review: "I was skeptical about applying for a US visa online, but HelloViza's team was incredibly thorough. They reviewed every document and the visa was approved in 12 days!",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i < rating ? "#f59e0b" : "#e5e7eb"}>
          <path d="M7 1l1.62 3.29 3.63.52-2.62 2.56.62 3.61L7 9.27 3.75 10.98l.62-3.61L1.75 4.81l3.63-.52z"/>
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.review.length > 140;
  const displayText = !expanded && isLong ? review.review.slice(0, 140) + "…" : review.review;

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 bg-'#f1f1f1' transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ boxShadow: "0 4px 18px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.04)" }}
    >
      {/* Top — avatar + name */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0 overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, ${BRAND}, #005fa3)` }}
        >
          {/* Avatar image — replace src with actual avatar path; falls back to initials */}
          <img
            src={review.avatar}
            alt={review.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span className="absolute font-black" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
            {review.initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-[#00477f] text-base leading-none mb-0.5 truncate"
            style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
            {review.name}
          </div>
          <div className="text-gray-400 text-xs" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
            {review.location}
          </div>
        </div>
        {/* Visa badge */}
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
          style={{
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
            background: "rgba(208,101,73,0.1)",
            color: ACCENT,
            fontSize: "0.72rem",
          }}
        >
          {review.visa}
        </span>
      </div>

      {/* Stars + date */}
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-gray-300 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          {review.date}
        </span>
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed m-0" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
        "{displayText}"
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 font-bold"
            style={{ color: ACCENT, fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;", fontSize: "inherit", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Verified badge */}
      <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-50">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#22c55e" opacity="0.15"/>
          <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5"/>
          <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-green-500 text-xs font-semibold" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
          Verified Traveler
        </span>
      </div>
    </div>
  );
}

const ReviewSections=()=> {
  return (
    <section className="bg-'#f1f1f1' py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <p
            className="text-[#d06549] text-sm font-bold uppercase tracking-[0.18em] mb-3"
            style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
          >
            Traveler Stories
          </p> 
          <h2
            className="font-black text-[#00477f] leading-none mb-4"
            style={{
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
              fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
              letterSpacing: "-1px",
            }}
          >
            What Our Travelers Say
          </h2>

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#f59e0b">
                  <path d="M10 1l2.39 4.84 5.34.77-3.87 3.77.91 5.32L10 13.27 5.23 15.7l.91-5.32L2.27 6.61l5.34-.77z"/>
                </svg>
              ))}
            </div>
            <span
              className="font-black text-[#00477f] text-2xl"
              style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}
            >
              4.81
            </span>
            <span className="text-gray-400 text-sm" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;" }}>
              from 12,000+ reviews
            </span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        {/* See all CTA */}
        <div className="text-center mt-10">
          <button
            className="px-8 py-3 rounded-xl font-bold text-base border-2 transition-all duration-200 hover:text-white"
            style={{
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
              fontSize: "1.05rem",
              borderColor: BRAND,
              color: BRAND,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = BRAND;
            }}
          >
            See All Reviews →
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReviewSections;
