import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaGift,
  FaRegClock,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Wallet() {
  const { t } = useTranslation();
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
        if (!txnRes.ok)
          throw new Error(txnData.error || "Failed to load transactions");

        setBalance(balData.balance || 0);
        setTransactions(txnData.items || []);
      } catch (err) {
        console.error("❌ Wallet Fetch Error:", err);
        setError(t("account.wallet.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, [t]);

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

  const formatTypeLabel = (type) => {
    if (!type) return "—";
    const key = type.toLowerCase();
    const translationKey = `account.wallet.types.${key}`;
    const translated = t(translationKey);
    // Fallback to original type string if no translation exists
    return translated === translationKey ? type : translated;
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
              <h1 style={S.pageTitle}>{t("account.wallet.title")}</h1>
              <p style={{ opacity: 0.8 }}>{t("account.wallet.subtitle")}</p>
            </div>
          </header>

          {error && <div style={S.error}>{error}</div>}

          {loading ? (
            <p style={{ textAlign: "center" }}>{t("account.wallet.loading")}</p>
          ) : (
            <>
              {/* === Balance Summary === */}
              <div style={S.balanceCard}>
                <h2 style={S.balanceLabel}>{t("account.wallet.balance.label")}</h2>
                <div style={S.balanceAmount}>
                  {t("account.wallet.balance.display", {
                    amount: balance.toFixed(2),
                  })}
                </div>
                <p style={S.note}>{t("account.wallet.balance.note")}</p>
              </div>

              {/* === Transactions Table === */}
              <div style={S.tableCard}>
                <h3 style={S.subTitle}>
                  {t("account.wallet.transactions.title")}
                </h3>
                {transactions.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    {t("account.wallet.transactions.empty")}
                  </p>
                ) : (
                  <table style={S.table}>
                    <thead>
                      <tr style={S.thRow}>
                        <th style={S.th}>
                          {t("account.wallet.transactions.headers.type")}
                        </th>
                        <th style={S.th}>
                          {t("account.wallet.transactions.headers.amount")}
                        </th>
                        <th style={S.th}>
                          {t("account.wallet.transactions.headers.remarks")}
                        </th>
                        <th style={S.th}>
                          {t("account.wallet.transactions.headers.date")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tItem) => (
                        <tr key={tItem.id || tItem._id} style={S.tr}>
                          <td style={S.tdType}>
                            <span style={{ marginRight: 8 }}>
                              {renderIcon(tItem.type)}
                            </span>
                            {formatTypeLabel(tItem.type)}
                          </td>
                          <td
                            style={{
                              ...S.td,
                              color:
                                tItem.type?.toLowerCase() === "credit"
                                  ? "#2ecc71"
                                  : tItem.type?.toLowerCase() === "debit"
                                  ? "#e74c3c"
                                  : "#00477f",
                              fontWeight: 700,
                            }}
                          >
                            {tItem.type?.toLowerCase() === "debit" ? "-" : "+"}
                            {t("account.wallet.transactions.amountDisplay", {
                              amount: Number(tItem.amount).toFixed(2),
                            })}
                          </td>
                          <td style={S.td}>{tItem.remarks || "—"}</td>
                          <td style={S.td}>
                            {tItem.createdAt ? formatDate(tItem.createdAt) : "—"}
                          </td>
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
