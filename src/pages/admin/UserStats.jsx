// src/pages/admin/UserStats.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

function toQS(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function money(n) {
  const x = Number(n || 0);
  if (!Number.isFinite(x)) return "0";
  // you can change currency later
  return x.toLocaleString();
}

function safeText(v) {
  return String(v ?? "").trim();
}

export default function AdminUserStats() {
  const navigate = useNavigate();
  const abortRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState(""); // recent-booker, unknown, etc.
  const [minBookingCount, setMinBookingCount] = useState(""); // "", "1", "2"
  const [includeUser, setIncludeUser] = useState(true);

  // sorting/paging
  const [sort, setSort] = useState("bookingCount");
  const [dir, setDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const params = useMemo(() => {
    return {
      page,
      limit,
      includeUser: includeUser ? 1 : 0,
      sort,
      dir,
      ...(safeText(q) ? { q: safeText(q) } : {}),
      ...(safeText(segment) ? { segment: safeText(segment) } : {}),
      ...(safeText(minBookingCount) ? { minBookingCount: safeText(minBookingCount) } : {}),
    };
  }, [page, limit, includeUser, sort, dir, q, segment, minBookingCount]);

  const endpoint = useMemo(() => {
    // Backend route mounted: /api/admin/user-stats
    return `/api/admin/user-stats${toQS(params)}`;
  }, [params]);

  async function load() {
    setErr("");
    setLoading(true);

    try {
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include", // IMPORTANT for cookie auth
        headers: { Accept: "application/json" },
        signal: ac.signal,
      });

      // If auth or RBAC blocks it, backend returns 401/403
      if (res.status === 401) {
        setErr("Please login again.");
        setLoading(false);
        navigate("/login", { replace: true, state: { from: { pathname: "/admin/user-stats" } } });
        return;
      }
      if (res.status === 403) {
        const j = await res.json().catch(() => null);
        setErr(j?.message || j?.error || "Forbidden");
        setLoading(false);
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(data?.error || `Request failed (${res.status})`);
        setLoading(false);
        return;
      }

      setRows(Array.isArray(data?.rows) ? data.rows : []);
      setTotal(Number(data?.total || 0));
      setLoading(false);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setErr(e?.message || "Failed to load user stats");
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  useEffect(() => {
    return () => {
      try {
        if (abortRef.current) abortRef.current.abort();
      } catch {}
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));

  // UI styles (kept inline like your project)
  const pageWrap = {
    padding: "18px 18px 26px",
    fontFamily: baseFont,
    background: "#f6f6f6",
    minHeight: "100dvh",
  };

  const topBar = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  };

  const title = {
    fontSize: 28,
    letterSpacing: 0.2,
    margin: 0,
    color: "#0b2a4a",
    lineHeight: 1.05,
  };

  const sub = {
    margin: "6px 0 0",
    color: "rgba(11,42,74,.78)",
    fontSize: 15,
    letterSpacing: 0.15,
  };

  const card = {
    background: "#fff",
    border: "1px solid rgba(2,9,23,.10)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(2,9,23,.06)",
    overflow: "hidden",
  };

  const filters = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 10,
    padding: 14,
    borderBottom: "1px solid rgba(2,9,23,.08)",
  };

  const field = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const label = {
    fontSize: 13,
    color: "rgba(11,42,74,.78)",
    letterSpacing: 0.2,
  };

  const input = {
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(2,9,23,.14)",
    padding: "0 12px",
    fontFamily: baseFont,
    fontSize: 16,
    outline: "none",
    background: "#fff",
  };

  const select = { ...input, paddingRight: 10 };

  const btn = {
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(2,9,23,.12)",
    background: "#0b2a4a",
    color: "#fff",
    fontFamily: baseFont,
    fontSize: 16,
    cursor: "pointer",
    padding: "0 14px",
    whiteSpace: "nowrap",
  };

  const btnGhost = {
    ...btn,
    background: "#fff",
    color: "#0b2a4a",
  };

  const statusPill = (kind) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(2,9,23,.12)",
    background: kind === "recent-booker" ? "rgba(208,101,73,.10)" : "rgba(11,42,74,.06)",
    color: "#0b2a4a",
    fontSize: 14,
    letterSpacing: 0.2,
    maxWidth: "100%",
  });

  const tableWrap = {
    width: "100%",
    overflowX: "auto",
  };

  const table = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: 980,
  };

  const th = {
    textAlign: "left",
    fontSize: 14,
    color: "rgba(11,42,74,.86)",
    padding: "12px 12px",
    borderBottom: "1px solid rgba(2,9,23,.10)",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 1,
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(2,9,23,.08)",
    fontSize: 15,
    color: "#0b2a4a",
    verticalAlign: "top",
  };

  const muted = { color: "rgba(11,42,74,.72)" };

  return (
    <div style={pageWrap}>
      <div style={topBar}>
        <div>
          <h1 style={title}>User Stats</h1>
          <p style={sub}>
            Source: <span style={muted}>/api/admin/user-stats</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={btnGhost} onClick={() => navigate("/admin")}>
            ← Back to Admin
          </button>
          <button type="button" style={btn} onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div style={card}>
        {/* Filters */}
        <div style={filters}>
          <div style={{ ...field, gridColumn: "span 4" }}>
            <div style={label}>Search (email / name)</div>
            <input
              style={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Type name/email..."
            />
          </div>

          <div style={{ ...field, gridColumn: "span 2" }}>
            <div style={label}>Segment</div>
            <select
              style={select}
              value={segment}
              onChange={(e) => {
                setSegment(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="recent-booker">recent-booker</option>
              <option value="unknown">unknown</option>
            </select>
          </div>

          <div style={{ ...field, gridColumn: "span 2" }}>
            <div style={label}>Min Bookings</div>
            <select
              style={select}
              value={minBookingCount}
              onChange={(e) => {
                setMinBookingCount(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div style={{ ...field, gridColumn: "span 2" }}>
            <div style={label}>Sort</div>
            <select style={select} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="bookingCount">bookingCount</option>
              <option value="totalSpend">totalSpend</option>
              <option value="lastBookingAt">lastBookingAt</option>
              <option value="computedAt">computedAt</option>
            </select>
          </div>

          <div style={{ ...field, gridColumn: "span 1" }}>
            <div style={label}>Dir</div>
            <select style={select} value={dir} onChange={(e) => setDir(e.target.value)}>
              <option value="desc">desc</option>
              <option value="asc">asc</option>
            </select>
          </div>

          <div style={{ ...field, gridColumn: "span 1" }}>
            <div style={label}>Limit</div>
            <select style={select} value={limit} onChange={(e) => setLimit(Number(e.target.value || 50))}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div style={{ ...field, gridColumn: "span 12", marginTop: 2 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={includeUser}
                onChange={(e) => setIncludeUser(e.target.checked)}
              />
              <span style={label}>Include user details (name/email/mobile)</span>
            </label>
          </div>
        </div>

        {/* Errors */}
        {err ? (
          <div style={{ padding: 14, borderBottom: "1px solid rgba(2,9,23,.08)", color: "#b42318" }}>
            {err}
          </div>
        ) : null}

        {/* Paging */}
        <div
          style={{
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(2,9,23,.08)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "rgba(11,42,74,.75)" }}>
            Total: <b style={{ color: "#0b2a4a" }}>{total}</b> • Page{" "}
            <b style={{ color: "#0b2a4a" }}>{page}</b> / {totalPages}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              style={btnGhost}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={loading || page <= 1}
            >
              Prev
            </button>
            <button
              type="button"
              style={btnGhost}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={loading || page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Bookings</th>
                <th style={th}>Total Spend</th>
                <th style={th}>Last Booking</th>
                <th style={th}>Segment</th>
                <th style={th}>Top Destinations</th>
                <th style={th}>Computed</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading ? (
                <tr>
                  <td style={td} colSpan={7}>
                    No rows found for current filters.
                  </td>
                </tr>
              ) : null}

              {rows.map((r) => {
                const u = r.user || {};
                const name = safeText(u.name) || "(no name)";
                const email = safeText(u.email);
                const mobile = safeText(u.mobile);

                const top = Array.isArray(r.topDestinations) ? r.topDestinations : [];
                const topText =
                  top.length > 0
                    ? top.map((t) => `${t.label || t.key || "?"} (${t.count || 0})`).join(", ")
                    : "";

                return (
                  <tr key={String(r._id || r.userId)}>
                    <td style={td}>
                      <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>{name}</div>
                      {email ? <div style={muted}>{email}</div> : null}
                      {mobile ? <div style={muted}>{mobile}</div> : null}
                      {!includeUser ? <div style={muted}>UserId: {String(r.userId || "")}</div> : null}
                    </td>

                    <td style={td}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{Number(r.bookingCount || 0)}</div>
                    </td>

                    <td style={td}>
                      <div style={{ fontWeight: 800 }}>{money(r.totalSpend || 0)}</div>
                    </td>

                    <td style={td}>
                      <div>{fmtDate(r.lastBookingAt)}</div>
                    </td>

                    <td style={td}>
                      <span style={statusPill(String(r.segment || "unknown"))}>
                        {String(r.segment || "unknown")}
                      </span>
                    </td>

                    <td style={td}>
                      <div style={muted}>{topText || "-"}</div>
                    </td>

                    <td style={td}>
                      <div style={muted}>{fmtDate(r.computedAt)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div style={{ padding: 12, color: "rgba(11,42,74,.72)", fontSize: 14 }}>
          Tip: Use <b>Min Bookings = 1+</b> to quickly find real bookers.
        </div>
      </div>
    </div>
  );
}
