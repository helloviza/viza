import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaGift,
  FaRegClock,
} from "react-icons/fa";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWallet() {
      setLoading(true);
      try {
        const [balRes, txnRes] = await Promise.all([
          fetch(`${API_BASE}/api/wallet/balance`, { credentials: "include" }),
          fetch(`${API_BASE}/api/wallet/transactions`, { credentials: "include" }),
        ]);

        const balData = await balRes.json();
        const txnData = await txnRes.json();

        if (!balRes.ok) throw new Error(balData.error || "Failed to load balance");
        if (!txnRes.ok) throw new Error(txnData.error || "Failed to load transactions");

        setBalance(balData.balance || 0);
        setTransactions(txnData.items || []);
      } catch (err) {
        console.error("❌ Wallet Fetch Error:", err);
        setError("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, []);

  const renderIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "credit":
        return <FaArrowDown style={{ color: "#2ecc71" }} />;
      case "debit":
        return <FaArrowUp style={{ color: "#e74c3c" }} />;
      case "referral":
        return <FaGift style={{ color: "#f1c40f" }} />;
      default:
        return <FaRegClock style={{ color: "#00477f" }} />;
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaWallet style={{ fontSize: 42, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>My Wallet</h1>
              <p style={{ opacity: 0.8 }}>
                Track your travel credits, transactions, and referral bonuses
              </p>
            </div>
          </header>

          {error && <div style={S.error}>{error}</div>}

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading wallet details...</p>
          ) : (
            <>
              {/* === Balance Summary === */}
              <div style={S.balanceCard}>
                <h2 style={S.balanceLabel}>Available Balance</h2>
                <div style={S.balanceAmount}>₹ {balance.toFixed(2)}</div>
                <p style={S.note}>
                  You can redeem your wallet credits for visa, flight, or holiday bookings.
                </p>
              </div>

              {/* === Transactions Table === */}
              <div style={S.tableCard}>
                <h3 style={S.subTitle}>Recent Transactions</h3>
                {transactions.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    No transactions yet.
                  </p>
                ) : (
                  <table style={S.table}>
                    <thead>
                      <tr style={S.thRow}>
                        <th style={S.th}>Type</th>
                        <th style={S.th}>Amount</th>
                        <th style={S.th}>Remarks</th>
                        <th style={S.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id || t._id} style={S.tr}>
                          <td style={S.tdType}>
                            <span style={{ marginRight: 8 }}>{renderIcon(t.type)}</span>
                            {t.type || "—"}
                          </td>
                          <td
                            style={{
                              ...S.td,
                              color:
                                t.type?.toLowerCase() === "credit"
                                  ? "#2ecc71"
                                  : t.type?.toLowerCase() === "debit"
                                  ? "#e74c3c"
                                  : "#00477f",
                              fontWeight: 700,
                            }}
                          >
                            {t.type?.toLowerCase() === "debit" ? "-" : "+"}₹
                            {Number(t.amount).toFixed(2)}
                          </td>
                          <td style={S.td}>{t.remarks || "—"}</td>
                          <td style={S.td}>{formatDate(t.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
    background: "linear-gradient(135deg, #00477f, #d06549)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  },
  pageTitle: { fontSize: 28, fontWeight: 700 },
  balanceCard: {
    background: "linear-gradient(135deg, #d06549, #00477f)",
    color: "#fff",
    borderRadius: 12,
    padding: "30px 25px",
    textAlign: "center",
    marginBottom: 30,
    boxShadow: "0 6px 20px rgba(0,71,127,0.3)",
  },
  balanceLabel: { fontSize: 20, fontWeight: 600, marginBottom: 10 },
  balanceAmount: { fontSize: 48, fontWeight: 800, marginBottom: 6 },
  note: { fontSize: 15, opacity: 0.9 },
  tableCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 25,
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
    overflowX: "auto",
  },
  subTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { backgroundColor: "#00477f", color: "#fff" },
  th: { textAlign: "left", padding: "10px 14px", fontWeight: 700 },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "10px 14px" },
  tdType: {
    padding: "10px 14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },
  error: {
    color: "#fff",
    backgroundColor: "#d06549",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: 600,
  },
};
