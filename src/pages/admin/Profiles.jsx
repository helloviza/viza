// helloviza/client/src/pages/admin/Profiles.jsx
import React, { useEffect, useMemo, useState } from "react";
import { api, API, API_BASE } from "../../utils/api";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

function fmt(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return "—";
  }
}

function bestRole(r) {
  const single = String(r?.role || "").trim();
  if (single) return single;
  if (Array.isArray(r?.roles) && r.roles.length) return r.roles.join(", ");
  return "—";
}

/* ---------- UI helpers (premium admin look) ---------- */
const shell = {
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
  padding: "18px 18px 34px",
  fontFamily: baseFont,
};

const hero = {
  borderRadius: 22,
  padding: "18px 18px",
  border: "1px solid rgba(255,255,255,.10)",
  background:
    "linear-gradient(135deg, rgba(11,42,74,.92) 0%, rgba(0,35,72,.88) 55%, rgba(11,42,74,.92) 100%)",
  boxShadow: "0 22px 70px rgba(0,0,0,.28)",
  color: "rgba(234,242,255,.92)",
};

const card = {
  marginTop: 14,
  borderRadius: 18,
  border: "1px solid rgba(2,9,23,.10)",
  background: "rgba(255,255,255,.92)",
  boxShadow: "0 18px 60px rgba(2,9,23,.10)",
  overflow: "hidden",
};

const input = {
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid rgba(2,9,23,.14)",
  outline: "none",
  minWidth: 260,
  fontFamily: baseFont,
  fontSize: 16,
  background: "#fff",
};

const btn = (variant = "primary") => ({
  padding: "11px 14px",
  borderRadius: 12,
  border: "1px solid rgba(2,9,23,.12)",
  cursor: "pointer",
  fontFamily: baseFont,
  fontSize: 16,
  fontWeight: 900,
  background: variant === "primary" ? "#0b2a4a" : "rgba(255,255,255,.9)",
  color: variant === "primary" ? "#ffffff" : "#0b2a4a",
  boxShadow: variant === "primary" ? "0 14px 34px rgba(11,42,74,.22)" : "none",
});

const chip = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(255,255,255,.06)",
  color: "rgba(234,242,255,.85)",
  fontWeight: 900,
  fontSize: 14,
};

const th = {
  textAlign: "left",
  padding: "12px 12px",
  borderBottom: "1px solid rgba(2,9,23,.08)",
  color: "rgba(2,9,23,.70)",
  fontWeight: 900,
  background: "#f8fafc",
  fontSize: 15,
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px 12px",
  borderBottom: "1px solid rgba(2,9,23,.06)",
  color: "#0f172a",
  fontSize: 16,
  verticalAlign: "top",
};

export default function Profiles() {
  const backendHint = useMemo(
    () => (import.meta?.env?.VITE_BACKEND ? String(import.meta.env.VITE_BACKEND) : ""),
    []
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const fetchRows = async (queryStr = "") => {
    setError("");
    setLoading(true);
    try {
      const qq = queryStr ? `?q=${encodeURIComponent(queryStr)}` : "";
      const j = await api.get(`${API.ADMIN_PROFILES}${qq}`);
      setRows(Array.isArray(j?.rows) ? j.rows : []);
    } catch (e) {
      setError(e?.message || "Failed to load profiles");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchRows(q.trim());
  };

  const exportCsv = `${API_BASE}/api/admin/profiles/export.csv`;
  const exportXlsx = `${API_BASE}/api/admin/profiles/export.xlsx`;

  return (
    <div style={{ width: "100%", paddingTop: 18, background: "transparent" }}>
      <div style={shell}>
        {/* Hero */}
        <div style={hero}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 0.4, lineHeight: 1.05 }}>
                Profiles
              </div>
              <div style={{ marginTop: 6, color: "rgba(234,242,255,.78)", fontSize: 16 }}>
                Search users and review access roles.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {backendHint ? <div style={chip}>Backend: {backendHint}</div> : null}

              <a href={exportCsv} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button type="button" style={btn("ghost")}>
                  Export CSV
                </button>
              </a>

              <a href={exportXlsx} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button type="button" style={btn("ghost")}>
                  Export XLSX
                </button>
              </a>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={onSearch}
            style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name/email..."
              style={input}
            />
            <button type="submit" style={btn("primary")}>
              Search
            </button>
            <button
              type="button"
              style={btn("ghost")}
              onClick={() => {
                setQ("");
                fetchRows("");
              }}
            >
              Clear
            </button>
            <button type="button" style={btn("ghost")} onClick={() => fetchRows(q.trim())}>
              Refresh
            </button>
          </form>

          {error ? (
            <div
              style={{
                marginTop: 12,
                border: "1px solid rgba(255,170,150,.40)",
                background: "rgba(255,170,150,.10)",
                color: "rgba(255,235,230,.95)",
                padding: "10px 12px",
                borderRadius: 14,
                fontWeight: 900,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        {/* Table */}
        <div style={card}>
          <div
            style={{
              padding: 14,
              borderBottom: "1px solid rgba(2,9,23,.08)",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ color: "rgba(2,9,23,.70)", fontWeight: 900 }}>
              {loading ? "Loading…" : `${rows.length} profiles`}
            </div>
            <div style={{ color: "rgba(2,9,23,.55)", fontWeight: 800, fontSize: 14 }}>
              Tip: Admin roles are <b>super-admin</b>, <b>admin</b>, <b>content-editor</b>.
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 16, color: "rgba(2,9,23,.70)", fontWeight: 900 }}>Loading…</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Email</th>
                    <th style={th}>Role</th>
                    <th style={th}>Active</th>
                    <th style={th}>Created</th>
                    <th style={th}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? (
                    rows.map((r) => (
                      <tr key={r.id || r._id}>
                        <td style={{ ...td, fontWeight: 900, color: "#0b2a4a" }}>{r.name || "—"}</td>
                        <td style={td}>{r.email || "—"}</td>
                        <td style={td}>{bestRole(r)}</td>
                        <td style={td}>{r.isActive === false ? "No" : "Yes"}</td>
                        <td style={td}>{fmt(r.createdAt)}</td>
                        <td style={td}>{fmt(r.updatedAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={td} colSpan={6}>
                        <span style={{ color: "rgba(2,9,23,.60)", fontWeight: 900 }}>
                          No profiles found.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: 14, color: "rgba(2,9,23,.55)", fontWeight: 800 }}>
          ✅ This page must NOT wrap <b>AdminLoginGate</b>. Only <b>/admin</b> route mounts it.
        </div>
      </div>
    </div>
  );
}
