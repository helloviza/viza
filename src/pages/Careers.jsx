import React from "react";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Replace with your own team/culture images or use Unsplash placeholders
const teamImg1 = "/images/team1.jpg";
const teamImg2 = "/images/team2.jpg";

const perks = [
  {
    icon: "🌏",
    title: "Remote work options",
    desc: "Work from anywhere with flexible hours."
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Family-friendly culture",
    desc: "Inclusive policies for work-life balance."
  },
  {
    icon: "💻",
    title: "Latest equipment",
    desc: "Get top-of-the-line tech for your role."
  },
  {
    icon: "🌴",
    title: "Generous Leave",
    desc: "Paid time off, public holidays, and personal days."
  },
  {
    icon: "📈",
    title: "Growth & Learning",
    desc: "Upskill budgets, career mentoring, and internal mobility."
  },
  {
    icon: "🏆",
    title: "Competitive pay",
    desc: "Great compensation & annual bonus."
  },
  {
    icon: "🩺",
    title: "Health Benefits",
    desc: "Medical, dental & wellness support."
  },
  {
    icon: "🎉",
    title: "Fun company offsites",
    desc: "Annual meetups in exciting locations."
  }
];

const jobs = [
  {
    title: "Full Stack Developer",
    location: "Remote / Bangalore",
    link: "#"
  },
  {
    title: "Customer Success Manager",
    location: "Remote / Delhi",
    link: "#"
  },
  {
    title: "Digital Marketing Specialist",
    location: "Remote / Mumbai",
    link: "#"
  }
];

export default function Careers() {
  return (
    <div
      style={{
        fontFamily: baseFont,
        background: "#f7fafc",
        margin: 0,
        padding: 0,
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "120px 18px 24px 18px"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 60
          }}
        >
          <span
            style={{
              color: "#00477f",
              letterSpacing: "1.5px",
              fontWeight: 700,
              fontSize: 18,
              textTransform: "uppercase",
              marginBottom: 8,
              display: "inline-block"
            }}
          >
            CAREERS
          </span>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              margin: "20px 0 18px 0",
              color: "#00477f",
              letterSpacing: "-1px",
              lineHeight: 1.08
            }}
          >
            You're Brilliant.<br />We're Hiring.
          </h1>
          <p
            style={{
              fontSize: 22,
              color: "#d06549",
              margin: "0 auto",
              maxWidth: 540,
              fontWeight: 400,
              lineHeight: 1.3
            }}
          >
            We’re looking for ambitious, energetic and helpful people who want to build delightful digital travel products that empower users globally.
          </p>
        </div>

        {/* PHOTOS */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginBottom: 60,
            flexWrap: "wrap"
          }}
        >
          <img
            src={teamImg1}
            alt="Helloviza Team 1"
            style={{
              borderRadius: 18,
              width: "100%",
              maxWidth: 500,
              minHeight: 210,
              objectFit: "cover",
              boxShadow: "0 4px 32px #89a5f4b0",
              flex: 1
            }}
          />
          <img
            src={teamImg2}
            alt="Helloviza Team 2"
            style={{
              borderRadius: 18,
              width: "100%",
              maxWidth: 500,
              minHeight: 210,
              objectFit: "cover",
              boxShadow: "0 4px 32px #ffad43a0",
              flex: 1
            }}
          />
        </div>

        {/* PERKS */}
        <div style={{ marginBottom: 70 }}>
          <div
            style={{
              color: "#00477f",
              fontWeight: 700,
              letterSpacing: "1.5px",
              marginBottom: 12,
              textTransform: "uppercase",
              fontSize: 18
            }}
          >
            PERKS
          </div>
          <h2
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#002c55",
              marginBottom: 36,
              lineHeight: 1.14
            }}
          >
            Why work at Helloviza?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 32
            }}
          >
            {perks.map((perk, i) => (
              <div key={i} style={{ textAlign: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>{perk.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 19,
                    color: "#00477f",
                    marginBottom: 6
                  }}
                >
                  {perk.title}
                </div>
                <div
                  style={{
                    color: "#6a778e",
                    fontSize: 15,
                    minHeight: 38
                  }}
                >
                  {perk.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JOBS */}
        <div style={{ marginBottom: 80 }}>
          <div
            style={{
              color: "#00477f",
              fontWeight: 700,
              letterSpacing: "1.5px",
              marginBottom: 12,
              textTransform: "uppercase",
              fontSize: 18
            }}
          >
            JOBS
          </div>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#00477f",
              marginBottom: 16
            }}
          >
            Current Openings
          </h2>
          <p
            style={{
              color: "#444",
              fontSize: 17,
              marginBottom: 20,
              lineHeight: 1.3
            }}
          >
            Join our rapidly growing team and build the future of digital travel!
          </p>
          <div>
            {jobs.map((job, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <a
                  href={job.link}
                  style={{
                    color: "#00477f",
                    fontWeight: 700,
                    fontSize: 19,
                    textDecoration: "none"
                  }}
                >
                  {job.title}
                </a>
                <span style={{ color: "#aaa", marginLeft: 16, fontSize: 16 }}>{job.location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div
          style={{
            background: "linear-gradient(100deg, #d06549 55%, #d06549 35%, #00477f 200%)",
            borderRadius: 30,
            padding: "36px 36px",
            boxShadow: "0 4px 44px #ffe38430",
            marginBottom: 30
          }}
        >
          <h3
            style={{
              fontWeight: 800,
              fontSize: 28,
              color: "#00477f",
              marginBottom: 15,
              lineHeight: 1.18
            }}
          >
            The ease of a travel expert.<br />The power of transparency.
          </h3>
          <div
            style={{
              display: "flex",
              gap: 22,
              flexWrap: "wrap",
              color: "#00477f",
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 22
            }}
          >
            <span>✔ 24x7 Customer Support</span>
            <span>✔ 100% Digital Process</span>
            <span>✔ Explore Global Destinations</span>
            <span>✔ Trusted by Thousands</span>
          </div>
          <button
            style={{
              padding: "12px 34px",
              background: "#00477f",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 10,
              fontSize: 17,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 12px #002c5550"
            }}
          >
            Request A Demo
          </button>
        </div>
      </div>
    </div>
  );
}
