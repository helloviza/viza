// helloviza/client/src/pages/admin/AdminCountryPrices.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../../utils/api";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

function normalizeCountryKey(v) {
  return String(v || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/&/g, " and ");
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function badgeStyle(kind) {
  const k = String(kind || "").toLowerCase();
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 14,
    letterSpacing: 0.2,
    border: "1px solid rgba(2,9,23,.12)",
    background: "rgba(255,255,255,.65)",
    color: "#0b2a4a",
    whiteSpace: "nowrap",
  };
  if (k === "offline") return { ...base, border: "1px solid rgba(208,101,73,.35)", color: "#7a2e1f" };
  if (k === "external") return { ...base, border: "1px solid rgba(88,199,255,.35)", color: "#0b2a4a" };
  return base;
}

function cls(s) {
  return String(s || "").trim();
}

function normalizeInternalPath(p = "") {
  const s = String(p || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

function resolveImageUrl(rawUrl, apiBase) {
  const u0 = String(rawUrl || "").trim();
  if (!u0) return "";
  if (/^https?:\/\//i.test(u0)) return u0;

  const u = u0.startsWith("uploads/") ? `/${u0}` : u0;
  if (u.startsWith("/uploads/")) return `${String(apiBase || "").replace(/\/+$/, "")}${u}`;
  return u;
}

function notifyCountryPricesUpdated() {
  try {
    window.dispatchEvent(new Event("hv:country-prices-updated"));
  } catch {
    // ignore
  }
}

const BADGE_OPTIONS = ["", "E-Visa", "Sticker", "Stamp", "Fast", "Express", "CUSTOM"];
const TYPE_OPTIONS = ["e-visa", "sticker"];
const MODE_OPTIONS = ["go-visa", "offline", "external"];

export default function AdminCountryPrices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    displayName: "",
    country: "",
    type: "e-visa",
    currency: "INR",
    fee: "",

    imageUrl: "",
    applyMode: "go-visa",
    applyUrl: "",

    badgeText: "",
    badgePreset: "",

    notes: "",
    isActive: true,
    sortOrder: 1000,
  });

  const fileRef = useRef(null);
  const apiBase = useMemo(() => String(API_BASE || "").replace(/\/+$/, ""), []);

  async function fetchRows() {
    setLoading(true);
    setErr("");
    try {
      // add cache-bust (harmless, helps when proxy/browser caches weirdly)
      const url = `${apiBase}/api/admin/country-prices?includeInactive=${includeInactive ? "true" : "false"}&t=${Date.now()}`;
      const res = await fetch(url, { credentials: "include" });
      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.error || json?.message || `Failed to load (${res.status})`);

      const list = Array.isArray(json?.rows) ? json.rows : [];
      list.sort((a, b) => {
        const sa = Number(a.sortOrder ?? 1000);
        const sb = Number(b.sortOrder ?? 1000);
        if (sa !== sb) return sa - sb;
        return String(a.displayName || "").localeCompare(String(b.displayName || ""));
      });

      setRows(list);
    } catch (e) {
      setErr(e?.message || "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeInactive]);

  function resetForm() {
    setEditingId(null);
    setForm({
      displayName: "",
      country: "",
      type: "e-visa",
      currency: "INR",
      fee: "",
      imageUrl: "",
      applyMode: "go-visa",
      applyUrl: "",
      badgeText: "",
      badgePreset: "",
      notes: "",
      isActive: true,
      sortOrder: 1000,
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  function startEdit(r) {
    setErr("");
    setEditingId(r._id);

    const badgeText = String(r.badgeText || "").trim();
    const presetHit = BADGE_OPTIONS.includes(badgeText) ? badgeText : badgeText ? "CUSTOM" : "";

    setForm({
      displayName: r.displayName || "",
      country: r.country || "",
      type: r.type || "e-visa",
      currency: r.currency || "INR",
      fee: r.fee === null || r.fee === undefined ? "" : String(r.fee),
      imageUrl: r.imageUrl || "",
      applyMode: r.applyMode || "go-visa",
      applyUrl: r.applyUrl || "",
      badgeText: presetHit === "CUSTOM" ? badgeText : presetHit,
      badgePreset: presetHit,
      notes: r.notes || "",
      isActive: !!r.isActive,
      sortOrder: Number.isFinite(Number(r.sortOrder)) ? Number(r.sortOrder) : 1000,
    });

    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function effectiveBadgeText() {
    if (form.badgePreset === "CUSTOM") return cls(form.badgeText);
    return cls(form.badgePreset);
  }

  async function save(e) {
    e.preventDefault();
    setErr("");

    const payload = {
      displayName: cls(form.displayName),
      country: normalizeCountryKey(form.country),
      type: cls(form.type) || "e-visa",
      currency: cls(form.currency).toUpperCase() || "INR",
      fee: form.fee === "" ? null : Number(form.fee),
      notes: cls(form.notes),

      imageUrl: cls(form.imageUrl),
      applyMode: cls(form.applyMode) || "go-visa",
      applyUrl: cls(form.applyUrl),

      badgeText: effectiveBadgeText(),
      isActive: !!form.isActive,
      sortOrder: Number(form.sortOrder),
    };

    if (!payload.displayName) return setErr("Display Name is required");
    if (!payload.country) return setErr("Country Key is required");
    if (!TYPE_OPTIONS.includes(payload.type)) return setErr('Type must be "e-visa" or "sticker"');
    if (!Number.isFinite(payload.sortOrder)) payload.sortOrder = 1000;

    if (payload.fee !== null && !Number.isFinite(payload.fee)) return setErr("Fee must be a number");

    if (payload.applyMode !== "go-visa" && !payload.applyUrl) {
      return setErr("Apply URL is required for Offline/External mode");
    }

    if (payload.applyMode !== "go-visa" && payload.applyUrl && !/^https?:\/\//i.test(payload.applyUrl)) {
      payload.applyUrl = normalizeInternalPath(payload.applyUrl);
    }

    try {
      const url = editingId
        ? `${apiBase}/api/admin/country-prices/${editingId}`
        : `${apiBase}/api/admin/country-prices`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.error || json?.message || `Save failed (${res.status})`);

      await fetchRows();
      resetForm();

      // ✅ Notify homepage grid listeners (VisaCountryGrid)
      notifyCountryPricesUpdated();
    } catch (e2) {
      setErr(e2?.message || "Save failed");
    }
  }

  async function toggleActive(r) {
    setErr("");
    try {
      const res = await fetch(`${apiBase}/api/admin/country-prices/${r._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !r.isActive }),
      });
      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.error || json?.message || `Update failed (${res.status})`);
      await fetchRows();

      // ✅ Notify homepage grid listeners
      notifyCountryPricesUpdated();
    } catch (e) {
      setErr(e?.message || "Update failed");
    }
  }

  async function remove(r) {
    const ok = window.confirm(`Disable "${r.displayName}"? This hides it from homepage.`);
    if (!ok) return;

    setErr("");
    try {
      const res = await fetch(`${apiBase}/api/admin/country-prices/${r._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.error || json?.message || `Delete failed (${res.status})`);
      await fetchRows();

      // ✅ Notify homepage grid listeners
      notifyCountryPricesUpdated();
    } catch (e) {
      setErr(e?.message || "Delete failed");
    }
  }

  async function uploadImageForEditingId(file) {
    if (!editingId) {
      setErr("Save this row first, then upload an image (so it can attach).");
      return;
    }
    if (!file) return;

    setErr("");
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(`${apiBase}/api/admin/country-prices/${editingId}`, {
        method: "PUT",
        credentials: "include",
        body: fd,
      });

      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.error || json?.message || `Upload failed (${res.status})`);

      await fetchRows();
      const newUrl = json?.row?.imageUrl || "";
      if (newUrl) setForm((f) => ({ ...f, imageUrl: newUrl }));
      if (fileRef.current) fileRef.current.value = "";

      // ✅ Notify homepage grid listeners
      notifyCountryPricesUpdated();
    } catch (e) {
      setErr(e?.message || "Upload failed");
    }
  }

  const filtered = useMemo(() => {
    const needle = cls(q).toLowerCase();
    if (!needle) return rows;
    return (rows || []).filter((r) => {
      const a = String(r.displayName || "").toLowerCase();
      const b = String(r.country || "").toLowerCase();
      const c = String(r.applyMode || "").toLowerCase();
      const d = String(r.badgeText || "").toLowerCase();
      const e = String(r.type || "").toLowerCase();
      return a.includes(needle) || b.includes(needle) || c.includes(needle) || d.includes(needle) || e.includes(needle);
    });
  }, [rows, q]);

  const ui = {
    card: {
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,.10)",
      background: "rgba(255,255,255,.06)",
      boxShadow: "0 18px 60px rgba(0,0,0,.18)",
      backdropFilter: "blur(10px)",
      padding: 14,
      marginTop: 12,
    },
    label: { fontSize: 14, color: "rgba(234,242,255,.78)", fontWeight: 800, marginBottom: 6 },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.14)",
      outline: "none",
      fontFamily: baseFont,
      fontSize: 16,
      background: "rgba(8,18,30,.55)",
      color: "#eaf2ff",
    },
    btn: (variant = "ghost") => ({
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,.16)",
      cursor: "pointer",
      fontFamily: baseFont,
      fontSize: 16,
      fontWeight: 800,
      letterSpacing: 0.2,
      background: variant === "primary" ? "linear-gradient(135deg, #d06549 0%, #ffb199 100%)" : "rgba(255,255,255,.06)",
      color: variant === "primary" ? "#061425" : "#eaf2ff",
      whiteSpace: "nowrap",
    }),
    danger: {
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid rgba(208,101,73,.35)",
      cursor: "pointer",
      fontFamily: baseFont,
      fontSize: 16,
      fontWeight: 900,
      background: "rgba(208,101,73,.10)",
      color: "#ffb199",
      whiteSpace: "nowrap",
    },
    tiny: { fontSize: 13, color: "rgba(234,242,255,.68)", fontWeight: 700 },
  };

  const formPreviewImg = resolveImageUrl(form.imageUrl, apiBase);

  return (
    <div style={{ fontFamily: baseFont }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 0.3, color: "#eaf2ff" }}>
            Country Prices Manager
          </div>
          <div style={ui.tiny}>
            Homepage grid is DB-driven — only <b>Active</b> rows appear in <b>VisaCountryGrid</b>.
          </div>
          <div style={{ ...ui.tiny, marginTop: 6 }}>
            Backend: <b>{apiBase}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 900, color: "rgba(234,242,255,.78)" }}>
            <input type="checkbox" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} />
            Include Inactive
          </label>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / key / mode / badge…"
            style={{ ...ui.input, width: 300 }}
          />

          <button onClick={fetchRows} style={ui.btn("ghost")} type="button">
            Refresh
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={ui.card}>
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
          <div style={{ gridColumn: "span 4" }}>
            <div style={ui.label}>Display Name *</div>
            <input value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} style={ui.input} />
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <div style={ui.label}>Country Key (canonical) *</div>
            <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} style={ui.input} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div style={ui.label}>Type</div>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} style={ui.input}>
              {TYPE_OPTIONS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div style={ui.label}>Sort Order</div>
            <input value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} style={ui.input} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div style={ui.label}>Currency</div>
            <input value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} style={ui.input} placeholder="INR" />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div style={ui.label}>Fee (optional)</div>
            <input value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))} style={ui.input} placeholder="e.g. 3499" />
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <div style={ui.label}>Badge Text (optional)</div>
            <select
              value={form.badgePreset}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => ({ ...f, badgePreset: v, badgeText: v === "CUSTOM" ? f.badgeText : "" }));
              }}
              style={ui.input}
            >
              {BADGE_OPTIONS.map((opt) => (
                <option key={opt || "none"} value={opt}>
                  {opt === "" ? "— None —" : opt === "CUSTOM" ? "Custom…" : opt}
                </option>
              ))}
            </select>

            {form.badgePreset === "CUSTOM" ? (
              <input value={form.badgeText} onChange={(e) => setForm((f) => ({ ...f, badgeText: e.target.value }))} style={{ ...ui.input, marginTop: 8 }} placeholder="Type custom badge…" />
            ) : null}
          </div>

          <div style={{ gridColumn: "span 5" }}>
            <div style={ui.label}>Image URL</div>
            <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} style={ui.input} placeholder="/uploads/... OR https://..." />

            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImageForEditingId(file);
                }}
                style={{ ...ui.input, padding: "8px 10px", width: "min(360px, 100%)", cursor: "pointer" }}
                title={editingId ? "Upload image to /uploads/country-prices and attach" : "Save first"}
                disabled={!editingId}
              />
              <div style={ui.tiny}>{editingId ? <>Upload attaches to this row (<b>{editingId}</b>).</> : <>Save first to enable upload.</>}</div>
            </div>
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div style={ui.label}>Apply Mode</div>
            <select value={form.applyMode} onChange={(e) => setForm((f) => ({ ...f, applyMode: e.target.value }))} style={ui.input}>
              {MODE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <div style={ui.label}>Apply URL (required for Offline/External)</div>
            <input value={form.applyUrl} onChange={(e) => setForm((f) => ({ ...f, applyUrl: e.target.value }))} style={ui.input} placeholder="/visa/uae-offline OR https://partner.com" />
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div style={ui.label}>Notes (optional)</div>
            <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} style={ui.input} placeholder="Internal notes…" />
          </div>

          <div style={{ gridColumn: "span 12", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, color: "rgba(234,242,255,.78)" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              Active (show on homepage)
            </label>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 40, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.06)" }}>
                {formPreviewImg ? (
                  <img src={formPreviewImg} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(234,242,255,.75)", fontWeight: 900 }}>
                    {cls(form.displayName).slice(0, 2).toUpperCase() || "—"}
                  </div>
                )}
              </div>

              <div style={ui.tiny}>
                Fee: <b>{form.fee === "" ? "Apply to Check" : form.fee}</b> · Mode: <b>{cls(form.applyMode) || "go-visa"}</b>{" "}
                {cls(form.applyUrl) ? (
                  <>
                    → <code>{/^https?:\/\//i.test(form.applyUrl) ? form.applyUrl : normalizeInternalPath(form.applyUrl)}</code>
                  </>
                ) : null}
                {effectiveBadgeText() ? (
                  <>
                    {" "}
                    · Badge: <b>{effectiveBadgeText()}</b>
                  </>
                ) : null}
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <button style={ui.btn("primary")} type="submit">
              {editingId ? "Update" : "Create"}
            </button>

            {editingId ? (
              <button style={ui.btn("ghost")} type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          {err ? (
            <div style={{ gridColumn: "1 / -1", borderRadius: 14, padding: "10px 12px", border: "1px solid rgba(208,101,73,.35)", background: "rgba(208,101,73,.10)", color: "#ffb199", fontWeight: 900 }}>
              {err}
            </div>
          ) : null}
        </form>
      </div>

      {/* Table */}
      <div style={ui.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ color: "rgba(234,242,255,.78)", fontWeight: 900 }}>{loading ? "Loading…" : `${filtered.length} rows`}</div>
          <div style={ui.tiny}>
            Tip: <b>sortOrder</b> smaller shows earlier on homepage grid.
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                {["Card", "Name", "Type", "Fee", "Badge", "Key", "Mode", "URL", "Active", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 10px",
                      fontSize: 14,
                      color: "rgba(234,242,255,.78)",
                      borderBottom: "1px solid rgba(255,255,255,.10)",
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => {
                const img = resolveImageUrl(r.imageUrl, apiBase);
                const label = cls(r.displayName) || "—";
                const mode = String(r.applyMode || "go-visa");
                const feeLabel = r.fee === null || r.fee === undefined ? "Apply to Check" : `${r.currency || "INR"} ${r.fee}`;

                return (
                  <tr key={r._id} style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                    <td style={{ padding: 10 }}>
                      <div style={{ width: 56, height: 40, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.06)" }}>
                        {img ? (
                          <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(234,242,255,.75)", fontWeight: 900 }}>
                            {label.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: 10, color: "#eaf2ff", fontWeight: 900 }}>{label}</td>
                    <td style={{ padding: 10, color: "rgba(234,242,255,.78)", fontWeight: 800 }}>{r.type || "e-visa"}</td>
                    <td style={{ padding: 10, color: "#ffb199", fontWeight: 900 }}>{feeLabel}</td>

                    <td style={{ padding: 10, color: "rgba(234,242,255,.78)", fontWeight: 900 }}>
                      {r.badgeText ? <b>{String(r.badgeText)}</b> : <span style={{ opacity: 0.7 }}>—</span>}
                    </td>

                    <td style={{ padding: 10, color: "rgba(234,242,255,.78)", fontWeight: 800 }}>{r.country}</td>

                    <td style={{ padding: 10 }}>
                      <span style={badgeStyle(mode)}>{mode}</span>
                    </td>

                    <td style={{ padding: 10, color: "rgba(234,242,255,.78)", fontWeight: 800, maxWidth: 360 }}>
                      {r.applyUrl ? (
                        /^https?:\/\//i.test(String(r.applyUrl)) ? (
                          <a href={String(r.applyUrl)} target="_blank" rel="noreferrer" style={{ color: "#ffb199", fontWeight: 900, textDecoration: "none" }}>
                            {String(r.applyUrl)}
                          </a>
                        ) : (
                          <span style={{ color: "#ffb199", fontWeight: 900 }}>{normalizeInternalPath(String(r.applyUrl))}</span>
                        )
                      ) : (
                        <span style={{ opacity: 0.7 }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: 10 }}>
                      <button onClick={() => toggleActive(r)} style={ui.btn("ghost")} type="button">
                        {r.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button onClick={() => startEdit(r)} style={ui.btn("ghost")} type="button">
                        Edit
                      </button>
                      <button onClick={() => remove(r)} style={ui.danger} type="button">
                        Disable
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 14, color: "rgba(234,242,255,.72)", fontWeight: 800 }}>
                    No rows yet. Create your first country price.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
