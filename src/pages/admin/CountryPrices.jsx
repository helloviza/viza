// helloviza/client/src/pages/admin/CountryPrices.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLoginGate from "./AdminLoginGate";
import { api, API } from "../../utils/api";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

const th = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #e5e7eb", color: "#334155", fontWeight: 900, whiteSpace: "nowrap" };
const td = { padding: "10px 12px", borderBottom: "1px solid #e5e7eb", color: "#0f172a", verticalAlign: "top" };

const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", outline: "none" };
const btnPrimary = { background: "#00477f", color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 900, cursor: "pointer" };
const btnGhost = { background: "transparent", color: "#00477f", border: "1px solid rgba(0,71,127,.25)", borderRadius: 10, padding: "10px 14px", fontWeight: 900, cursor: "pointer" };
const btnLink = { background: "none", border: "none", color: "#00477f", fontWeight: 900, cursor: "pointer", padding: 0 };
const btnDanger = { background: "none", border: "none", color: "#d06549", fontWeight: 900, cursor: "pointer" };

function fmt(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return "—";
  }
}

export default function CountryPrices() {
  const backendHint = useMemo(
    () => (import.meta?.env?.VITE_BACKEND ? String(import.meta.env.VITE_BACKEND) : ""),
    []
  );

  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [q, setQ] = useState("");
  const [includeInactive, setIncludeInactive] = useState(true);

  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({
    country: "",
    displayName: "",
    type: "e-visa",
    currency: "INR",
    fee: "",
    slash: "",
    isActive: true,
    notes: "",
  });

  const resetForm = () => {
    setEditingId("");
    setForm({
      country: "",
      displayName: "",
      type: "e-visa",
      currency: "INR",
      fee: "",
      slash: "",
      isActive: true,
      notes: "",
    });
  };

  const fetchRows = async () => {
    setError("");
    try {
      const qs = new URLSearchParams();
      qs.set("includeInactive", includeInactive ? "true" : "false");
      if (q.trim()) qs.set("q", q.trim());
      const j = await api.get(`${API.ADMIN_COUNTRY_PRICES}?${qs.toString()}`);
      setRows(j?.rows || []);
    } catch (e) {
      setError(e?.message || "Failed to load country prices");
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeInactive]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      country: String(form.country || "").trim().toLowerCase(),
      displayName: String(form.displayName || "").trim(),
      type: String(form.type || "e-visa").trim(),
      currency: String(form.currency || "INR").trim() || "INR",
      notes: String(form.notes || "").trim(),
      isActive: !!form.isActive,
    };

    const fee = Number(form.fee);
    if (!payload.country) return setError("country is required");
    if (!payload.displayName) return setError("displayName is required");
    if (!["e-visa", "sticker"].includes(payload.type)) return setError("type must be e-visa or sticker");
    if (!Number.isFinite(fee) || fee < 0) return setError("fee must be a non-negative number");
    payload.fee = fee;
    if (!Number.isFinite(slash) || slash < 0) return setError("Slash must be a non-negative number");
    payload.slash = slash;

    try {
      if (editingId) {
        await api.put(`${API.ADMIN_COUNTRY_PRICES}/${editingId}`, payload);
      } else {
        await api.post(API.ADMIN_COUNTRY_PRICES, payload);
      }
      resetForm();
      await fetchRows();
    } catch (e2) {
      setError(e2?.message || (editingId ? "Update failed" : "Create failed"));
    }
  };

  const startEdit = (row) => {
    setError("");
    setEditingId(String(row?._id || ""));
    setForm({
      country: row?.country || "",
      displayName: row?.displayName || "",
      type: row?.type || "e-visa",
      currency: row?.currency || "INR",
      fee: row?.fee ?? "",
      slash: row?.slash ?? "",
      isActive: row?.isActive !== false,
      notes: row?.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this row? (soft delete: isActive=false)")) return;
    setError("");
    setBusyId(String(id));
    try {
      await api.delete(`${API.ADMIN_COUNTRY_PRICES}/${id}`);
      await fetchRows();
    } catch (e) {
      setError(e?.message || "Delete failed");
    } finally {
      setBusyId("");
    }
  };

  const toggleActive = async (row) => {
    if (!row?._id) return;
    setError("");
    setBusyId(String(row._id));
    try {
      await api.put(`${API.ADMIN_COUNTRY_PRICES}/${row._id}`, { isActive: !row.isActive });
      await fetchRows();
    } catch (e) {
      setError(e?.message || "Update failed");
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminLoginGate>
      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 16px", fontFamily: baseFont }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ color: "#00477f", fontSize: "1.85rem", fontWeight: 900, margin: 0 }}>
            Country Prices
          </h1>
          {backendHint ? (
            <div style={{ color: "#64748b", fontWeight: 800, fontSize: 13 }}>Backend: {backendHint}</div>
          ) : null}
        </div>

        <div style={{ height: 10 }} />

        {error ? (
          <div
            style={{
              border: "1px solid rgba(208,101,73,.35)",
              background: "rgba(208,101,73,.08)",
              color: "#7a2e1f",
              padding: "10px 12px",
              borderRadius: 12,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <input
            style={{ ...inputStyle, maxWidth: 320 }}
            placeholder="Search (country / displayName / notes)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="button" style={btnGhost} onClick={fetchRows}>
            Search
          </button>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, color: "#334155" }}>
            <input
              type="checkbox"
              checked={!!includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            Include inactive
          </label>
        </div>

        <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            marginBottom: 16,
            alignItems: "end",
          }}
        >
          <div>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Country (key)</div>
            <input
              style={inputStyle}
              placeholder='e.g., "uae" or "united arab emirates"'
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              required
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Display Name</div>
            <input
              style={inputStyle}
              placeholder="e.g., United Arab Emirates"
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              required
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Type</div>
            <select
              style={inputStyle}
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="e-visa">e-visa</option>
              <option value="sticker">sticker</option>
            </select>
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Currency</div>
            <input
              style={inputStyle}
              placeholder="INR"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Fee</div>
            <input
              style={inputStyle}
              type="number"
              min="0"
              placeholder="e.g., 2999"
              value={form.fee}
              onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
              required
            />
          </div>

          <div>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Fee</div>
            <input
              style={inputStyle}
              type="number"
              min="0"
              placeholder="e.g., 2999"
              value={form.slash}
              onChange={(e) => setForm((f) => ({ ...f, slash: e.target.value }))}
              required
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, color: "#334155" }}>
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active
          </label>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontWeight: 900, color: "#334155", marginBottom: 6 }}>Notes</div>
            <input
              style={inputStyle}
              placeholder="Optional notes for admin"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={btnPrimary}>
              {editingId ? "Save" : "Create"}
            </button>
            {editingId ? (
              <button type="button" style={btnGhost} onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 14 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={th}>Display Name</th>
                <th style={th}>Country</th>
                <th style={th}>Type</th>
                <th style={th}>Fee</th>
                <th style={th}>Slash</th>
                <th style={th}>Currency</th>
                <th style={th}>Active</th>
                <th style={th}>Updated</th>
                <th style={th}>Notes</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((r) => (
                  <tr key={r._id}>
                    <td style={td}><b>{r.displayName}</b></td>
                    <td style={td}>{r.country}</td>
                    <td style={td}>{r.type}</td>
                    <td style={td}>{r.fee}</td>
                    <td style={td}>{r.slash}</td>
                    <td style={td}>{r.currency || "INR"}</td>
                    <td style={td}>
                      <button disabled={busyId === String(r._id)} onClick={() => toggleActive(r)} style={btnLink}>
                        {r.isActive ? "Yes" : "No"}
                      </button>
                    </td>
                    <td style={td}>{fmt(r.updatedAt)}</td>
                    <td style={td}>
                      <span style={{ color: "#334155" }}>{r.notes || "—"}</span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button type="button" style={btnLink} onClick={() => startEdit(r)}>
                          Edit
                        </button>
                        <button disabled={busyId === String(r._id)} onClick={() => remove(r._id)} style={btnDanger}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={td} colSpan={9}>
                    <span style={{ color: "#64748b", fontWeight: 800 }}>No rows yet.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ height: 14 }} />
        <div style={{ color: "#64748b", fontWeight: 800, fontSize: 13 }}>
          Note: Public grid uses <b>/api/country-prices</b> and shows only <b>isActive=true</b>.
        </div>
      </div>
    </AdminLoginGate>
  );
}
