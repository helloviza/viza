// helloviza/client/src/pages/admin/Offers.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { api, API } from "../../utils/api";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

/* ---------- UI helpers (AI-premium look) ---------- */
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

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid rgba(2,9,23,.14)",
  outline: "none",
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

const pill = (active) => ({
  padding: "9px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.16)",
  background: active ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)",
  color: active ? "rgba(255,255,255,.96)" : "rgba(234,242,255,.80)",
  fontWeight: 900,
  fontSize: 14,
  cursor: "pointer",
  userSelect: "none",
});

const btnLink = {
  background: "none",
  border: "none",
  color: "#0b2a4a",
  fontWeight: 900,
  cursor: "pointer",
  padding: 0,
  fontFamily: baseFont,
  fontSize: 16,
};

const btnDanger = {
  background: "none",
  border: "none",
  color: "#d06549",
  fontWeight: 900,
  cursor: "pointer",
  fontFamily: baseFont,
  fontSize: 16,
};

const th = {
  textAlign: "left",
  padding: "12px 12px",
  borderBottom: "1px solid rgba(2,9,23,.08)",
  color: "rgba(2,9,23,.70)",
  fontWeight: 900,
  whiteSpace: "nowrap",
  background: "#f8fafc",
  fontSize: 15,
};

const td = {
  padding: "12px 12px",
  borderBottom: "1px solid rgba(2,9,23,.06)",
  color: "#0f172a",
  verticalAlign: "top",
  fontSize: 16,
};

const sectionCard = {
  marginTop: 12,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(255,255,255,.06)",
  padding: 12,
};

const sectionTitle = {
  fontWeight: 900,
  fontSize: 18,
  color: "rgba(234,242,255,.92)",
  letterSpacing: 0.2,
};

const tiny = {
  marginTop: 6,
  color: "rgba(234,242,255,.70)",
  fontWeight: 800,
  fontSize: 14,
};

/* ---------- date helpers ---------- */
function fmt(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return "—";
  }
}
function toLocalInputValue(dateOrStr) {
  if (!dateOrStr) return "";
  const d = new Date(dateOrStr);
  if (!Number.isFinite(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function safeStr(v) {
  return String(v ?? "").trim();
}

function isImageFile(file) {
  return !!file && typeof file.type === "string" && file.type.startsWith("image/");
}

function resolveMaybeRelativeUrl(u) {
  const s = safeStr(u);
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("/")) return s;
  return s;
}

async function readJsonOrText(res) {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const t = await res.text();
    return { _text: t };
  } catch {
    return null;
  }
}

function splitList(v) {
  // comma/newline separated -> clean strings
  const raw = safeStr(v);
  if (!raw) return [];
  return raw
    .split(/[,|\n]/g)
    .map((s) => safeStr(s))
    .filter(Boolean);
}

function joinList(arr) {
  const a = Array.isArray(arr) ? arr : [];
  return a.map((x) => safeStr(x)).filter(Boolean).join(", ");
}

function toIntOrNull(v) {
  const s = safeStr(v);
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function toIsoOrNull(datetimeLocalStr) {
  const s = safeStr(datetimeLocalStr);
  if (!s) return null;
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return null;
  return d.toISOString();
}

function normKind(v) {
  const k = safeStr(v).toLowerCase();
  return k === "flash" ? "flash" : "scroller";
}

export default function Offers() {
  const backendHint = useMemo(() => {
    // works for Vite. For CRA typically empty (fine).
    try {
      return import.meta?.env?.VITE_BACKEND ? String(import.meta.env.VITE_BACKEND) : "";
    } catch {
      return "";
    }
  }, []);

  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [editingId, setEditingId] = useState("");

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    kind: "scroller",
    link: "",
    accent: "#d06549",
    imageUrl: "",
    useImage: false,

    // NEW
    priority: 0,
    placement: "global",

    // NEW: audience targeting
    audienceMode: "all", // all | include | exclude
    allowGuests: false,
    includeEmails: "",
    excludeEmails: "",
    includeUserIds: "",
    excludeUserIds: "",
    includeRoles: "",
    excludeRoles: "",

    // NEW: criteria targeting
    minBookings: "",
    maxBookings: "",
    lastBookingAtOrAfter: "",
    lastBookingAtOrBefore: "",
    lastActiveAtOrAfter: "",
    lastActiveAtOrBefore: "",
    frequentDestination: "",

    // old flags
    forceDisplay: false,
    isActive: true,
    startAt: "",
    endAt: "",

    // important behavior
    autoDeactivateOthers: true, // for SCROLLER only
  });

  const resetForm = () => {
    setEditingId("");
    setForm({
      title: "",
      message: "",
      kind: "scroller",
      link: "",
      accent: "#d06549",
      imageUrl: "",
      useImage: false,

      priority: 0,
      placement: "global",

      audienceMode: "all",
      allowGuests: false,
      includeEmails: "",
      excludeEmails: "",
      includeUserIds: "",
      excludeUserIds: "",
      includeRoles: "",
      excludeRoles: "",

      minBookings: "",
      maxBookings: "",
      lastBookingAtOrAfter: "",
      lastBookingAtOrBefore: "",
      lastActiveAtOrAfter: "",
      lastActiveAtOrBefore: "",
      frequentDestination: "",

      forceDisplay: false,
      isActive: true,
      startAt: "",
      endAt: "",
      autoDeactivateOthers: true,
    });
    try {
      if (fileRef.current) fileRef.current.value = "";
    } catch {}
  };

  const fetchRows = async () => {
    setError("");
    try {
      const j = await api.get(`${API.ADMIN_OFFERS}?includeInactive=true`);
      setRows(Array.isArray(j?.rows) ? j.rows : []);
    } catch (e) {
      setError(e?.message || "Failed to load offers");
      setRows([]);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadImage(file) {
    if (!file) return "";
    if (!isImageFile(file)) throw new Error("Please select an image file (PNG/JPG/WebP).");

    const fd = new FormData();
    fd.append("image", file);

    // ✅ Try multiple endpoints to avoid wrong-origin/proxy issues
    const base = safeStr(API.ADMIN_OFFERS) || "/api/admin/offers";
    const candidates = [
      `${base}/upload`, // normal (works with CRA proxy OR same-origin)
      `/api/admin/offers/upload`, // explicit relative
      backendHint ? `${backendHint.replace(/\/$/, "")}${base}/upload` : "",
      // common local backend when frontend is :3000 and backend is :8080
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? `http://${window.location.hostname}:8080${base}/upload`
        : "",
    ].filter(Boolean);

    let lastErr = "";

    for (const url of candidates) {
      try {
        const res = await fetch(url, {
          method: "POST",
          credentials: "include",
          body: fd,
        });

        const data = await readJsonOrText(res);

        if (!res.ok) {
          lastErr =
            (data && (data.error || data.message)) ||
            (data && data._text && data._text.slice(0, 140)) ||
            `Upload failed (${res.status})`;
          continue;
        }

        const out = data?.url || data?.imageUrl || data?.fileUrl || data?.path || "";
        const finalUrl = resolveMaybeRelativeUrl(out);
        if (!finalUrl) {
          lastErr = "Upload succeeded but server did not return url/imageUrl.";
          continue;
        }

        return finalUrl;
      } catch (e) {
        lastErr = e?.message || "Failed to fetch";
        continue;
      }
    }

    throw new Error(
      `Upload failed: ${lastErr || "connection aborted"}.\n\nFix checklist:\n1) Confirm backend route exists: POST /api/admin/offers/upload\n2) Backend started on :8080 and not crashing\n3) If CRA, ensure proxy is set OR use absolute backend URL\n4) Server must use multer (multipart) and /uploads is served`
    );
  }

  function buildAudiencePayload() {
    const mode = safeStr(form.audienceMode || "all").toLowerCase();
    const allowed = ["all", "include", "exclude"].includes(mode) ? mode : "all";

    const audience = {
      mode: allowed,
      allowGuests: !!form.allowGuests,
      includeEmails: splitList(form.includeEmails),
      excludeEmails: splitList(form.excludeEmails),
      includeUserIds: splitList(form.includeUserIds),
      excludeUserIds: splitList(form.excludeUserIds),
      includeRoles: splitList(form.includeRoles).map((s) => s.toLowerCase()),
      excludeRoles: splitList(form.excludeRoles).map((s) => s.toLowerCase()),
    };

    // keep it clean: if "all" and no lists, store empty object to avoid clutter
    const hasAny =
      audience.allowGuests ||
      audience.includeEmails.length ||
      audience.excludeEmails.length ||
      audience.includeUserIds.length ||
      audience.excludeUserIds.length ||
      audience.includeRoles.length ||
      audience.excludeRoles.length ||
      allowed !== "all";

    return hasAny ? audience : {};
  }

  function buildCriteriaPayload() {
    const c = {
      minBookings: toIntOrNull(form.minBookings),
      maxBookings: toIntOrNull(form.maxBookings),

      lastBookingAtOrAfter: toIsoOrNull(form.lastBookingAtOrAfter),
      lastBookingAtOrBefore: toIsoOrNull(form.lastBookingAtOrBefore),

      lastActiveAtOrAfter: toIsoOrNull(form.lastActiveAtOrAfter),
      lastActiveAtOrBefore: toIsoOrNull(form.lastActiveAtOrBefore),

      frequentDestination: safeStr(form.frequentDestination || ""),
    };

    const hasAny =
      c.minBookings !== null ||
      c.maxBookings !== null ||
      !!c.lastBookingAtOrAfter ||
      !!c.lastBookingAtOrBefore ||
      !!c.lastActiveAtOrAfter ||
      !!c.lastActiveAtOrBefore ||
      !!c.frequentDestination;

    return hasAny ? c : {};
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const kind = normKind(form.kind);

    const payload = {
      title: safeStr(form.title),
      message: safeStr(form.message),
      kind,
      link: safeStr(form.link),
      accent: safeStr(form.accent) || "#d06549",

      // ✅ image is optional now
      imageUrl: form.useImage ? resolveMaybeRelativeUrl(form.imageUrl) : "",

      // NEW
      priority: Number.isFinite(Number(form.priority)) ? Number(form.priority) : 0,
      placement: safeStr(form.placement || "global") || "global",
      audience: buildAudiencePayload(),
      criteria: buildCriteriaPayload(),

      forceDisplay: !!form.forceDisplay,
      isActive: !!form.isActive,
      startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
    };

    if (!payload.title) return setError("title is required");
    if (!payload.message) return setError("message is required");
    if (!["scroller", "flash"].includes(payload.kind)) return setError("kind must be scroller or flash");

    try {
      if (editingId) await api.put(`${API.ADMIN_OFFERS}/${editingId}`, payload);
      else await api.post(API.ADMIN_OFFERS, payload);

      // ✅ Only prevent "dual banner" for SCROLLER.
      if (form.autoDeactivateOthers && payload.isActive && payload.kind === "scroller") {
        // reload fresh list then deactivate other active scrollers
        const j = await api.get(`${API.ADMIN_OFFERS}?includeInactive=true`);
        const fresh = Array.isArray(j?.rows) ? j.rows : [];
        setRows(fresh);

        // Determine the "keep" offer id:
        // - if editing, keep editingId
        // - else keep the most recently updated matching title/message/kind
        let keepId = editingId ? String(editingId) : "";
        if (!keepId) {
          const match = [...fresh]
            .filter((r) => r && normKind(r.kind) === "scroller")
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt || 0).getTime() -
                new Date(a.updatedAt || a.createdAt || 0).getTime()
            )
            .find(
              (r) =>
                safeStr(r.title) === payload.title &&
                safeStr(r.message) === payload.message &&
                normKind(r.kind) === payload.kind
            );
          keepId = match?._id ? String(match._id) : "";
        }

        if (keepId) {
          const others = fresh.filter(
            (r) => r && r._id && String(r._id) !== keepId && r.isActive && normKind(r.kind) === "scroller"
          );

          for (const r of others) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await api.put(`${API.ADMIN_OFFERS}/${r._id}`, { isActive: false });
            } catch {}
          }
        }
      }

      await fetchRows();
      resetForm();
    } catch (e2) {
      setError(e2?.message || (editingId ? "Update failed" : "Create failed"));
    }
  };

  const startEdit = (row) => {
    setError("");
    setEditingId(String(row?._id || ""));

    const img = row?.imageUrl || "";
    const aud = row?.audience || {};
    const cri = row?.criteria || {};

    setForm((f) => ({
      ...f,
      title: row?.title || "",
      message: row?.message || "",
      kind: row?.kind || "scroller",
      link: row?.link || "",
      accent: row?.accent || "#d06549",
      imageUrl: img,
      useImage: !!img,
      forceDisplay: !!row?.forceDisplay,
      isActive: row?.isActive !== false,
      startAt: toLocalInputValue(row?.startAt),
      endAt: toLocalInputValue(row?.endAt),

      // NEW
      priority: Number.isFinite(Number(row?.priority)) ? Number(row.priority) : 0,
      placement: safeStr(row?.placement || "global") || "global",

      audienceMode: safeStr(aud?.mode || "all") || "all",
      allowGuests: !!aud?.allowGuests,
      includeEmails: joinList(aud?.includeEmails),
      excludeEmails: joinList(aud?.excludeEmails),
      includeUserIds: joinList(aud?.includeUserIds),
      excludeUserIds: joinList(aud?.excludeUserIds),
      includeRoles: joinList(aud?.includeRoles),
      excludeRoles: joinList(aud?.excludeRoles),

      minBookings:
        cri?.minBookings === null || cri?.minBookings === undefined ? "" : String(cri.minBookings),
      maxBookings:
        cri?.maxBookings === null || cri?.maxBookings === undefined ? "" : String(cri.maxBookings),
      lastBookingAtOrAfter: toLocalInputValue(cri?.lastBookingAtOrAfter),
      lastBookingAtOrBefore: toLocalInputValue(cri?.lastBookingAtOrBefore),
      lastActiveAtOrAfter: toLocalInputValue(cri?.lastActiveAtOrAfter),
      lastActiveAtOrBefore: toLocalInputValue(cri?.lastActiveAtOrBefore),
      frequentDestination: safeStr(cri?.frequentDestination || ""),

      autoDeactivateOthers: f.autoDeactivateOthers ?? true,
    }));

    try {
      if (fileRef.current) fileRef.current.value = "";
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this offer? (soft delete by default)")) return;
    setError("");
    setBusyId(String(id));
    try {
      await api.delete(`${API.ADMIN_OFFERS}/${id}`);
      await fetchRows();
    } catch (e) {
      setError(e?.message || "Delete failed");
    } finally {
      setBusyId("");
    }
  };

  const toggle = async (row, field) => {
    if (!row?._id) return;
    setError("");
    setBusyId(String(row._id));
    try {
      await api.put(`${API.ADMIN_OFFERS}/${row._id}`, { [field]: !row[field] });
      await fetchRows();
    } catch (e) {
      setError(e?.message || "Update failed");
    } finally {
      setBusyId("");
    }
  };

  const onPickFile = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setError("");

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url, useImage: true }));
    } catch (err) {
      setError(err?.message || "Image upload failed");
      try {
        if (fileRef.current) fileRef.current.value = "";
      } catch {}
    } finally {
      setUploading(false);
    }
  };

  const imagePreview = useMemo(
    () => (form.useImage ? resolveMaybeRelativeUrl(form.imageUrl) : ""),
    [form.imageUrl, form.useImage]
  );

  const activeCount = useMemo(
    () => (Array.isArray(rows) ? rows.filter((r) => r && r.isActive).length : 0),
    [rows]
  );

  return (
    <div style={{ width: "100%", paddingTop: 18 }}>
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
                Offers / Announcement
              </div>
              <div style={{ marginTop: 6, color: "rgba(234,242,255,.78)", fontSize: 16 }}>
                Control AnnouncementBar (scroller/flash) with scheduling + targeting.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {backendHint ? <div style={chip}>Backend: {backendHint}</div> : null}
              <div style={chip}>Active: {activeCount}</div>
            </div>
          </div>

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
                whiteSpace: "pre-wrap",
              }}
            >
              {error}
            </div>
          ) : null}

          {/* Form */}
          <div style={{ marginTop: 14 }}>
            <form
              onSubmit={submit}
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                alignItems: "end",
              }}
            >
              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Title</div>
                <input
                  style={inputStyle}
                  placeholder="e.g., Limited-Time Visa Offer"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Message</div>
                <input
                  style={inputStyle}
                  placeholder="Text shown in scroller/flash banner"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Kind</div>
                <select
                  style={inputStyle}
                  value={form.kind}
                  onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
                >
                  <option value="scroller">scroller</option>
                  <option value="flash">flash</option>
                </select>
              </div>

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Priority</div>
                <input
                  style={inputStyle}
                  type="number"
                  step="1"
                  placeholder="0"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                />
              </div>

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Placement</div>
                <input
                  style={inputStyle}
                  placeholder="global (or home, visa, etc.)"
                  value={form.placement}
                  onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value }))}
                />
              </div>

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Link (optional)</div>
                <input
                  style={inputStyle}
                  placeholder="https://..."
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                />
              </div>

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Accent (optional)</div>
                <input
                  style={inputStyle}
                  placeholder="#d06549"
                  value={form.accent}
                  onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
                />
              </div>

              {/* With image / without image switch */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 900,
                  color: "rgba(234,242,255,.85)",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!form.useImage}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      useImage: e.target.checked,
                      imageUrl: e.target.checked ? f.imageUrl : "",
                    }))
                  }
                />
                Use image (optional)
              </label>

              {/* Image uploader (optional) */}
              {form.useImage ? (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)" }}>Image URL / Upload</div>
                    {uploading ? (
                      <div style={{ color: "rgba(234,242,255,.80)", fontWeight: 900 }}>Uploading…</div>
                    ) : null}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginTop: 6 }}>
                    <input
                      style={inputStyle}
                      value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="/uploads/offers/... or https://... (or upload below)"
                    />
                    <button
                      type="button"
                      style={btn("ghost")}
                      onClick={() => {
                        try {
                          if (fileRef.current) fileRef.current.click();
                        } catch {}
                      }}
                      disabled={uploading}
                    >
                      Upload Image
                    </button>
                  </div>

                  <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />

                  {imagePreview ? (
                    <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <div
                        style={{
                          width: 240,
                          height: 92,
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,.22)",
                          background: "rgba(255,255,255,.10)",
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Offer"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={(ev) => {
                            ev.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <div style={{ color: "rgba(234,242,255,.78)", fontWeight: 900 }}>
                        Preview
                        <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            style={btn("ghost")}
                            onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                            disabled={uploading}
                          >
                            Clear URL
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, color: "rgba(234,242,255,.65)", fontWeight: 900, fontSize: 14 }}>
                      No image selected (optional).
                    </div>
                  )}
                </div>
              ) : null}

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>Start At (optional)</div>
                <input
                  style={inputStyle}
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                />
              </div>

              <div>
                <div style={{ fontWeight: 900, color: "rgba(234,242,255,.85)", marginBottom: 6 }}>End At (optional)</div>
                <input
                  style={inputStyle}
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                />
              </div>

              <label
                style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, color: "rgba(234,242,255,.85)" }}
              >
                <input
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active
              </label>

              <label
                style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, color: "rgba(234,242,255,.85)" }}
              >
                <input
                  type="checkbox"
                  checked={!!form.forceDisplay}
                  onChange={(e) => setForm((f) => ({ ...f, forceDisplay: e.target.checked }))}
                />
                Force Display
              </label>

              <label
                style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, color: "rgba(234,242,255,.85)" }}
              >
                <input
                  type="checkbox"
                  checked={!!form.autoDeactivateOthers}
                  onChange={(e) => setForm((f) => ({ ...f, autoDeactivateOthers: e.target.checked }))}
                />
                Auto-deactivate other Active <b>scroller</b> offers
              </label>

              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div style={pill(showAdvanced)} onClick={() => setShowAdvanced((v) => !v)}>
                  Targeting (Audience)
                </div>
                <div style={pill(showCriteria)} onClick={() => setShowCriteria((v) => !v)}>
                  Targeting (Criteria)
                </div>
                <div style={{ color: "rgba(234,242,255,.70)", fontWeight: 900 }}>
                  Optional targeting for future personalization.
                </div>
              </div>

              {/* Audience targeting */}
              {showAdvanced ? (
                <div style={{ gridColumn: "1 / -1", ...sectionCard }}>
                  <div style={sectionTitle}>Audience Targeting</div>
                  <div style={tiny}>
                    Mode:
                    <b> all</b> = everyone (except excluded), <b>include</b> = only included users/roles/emails,{" "}
                    <b>exclude</b> = everyone except excluded.
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gap: 10,
                      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                      alignItems: "end",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Mode
                      </div>
                      <select
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.audienceMode}
                        onChange={(e) => setForm((f) => ({ ...f, audienceMode: e.target.value }))}
                      >
                        <option value="all">all</option>
                        <option value="include">include</option>
                        <option value="exclude">exclude</option>
                      </select>
                    </div>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 900,
                        color: "rgba(234,242,255,.85)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!form.allowGuests}
                        onChange={(e) => setForm((f) => ({ ...f, allowGuests: e.target.checked }))}
                      />
                      allowGuests (only affects mode=include)
                    </label>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Include Emails (comma/newline separated)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.includeEmails}
                        onChange={(e) => setForm((f) => ({ ...f, includeEmails: e.target.value }))}
                        placeholder="user1@..., user2@..."
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Exclude Emails (comma/newline separated)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.excludeEmails}
                        onChange={(e) => setForm((f) => ({ ...f, excludeEmails: e.target.value }))}
                        placeholder="someone@..."
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Include UserIds (comma/newline separated)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.includeUserIds}
                        onChange={(e) => setForm((f) => ({ ...f, includeUserIds: e.target.value }))}
                        placeholder="Mongo _id / auth id etc."
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Exclude UserIds (comma/newline separated)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.excludeUserIds}
                        onChange={(e) => setForm((f) => ({ ...f, excludeUserIds: e.target.value }))}
                        placeholder="Mongo _id / auth id etc."
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Include Roles (comma/newline separated)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.includeRoles}
                        onChange={(e) => setForm((f) => ({ ...f, includeRoles: e.target.value }))}
                        placeholder="premium, customer, business, etc."
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        Exclude Roles (comma/newline separated)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.excludeRoles}
                        onChange={(e) => setForm((f) => ({ ...f, excludeRoles: e.target.value }))}
                        placeholder="blocked, internal, etc."
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Criteria targeting */}
              {showCriteria ? (
                <div style={{ gridColumn: "1 / -1", ...sectionCard }}>
                  <div style={sectionTitle}>Criteria Targeting (future-ready)</div>
                  <div style={tiny}>
                    When booking is live, stats will decide eligibility. If stats are missing, system assumes
                    bookingCount=0 and dates=null.
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gap: 10,
                      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                      alignItems: "end",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        minBookings
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        type="number"
                        step="1"
                        value={form.minBookings}
                        onChange={(e) => setForm((f) => ({ ...f, minBookings: e.target.value }))}
                        placeholder="e.g., 1"
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        maxBookings
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        type="number"
                        step="1"
                        value={form.maxBookings}
                        onChange={(e) => setForm((f) => ({ ...f, maxBookings: e.target.value }))}
                        placeholder="e.g., 10"
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        lastBookingAt ≥
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        type="datetime-local"
                        value={form.lastBookingAtOrAfter}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastBookingAtOrAfter: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        lastBookingAt ≤
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        type="datetime-local"
                        value={form.lastBookingAtOrBefore}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastBookingAtOrBefore: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        lastActiveAt ≥
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        type="datetime-local"
                        value={form.lastActiveAtOrAfter}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastActiveAtOrAfter: e.target.value }))
                        }
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        lastActiveAt ≤
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        type="datetime-local"
                        value={form.lastActiveAtOrBefore}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastActiveAtOrBefore: e.target.value }))
                        }
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          fontWeight: 900,
                          color: "rgba(234,242,255,.85)",
                          marginBottom: 6,
                        }}
                      >
                        frequentDestination (future)
                      </div>
                      <input
                        style={{ ...inputStyle, background: "rgba(255,255,255,.92)" }}
                        value={form.frequentDestination}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, frequentDestination: e.target.value }))
                        }
                        placeholder="e.g., dubai"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" style={btn("primary")} disabled={uploading}>
                  {editingId ? "Save" : "Create"}
                </button>
                {editingId ? (
                  <button type="button" style={btn("ghost")} onClick={resetForm} disabled={uploading}>
                    Cancel
                  </button>
                ) : null}
                <button type="button" style={btn("ghost")} onClick={fetchRows} disabled={uploading}>
                  Refresh
                </button>
              </div>
            </form>
          </div>
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
            <div style={{ color: "rgba(2,9,23,.70)", fontWeight: 900 }}>{rows.length} offers</div>
            <div style={{ color: "rgba(2,9,23,.55)", fontWeight: 800, fontSize: 14 }}>
              Toggle <b>Active</b> to show/hide; <b>Force</b> overrides schedule. Image is optional. Priority &amp;
              targeting supported.
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Kind</th>
                  <th style={th}>Priority</th>
                  <th style={th}>Placement</th>
                  <th style={th}>Active</th>
                  <th style={th}>Force</th>
                  <th style={th}>Image</th>
                  <th style={th}>Targeting</th>
                  <th style={th}>Window</th>
                  <th style={th}>Updated</th>
                  <th style={th}></th>
                </tr>
              </thead>

              <tbody>
                {rows.length ? (
                  rows.map((r) => {
                    const img = resolveMaybeRelativeUrl(r?.imageUrl);
                    const aud = r?.audience || {};
                    const c = r?.criteria || {};

                    const am = safeStr(aud?.mode || "all");

                    const hasAud =
                      am !== "all" ||
                      !!aud.allowGuests ||
                      (Array.isArray(aud.includeEmails) && aud.includeEmails.length > 0) ||
                      (Array.isArray(aud.excludeEmails) && aud.excludeEmails.length > 0) ||
                      (Array.isArray(aud.includeRoles) && aud.includeRoles.length > 0) ||
                      (Array.isArray(aud.excludeRoles) && aud.excludeRoles.length > 0) ||
                      (Array.isArray(aud.includeUserIds) && aud.includeUserIds.length > 0) ||
                      (Array.isArray(aud.excludeUserIds) && aud.excludeUserIds.length > 0);

                    const hasCriteria =
                      (c.minBookings !== null && c.minBookings !== undefined) ||
                      (c.maxBookings !== null && c.maxBookings !== undefined) ||
                      !!c.lastBookingAtOrAfter ||
                      !!c.lastBookingAtOrBefore ||
                      !!c.lastActiveAtOrAfter ||
                      !!c.lastActiveAtOrBefore ||
                      !!c.frequentDestination;

                    return (
                      <tr key={r._id}>
                        <td style={td}>
                          <div style={{ fontWeight: 900, color: "#0b2a4a" }}>{r.title}</div>
                          <div style={{ color: "rgba(2,9,23,.72)", fontWeight: 700, marginTop: 4 }}>
                            {r.message}
                          </div>
                        </td>

                        <td style={td}>{r.kind}</td>

                        <td style={td}>{Number.isFinite(Number(r?.priority)) ? Number(r.priority) : 0}</td>

                        <td style={td}>{safeStr(r?.placement || "global") || "global"}</td>

                        <td style={td}>
                          <button
                            type="button"
                            disabled={busyId === String(r._id)}
                            onClick={() => toggle(r, "isActive")}
                            style={btnLink}
                          >
                            {r.isActive ? "Yes" : "No"}
                          </button>
                        </td>

                        <td style={td}>
                          <button
                            type="button"
                            disabled={busyId === String(r._id)}
                            onClick={() => toggle(r, "forceDisplay")}
                            style={btnLink}
                          >
                            {r.forceDisplay ? "Yes" : "No"}
                          </button>
                        </td>

                        <td style={td}>
                          {img ? (
                            <div
                              style={{
                                width: 120,
                                height: 48,
                                borderRadius: 12,
                                overflow: "hidden",
                                border: "1px solid rgba(2,9,23,.10)",
                                background: "#fff",
                              }}
                              title={img}
                            >
                              <img
                                src={img}
                                alt="offer"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                onError={(ev) => {
                                  ev.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          ) : (
                            <span style={{ color: "rgba(2,9,23,.45)", fontWeight: 900 }}>—</span>
                          )}
                        </td>

                        <td style={td}>
                          <div style={{ fontWeight: 900, color: "#0b2a4a" }}>
                            {hasAud || hasCriteria ? "Yes" : "No"}
                          </div>
                          <div
                            style={{
                              marginTop: 4,
                              color: "rgba(2,9,23,.62)",
                              fontWeight: 800,
                              fontSize: 14,
                            }}
                          >
                            {hasAud ? `audience:${am}` : "audience:—"}
                            <br />
                            {hasCriteria ? "criteria:✓" : "criteria:—"}
                          </div>
                        </td>

                        <td style={td}>
                          <div>
                            <div>
                              <b>Start:</b> {r.startAt ? fmt(r.startAt) : "—"}
                            </div>
                            <div>
                              <b>End:</b> {r.endAt ? fmt(r.endAt) : "—"}
                            </div>
                          </div>
                        </td>

                        <td style={td}>{fmt(r.updatedAt)}</td>

                        <td style={td}>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              justifyContent: "flex-end",
                              flexWrap: "wrap",
                            }}
                          >
                            <button type="button" style={btnLink} onClick={() => startEdit(r)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={busyId === String(r._id)}
                              onClick={() => remove(r._id)}
                              style={btnDanger}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td style={td} colSpan={11}>
                      <span style={{ color: "rgba(2,9,23,.55)", fontWeight: 900 }}>No offers yet.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 14, color: "rgba(2,9,23,.55)", fontWeight: 800 }}>
          ✅ This page must NOT wrap <b>AdminLoginGate</b>. Only <b>/admin</b> route mounts it.
        </div>
      </div>
    </div>
  );
}
