import React from "react";
import { Link } from "react-router-dom";

// Upload your images/animations (GIF, SVG, PNG, etc.) to /public/uploads/
const handImg = "/uploads/your_hand_animation.gif";      // Top right hand animation
const globeImg = "/uploads/your_globe_animation.gif";    // Center globe animation
const circleImg = "/uploads/your_circle_animation.gif";  // Final circular animation

const blogPosts = [
  {
    title: "10K+ Travelers Served, Zero Hassle",
    desc: "How Helloviza delivers peace of mind at every stage.",
    img: "/uploads/blog1.jpg",
    link: "#"
  },
  // Add more as needed
];

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Responsive padding for header safety (mystyle)
const headerSafePadding = {
  height: typeof window !== "undefined" && window.innerWidth < 700 ? 82 : 32
};

export default function AboutUs() {
  return (
    <div style={{
      fontFamily: baseFont,
      background: "#fff",
      color: "#181a1b",
      minHeight: "100vh"
    }}>
      {/* --- TOP SAFE PADDING for header, MOBILE FRIENDLY --- */}
      <div style={headerSafePadding}></div>

      {/* --- Hero Section (Left Text, Right Hand) --- */}
      <section style={{
        display: "flex",
        flexDirection: window.innerWidth < 920 ? "column" : "row",
        alignItems: "center",
        maxWidth: 1280,
        margin: "0 auto",
        padding: window.innerWidth < 920 ? "38px 0 24px 0" : "92px 0 54px 0",
        position: "relative"
      }}>
        <div style={{
          flex: 1,
          minWidth: window.innerWidth < 920 ? "unset" : 320,
          paddingLeft: window.innerWidth < 920 ? 0 : 54,
          width: window.innerWidth < 920 ? "100%" : undefined,
          textAlign: window.innerWidth < 920 ? "center" : undefined
        }}>
          <div style={{
            fontWeight: 400,
            fontSize: 15,
            letterSpacing: "1.2px",
            color: "#aaa",
            marginBottom: 14,
            textTransform: "uppercase"
          }}>
            About us
          </div>
          <h1 style={{
            fontWeight: 600,
            fontSize: window.innerWidth < 540 ? 21 : 37,
            lineHeight: 1.13,
            margin: 0,
            color: "#181a1b"
          }}>
            We’re a team of Professional<br />
            passionate about building<br />
            for other travelers.
          </h1>
          <p style={{
            marginTop: 32,
            color: "#4d5b74",
            fontSize: window.innerWidth < 540 ? 14 : 19,
            lineHeight: "1.45",
            maxWidth: 510
          }}>
            Your journey is at the heart of Helloviza.<br />
            Our team’s mission is to remove friction and uncertainty from travel—whether for business, family, or adventure.
          </p>
        </div>
        {/* Hand Animation Upload */}
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: window.innerWidth < 920 ? "center" : "flex-end",
          minWidth: window.innerWidth < 920 ? 0 : 400,
          position: "relative",
          height: window.innerWidth < 540 ? 110 : (window.innerWidth < 920 ? 220 : 400),
          marginRight: window.innerWidth < 920 ? 0 : 40,
          marginTop: window.innerWidth < 920 ? 20 : 0,
          marginBottom: window.innerWidth < 540 ? 6 : 0
        }}>
          <img
            src={handImg}
            alt="Hand animation"
            style={{
              width: window.innerWidth < 540 ? 80 : (window.innerWidth < 920 ? 210 : 360),
              maxWidth: window.innerWidth < 540 ? "65vw" : (window.innerWidth < 920 ? "82vw" : "100%"),
              objectFit: "contain",
              opacity: 0.97
            }}
          />
        </div>
      </section>

      {/* --- Centered Mission --- */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "32px 10px 42px 10px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          <span style={{ flex: 1, borderTop: "1px solid #e3e3e3", marginRight: 15 }}></span>
          <span style={{
            color: "#888",
            fontSize: 14,
            letterSpacing: "2.5px",
            fontWeight: 600
          }}>
            Mission
          </span>
          <span style={{ flex: 1, borderTop: "1px solid #e3e3e3", marginLeft: 15 }}></span>
        </div>
        <h2 style={{
          fontWeight: 600,
          fontSize: window.innerWidth < 540 ? 16 : 25,
          color: "#2d4159",
          margin: "0 0 18px 0"
        }}>
          Accelerate innovation by making it radically simple to create and consume global travel services.
        </h2>
      </section>

      {/* --- 4 Value Cards --- */}
      <section style={{
        maxWidth: 1050,
        margin: "0 auto 62px auto",
        display: "grid",
        gridTemplateColumns: window.innerWidth < 600 ? "1fr" : "repeat(auto-fit, minmax(255px, 1fr))",
        gap: window.innerWidth < 600 ? 12 : 38
      }}>
        {/* Card 1 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: window.innerWidth < 600 ? 14 : 20,
          padding: window.innerWidth < 600 ? "18px 8px 16px 8px" : "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0",
          fontSize: window.innerWidth < 600 ? "0.96rem" : "1rem"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>✈️</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Seamless Visa Services</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>Expert-led guidance, application, and approvals for every traveler and business.</div>
        </div>
        {/* Card 2 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: window.innerWidth < 600 ? 14 : 20,
          padding: window.innerWidth < 600 ? "18px 8px 16px 8px" : "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0",
          fontSize: window.innerWidth < 600 ? "0.96rem" : "1rem"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>💡</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Digital Convenience</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>All-in-one online portal. Track, upload, and manage your journey from anywhere.</div>
        </div>
        {/* Card 3 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: window.innerWidth < 600 ? 14 : 20,
          padding: window.innerWidth < 600 ? "18px 8px 16px 8px" : "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0",
          fontSize: window.innerWidth < 600 ? "0.96rem" : "1rem"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>🌏</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Global Partnerships</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>Trusted network with embassies, airlines, and hotels—everywhere you want to go.</div>
        </div>
        {/* Card 4 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: window.innerWidth < 600 ? 14 : 20,
          padding: window.innerWidth < 600 ? "18px 8px 16px 8px" : "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0",
          fontSize: window.innerWidth < 600 ? "0.96rem" : "1rem"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>🤝</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Real Human Support</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>Speak to real experts 24/7. We care about your travel as much as you do.</div>
        </div>
      </section>

      {/* --- Globe Animation Center --- */}
      <section style={{
        textAlign: "center",
        margin: window.innerWidth < 600 ? "30px 0 18px 0" : "70px 0 38px 0",
        minHeight: 110
      }}>
        <img
          src={globeImg}
          alt="Globe animation"
          style={{
            width: window.innerWidth < 600 ? 210 : 340,
            maxWidth: "97vw",
            margin: "0 auto 18px auto"
          }}
        />
        <div style={{
          color: "#181a1b",
          fontWeight: 600,
          fontSize: window.innerWidth < 540 ? 15 : 21,
          margin: "18px 0 0 0"
        }}>
          Atlantic Ocean in the middle? <span style={{ color: "#d06549" }}>No problem.</span>
        </div>
        <div style={{
          color: "#4d5b74",
          fontSize: window.innerWidth < 540 ? 12 : 16,
          margin: "6px auto 0 auto",
          maxWidth: 460
        }}>
          Our distributed team & partners work across continents to help you—wherever you are!
        </div>
      </section>

      {/* --- Join Our Team CTA Band --- */}
      <section style={{
        background: "#00477f",
        color: "#fff",
        padding: window.innerWidth < 700 ? "28px 0 28px 0" : "44px 0 50px 0",
        margin: window.innerWidth < 700 ? "28px 0" : "56px 0",
        textAlign: "center"
      }}>
        <div style={{
          letterSpacing: "2px",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 10
        }}>Careers</div>
        <h3 style={{
          fontWeight: 700,
          fontSize: window.innerWidth < 540 ? 16 : 28,
          marginBottom: 16,
          color: "#fff"
        }}>
          Join our team
        </h3>
        <div style={{
          color: "#c1c9d3",
          fontSize: window.innerWidth < 540 ? 12 : 17,
          marginBottom: 22
        }}>
          Interested in building the future of global travel?
        </div>
        <a href="/careers">
          <button style={{
            background: "#ffffff",
            color: "#d06549",
            fontWeight: 700,
            border: 0,
            borderRadius: 8,
            fontSize: window.innerWidth < 540 ? 14 : 18,
            padding: window.innerWidth < 540 ? "7px 18px" : "12px 40px",
            cursor: "pointer"
          }}>
            See Open Roles
          </button>
        </a>
      </section>

      {/* --- Social Proof/Blog Cards --- */}
      <section style={{
        maxWidth: 1200,
        margin: "60px auto 0 auto",
        padding: "24px 8px 38px 8px",
        display: "flex",
        flexWrap: "wrap",
        gap: 22,
        justifyContent: "center"
      }}>
        <h2 style={{
          width: "100%",
          fontSize: window.innerWidth < 540 ? 14 : 20,
          fontWeight: 700,
          margin: "0 0 16px 0",
          color: "#222"
        }}>
          What people are writing
        </h2>
        {blogPosts.map((p, i) => (
          <a key={i} href={p.link} style={{
            textDecoration: "none",
            background: "#fafbfc",
            borderRadius: 16,
            boxShadow: "0 2px 10px #ececec",
            padding: 0,
            maxWidth: 290,
            width: "100%",
            minHeight: window.innerWidth < 700 ? 120 : 220,
            color: "#111",
            display: "flex",
            flexDirection: "column"
          }}>
            <img src={p.img} alt={p.title} style={{
              width: "100%",
              height: window.innerWidth < 700 ? 84 : 112,
              objectFit: "cover",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            }} />
            <div style={{ padding: "16px 18px 10px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#003366", marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: "#4d5b74" }}>{p.desc}</div>
            </div>
          </a>
        ))}
      </section>

      {/* --- Circle Animation + End CTA --- */}
      <section style={{
        maxWidth: 700,
        margin: "60px auto 0 auto",
        padding: "38px 0 40px 0",
        textAlign: "center"
      }}>
        <img
          src={circleImg}
          alt="Circle animation"
          style={{
            width: window.innerWidth < 700 ? 220 : 400,
            maxWidth: "96vw",
            margin: "0 auto 28px auto"
          }}
        />
        <div style={{ fontSize: window.innerWidth < 540 ? 14 : 21, fontWeight: 700, color: "#003366", marginBottom: 10 }}>
          Open the door to your world.
        </div>
        <Link to="/go-for-visa" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: window.innerWidth < 540 ? "7px 16px" : "14px 36px",
              background: "#003366",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 10,
              fontSize: window.innerWidth < 540 ? 12 : 17,
              border: "none",
              cursor: "pointer",
              marginTop: 16,
              boxShadow: "0 2px 10px #00336620"
            }}
          >
            Reserve Your Visa
          </button>
        </Link>
      </section>
    </div>
  );
}
