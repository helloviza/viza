import React from "react";
import { Link } from "react-router-dom";


// Upload your images/animations (SVG, Lottie GIF, PNG, etc.) to /public/uploads/
// and set the paths below.

const handImg = "/uploads/your_hand_animation.gif";      // Top right hand animation
const globeImg = "/uploads/your_globe_animation.gif";    // Center globe animation
const circleImg = "/uploads/your_circle_animation.gif";  // Final circular animation

// Team/Advisor Images
const team = [
  { name: "Imran Ali", role: "Founder & CEO", img: "/uploads/imran.jpg" },
  { name: "Saurabh Jha", role: "CTO & Co-founder", img: "/uploads/saurabh.jpg" },
  // Add more as needed
];

const friends = [
  { name: "Vivek Sharma", title: "Advisor", img: "/uploads/vivek.jpg" },
  // Add more as needed
];

const investors = [
  { logo: "/uploads/investor1.png", name: "XCapital" },
  { logo: "/uploads/investor2.png", name: "TravelSeed" },
  // Add more as needed
];

const indInvestors = [
  { name: "Ashish Bhatt", role: "Angel Investor", img: "/uploads/ashish.jpg" },
  // Add more as needed
];

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

export default function AboutUs() {
  return (
    <div style={{
      fontFamily: baseFont,
      background: "#fff",
      color: "#181a1b",
      minHeight: "100vh"
    }}>
      {/* --- Hero Section (Left Text, Right Hand) --- */}
      <section style={{
        display: "flex",
        alignItems: "center",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "92px 0 54px 0",
        position: "relative"
      }}>
        <div style={{ flex: 1, minWidth: 320, paddingLeft: 54 }}>
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
            fontSize: 37,
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
            fontSize: 19,
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
          justifyContent: "flex-end",
          minWidth: 400,
          position: "relative",
          height: 400,
          marginRight: 40
        }}>
          <img
            src={handImg}
            alt="Hand animation"
            style={{
              width: 360,
              maxWidth: "100%",
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
          fontSize: 25,
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
        gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))",
        gap: 38
      }}>
        {/* Card 1 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 20,
          padding: "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>✈️</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Seamless Visa Services</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>Expert-led guidance, application, and approvals for every traveler and business.</div>
        </div>
        {/* Card 2 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 20,
          padding: "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>💡</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Digital Convenience</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>All-in-one online portal. Track, upload, and manage your journey from anywhere.</div>
        </div>
        {/* Card 3 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 20,
          padding: "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>🌏</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Global Partnerships</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>Trusted network with embassies, airlines, and hotels—everywhere you want to go.</div>
        </div>
        {/* Card 4 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 20,
          padding: "34px 26px 30px 26px",
          textAlign: "left",
          boxShadow: "0 1px 10px #f0f0f0"
        }}>
          <div style={{ fontSize: 33, marginBottom: 16 }}>🤝</div>
          <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Real Human Support</div>
          <div style={{ color: "#4d5b74", fontSize: 15 }}>Speak to real experts 24/7. We care about your travel as much as you do.</div>
        </div>
      </section>

      {/* --- Globe Animation Center --- */}
      <section style={{
        textAlign: "center",
        margin: "70px 0 38px 0",
        minHeight: 110
      }}>
        <img
          src={globeImg}
          alt="Globe animation"
          style={{
            width: 340,
            maxWidth: "100%",
            margin: "0 auto 18px auto"
          }}
        />
        <div style={{
          color: "#181a1b",
          fontWeight: 600,
          fontSize: 21,
          margin: "18px 0 0 0"
        }}>
          Atlantic Ocean in the middle? <span style={{ color: "#d06549" }}>No problem.</span>
        </div>
        <div style={{
          color: "#4d5b74",
          fontSize: 16,
          margin: "6px auto 0 auto",
          maxWidth: 460
        }}>
          Our distributed team & partners work across continents to help you—wherever you are!
        </div>
      </section>

      {/* --- Team Section --- */}
      <section style={{
        maxWidth: 1100,
        margin: "0 auto 10px auto",
        padding: "34px 16px 0 16px"
      }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          margin: "0 0 22px 0",
          color: "#222"
        }}>
          Meet Helloviza’s team
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          margin: "16px 0"
        }}>
          {team.map((t, i) => (
            <div key={i} style={{
              textAlign: "center",
              width: 145,
              marginBottom: 20
            }}>
              <img src={t.img} alt={t.name}
                style={{
                  width: 78, height: 78, borderRadius: "50%", objectFit: "cover",
                  border: "2px solid #d0e3f7", marginBottom: 6
                }}
              />
              <div style={{ fontWeight: 600, fontSize: 16, color: "#003366" }}>{t.name}</div>
              <div style={{ fontSize: 14, color: "#7d868e" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Friends/Partners Section --- */}
      <section style={{
        maxWidth: 1000,
        margin: "0 auto 14px auto",
        padding: "28px 6px 0 6px"
      }}>
        <h2 style={{
          fontSize: 19,
          fontWeight: 700,
          margin: "0 0 14px 0",
          color: "#222"
        }}>
          Meet Helloviza’s friends
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          margin: "10px 0"
        }}>
          {friends.map((t, i) => (
            <div key={i} style={{
              textAlign: "center",
              width: 120,
              marginBottom: 12
            }}>
              <img src={t.img} alt={t.name}
                style={{
                  width: 58, height: 58, borderRadius: "50%", objectFit: "cover",
                  border: "2px solid #ffd79b", marginBottom: 5
                }}
              />
              <div style={{ fontWeight: 600, fontSize: 14, color: "#d06549" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#bdbcbc" }}>{t.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Join Our Team Black CTA Band --- */}
      <section style={{
        background: "#00477f",
        color: "#fff",
        padding: "44px 0 50px 0",
        margin: "56px 0",
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
          fontSize: 28,
          marginBottom: 16,
          color: "#fff"
        }}>
          Join our team
        </h3>
        <div style={{
          color: "#c1c9d3",
          fontSize: 17,
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
            fontSize: 18,
            padding: "12px 40px",
            cursor: "pointer"
          }}>
            See Open Roles
          </button>
        </a>
      </section>

      {/* --- Investors Section --- */}
      <section style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "30px 16px 0 16px"
      }}>
        <h2 style={{
          fontSize: 19,
          fontWeight: 700,
          margin: "0 0 10px 0",
          color: "#222"
        }}>
          Our Investors
        </h2>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 38,
          margin: "18px 0 22px 0"
        }}>
          {investors.map((inv, i) => (
            <img src={inv.logo} key={i} alt={inv.name}
              style={{ height: 34, objectFit: "contain", opacity: 0.80 }} />
          ))}
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18
        }}>
          {indInvestors.map((inv, i) => (
            <div key={i} style={{
              textAlign: "center",
              width: 115
            }}>
              <img src={inv.img} alt={inv.name}
                style={{
                  width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                  border: "2px solid #eee", marginBottom: 3
                }}
              />
              <div style={{ fontWeight: 600, fontSize: 13, color: "#00477f" }}>{inv.name}</div>
              <div style={{ fontSize: 12, color: "#bdbcbc" }}>{inv.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Social Proof/Blog Cards --- */}
      <section style={{
        maxWidth: 1200,
        margin: "60px auto 0 auto",
        padding: "24px 8px 38px 8px"
      }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 16px 0",
          color: "#222"
        }}>
          What people are writing
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 22
        }}>
          {blogPosts.map((p, i) => (
            <a key={i} href={p.link} style={{
              textDecoration: "none",
              background: "#fafbfc",
              borderRadius: 16,
              boxShadow: "0 2px 10px #ececec",
              padding: 0,
              maxWidth: 290,
              width: "100%",
              minHeight: 220,
              color: "#111"
            }}>
              <img src={p.img} alt={p.title} style={{
                width: "100%",
                height: 112,
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
        </div>
      </section>

      {/* --- Circle Animation + End CTA --- */}
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
      width: 400,
      margin: "0 auto 28px auto"
    }}
  />
  <div style={{ fontSize: 21, fontWeight: 700, color: "#003366", marginBottom: 10 }}>
    Open the door to your world.
  </div>
  <Link to="/go-for-visa" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "14px 36px",
        background: "#003366",
        color: "#fff",
        fontWeight: 700,
        borderRadius: 10,
        fontSize: 17,
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
