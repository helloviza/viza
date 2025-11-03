// helloviza/client/src/components/VisaSearchNeo.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import allCountries from "../data/allCountries";

/* ====== constants for handoff (no UI impact) ====== */
const LOGIN_REDIRECT_KEY = "postLoginRedirect";
const GV_PAYLOAD_KEY = "gv_payload";

/* =====================  POSITION / SIZE  ===================== */
const ANCHOR = { topVh: 39, leftPct: 60, width: "min(720px, 48vw)" };
/* ============================================================= */

const BRAND = "#00477f";
const BRANDS = "#ffffff";
const ACCENT = "#d06549";
const baseFont = "'Barlow Condensed', Arial, sans-serif";
const CTRL_H = 48;
const RADIUS = 25;

/* ---------- small date utils ---------- */
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const today0 = () => startOfDay(new Date());
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return startOfDay(x);
};
const ymd = (d) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
const nice = (d) =>
  d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ---------- helpers ---------- */
const norm = (s = "") => s.replace(/\s+/g, " ").trim().toLowerCase();
const ALIASES = {
  dubai: "United Arab Emirates",
  "abu dhabi": "United Arab Emirates",
  uae: "United Arab Emirates",
  emirates: "United Arab Emirates",
  doha: "Qatar",
  riyadh: "Saudi Arabia",
  jeddah: "Saudi Arabia",
  ksa: "Saudi Arabia",
  usa: "United States",
  us: "United States",
  "u.s.": "United States",
  america: "United States",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  england: "United Kingdom",
  britain: "United Kingdom",
  singapore: "Singapore",
  bangkok: "Thailand",
  phuket: "Thailand",
  "kuala lumpur": "Malaysia",
  bali: "Indonesia",
  jakarta: "Indonesia",
  tokyo: "Japan",
  osaka: "Japan",
  mumbai: "India",
  delhi: "India",
  bengaluru: "India",
  bangalore: "India",
  chennai: "India",
  paris: "France",
  berlin: "Germany",
  madrid: "Spain",
  barcelona: "Spain",
  rome: "Italy",
  milan: "Italy",
  istanbul: "Turkey",
  amsterdam: "Netherlands",
  zurich: "Switzerland",
  geneva: "Switzerland",
};
const EVISA = new Set([
  "United Arab Emirates",
  "Turkey",
  "Sri Lanka",
  "India",
  "Kenya",
  "Cambodia",
  "Vietnam",
  "Thailand",
  "Malaysia",
  "Indonesia",
  "Qatar",
]);
const PURPOSES = [
  "Tourist Visa",
  "Business Visa",
  "Family Visa",
  "Student Visa",
  "Transit Visa",
];

function flagOf(name = "") {
  const m = {
    india: "🇮🇳",
    "united arab emirates": "🇦🇪",
    uae: "🇦🇪",
    singapore: "🇸🇬",
    thailand: "🇹🇭",
    malaysia: "🇲🇾",
    "united states": "🇺🇸",
    usa: "🇺🇸",
    "united kingdom": "🇬🇧",
    uk: "🇬🇧",
    australia: "🇦🇺",
    canada: "🇨🇦",
    qatar: "🇶🇦",
    oman: "🇴🇲",
    "saudi arabia": "🇸🇦",
    japan: "🇯🇵",
    "south korea": "🇰🇷",
    china: "🇨🇳",
    france: "🇫🇷",
    germany: "🇩🇪",
    italy: "🇮🇹",
    spain: "🇪🇸",
    netherlands: "🇳🇱",
    turkey: "🇹🇷",
    "sri lanka": "🇱🇰",
    nepal: "🇳🇵",
    bhutan: "🇧🇹",
    bangladesh: "🇧🇩",
    "new zealand": "🇳🇿",
    indonesia: "🇮🇩",
    switzerland: "🇨🇭",
  };
  return m[norm(name)] || "🛫";
}

function normalizeCountry(input) {
  if (!input) return "";
  const q = norm(input);
  if (ALIASES[q]) return ALIASES[q];
  const exact = allCountries.find((c) => norm(c) === q);
  if (exact) return exact;
  const starts = allCountries.find((c) => norm(c).startsWith(q));
  if (starts) return starts;
  const contains = allCountries.find((c) => norm(c).includes(q));
  return contains || input;
}

function prettyIn(days = 5) {
  const d = new Date(Date.now() + days * 86400000);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

function useSuggestions(list, q, limit = 8) {
  return useMemo(() => {
    const query = norm(q);
    if (!query) return [];
    const starts = [],
      contains = [],
      aliasHits = [];
    Object.keys(ALIASES).forEach((k) => {
      const nk = norm(k);
      if (nk.startsWith(query) || (query.length > 1 && nk.includes(query)))
        aliasHits.push(ALIASES[k]);
    });
    for (const c of list) {
      const lc = norm(c);
      if (query.length === 1) {
        if (lc.startsWith(query)) starts.push(c);
      } else {
        if (lc.startsWith(query)) starts.push(c);
        else if (lc.includes(query)) contains.push(c);
      }
    }
    const uniq = Array.from(new Set([...aliasHits, ...starts, ...contains])).slice(
      0,
      limit
    );
    return uniq.map((v) => ({
      value: v,
      subtitle: `Get your visa by ${prettyIn(4 + Math.floor(Math.random() * 6))}`,
      chip: EVISA.has(v) ? "E-VISA" : "VISA",
    }));
  }, [list, q, limit]);
}

function Highlight({ text, query }) {
  const q = (query || "").trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ background: "#ffefc2", borderRadius: 4, padding: "0 2px" }}>
        {text.slice(i, i + q.length)}
      </span>
      {text.slice(i + q.length)}
    </>
  );
}

/* ---------- floating panel aligned to NEXT button ---------- */
function FloatingPanel({ containerEl, nextBtnEl, open, children }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open || !containerEl) return;
    const update = () => {
      const pill = containerEl.getBoundingClientRect();
      if (!pill) return;
      const btn = nextBtnEl ? nextBtnEl.getBoundingClientRect() : null;

      const GAP = 8;
      const MIN_W = 330;
      const MAX_W = 520;

      let left = btn ? btn.right + GAP : pill.left + 14;
      const rightLimit = pill.right - 6;
      let width = rightLimit - left;

      if (width < MIN_W) {
        left = pill.left + 14;
        width = rightLimit - left;
      }
      width = Math.max(MIN_W, Math.min(MAX_W, width));
      setPos({ top: pill.bottom + 6, left, width });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [containerEl, nextBtnEl, open]);

  if (!open || !pos) return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 4000,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

/* ---------- calendar (plumtrips-style, lightweight) ---------- */
function CalendarPanel({
  minDate,
  selected,
  onPick,
}) {
  const startMonth = startOfDay(selected || minDate || today0());
  const [view, setView] = useState(new Date(startMonth));

  const y = view.getFullYear();
  const m = view.getMonth();

  const first = new Date(y, m, 1);
  const firstDow = (first.getDay() + 6) % 7; // Monday=0 grid
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const days = [];
  // leading blanks
  for (let i = 0; i < firstDow; i++) days.push(null);
  // actual days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(y, m, d));
  }
  // trailing blanks to full rows
  while (days.length % 7) days.push(null);

  const isDisabled = (d) => !d || startOfDay(d) < startOfDay(minDate);
  const isSelected = (d) =>
    selected && d && startOfDay(d).getTime() === startOfDay(selected).getTime();

  return (
    <div style={S.calWrap}>
      <div style={S.calHeader}>
        <button
          type="button"
          style={S.calNav}
          onClick={() => setView(new Date(y, m - 1, 1))}
          aria-label="Prev month"
        >
          ←
        </button>
        <div style={S.calTitle}>
          {view.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          type="button"
          style={S.calNav}
          onClick={() => setView(new Date(y, m + 1, 1))}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div style={S.calWeekHead}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
          <div key={w} style={S.calWeekCell}>
            {w}
          </div>
        ))}
      </div>

      <div style={S.calGrid}>
        {days.map((d, i) => {
          const dis = isDisabled(d);
          const sel = isSelected(d);
          return (
            <button
              key={i}
              type="button"
              disabled={dis}
              onClick={() => !dis && onPick(startOfDay(d))}
              style={S.day(dis, sel)}
            >
              {d ? d.getDate() : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- styles ---------- */
const S = {
  shell: (visible = true) => ({
    position: "fixed",
    left: `${ANCHOR.leftPct}%`,
    top: `${ANCHOR.topVh}vh`,
    transform: "translateX(-50%)",
    width: ANCHOR.width,
    zIndex: 9999,
    pointerEvents: "none",
    opacity: visible ? 1 : 0,
    transition: "opacity .25s ease, transform .25s ease",
    ...(visible
      ? {}
      : { transform: "translateX(-50%) translateY(-6px) scale(.995)" }),
    fontFamily: baseFont,
  }),
  microLabel: {
    position: "absolute",
    top: -18,
    left: 10,
    fontSize: "1rem",
    letterSpacing: ".02em",
    color: ACCENT,
    textShadow: "0 1px 1px rgba(0,0,0,.18)",
    fontWeight: 900,
    pointerEvents: "none",
  },
  pill: {
    pointerEvents: "auto",
    height: CTRL_H,
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 25,
    padding: "10px 10px 0 10px",
    borderRadius: RADIUS,
    background: BRANDS,
    border: "1px solid #e9eef5",
    boxShadow: "0 8px 26px rgba(0,0,0,.10)",
    backdropFilter: "blur(8px) saturate(1.05)",
    position: "relative",
  },
  flag: { width: 26, textAlign: "center", fontSize: 18, opacity: 0.9 },
  input: {
    border: 0,
    outline: "none",
    background: "transparent",
    width: "100%",
    fontWeight: 900,
    fontSize: "1.08rem",
    color: BRAND,
  },
  btnGhost: {
    border: "1px solid #d5e3f1",
    height: CTRL_H - 14,
    padding: "0 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,.85)",
    color: BRAND,
    fontWeight: 900,
    cursor: "pointer",
  },
  btnPrimary: {
    border: 0,
    height: CTRL_H - 10,
    padding: "0 40px",
    borderRadius: 999,
    background: ACCENT,
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,71,127,.24)",
  },
  progress: {
    height: 3,
    background: "rgba(255,255,255,.55)",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 6,
  },
  bar: (step) => ({
    height: "100%",
    width: `${((step + 1) / 5) * 100}%`,
    background: `linear-gradient(90deg, ${BRAND}, #2a8ed6)`,
    transition: "width .45s cubic-bezier(.22,.9,.22,1)",
  }),
  listBox: {
    background: "#fff",
    border: "1px solid #e6ecf4",
    borderRadius: 12,
    boxShadow: "0 16px 42px rgba(16,24,40,.14)",
    overflow: "hidden",
  },
  item: (active) => ({
    display: "grid",
    gridTemplateColumns: "30px 1fr auto",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: active ? "#f6f9ff" : "#fff",
    borderBottom: "1px solid #f2f4f7",
    cursor: "pointer",
  }),
  itFlag: { fontSize: 20, textAlign: "center" },
  itTitle: { fontWeight: 900, fontSize: "1.12rem", color: "#0f172a", lineHeight: 1.1 },
  itSub: { color: "#5f6c85", fontSize: ".98rem", marginTop: 2 },
  chip: {
    fontWeight: 700,
    fontSize: ".86rem",
    color: "#2f3a8c",
    background: "#eef1ff",
    padding: "6px 10px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  },
  chipsWrap: { display: "flex", gap: 5, flexWrap: "nowrap" },
  chipBtn: (active) => ({
    border: ".5px solid " + (active ? BRAND : "#d6e4f2"),
    background: active ? "rgba(0,71,127,.10)" : "#fff",
    color: active ? BRAND : "#0f172a",
    borderRadius: 999,
    fontWeight: 900,
    height: CTRL_H - 20,
    padding: "0 8px",
    cursor: "pointer",
  }),

  /* calendar styles */
  calWrap: {
    background: "#fff",
    border: "1px solid #e6ecf4",
    borderRadius: 14,
    boxShadow: "0 16px 42px rgba(16,24,40,.14)",
    padding: 12,
    userSelect: "none",
  },
  calHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 6px 8px",
  },
  calTitle: {
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: ".01em",
    fontSize: "1.1rem",
  },
  calNav: {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: 8,
    padding: "4px 10px",
    cursor: "pointer",
    fontWeight: 800,
    color: BRAND,
  },
  calWeekHead: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
    padding: "0 4px 6px",
  },
  calWeekCell: {
    textAlign: "center",
    fontWeight: 800,
    color: "#64748b",
    fontSize: ".9rem",
  },
  calGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
    padding: 4,
  },
  day: (disabled, selected) => ({
    height: 38,
    borderRadius: 10,
    border: "1px solid " + (selected ? ACCENT : "#edf2f7"),
    background: selected ? ACCENT : "#ffffff",
    color: selected ? "#ffffff" : disabled ? "#cbd5e1" : "#0f172a",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 800,
  }),
};

/* ---------- main component ---------- */
export default function VisaSearchNeo({ onResults, user }) {
  const navigate = useNavigate();

  // global placeholder color (white)
  useEffect(() => {
    const id = "visa-placeholder-style";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        .visa-input::placeholder { color: #d06549; opacity: 1; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // wizard state (unchanged around text steps)
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting && e.intersectionRatio > 0.05),
      { threshold: [0, 0.05, 0.2, 0.6, 1] }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const [oText, setOText] = useState("");
  const [origin, setOrigin] = useState("");
  const oRef = useRef(null);
  const oList = useSuggestions(allCountries, oText, 10);
  const [oActive, setOActive] = useState(0);

  const [dText, setDText] = useState("");
  const [destination, setDestination] = useState("");
  const dRef = useRef(null);
  const dList = useSuggestions(allCountries, dText, 10);
  const [dActive, setDActive] = useState(0);

  const oSuggest = oList.length ? oList : fallbackByFirstLetter(allCountries, oText);
  const dSuggest = dList.length ? dList : fallbackByFirstLetter(allCountries, dText);

  const [start, setStart] = useState(""); // yyyy-mm-dd
  const [end, setEnd] = useState("");

  const [purpose, setPurpose] = useState("");

  // Refs for positioning the panels
  const pillRef = useRef(null);
  const nextBtnRef = useRef(null);

  // focus origin/destination inputs automatically
  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 0) oRef.current?.focus();
      if (step === 1) dRef.current?.focus();
    }, 360);
    return () => clearTimeout(t);
  }, [step]);

  function pickOrigin(v) {
    const c = normalizeCountry(v);
    setOrigin(c);
    setOText(c);
    setStep(1);
  }
  function pickDest(v) {
    const c = normalizeCountry(v);
    setDestination(c);
    setDText(c);
    setStep(2); // jump to start-date step immediately
  }

  function canNext() {
    if (step === 0) return !!oText;
    if (step === 1) return !!dText;
    if (step === 2) return !!start;
    if (step === 3) return !!end;
    if (step === 4) return !!purpose;
    return false;
  }

  function isLoggedIn() {
    if (user) return true;
    try {
      return Boolean(
        localStorage.getItem("hv_user") ||
          sessionStorage.getItem("hv_user") ||
          localStorage.getItem("hv_token")
      );
    } catch {
      return false;
    }
  }

  function submit() {
    const payload = {
      from: normalizeCountry(origin || oText),
      to: normalizeCountry(destination || dText),
      start,
      end,
      type: purpose,
    };
    try {
      sessionStorage.setItem(GV_PAYLOAD_KEY, JSON.stringify(payload));
    } catch {}

    const qs = new URLSearchParams(payload).toString();
    const target = `/go-for-visa?${qs}`;

    if (!isLoggedIn()) {
      try {
        sessionStorage.setItem(LOGIN_REDIRECT_KEY, target);
      } catch {}
      navigate(`/login?next=${encodeURIComponent(target)}`);
      return;
    }

    navigate(target);

    if (typeof onResults === "function") {
      onResults([
        {
          id: "preview",
          route: `${payload.from} → ${payload.to}`,
          type: payload.type || "Visa",
        },
      ]);
    }
  }

  const labels = [
    "Where are you starting from?",
    "Your destination?",
    "Visa start date",
    "Visa end date",
    "Purpose of visa",
  ];
  const placeholders = [labels[0], labels[1], "dd-mm-yyyy", "dd-mm-yyyy"];

  // Calendar min constraints
  const minStart = addDays(today0(), 1); // API requires > today
  const selectedStart = start ? startOfDay(new Date(start)) : null;
  const minEnd = selectedStart ? addDays(selectedStart, 1) : addDays(today0(), 2);
  const selectedEnd = end ? startOfDay(new Date(end)) : null;

  return (
    <div style={S.shell(visible)}>
      {/*<div style={S.microLabel}>{labels[step]}</div>*/}

      {/* SLIM PILL */}
      <div style={S.pill} ref={pillRef}>
        <span style={S.flag}>
          {flagOf(step < 1 ? (oText || origin) : (dText || destination))}
        </span>

        {/* Step 0: Origin */}
        {step === 0 && (
          <input
            ref={oRef}
            className="visa-input"
            value={oText}
            onChange={(e) => {
              setOText(e.target.value);
              setOActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                pickOrigin((oSuggest[oActive]?.value) || oText);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOActive((i) =>
                  Math.min(i + 1, Math.max(0, oSuggest.length - 1))
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setOActive((i) => Math.max(i - 1, 0));
              }
            }}
            placeholder={placeholders[0]}
            style={S.input}
            aria-label="Origin"
          />
        )}

        {/* Step 1: Destination */}
        {step === 1 && (
          <input
            ref={dRef}
            className="visa-input"
            value={dText}
            onChange={(e) => {
              setDText(e.target.value);
              setDActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") pickDest((dSuggest[dActive]?.value) || dText);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setDActive((i) =>
                  Math.min(i + 1, Math.max(0, dSuggest.length - 1))
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setDActive((i) => Math.max(i - 1, 0));
              }
            }}
            placeholder={placeholders[1]}
            style={S.input}
            aria-label="Destination"
          />
        )}

        {/* Step 2: Start date (custom calendar; read-only display) */}
        {step === 2 && (
          <div style={{ ...S.input, cursor: "pointer" }} aria-label="Visa start date">
            {selectedStart ? nice(selectedStart) : placeholders[2]}
          </div>
        )}

        {/* Step 3: End date */}
        {step === 3 && (
          <div style={{ ...S.input, cursor: "pointer" }} aria-label="Visa end date">
            {selectedEnd ? nice(selectedEnd) : placeholders[3]}
          </div>
        )}

        {/* Step 4: Purpose */}
        {step === 4 && (
          <div style={{ overflow: "hidden" }}>
            <div style={S.chipsWrap}>
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  style={S.chipBtn(purpose === p)}
                >
                  {p.replace(" Visa", "")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* actions */}
        {step > 0 ? (
          <button className="ghost" style={S.btnGhost} onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <button
            ref={nextBtnRef}
            style={S.btnPrimary}
            onClick={() => {
              if (step === 0) pickOrigin((oSuggest[0]?.value) || oText);
              else if (step === 1) pickDest((dSuggest[0]?.value) || dText);
              else setStep(step + 1);
            }}
            disabled={!canNext()}
          >
            Next →
          </button>
        ) : (
          <button style={S.btnPrimary} onClick={submit} disabled={!canNext()}>
            🔎 Search
          </button>
        )}
      </div>

      <div style={S.progress}>
        <div style={S.bar(step)} />
      </div>

      {/* Dropdown for origin */}
      <FloatingPanel
        containerEl={pillRef.current}
        nextBtnEl={nextBtnRef.current}
        open={step === 0 && !!oText}
      >
        <div style={S.listBox}>
          {oSuggest.map((it, i) => (
            <div
              key={`o-${it.value}-${i}`}
              style={S.item(i === oActive)}
              onMouseEnter={() => setOActive(i)}
              onClick={() => pickOrigin(it.value)}
            >
              <div style={S.itFlag}>{flagOf(it.value)}</div>
              <div>
                <div style={S.itTitle}>
                  <Highlight text={it.value} query={oText} />
                </div>
                <div style={S.itSub}>{it.subtitle}</div>
              </div>
              <div style={S.chip}>{it.chip}</div>
            </div>
          ))}
        </div>
      </FloatingPanel>

      {/* Dropdown for destination */}
      <FloatingPanel
        containerEl={pillRef.current}
        nextBtnEl={nextBtnRef.current}
        open={step === 1 && !!dText}
      >
        <div style={S.listBox}>
          {dSuggest.map((it, i) => (
            <div
              key={`d-${it.value}-${i}`}
              style={S.item(i === dActive)}
              onMouseEnter={() => setDActive(i)}
              onClick={() => pickDest(it.value)}
            >
              <div style={S.itFlag}>{flagOf(it.value)}</div>
              <div>
                <div style={S.itTitle}>
                  <Highlight text={it.value} query={dText} />
                </div>
                <div style={S.itSub}>{it.subtitle}</div>
              </div>
              <div style={S.chip}>{it.chip}</div>
            </div>
          ))}
        </div>
      </FloatingPanel>

      {/* START date calendar (auto advance on pick) */}
      <FloatingPanel
        containerEl={pillRef.current}
        nextBtnEl={nextBtnRef.current}
        open={step === 2}
      >
        <CalendarPanel
          minDate={minStart}
          selected={selectedStart || minStart}
          onPick={(d) => {
            const iso = ymd(d);
            setStart(iso);
            // ensure end respects min rule
            if (end) {
              const endD = startOfDay(new Date(end));
              if (endD <= d) setEnd(ymd(addDays(d, 1)));
            }
            setStep(3); // auto-advance
          }}
        />
      </FloatingPanel>

      {/* END date calendar (auto advance on pick) */}
      <FloatingPanel
        containerEl={pillRef.current}
        nextBtnEl={nextBtnRef.current}
        open={step === 3}
      >
        <CalendarPanel
          minDate={minEnd}
          selected={selectedEnd || minEnd}
          onPick={(d) => {
            const iso = ymd(d);
            setEnd(iso);
            setStep(4); // auto-advance
          }}
        />
      </FloatingPanel>
    </div>
  );
}

function fallbackByFirstLetter(countries, text) {
  const ch = (text || "").trim().toLowerCase()[0];
  if (!ch) return [];
  return countries
    .filter((c) => c.toLowerCase().startsWith(ch))
    .slice(0, 8)
    .map((v) => ({
      value: v,
      subtitle: `Get your visa by ${prettyIn(6)}`,
      chip: EVISA.has(v) ? "E-VISA" : "VISA",
    }));
}
