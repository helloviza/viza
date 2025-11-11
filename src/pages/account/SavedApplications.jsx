// helloviza/client/src/pages/account/SavedApplications.jsx
import React, { useEffect, useState } from "react";
import {
  FaBookmark,
  FaGlobe,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function SavedApplications() {
  const { t, i18n } = useTranslation("common");

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/applications/saved`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load saved applications");
        setApps(data.items || []);
      } catch (err) {
        console.error("❌ Saved Applications Fetch Error:", err);
        setError(t("account.savedApplications.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, [t]);

  async function handleDelete(id) {
    if (!window.confirm(t("account.savedApplications.confirmDelete"))) return;
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(t("account.savedApplications.errors.deleteFailed"));
    }
  }

  const statusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle style={{ color: "#2ecc71" }} />;
      case "pending":
        return <FaClock style={{ color: "#f39c12" }} />;
      case "rejected":
        return <FaTimesCircle style={{ color: "#e74c3c" }} />;
      default:
        return <FaGlobe style={{ color: "#00477f" }} />;
    }
  };

  const statusLabel = (status) => {
    const key = (status || "").toLowerCase();
    if (key === "completed") return t("account.savedApplications.status.completed");
    if (key === "pending" || !key) return t("account.savedApplications.status.pending");
    if (key === "rejected") return t("account.savedApplications.status.rejected");
    return t("account.savedApplications.status.default");
  };

  const locale = i18n.language === "ar" ? "ar-EG" : "en-IN";

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaBookmark style={{ fontSize: 42, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>{t("account.savedApplications.title")}</h1>
              <p style={{ opacity: 0.8 }}>
                {t("account.savedApplications.subtitle")}
              </p>
            </div>
          </header>

          {error && <div style={S.error}>{error}</div>}

          {loading ? (
            <p style={{ textAlign: "center" }}>
              {t("account.savedApplications.loading")}
            </p>
          ) : apps.length === 0 ? (
            <div style={S.emptyState}>
              <FaBookmark style={{ fontSize: 60, color: "#ccc" }} />
              <p>{t("account.savedApplications.empty")}</p>
            </div>
          ) : (
            <div style={S.tableCard}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thRow}>
                    <th style={S.th}>
                      {t("account.savedApplications.table.headers.id")}
                    </th>
                    <th style={S.th}>
                      {t("account.savedApplications.table.headers.type")}
                    </th>
                    <th style={S.th}>
                      {t("account.savedApplications.table.headers.country")}
                    </th>
                    <th style={S.th}>
                      {t("account.savedApplications.table.headers.status")}
                    </th>
                    <th style={S.th}>
                      {t("account.savedApplications.table.headers.updated")}
                    </th>
                    <th style={S.th}>
                      {t("account.savedApplications.table.headers.action")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id} style={S.tr}>
                      <td style={S.td}>{a.id || "—"}</td>
                      <td style={S.td}>
                        {a.type || t("account.savedApplications.table.defaultType")}
                      </td>
                      <td style={S.td}>{a.country || "—"}</td>
                      <td style={S.td}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {statusIcon(a.status)}
                          {statusLabel(a.status)}
                        </span>
                      </td>
                      <td style={S.td}>
                        {a.updatedAt
                          ? new Date(a.updatedAt).toLocaleDateString(locale, {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td style={S.tdAction}>
                        {a.url && (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            style={S.viewBtn}
                          >
                            <FaExternalLinkAlt />
                            {t("account.savedApplications.actions.view")}
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(a.id)}
                          style={S.deleteBtn}
                          aria-label={t("account.savedApplications.actions.remove")}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
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
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { backgroundColor: "#00477f", color: "#fff" },
  th: { textAlign: "left", padding: "10px 14px", fontWeight: 700 },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "10px 14px", fontWeight: 500 },
  tdAction: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  viewBtn: {
    backgroundColor: "#00477f",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#d06549",
    cursor: "pointer",
    fontSize: 18,
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
