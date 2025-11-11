import React, { useState, useEffect } from "react";
import { FaFileUpload, FaFileAlt, FaTrashAlt } from "react-icons/fa";
import AccountSidebar from "../../components/account/Sidebar";
import { useTranslation } from "react-i18next";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Documents() {
  const { t, i18n } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("passport");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // === Fetch existing documents ===
  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/documents`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setDocuments(data.items || []);
      } catch (err) {
        console.error("❌ Documents fetch error:", err);
        setError(t("account.documents.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [t]);

  // === Handle file upload ===
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setError(t("account.documents.errors.chooseFirst"));
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch(`${API_BASE}/api/documents/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDocuments((prev) => [...prev, data]);
      setSuccess(t("account.documents.status.uploadSuccess"));
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(t("account.documents.errors.uploadFailed"));
    } finally {
      setLoading(false);
    }
  }

  // === Handle delete ===
  async function handleDelete(id) {
    if (!window.confirm(t("account.documents.confirmDelete"))) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(t("account.documents.errors.deleteFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", direction: i18n.dir(), fontFamily: baseFont }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaFileUpload style={{ fontSize: 40, marginInlineEnd: 16 }} />
            <div>
              <h1 style={S.pageTitle}>{t("account.documents.title")}</h1>
              <p style={{ opacity: 0.8 }}>
                {t("account.documents.subtitle")}
              </p>
            </div>
          </header>

          {error && <div style={S.error}>{error}</div>}
          {success && <div style={S.success}>{success}</div>}

          {/* === Upload Form === */}
          <form onSubmit={handleUpload} style={S.formCard} noValidate>
            <div style={S.formRow}>
              <label style={S.label}>{t("account.documents.form.docType")}</label>
              <select
                style={S.select}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="passport">{t("account.documents.form.types.passport")}</option>
                <option value="pan">{t("account.documents.form.types.pan")}</option>
                <option value="visa">{t("account.documents.form.types.visa")}</option>
                <option value="aadhar">{t("account.documents.form.types.aadhar")}</option>
                <option value="other">{t("account.documents.form.types.other")}</option>
              </select>
            </div>

            <div style={S.formRow}>
              <label style={S.label}>{t("account.documents.form.chooseFile")}</label>
              <input
                style={S.fileInput}
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            <button type="submit" style={S.uploadBtn} disabled={loading}>
              {loading
                ? t("account.documents.form.uploading")
                : t("account.documents.form.uploadBtn")}
            </button>
          </form>

          {/* === Documents Table === */}
          <div style={S.tableCard}>
            <h2 style={S.subTitle}>{t("account.documents.table.title")}</h2>
            {documents.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                {t("account.documents.table.empty")}
              </p>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr style={S.thRow}>
                    <th style={S.th}>{t("account.documents.table.headers.type")}</th>
                    <th style={S.th}>{t("account.documents.table.headers.file")}</th>
                    <th style={S.th}>{t("account.documents.table.headers.uploadedOn")}</th>
                    <th style={S.th}>{t("account.documents.table.headers.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} style={S.tr}>
                      <td style={S.td}>{doc.type?.toUpperCase()}</td>
                      <td style={S.tdFile}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          style={S.fileLink}
                        >
                          <FaFileAlt style={{ marginInlineEnd: 6 }} />
                          {doc.filename || t("account.documents.actions.viewFile")}
                        </a>
                      </td>
                      <td style={S.td}>
                        {new Date(doc.createdAt).toLocaleDateString(i18n.language || "en", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={S.tdAction}>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          style={S.deleteBtn}
                          title={t("account.documents.actions.delete")}
                          aria-label={t("account.documents.actions.delete")}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// === Styles ===
const S = {
  pageWrapper: {
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: baseFont,
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
    boxShadow: "0 6px 18px rgba(208, 101, 73, 0.6)",
  },
  pageTitle: { fontSize: 28, fontWeight: 700 },
  formCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 25,
    marginBottom: 30,
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
  },
  formRow: { display: "flex", flexDirection: "column", marginBottom: 15 },
  label: { fontWeight: 700, marginBottom: 6, color: "#00477f" },
  select: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid #d06549",
    color: "#00477f",
    fontFamily: baseFont,
    fontSize: 15,
  },
  fileInput: {
    padding: "10px",
    borderRadius: 8,
    border: "1.5px solid #d06549",
    color: "#00477f",
    fontSize: 15,
  },
  uploadBtn: {
    backgroundColor: "#d06549",
    color: "#fff",
    padding: "12px 40px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  tableCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 25,
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
  },
  subTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { backgroundColor: "#00477f", color: "#fff" },
  th: { textAlign: "left", padding: "10px 12px", fontWeight: 700 },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "10px 12px", color: "#00477f" },
  tdFile: { padding: "10px 12px" },
  tdAction: { textAlign: "center" },
  fileLink: {
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#d06549",
    fontWeight: 600,
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
  success: {
    color: "#fff",
    backgroundColor: "green",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: 600,
  },
};
