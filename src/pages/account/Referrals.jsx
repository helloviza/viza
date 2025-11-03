import React, { useEffect, useState } from "react";
import {
  FaGift,
  FaUserPlus,
  FaWhatsapp,
  FaEnvelope,
  FaCopy,
  FaLink,
  FaWallet,
} from "react-icons/fa";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Referrals() {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [stats, setStats] = useState({ totalInvites: 0, successful: 0, credits: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchReferralData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/referrals`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load referrals");

        setReferralCode(data.code || "");
        setReferralLink(data.link || `${window.location.origin}/signup?ref=${data.code}`);
        setStats({
          totalInvites: data.totalInvites || 0,
          successful: data.successful || 0,
          credits: data.credits || 0,
        });
      } catch (err) {
        console.error("❌ Referral fetch error:", err);
        setMessage("Failed to load referral data.");
      } finally {
        setLoading(false);
      }
    }
    fetchReferralData();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setMessage("Referral link copied!");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Copy failed, please copy manually.");
    }
  };

  const handleShare = (platform) => {
    const text = `Join HelloViza with my referral code ${referralCode}! Use this link to sign up: ${referralLink}`;
    if (platform === "whatsapp")
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    else if (platform === "email")
      window.open(`mailto:?subject=Join HelloViza&body=${encodeURIComponent(text)}`);
    else window.open(referralLink, "_blank");
  };

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaGift style={{ fontSize: 42, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>Referrals & Rewards</h1>
              <p style={{ opacity: 0.8 }}>
                Invite your friends to HelloViza and earn travel credits when they join!
              </p>
            </div>
          </header>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading referral details...</p>
          ) : (
            <>
              <div style={S.referralCard}>
                <FaLink style={S.linkIcon} />
                <h2 style={S.referralTitle}>Your Referral Code</h2>
                <div style={S.referralBox}>
                  <span style={S.referralCode}>{referralCode || "XXXXXX"}</span>
                  <button onClick={handleCopy} style={S.copyBtn}>
                    <FaCopy /> Copy Link
                  </button>
                </div>
                <p style={S.linkText}>{referralLink}</p>

                <div style={S.shareButtons}>
                  <button onClick={() => handleShare("whatsapp")} style={S.waBtn}>
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button onClick={() => handleShare("email")} style={S.emailBtn}>
                    <FaEnvelope /> Email
                  </button>
                  <button onClick={() => handleShare("direct")} style={S.linkBtn}>
                    <FaUserPlus /> Share Link
                  </button>
                </div>

                {message && <div style={S.toast}>{message}</div>}
              </div>

              <div style={S.statsGrid}>
                <div style={S.statCard}>
                  <FaUserPlus style={S.statIcon} />
                  <h3 style={S.statValue}>{stats.totalInvites}</h3>
                  <p style={S.statLabel}>Total Invites</p>
                </div>
                <div style={S.statCard}>
                  <FaGift style={S.statIcon} />
                  <h3 style={S.statValue}>{stats.successful}</h3>
                  <p style={S.statLabel}>Successful Referrals</p>
                </div>
                <div style={S.statCard}>
                  <FaWallet style={S.statIcon} />
                  <h3 style={S.statValue}>₹ {stats.credits.toFixed(2)}</h3>
                  <p style={S.statLabel}>Referral Credits</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// === Styles ===
const S = {
  pageWrapper: {
    maxWidth: 1000,
    margin: "0 auto",
    fontFamily: baseFont,
    padding: "0 20px",
    color: "#00477f",
  },
  headerCard: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 30,
    borderRadius: 12,
    padding: 25,
    background: "linear-gradient(135deg, #d06549, #00477f)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  },
  pageTitle: { fontSize: 28, fontWeight: 700 },
  referralCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 30,
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
    marginBottom: 30,
  },
  linkIcon: { fontSize: 40, color: "#d06549", marginBottom: 8 },
  referralTitle: { fontSize: 22, fontWeight: 700, color: "#00477f" },
  referralBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    margin: "20px 0",
  },
  referralCode: {
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: 2,
    color: "#00477f",
  },
  copyBtn: {
    background: "#00477f",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  linkText: { fontSize: 14, color: "#666", marginBottom: 20 },
  shareButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  waBtn: {
    background: "#25d366",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  emailBtn: {
    background: "#0072c6",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  linkBtn: {
    background: "#d06549",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  toast: {
    marginTop: 16,
    background: "#00477f",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    fontWeight: 600,
    display: "inline-block",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },
  statCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
  },
  statIcon: { fontSize: 30, color: "#d06549", marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: 800 },
  statLabel: { fontSize: 15, color: "#666" },
};
