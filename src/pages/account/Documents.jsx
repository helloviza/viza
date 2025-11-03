import React, { useState, useEffect } from "react";
import { FaFileUpload, FaFileAlt, FaTrashAlt } from "react-icons/fa";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Documents() {
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
        if (!res.ok) throw new Error(data.error || "Failed to load documents");
        setDocuments(data.items || []);
      } catch (err) {
        console.error("❌ Documents fetch error:", err);
        setError("Failed to load your uploaded documents");
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  // === Handle file upload ===
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setError("Please choose a file first.");
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
      setSuccess("✅ File uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // === Handle delete ===
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
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
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaFileUpload style={{ fontSize: 40, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>My Documents</h1>
              <p style={{ opacity: 0.8 }}>
                Upload and manage your travel / KYC documents
              </p>
            </div>
          </header>

          {error && <div style={S.error}>{error}</div>}
          {success && <div style={S.success}>{success}</div>}

          {/* === Upload Form === */}
          <form onSubmit={handleUpload} style={S.formCard}>
            <div style={S.formRow}>
              <label style={S.label}>Document Type</label>
              <select
                style={S.select}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="passport">Passport</option>
                <option value="pan">PAN Card</option>
                <option value="visa">Visa</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={S.formRow}>
              <label style={S.label}>Choose File</label>
              <input
                style={S.fileInput}
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            <button type="submit" style={S.uploadBtn} disabled={loading}>
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </form>

          {/* === Documents Table === */}
          <div style={S.tableCard}>
            <h2 style={S.subTitle}>Uploaded Files</h2>
            {documents.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                No documents uploaded yet.
              </p>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr style={S.thRow}>
                    <th style={S.th}>Type</th>
                    <th style={S.th}>File</th>
                    <th style={S.th}>Uploaded On</th>
                    <th style={S.th}>Actions</th>
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
                          <FaFileAlt style={{ marginRight: 6 }} />
                          {doc.filename || "View File"}
                        </a>
                      </td>
                      <td style={S.td}>
                        {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={S.tdAction}>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          style={S.deleteBtn}
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
