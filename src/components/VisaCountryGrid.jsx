// helloviza/client/src/components/VisaCountryGrid.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, API_BASE } from "../utils/api";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

function readActive(row) {
  if (typeof row?.isActive === "boolean") return row.isActive;
  if (typeof row?.active === "boolean") return row.active; // legacy
  return true;
}

/**
 * fee can be null/blank.
 * Number(null) => 0 (BUG) so return null for empty.
 */
function readFee(row) {
  const v = row?.fee ?? row?.price; // fee(new) | price(legacy)
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function readCurrency(row) {
  return String(row?.currency || "INR").trim().toUpperCase() || "INR";
}

function fmtPrice(currency = "INR", fee = 0) {
  if (!Number.isFinite(Number(fee))) return null;
  const n = Number(fee);
  try {
    return `${currency} ${n.toLocaleString()}`;
  } catch {
    return `${currency} ${n}`;
  }
}

function isExternalUrl(u = "") {
  return /^https?:\/\//i.test(String(u || "").trim());
}

function normalizeInternalPath(p = "") {
  const s = String(p || "").trim();
  if (!s) return "";
  if (isExternalUrl(s)) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
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

/** Card */
const CountryCard = React.memo(function CountryCard({
  imageUrl,
  label,
  priceLabel,
  badgeText,
  onApply,
  applyText,
}) {
  const [imgErr, setImgErr] = useState(false);
  const finalImg = resolveImageUrl(imageUrl);

  return (
    <div style={styles.card}>
      <div style={styles.media}>
        {finalImg && !imgErr ? (
          <img
            src={finalImg}
            alt={label}
            loading="lazy"
            style={styles.img}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div style={styles.fallbackImg}>
            <div style={styles.fallbackText}>
              {String(label || "Visa").slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}

        {badgeText ? <div style={styles.badge}>{badgeText}</div> : null}
        <div style={styles.mediaShade} />
      </div>

      <div style={styles.body}>
        <div style={styles.country}>{label}</div>
        <div style={styles.price}>{priceLabel}</div>

        <button onClick={onApply} type="button" style={styles.applyBtn}>
          {applyText}
          <span style={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
});

export default function VisaCountryGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const [cardsRows, setCardsRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const aliveRef = useRef(true);

  const fetchCards = useCallback(async ({ showSpinner } = { showSpinner: true }) => {
    try {
      if (showSpinner) setLoading(true);
      else setRefreshing(true);

      // ✅ Force refresh:
      // 1) cache:no-store
      // 2) append t= timestamp to defeat any caching layers
      const url = `/api/country-cards?t=${Date.now()}`;

      const rows = await api
        // many api wrappers accept a 2nd param; if yours ignores it, the ?t= still works.
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

    // ✅ Live refresh every 60s (optional but helps “live pricing”)
    const id = window.setInterval(() => {
      fetchCards({ showSpinner: false });
    }, 60 * 1000);

    // ✅ Listen for admin-triggered refresh
    const onPricesUpdated = () => fetchCards({ showSpinner: false });
    window.addEventListener("hv:country-prices-updated", onPricesUpdated);

    return () => {
      aliveRef.current = false;
      window.clearInterval(id);
      window.removeEventListener("hv:country-prices-updated", onPricesUpdated);
    };
  }, [fetchCards]);

  const visibleCards = useMemo(() => {
    const list = (cardsRows || [])
      .filter((c) => c && readActive(c))
      .map((c) => {
        const fee = readFee(c); // null means “Apply to Check”
        const currency = readCurrency(c);

        return {
          _id:
            c._id ||
            `${c.country || ""}__${c.type || ""}` ||
            Math.random().toString(16).slice(2),
          country: String(c.country || "").trim(),
          displayName: String(c.displayName || c.country || "").trim(),
          imageUrl: String(c.imageUrl || "").trim(),
          applyMode: String(c.applyMode || "go-visa").trim(),
          applyUrl: String(c.applyUrl || "").trim(),
          badgeText: String(c.badgeText || "").trim(),
          sortOrder: Number.isFinite(Number(c.sortOrder)) ? Number(c.sortOrder) : 9999,
          type: String(c.type || "").trim(),
          currency: currency || "INR",
          fee,
        };
      });

    list.sort((a, b) => {
      const ao = Number.isFinite(Number(a.sortOrder)) ? Number(a.sortOrder) : 9999;
      const bo = Number.isFinite(Number(b.sortOrder)) ? Number(b.sortOrder) : 9999;
      if (ao !== bo) return ao - bo;
      return String(a.displayName || "").localeCompare(String(b.displayName || ""));
    });

    return list;
  }, [cardsRows]);

  function handleApply(card) {
    const displayName = String(card?.displayName || "").trim();
    const mode = String(card?.applyMode || "go-visa").trim();
    const url = String(card?.applyUrl || "").trim();

    if (mode !== "go-visa" && url) {
      if (isExternalUrl(url)) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
      navigate(normalizeInternalPath(url));
      return;
    }

    const params = new URLSearchParams({
      from: "IN",
      to: displayName || "Unknown",
      autostart: "1",
    });
    const nextUrl = `/go/visa?${params.toString()}`;

    try {
      const stored =
        localStorage.getItem("helloviza_user") ||
        localStorage.getItem("hv_user") ||
        sessionStorage.getItem("hv_user");

      if (!stored) navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
      else navigate(nextUrl);
    } catch {
      navigate(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }

  const title = t("visaCountryGrid.title", { defaultValue: "Visa Destinations" });
  const subtitle = t("visaCountryGrid.subtitle", {
    defaultValue: "Live prices, instant apply, and manual/offline routing where needed.",
  });

  const fallbackPrice = t("visaCountryGrid.applyToSeePrice", { defaultValue: "Apply to Check" });
  const applyText = t("common.applyNow", { defaultValue: "Apply Now" });

  const updatedLabel = lastUpdated
    ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}`
    : "";

  return (
    <section style={styles.section}>
      <div style={styles.headerWrap}>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.subtitle}>
          {subtitle}
          <span style={styles.metaPill}>
            {refreshing ? "Refreshing…" : updatedLabel || "—"}
          </span>
          <button
            type="button"
            onClick={() => fetchCards({ showSpinner: false })}
            style={styles.refreshBtn}
            disabled={loading || refreshing}
            aria-label="Refresh prices"
            title="Refresh prices"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading ? <div style={styles.loader}>Loading destinations…</div> : null}

      {!loading && visibleCards.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyTitle}>No destinations enabled yet.</div>
          <div style={styles.emptyText}>Enable countries in Admin and mark them Active.</div>
        </div>
      ) : null}

      <div style={styles.grid}>
        {visibleCards.map((c) => {
          const priceLabel =
            c.fee != null && c.currency ? fmtPrice(c.currency, c.fee) : fallbackPrice;

          const label = t(`countries.${c.displayName}`, { defaultValue: c.displayName || "—" });

          const badgeText =
            c.badgeText
              ? String(c.badgeText)
              : c.applyMode && String(c.applyMode) !== "go-visa"
              ? String(c.applyMode).toUpperCase()
              : "";

          return (
            <CountryCard
              key={String(c._id)}
              imageUrl={c.imageUrl || ""}
              label={label}
              priceLabel={priceLabel}
              badgeText={badgeText}
              applyText={applyText}
              onApply={() => handleApply(c)}
            />
          );
        })}
      </div>
    </section>
  );
}

const styles = {
  section: {
    width: "100vw",
    padding: "44px 0 34px",
    fontFamily: baseFont,
    background:
      "radial-gradient(1200px 520px at 15% 10%, rgba(208,101,73,.14), transparent 55%), radial-gradient(900px 520px at 85% 20%, rgba(88,199,255,.10), transparent 60%), rgba(248, 232, 238, 0.50)",
  },
  headerWrap: { width: "min(1200px, 92vw)", margin: "0 auto 18px", textAlign: "center" },
  title: { fontSize: "2.4rem", fontWeight: 900, margin: 0, letterSpacing: ".01em", color: "#00477f" },
  subtitle: {
    marginTop: 10,
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "rgba(2,9,23,.70)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  metaPill: {
    fontSize: 13,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,.65)",
    border: "1px solid rgba(2,9,23,.10)",
    color: "rgba(2,9,23,.72)",
  },
  refreshBtn: {
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid rgba(0,71,127,.18)",
    background: "rgba(255,255,255,.82)",
    color: "#00477f",
    fontFamily: baseFont,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(2,9,23,.08)",
  },
  loader: {
    width: "min(1200px, 92vw)",
    margin: "10px auto 8px",
    textAlign: "center",
    color: "rgba(2,9,23,.60)",
    fontWeight: 800,
  },
  emptyState: {
    width: "min(900px, 92vw)",
    margin: "18px auto 10px",
    borderRadius: 18,
    padding: "16px 16px",
    border: "1px solid rgba(2,9,23,.10)",
    background: "rgba(255,255,255,.78)",
    boxShadow: "0 14px 40px rgba(2,9,23,.08)",
    textAlign: "center",
  },
  emptyTitle: { fontWeight: 900, color: "#0b2a4a", fontSize: 18 },
  emptyText: { marginTop: 6, fontWeight: 700, color: "rgba(2,9,23,.60)" },
  grid: {
    width: "min(1200px, 92vw)",
    margin: "18px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 18,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    background: "rgba(255,255,255,.88)",
    border: "1px solid rgba(2,9,23,.10)",
    boxShadow: "0 16px 52px rgba(2,9,23,.10)",
    transform: "translateZ(0)",
    transition: "transform .18s ease, box-shadow .18s ease",
  },
  media: { position: "relative", width: "100%", height: 128, overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scale(1.02)" },
  mediaShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,.05) 0%, rgba(0,0,0,.16) 70%, rgba(0,0,0,.22) 100%)",
    pointerEvents: "none",
  },
  fallbackImg: {
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(800px 220px at 10% 20%, rgba(208,101,73,.45), transparent 60%), radial-gradient(700px 220px at 90% 20%, rgba(88,199,255,.40), transparent 60%), linear-gradient(135deg, rgba(11,42,74,.95), rgba(0,35,72,.92))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    width: 60,
    height: 60,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,.12)",
    border: "1px solid rgba(255,255,255,.18)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: 0.5,
    boxShadow: "0 18px 50px rgba(0,0,0,.28)",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: "7px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 13,
    background: "rgba(255,255,255,.86)",
    border: "1px solid rgba(2,9,23,.10)",
    color: "#0b2a4a",
    backdropFilter: "blur(8px)",
  },
  body: { padding: 14, display: "flex", flexDirection: "column", gap: 8, minHeight: 150 },
  country: { fontSize: "1.05rem", fontWeight: 900, color: "#0b2a4a", letterSpacing: ".01em", lineHeight: 1.1 },
  price: { fontSize: ".98rem", fontWeight: 900, color: "#d06549" },
  applyBtn: {
    marginTop: "auto",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,71,127,.12)",
    background: "linear-gradient(135deg, #00477f 0%, #0b2a4a 100%)",
    color: "#fff",
    fontFamily: baseFont,
    fontWeight: 900,
    fontSize: 16,
    letterSpacing: ".02em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 14px 40px rgba(0,71,127,.22)",
  },
  arrow: { display: "inline-block", transform: "translateY(-1px)", fontWeight: 900 },
};
