// src/components/ContactUs.jsx
import React, { useState } from "react";

const BRAND  = "#00477f";
const ACCENT = "#d06549";

const TOPICS = [
  "Visa Application",
  "Transfer Service",
  "Document Help",
  "Pricing Query",
  "Partnership",
  "Other",
];

const ContactUs=()=>{
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [status, setStatus]   = useState(null); // "success" | "error" | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      // TODO: Replace with your actual API endpoint
      // const res = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error("Submit failed");
      await new Promise((r) => setTimeout(r, 1200)); // Simulate API call
      setStatus("success");
      setForm({ name: "", email: "", phone: "", topic: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl border bg-white outline-none text-sm transition-all duration-200
    focus:border-[#00477f] focus:ring-2 focus:ring-[#00477f]/10
  `;
  const inputStyle = { fontFamily: "'Inter', sans-serif", borderColor: "rgba(0,0,0,0.12)" };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left — info */}
          <div className="lg:w-[42%] xl:sticky xl:top-24">
            <p
              className="text-[#d06549] text-sm font-bold uppercase tracking-[0.18em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get In Touch
            </p>
            <h2
              className="font-black text-[#00477f] leading-none mb-5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
                letterSpacing: "-1px",
              }}
            >
              Contact <span className="italic text-[#d06549]">Us</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Have a question about your visa, need help with documents, or want to partner with us? We're here to help.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  label: "Email",
                  value: "support@helloviza.com",
                  href: "mailto:support@helloviza.com",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                  label: "WhatsApp",
                  value: "+91 99999 99999",
                  href: "https://wa.me/919999999999",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: "Office",
                  value: "New Delhi, India",
                  href: null,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(208,101,73,0.1)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {item.label}
                    </div>
                    {item.href ? (
                      <a href={item.href}
                        className="text-[#00477f] font-bold text-sm hover:text-[#d06549] transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", textDecoration: "none" }}>
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-[#00477f] font-bold text-sm"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}>
                        {item.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business hours */}
            <div className="mt-8 p-5 rounded-2xl"
              style={{ background: "rgba(0,71,127,0.05)", border: "1px solid rgba(0,71,127,0.1)" }}>
              <p className="font-black text-[#00477f] text-base mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Business Hours
              </p>
              {[
                { day: "Mon – Fri", time: "9:00 AM – 7:00 PM IST" },
                { day: "Saturday",  time: "10:00 AM – 5:00 PM IST" },
                { day: "Sunday",    time: "Emergency Support Only" },
              ].map((h, i) => (
                <div key={i} className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>{h.day}</span>
                  <span className="text-[#00477f] font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:w-[58%] w-full">
            <div
              className="rounded-3xl p-6 sm:p-8 lg:p-10"
              style={{ background: "#f8f9fc", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(34,197,94,0.1)" }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="14" stroke="#22c55e" strokeWidth="2"/>
                      <path d="M10 16l4 4 8-8" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-black text-[#00477f] text-2xl mb-2"
                    style={{ fontFamily: "'Inter', Arial, sans-serif" }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Our team will get back to you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setStatus(null)}
                    className="mt-6 px-6 py-2.5 rounded-xl font-bold text-sm text-white"
                    style={{ background: BRAND, fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="font-black text-[#00477f] text-xl mb-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    Send Us a Message
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        Full Name *
                      </label>
                      <input
                        name="name" required value={form.name} onChange={handleChange}
                        placeholder="Your name"
                        className={inputClass} style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        Email *
                      </label>
                      <input
                        type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClass} style={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        Phone
                      </label>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className={inputClass} style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        Topic
                      </label>
                      <select
                        name="topic" value={form.topic} onChange={handleChange}
                        className={inputClass} style={{ ...inputStyle, color: form.topic ? "#111" : "#9ca3af" }}
                      >
                        <option value="">Select a topic</option>
                        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      Message *
                    </label>
                    <textarea
                      name="message" required value={form.message} onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      rows={5}
                      className={inputClass + " resize-none"} style={inputStyle}
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black text-white text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1.1rem",
                      background: loading ? "#aaa" : `linear-gradient(135deg, ${BRAND} 0%, #005fa3 100%)`,
                      boxShadow: loading ? "none" : "0 8px 24px rgba(0,71,127,0.3)",
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Sending…
                      </span>
                    ) : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



export default ContactUs;
