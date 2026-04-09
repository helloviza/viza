// src/components/DiscoverDestinations.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, API_BASE } from "../utils/api";

/* ═══════════════════════════════════════════════════
   BACKEND HELPERS — ported 1-to-1 from VisaCountryGrid
═══════════════════════════════════════════════════ */

function readActive(row) {
  if (typeof row?.isActive === "boolean") return row.isActive;
  if (typeof row?.active  === "boolean") return row.active;
  return true;
}

/** fee can be null/blank — Number(null)=>0 is a bug, so return null for empty */
function readFee(row) {
  const v = row?.fee ?? row?.price;
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function readCurrency(row) {
  return String(row?.currency || "INR").trim().toUpperCase() || "INR";
}

function fmtPrice(currency = "INR", fee = 0) {
  if (!Number.isFinite(Number(fee))) return null;
  try   { return `${currency} ${Number(fee).toLocaleString()}`; }
  catch { return `${currency} ${fee}`; }
}

function isExternalUrl(u = "") {
  return /^https?:\/\//i.test(String(u || "").trim());
}

function normalizeInternalPath(p = "") {
  const s = String(p || "").trim();
  if (!s) return "";
  if (isExternalUrl(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

function resolveImageUrl(rawUrl) {
  const u0 = String(rawUrl || "").trim();
  if (!u0) return "";
  if (/^https?:\/\//i.test(u0)) return u0;
  const u = u0.startsWith("uploads/") ? `/${u0}` : u0;
  if (u.startsWith("/uploads/")) {
    return `${String(API_BASE || "").replace(/\/+$/, "")}${u}`;
  }
  return u;
}

/** Derive region from country name (fallback for cards that don't carry a region field) */
const REGION_MAP = {
  Asia:        ["Indonesia","Japan","Singapore","Thailand","Maldives","India","China","South Korea","Vietnam","Philippines","Malaysia","Sri Lanka","Nepal","Bhutan","Cambodia","Laos","Myanmar","Bangladesh","Pakistan","UAE","Oman","Qatar","Bahrain","Kuwait","Saudi Arabia"],
  Europe:      ["France","UK","Italy","Spain","Netherlands","Germany","Portugal","Greece","Switzerland","Austria","Belgium","Sweden","Norway","Denmark","Finland","Poland","Czech Republic","Hungary","Croatia","Ireland"],
  Americas:    ["USA","Canada","Mexico","Brazil","Argentina","Colombia","Peru","Chile","Cuba","Jamaica","Costa Rica"],
 "Middle East": ["UAE","Saudi Arabia","Qatar","Kuwait","Bahrain","Oman","Jordan","Lebanon","Israel","Turkey"],
  Africa:      ["South Africa","Egypt","Morocco","Kenya","Tanzania","Ghana","Nigeria","Ethiopia","Tunisia","Rwanda"],
  Oceania:     ["Australia","New Zealand","Fiji","Papua New Guinea","Samoa","Vanuatu"],
};

function inferRegion(countryName = "") {
  const c = countryName.trim();
  for (const [region, list] of Object.entries(REGION_MAP)) {
    if (list.some((n) => n.toLowerCase() === c.toLowerCase())) return region;
  }
  return "Other";
}

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const BRAND      = "#00477f";
const ACCENT     = "#d06549";
const BASE_FONT  = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
const BODY_FONT  = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
const REGIONS    = ["All","Asia","Europe","Americas","Middle East","Africa","Oceania"];
const PAGE_SIZE  = 12;

/* ═══════════════════════════════════════════════════
   CARD COMPONENT
═══════════════════════════════════════════════════ */
const DestinationCard = React.memo(function DestinationCard({
  card, applyText, fallbackPrice, onApply, index,
}) {
  const [hov, setHov]       = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const finalImg            = resolveImageUrl(card.imageUrl);

  const priceLabel = card.fee != null ? fmtPrice(card.currency, card.fee) : fallbackPrice;

  const badgeText =
    card.badgeText
      ? String(card.badgeText)
      : card.applyMode && card.applyMode !== "go-visa"
      ? String(card.applyMode).toUpperCase()
      : "";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onApply(card)}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        aspectRatio: "3/4",
        cursor: "pointer",
        boxShadow: hov
          ? "0 28px 56px rgba(0,71,127,0.28), 0 0 0 1.5px rgba(208,101,73,0.30)"
          : "0 6px 20px rgba(0,0,0,0.11)",
        transform: hov ? "translateY(-6px) scale(1.025)" : "translateY(0) scale(1)",
        transition: "all 0.32s cubic-bezier(.22,.9,.22,1)",
        animationDelay: `${index * 60}ms`,
        animationFillMode: "both",
        animation: "cardFadeUp 0.55s cubic-bezier(.22,.9,.22,1) both",
      }}
    >
      {/* Image or fallback */}
      {finalImg && !imgErr ? (
        <img
          src={finalImg}
          alt={card.displayName}
          loading="lazy"
          onError={() => setImgErr(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: hov ? "scale(1.10)" : "scale(1.02)",
            transition: "transform 0.55s cubic-bezier(.22,.9,.22,1)",
          }}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 20% 30%, rgba(208,101,73,0.55), transparent 60%),
                       radial-gradient(ellipse at 80% 10%, rgba(88,199,255,0.40), transparent 60%),
                       linear-gradient(150deg, #0b2a4a 0%, #00477f 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.20)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 24,
            fontFamily: BASE_FONT, letterSpacing: 1,
          }}>
            {String(card.displayName || "?").slice(0,2).toUpperCase()}
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.82) 100%)",
        pointerEvents: "none",
      }}/>

      {/* Badge */}
      {badgeText && (
        <div style={{
          position: "absolute", top: 12, left: 12,
          padding: "5px 11px", borderRadius: 999,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.5)",
          color: "#0b2a4a", fontFamily: BASE_FONT,
          fontWeight: 900, fontSize: 11,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {badgeText}
        </div>
      )}

      {/* Rating star placeholder (cards from API don't have rating, show visa type indicator) */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        display: "flex", alignItems: "center", gap: 4,
        background: "rgba(0,0,0,0.42)", backdropFilter: "blur(8px)",
        borderRadius: 999, padding: "4px 9px",
      }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="#f59e0b">
          <path d="M6 1l1.39 2.81L10.5 4.24l-2.25 2.19.53 3.09L6 8.04 3.22 9.52l.53-3.09L1.5 4.24l3.11-.43z"/>
        </svg>
        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: BASE_FONT }}>
          Visa
        </span>
      </div>

      {/* Bottom content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "0 14px 14px",
      }}>
        {/* Country name */}
        <div style={{
          color: "#fff", fontFamily: BASE_FONT,
          fontWeight: 900, fontSize: "1.15rem",
          lineHeight: 1.1, letterSpacing: "0.01em",
          marginBottom: 4,
          textShadow: "0 1px 8px rgba(0,0,0,0.4)",
        }}>
          {card.displayName || card.country || "—"}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 12, fontFamily: BODY_FONT }}>
            {card.type ? `${card.type} Visa` : "Tourist Visa"}
          </span>
          <span style={{
            color: "#fff", fontFamily: BASE_FONT,
            fontWeight: 900, fontSize: "0.95rem",
            background: "rgba(208,101,73,0.85)",
            padding: "2px 8px", borderRadius: 6,
          }}>
            {priceLabel}
          </span>
        </div>

        {/* CTA on hover */}
        <div style={{
          maxHeight: hov ? 48 : 0,
          opacity: hov ? 1 : 0,
          overflow: "hidden",
          marginTop: hov ? 10 : 0,
          transition: "max-height 0.30s ease, opacity 0.25s ease, margin-top 0.25s ease",
        }}>
          <div style={{
            width: "100%", padding: "9px 0",
            borderRadius: 12, textAlign: "center",
            color: "#fff", fontFamily: BASE_FONT,
            fontWeight: 900, fontSize: "0.95rem",
            background: "linear-gradient(90deg, #d06549 0%, #e07a5f 100%)",
            boxShadow: "0 4px 16px rgba(208,101,73,0.45)",
            letterSpacing: "0.03em",
          }}>
            {applyText} →
          </div>
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 20, overflow: "hidden",
      aspectRatio: "3/4", background: "#e8eef5",
      animation: "shimmer 1.6s ease-in-out infinite",
    }}/>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function DiscoverDestinations() {
  const navigate        = useNavigate();
  const { t }           = useTranslation("common");
  const aliveRef        = useRef(true);

  /* — Backend state (from VisaCountryGrid) — */
  const [cardsRows, setCardsRows]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* — UI state (from DiscoverDestinations) — */
  const [region, setRegion]         = useState("All");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);

  /* ── FETCH — exact logic from VisaCountryGrid ── */
  const fetchCards = useCallback(async ({ showSpinner } = { showSpinner: true }) => {
    try {
      if (showSpinner) setLoading(true);
      else             setRefreshing(true);

      const url  = `/api/country-cards?t=${Date.now()}`;
      const rows = await api
        .get(url, { cache: "no-store" })
        .then((j) => (Array.isArray(j?.rows) ? j.rows : []))
        .catch(() => []);

      if (!aliveRef.current) return;
      setCardsRows(rows);
      setLastUpdated(new Date().toISOString());
    } finally {
      if (!aliveRef.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    fetchCards({ showSpinner: true });

    /* Live refresh every 60 s */
    const id = window.setInterval(() => fetchCards({ showSpinner: false }), 60_000);

    /* Admin-triggered refresh event */
    const onPricesUpdated = () => fetchCards({ showSpinner: false });
    window.addEventListener("hv:country-prices-updated", onPricesUpdated);

    return () => {
      aliveRef.current = false;
      window.clearInterval(id);
      window.removeEventListener("hv:country-prices-updated", onPricesUpdated);
    };
  }, [fetchCards]);

  /* ── NORMALIZE + SORT — exact logic from VisaCountryGrid ── */
  const allCards = useMemo(() => {
    const list = (cardsRows || [])
      .filter((c) => c && readActive(c))
      .map((c) => ({
        _id:         c._id || `${c.country||""}__${c.type||""}` || Math.random().toString(16).slice(2),
        country:     String(c.country    || "").trim(),
        displayName: String(c.displayName || c.country || "").trim(),
        imageUrl:    String(c.imageUrl    || "").trim(),
        applyMode:   String(c.applyMode   || "go-visa").trim(),
        applyUrl:    String(c.applyUrl    || "").trim(),
        badgeText:   String(c.badgeText   || "").trim(),
        sortOrder:   Number.isFinite(Number(c.sortOrder)) ? Number(c.sortOrder) : 9999,
        type:        String(c.type        || "").trim(),
        currency:    readCurrency(c),
        fee:         readFee(c),
        region:      String(c.region || inferRegion(c.country || "") || "Other").trim(),
      }));

    list.sort((a, b) => {
      const ao = Number.isFinite(a.sortOrder) ? a.sortOrder : 9999;
      const bo = Number.isFinite(b.sortOrder) ? b.sortOrder : 9999;
      if (ao !== bo) return ao - bo;
      return String(a.displayName).localeCompare(String(b.displayName));
    });
    return list;
  }, [cardsRows]);

  /* ── CLIENT-SIDE FILTER: region + search ── */
  const filteredCards = useMemo(() => {
    let list = region === "All" ? allCards : allCards.filter((c) => c.region === region);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCards, region, search]);

  /* ── PAGINATION ── */
  const pagedCards = useMemo(() => filteredCards.slice(0, page * PAGE_SIZE), [filteredCards, page]);
  const hasMore    = pagedCards.length < filteredCards.length;

  /* Reset page when filter changes */
  useEffect(() => { setPage(1); }, [region, search]);

  /* ── APPLY HANDLER — exact logic from VisaCountryGrid ── */
  function handleApply(card) {
    const displayName = String(card?.displayName || "").trim();
    const mode        = String(card?.applyMode   || "go-visa").trim();
    const url         = String(card?.applyUrl    || "").trim();

    if (mode !== "go-visa" && url) {
      if (isExternalUrl(url)) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      navigate(normalizeInternalPath(url));
      return;
    }

    const params  = new URLSearchParams({ from: "IN", to: displayName || "Unknown", autostart: "1" });
    const nextUrl = `/go/visa?${params.toString()}`;

    try {
      const stored =
        localStorage.getItem("helloviza_user") ||
        localStorage.getItem("hv_user")        ||
        sessionStorage.getItem("hv_user");
      if (!stored) navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
      else         navigate(nextUrl);
    } catch {
      navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }

  /* ── i18n strings ── */
  const fallbackPrice = t("visaCountryGrid.applyToSeePrice", { defaultValue: "Apply to Check" });
  const applyText     = t("common.applyNow", { defaultValue: "Apply Now" });
  const updatedLabel  = lastUpdated
    ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}`
    : "";

  /* ── Region tab counts ── */
  const regionCounts = useMemo(() => {
    const counts = { All: allCards.length };
    REGIONS.slice(1).forEach((r) => {
      counts[r] = allCards.filter((c) => c.region === r).length;
    });
    return counts;
  }, [allCards]);

  return (
    <section style={styles.section}>
      {/* ── Background mesh ── */}
      <div style={styles.bgMesh} aria-hidden="true"/>

      <div style={styles.container}>

        {/* ════════ HEADER ════════ */}
        <div style={styles.headerRow}>
          <div>
            <p style={styles.eyebrow}>Find Your Next Adventure</p>
            <h2 style={styles.title}>
              Discover Your{" "}
              <span style={{ color: ACCENT }}>Destination</span>
            </h2>
            <p style={styles.metaLine}>
              {loading ? (
                "Loading destinations…"
              ) : (
                <>
                  <strong style={{ color: BRAND }}>{filteredCards.length}</strong>
                  {" destination"}{filteredCards.length !== 1 ? "s" : ""}{" available"}
                  {refreshing && (
                    <span style={styles.refreshPill}>↻ Refreshing…</span>
                  )}
                  {!refreshing && updatedLabel && (
                    <span style={styles.refreshPill}>{updatedLabel}</span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Search + Refresh */}
          <div style={styles.searchWrap}>
            <div style={styles.searchBox}>
              <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#9ab0c6" }}
                width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search destinations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                aria-label="Search destinations"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={styles.clearBtn}
                  aria-label="Clear search"
                >×</button>
              )}
            </div>

            <button
              onClick={() => fetchCards({ showSpinner: false })}
              disabled={loading || refreshing}
              style={styles.refreshBtn}
              aria-label="Refresh prices"
              title="Refresh prices"
            >
              <span style={{
                display: "inline-block",
                animation: refreshing ? "spin 1s linear infinite" : "none",
              }}>↻</span>
              {" "}Refresh
            </button>
          </div>
        </div>

        {/* ════════ REGION TABS ════════ */}
        <div style={styles.tabsWrap}>
          <div style={styles.tabs}>
            {REGIONS.map((r) => {
              const active = region === r;
              const count  = regionCounts[r] ?? 0;
              return (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  style={{
                    ...styles.tab,
                    ...(active ? styles.tabActive : styles.tabInactive),
                  }}
                >
                  {r}
                  {count > 0 && (
                    <span style={{
                      ...styles.tabCount,
                      background: active ? "rgba(255,255,255,0.25)" : "rgba(0,71,127,0.10)",
                      color:      active ? "#fff" : BRAND,
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════ GRID ════════ */}
        <div style={styles.grid}>
          {loading && pagedCards.length === 0
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i}/>)
            : pagedCards.map((card, i) => (
                <DestinationCard
                  key={String(card._id)}
                  card={card}
                  index={i}
                  applyText={applyText}
                  fallbackPrice={fallbackPrice}
                  onApply={handleApply}
                />
              ))
          }
        </div>

        {/* ════════ EMPTY STATE ════════ */}
        {!loading && filteredCards.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🌍</div>
            <p style={styles.emptyTitle}>
              {search ? `No results for "${search}"` : "No destinations enabled yet."}
            </p>
            <p style={styles.emptyText}>
              {search
                ? "Try a different search term or browse all regions."
                : "Enable countries in Admin and mark them Active."}
            </p>
            {search && (
              <button onClick={() => setSearch("")} style={styles.clearSearchBtn}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* ════════ LOAD MORE ════════ */}
        {hasMore && !loading && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              style={styles.loadMoreBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,71,127,0.40)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,71,127,0.28)";
              }}
            >
              Load More Destinations →
            </button>
          </div>
        )}
      </div>

      {/* ── Global keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,700;0,800;0,900;1,700;1,900&family=Inter:wght@400;500;600&display=swap');

        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes shimmer {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
const styles = {
  section: {
    width: "100%",
    padding: "64px 0 48px",
    fontFamily: BASE_FONT,
    background: "#f4f7fb",
    position: "relative",
    overflow: "hidden",
  },
  bgMesh: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `
      radial-gradient(1400px 600px at 8% 5%,  rgba(208,101,73,0.10), transparent 55%),
      radial-gradient(1000px 600px at 92% 15%, rgba(88,199,255,0.08), transparent 60%),
      radial-gradient(800px  400px at 50% 90%, rgba(0,71,127,0.06),   transparent 60%)
    `,
  },
  container: {
    width:   "min(1240px, 94vw)",
    margin:  "0 auto",
    position: "relative",
  },

  /* Header */
  headerRow: {
    display:        "flex",
    flexWrap:       "wrap",
    alignItems:     "flex-end",
    justifyContent: "space-between",
    gap:            16,
    marginBottom:   28,
  },
  eyebrow: {
    color:         ACCENT,
    fontFamily:    BASE_FONT,
    fontWeight:    900,
    fontSize:      "0.78rem",
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    margin:        "0 0 8px",
  },
  title: {
    fontFamily:    BASE_FONT,
    fontWeight:    900,
    fontSize:      "clamp(2rem, 3.2vw, 3rem)",
    letterSpacing: "-1px",
    color:         BRAND,
    margin:        0,
    lineHeight:    1.0,
  },
  metaLine: {
    marginTop:  8,
    fontSize:   "0.88rem",
    fontFamily: BASE_FONT,
    fontWeight: 700,
    color:      "rgba(11,42,74,0.60)",
    display:    "flex",
    alignItems: "center",
    gap:        8,
    flexWrap:   "wrap",
  },
  refreshPill: {
    fontSize:   12,
    fontWeight: 900,
    padding:    "4px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.80)",
    border:     "1px solid rgba(0,71,127,0.12)",
    color:      "rgba(11,42,74,0.70)",
  },

  /* Search */
  searchWrap: {
    display:    "flex",
    alignItems: "center",
    gap:        8,
    flexWrap:   "wrap",
  },
  searchBox: {
    position:   "relative",
    display:    "flex",
    alignItems: "center",
  },
  searchInput: {
    paddingLeft:   42,
    paddingRight:  32,
    paddingTop:    10,
    paddingBottom: 10,
    borderRadius:  12,
    border:        "1.5px solid rgba(0,71,127,0.15)",
    background:    "#fff",
    fontSize:      "0.90rem",
    fontFamily:    BASE_FONT,
    fontWeight:    600,
    color:         "#0b2a4a",
    outline:       "none",
    width:         220,
    transition:    "border-color 0.2s",
  },
  clearBtn: {
    position:   "absolute",
    right:      10,
    background: "none",
    border:     "none",
    cursor:     "pointer",
    color:      "#9ab0c6",
    fontSize:   18,
    lineHeight: 1,
    padding:    0,
  },
  refreshBtn: {
    padding:      "9px 16px",
    borderRadius: 12,
    border:       "1.5px solid rgba(0,71,127,0.18)",
    background:   "rgba(255,255,255,0.90)",
    color:        BRAND,
    fontFamily:   BASE_FONT,
    fontWeight:   900,
    fontSize:     "0.90rem",
    cursor:       "pointer",
    transition:   "background 0.18s",
    whiteSpace:   "nowrap",
  },

  /* Region tabs */
  tabsWrap: {
    overflowX:     "auto",
    marginBottom:  20,
    scrollbarWidth:"none",
  },
  tabs: {
    display:   "flex",
    gap:       8,
    paddingBottom: 4,
  },
  tab: {
    display:      "inline-flex",
    alignItems:   "center",
    gap:          6,
    padding:      "8px 16px",
    borderRadius: 999,
    fontFamily:   BASE_FONT,
    fontWeight:   900,
    fontSize:     "0.92rem",
    cursor:       "pointer",
    whiteSpace:   "nowrap",
    flexShrink:   0,
    transition:   "all 0.22s ease",
    border:       "1.5px solid transparent",
  },
  tabActive: {
    background: `linear-gradient(135deg, ${BRAND} 0%, #005fa3 100%)`,
    color:      "#fff",
    boxShadow:  `0 6px 18px rgba(0,71,127,0.32)`,
    border:     "1.5px solid transparent",
  },
  tabInactive: {
    background: "rgba(255,255,255,0.88)",
    color:      BRAND,
    border:     `1.5px solid rgba(0,71,127,0.14)`,
  },
  tabCount: {
    padding:      "1px 7px",
    borderRadius: 999,
    fontSize:     11,
    fontWeight:   900,
    fontFamily:   BASE_FONT,
  },

  /* Grid */
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
    gap:                 16,
  },

  /* Empty state */
  emptyState: {
    textAlign:    "center",
    padding:      "48px 24px",
    borderRadius: 20,
    background:   "rgba(255,255,255,0.80)",
    border:       "1px solid rgba(0,71,127,0.10)",
    boxShadow:    "0 12px 36px rgba(0,71,127,0.08)",
    marginTop:    24,
  },
  emptyTitle: {
    fontFamily: BASE_FONT,
    fontWeight: 900,
    fontSize:   "1.25rem",
    color:      "#0b2a4a",
    margin:     "0 0 8px",
  },
  emptyText: {
    fontFamily: BASE_FONT,
    fontWeight: 600,
    fontSize:   "0.95rem",
    color:      "rgba(11,42,74,0.55)",
    margin:     0,
  },
  clearSearchBtn: {
    marginTop:    16,
    padding:      "10px 24px",
    borderRadius: 12,
    border:       "none",
    background:   BRAND,
    color:        "#fff",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
    fontWeight:   900,
    fontSize:     "1rem",
    cursor:       "pointer",
  },

  /* Load more */
  loadMoreBtn: {
    padding:      "13px 36px",
    borderRadius: 14,
    border:       "none",
    background:   `linear-gradient(135deg, ${BRAND} 0%, #005fa3 100%)`,
    color:        "#fff",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
    fontWeight:   900,
    fontSize:     "1.05rem",
    letterSpacing:"0.02em",
    cursor:       "pointer",
    boxShadow:    "0 8px 24px rgba(0,71,127,0.28)",
    transition:   "transform 0.22s ease, box-shadow 0.22s ease",
  },
};