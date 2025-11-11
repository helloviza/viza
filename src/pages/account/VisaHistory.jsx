import React, { useEffect, useState } from "react";
import {
  FaGlobeAsia,
  FaPlaneDeparture,
  FaFileDownload,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function VisaHistory() {
  const { t, i18n } = useTranslation("common");
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locale = i18n.language === "ar" ? "ar-EG" : "en-IN";

  useEffect(() => {
    async function fetchVisaHistory() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/visa/history`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load visa history");
        setVisas(data.items || []);
      } catch (err) {
        console.error("❌ Visa History Fetch Error:", err);
        setError(t("account.visaHistory.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchVisaHistory();
  }, [t]);

  const statusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "approved":
        return "#2ecc71";
      case "pending":
        return "#f39c12";
      case "rejected":
        return "#e74c3c";
      default:
        return "#00477f";
    }
  };

  const translateStatus = (status) => {
    const s = status?.toLowerCase();
    const key =
      s === "approved" || s === "pending" || s === "rejected" ? s : "default";
    return t(`account.visaHistory.status.${key}`);
  };

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaGlobeAsia style={{ fontSize: 42, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>{t("account.visaHistory.title")}</h1>
              <p style={{ opacity: 0.8 }}>{t("account.visaHistory.subtitle")}</p>
            </div>
          </header>

          {error && <div style={S.error}>{error}</div>}

          {loading ? (
            <p style={{ textAlign: "center" }}>
              {t("account.visaHistory.loading")}
            </p>
          ) : visas.length === 0 ? (
            <div style={S.emptyState}>
              <FaPlaneDeparture style={{ fontSize: 60, color: "#ccc" }} />
              <p>{t("account.visaHistory.empty")}</p>
            </div>
          ) : (
            <div style={S.tableCard}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thRow}>
                    <th style={S.th}>
                      {t("account.visaHistory.table.headers.country")}
                    </th>
                    <th style={S.th}>
                      {t("account.visaHistory.table.headers.type")}
                    </th>
                    <th style={S.th}>
                      {t("account.visaHistory.table.headers.appliedOn")}
                    </th>
                    <th style={S.th}>
                      {t("account.visaHistory.table.headers.status")}
                    </th>
                    <th style={S.th}>
                      {t("account.visaHistory.table.headers.remarks")}
                    </th>
                    <th style={S.th}>
                      {t("account.visaHistory.table.headers.download")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visas.map((v) => {
                    const appliedDate = v.appliedAt
                      ? new Date(v.appliedAt).toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—";

                    const statusText = translateStatus(v.status);

                    return (
                      <tr key={v.id || v._id} style={S.tr}>
                        <td style={S.td}>{v.country || "—"}</td>
                        <td style={S.td}>
                          {v.type || t("account.visaHistory.table.defaultType")}
                        </td>
                        <td style={S.td}>{appliedDate}</td>
                        <td
                          style={{
                            ...S.td,
                            color: statusColor(v.status),
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {v.status?.toLowerCase() === "approved" && (
                            <FaCheckCircle style={S.statusIcon} />
                          )}
                          {v.status?.toLowerCase() === "pending" && (
                            <FaClock style={S.statusIcon} />
                          )}
                          {v.status?.toLowerCase() === "rejected" && (
                            <FaTimesCircle style={S.statusIcon} />
                          )}
                          {statusText}
                        </td>
                        <td style={S.td}>{v.remarks || "—"}</td>
                        <td style={S.td}>
                          {v.documentUrl ? (
                            <a
                              href={v.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={S.downloadLink}
                            >
                              <FaFileDownload />{" "}
                              {t("account.visaHistory.table.downloadLabel")}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
  tableCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 25,
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
  },
  thRow: { backgroundColor: "#00477f", color: "#fff" },
  th: { textAlign: "left", padding: "10px 14px", fontWeight: 700 },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "10px 14px", fontWeight: 500 },
  statusIcon: { marginRight: 6 },
  downloadLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#d06549",
    textDecoration: "none",
    fontWeight: 600,
    gap: 4,
  },
  error: {
    color: "#fff",
    backgroundColor: "#d06549",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: 600,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,71,127,0.1)",
    color: "#666",
    fontSize: 18,
  },
};
