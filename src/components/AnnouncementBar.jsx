// src/components/AnnouncementBar.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import fallbackLogo from "../assets/helloviza-logo.png";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

// Try public first; fallback to admin (cookie-protected) for local/admin sessions
const ENDPOINTS = ["/api/offers/active", "/api/admin/offers/active"];

// Put scroller BELOW your fixed header (tune once)
const HEADER_OFFSET_PX = 96;

// pixels per second for marquee speed
const MARQUEE_PX_PER_SEC = 90;

/** ===========================
 *  FLASH sizing controls (edit here)
 *  =========================== */
const FLASH_TOP_GAP = 14; // space under header (smaller = closer)
const FLASH_MAX_W = 820; // 🔥 make flash smaller/bigger from here
const FLASH_VW = 92; // width in vw cap (min(FLASH_MAX_W, FLASH_VWvw))
const FLASH_AUTO_ROTATE_MS = 4500; // autoplay interval
const FLASH_MAX_ITEMS = 10; // safety cap

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function inWindow(o) {
  const n = Date.now();
  const s = o?.startAt ? new Date(o.startAt).getTime() : null;
  const e = o?.endAt ? new Date(o.endAt).getTime() : null;
  if (s && Number.isFinite(s) && n < s) return false;
  if (e && Number.isFinite(e) && n > e) return false;
  return true;
}

function normKind(v) {
  return String(v || "scroller").trim().toLowerCase();
}

function pickOfferShape(raw) {
  // Supports:
  // - NEW API: { scroller, flash, offer, offers }
  // - OLD API: { offer, offers } or { row } or offer object
  if (!raw) return { scroller: null, flash: [], offer: null, offers: [] };

  const scroller = raw?.scroller || null;
  const flash = Array.isArray(raw?.flash) ? raw.flash : [];

  if (raw?.offer || raw?.offers) {
    const offers = Array.isArray(raw.offers) ? raw.offers : [];
    return {
      scroller,
      flash,
      offer: raw.offer || offers[0] || null,
      offers,
    };
  }

  if (raw?.row) {
    return { scroller, flash, offer: raw.row, offers: [raw.row] };
  }

  return { scroller, flash, offer: raw, offers: [raw] };
}

function offerDismissKey(offer) {
  const id = offer?._id || offer?.id || "";
  const stamp = offer?.updatedAt || offer?.endAt || offer?.startAt || "";
  const sig = `${id}|${stamp}|${offer?.title || ""}|${offer?.message || ""}|${offer?.kind || ""}`;
  try {
    return `hv_offer_dismiss:${btoa(unescape(encodeURIComponent(sig))).slice(0, 64)}`;
  } catch {
    return `hv_offer_dismiss:${String(id || "x")}`;
  }
}

function pickImageUrl(offer) {
  return (
    offer?.imageUrl ||
    offer?.img ||
    offer?.image ||
    offer?.banner ||
    offer?.cover ||
    offer?.mediaUrl ||
    ""
  );
}

/* ===========================
   Marquee sub-component
=========================== */
function Marquee({ text }) {
  const viewportRef = useRef(null);
  const chunkRef = useRef(null);

  const [distancePx, setDistancePx] = useState(600);
  const [durationSec, setDurationSec] = useState(12);

  useLayoutEffect(() => {
    const measure = () => {
      const chunk = chunkRef.current;
      const viewport = viewportRef.current;
      if (!chunk || !viewport) return;

      const w = Math.max(1, Math.round(chunk.scrollWidth));
      setDistancePx(w);

      const sec = Math.max(8, Math.min(40, w / MARQUEE_PX_PER_SEC));
      setDurationSec(sec);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  return (
    <div
      ref={viewportRef}
      className="hv-marqueeViewport"
      style={{
        position: "relative",
        flex: "1 1 auto",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        className="hv-track"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 24,
          whiteSpace: "nowrap",
          willChange: "transform",
          ["--hvMarqueeDistance"]: `${distancePx}px`,
          ["--hvMarqueeDuration"]: `${durationSec}s`,
          animation: "hvMarquee var(--hvMarqueeDuration) linear infinite",
        }}
      >
        <div
          ref={chunkRef}
          className="hv-chunk"
          style={{ display: "inline-flex", gap: 18, alignItems: "center" }}
        >
          <span className="hv-msg">{text}</span>
          <span className="hv-dot">•</span>
          <span className="hv-msg">{text}</span>
          <span className="hv-dot">•</span>
          <span className="hv-msg">{text}</span>
          <span className="hv-dot">•</span>
        </div>

        <div
          className="hv-chunk"
          aria-hidden="true"
          style={{ display: "inline-flex", gap: 18, alignItems: "center" }}
        >
          <span className="hv-msg">{text}</span>
          <span className="hv-dot">•</span>
          <span className="hv-msg">{text}</span>
          <span className="hv-dot">•</span>
          <span className="hv-msg">{text}</span>
          <span className="hv-dot">•</span>
        </div>
      </div>

      <style>{`
        @keyframes hvMarquee{
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-1 * var(--hvMarqueeDistance))); }
        }
        .hv-msg{ opacity:.98; font-weight:800; letter-spacing:.01em; }
        .hv-dot{ opacity:.75; font-weight:900; }
        @media (prefers-reduced-motion: reduce){
          .hv-track{ animation:none !important; }
        }
      `}</style>
    </div>
  );
}

/* ===========================
   Flash Carousel (with swipe)
=========================== */
function FlashCarousel({ offers, isHome, onDismissOffer }) {
  const list = useMemo(() => {
    const out = (Array.isArray(offers) ? offers : [])
      .filter((o) => o && (o.isActive === undefined || !!o.isActive))
      .filter((o) => inWindow(o))
      .map((o) => ({ ...o, kind: normKind(o.kind) }))
      .filter((o) => o.kind === "flash")
      .slice(0, FLASH_MAX_ITEMS);
    return out;
  }, [offers]);

  const [idx, setIdx] = useState(0);
  const stableLen = list.length;

  useEffect(() => {
    setIdx((v) => {
      if (stableLen <= 1) return 0;
      return Math.min(v, stableLen - 1);
    });
  }, [stableLen]);

  // autoplay (but pause if user prefers reduced motion)
  useEffect(() => {
    if (stableLen <= 1) return;
    if (!isHome) return;

    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (m?.matches) return;

    const t = setInterval(() => {
      setIdx((v) => (v + 1) % stableLen);
    }, FLASH_AUTO_ROTATE_MS);

    return () => clearInterval(t);
  }, [stableLen, isHome]);

  // swipe support
  const touchRef = useRef({ x: 0, y: 0, t: 0, active: false });
  const onTouchStart = (e) => {
    const p = e.touches?.[0];
    if (!p) return;
    touchRef.current = { x: p.clientX, y: p.clientY, t: Date.now(), active: true };
  };
  const onTouchEnd = (e) => {
    if (!touchRef.current.active) return;
    touchRef.current.active = false;

    const p = e.changedTouches?.[0];
    if (!p) return;

    const dx = p.clientX - touchRef.current.x;
    const dy = p.clientY - touchRef.current.y;
    const dt = Date.now() - touchRef.current.t;

    // horizontal swipe only
    if (Math.abs(dy) > 60) return;
    if (dt > 800) return;
    if (Math.abs(dx) < 50) return;

    if (stableLen <= 1) return;
    if (dx < 0) setIdx((v) => (v + 1) % stableLen); // left → next
    else setIdx((v) => (v - 1 + stableLen) % stableLen); // right → prev
  };

  if (!isHome) return null;
  if (!stableLen) return null;

  const current = list[idx];
  const title = current?.title || "Limited Time Offer";
  const message = current?.message || "";
  const code = current?.couponCode || current?.code || "";
  const badge = current?.badge || "";
  const accent = current?.accent || "#d06549";
  const imageUrl = pickImageUrl(current);
  const hasImage = !!imageUrl;

  return (
    <div
      role="dialog"
      aria-label="Flash offer"
      style={{
        position: "fixed",
        top: HEADER_OFFSET_PX + FLASH_TOP_GAP,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 3000,
        width: `min(${FLASH_MAX_W}px, ${FLASH_VW}vw)`,
        fontFamily: baseFont,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hv-wowShell">
        <div className="hv-wowSparkle" aria-hidden="true" />

        <div className={`hv-wowCard ${hasImage ? "hasImage" : "noImage"}`}>
          {/* LEFT */}
          {hasImage ? (
            <div className="hv-wowBanner">
              <img
                src={imageUrl}
                alt={title}
                className="hv-wowImg"
                onError={(e) => {
                  e.currentTarget.src = fallbackLogo;
                  e.currentTarget.classList.add("hv-wowFallback");
                }}
              />
              <div className="hv-wowImgGloss" aria-hidden="true" />
            </div>
          ) : (
            <div className="hv-wowBanner hv-wowNoImg">
              <div className="hv-wowNoImgInner">
                <img src={fallbackLogo} alt="HelloViza" className="hv-wowNoImgLogo" />
                <div className="hv-wowNoImgText">
                  <div className="t1">HELLOVIZA</div>
                  <div className="t2">Premium visa support</div>
                </div>
              </div>
              <div className="hv-wowNoImgGlow" aria-hidden="true" />
            </div>
          )}

          {/* RIGHT */}
          <div className="hv-wowRight">
            <div className="hv-wowTop">
              <div className="hv-wowKicker">
                <span className="dot" style={{ background: accent }} />
                {badge || "Flash deal • Limited time"}
              </div>

              <button
                className="hv-wowClose"
                aria-label="Close"
                onClick={() => onDismissOffer(current)}
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="hv-wowTitle">{title}</div>
            <div className="hv-wowMsg">{message}</div>

            <div className="hv-wowRow">
              {code ? (
                <div className="hv-wowCode">
                  <span className="label">Code</span>
                  <span className="value">{code}</span>
                  <button
                    type="button"
                    className="hv-wowCopy"
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(code);
                      } catch {}
                    }}
                    title="Copy code"
                  >
                    Copy
                  </button>
                </div>
              ) : (
                <div className="hv-wowHint">
                  <span className="spark" aria-hidden="true">
                    ✦
                  </span>
                  Limited-time pricing live now
                </div>
              )}

              <div className="hv-wowPills">
                <span className="pill">Fast approval</span>
                <span className="pill">End-to-end support</span>
                <span className="pill">WhatsApp help</span>
              </div>
            </div>

            <div className="hv-wowActions">
              {current.link ? (
                <a className="hv-wowCta" href={current.link}>
                  Grab Offer <span className="arrow" aria-hidden="true">→</span>
                </a>
              ) : (
                <button className="hv-wowCta" type="button" onClick={() => onDismissOffer(current)}>
                  Got it <span className="arrow" aria-hidden="true">→</span>
                </button>
              )}

              {/* carousel controls */}
              {stableLen > 1 ? (
                <div className="hv-wowNav" aria-label="Flash carousel controls">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIdx((v) => (v - 1 + stableLen) % stableLen)}
                    aria-label="Previous"
                    title="Previous"
                  >
                    ‹
                  </button>

                  <div className="dots" role="tablist" aria-label="Slides">
                    {list.map((o, i) => (
                      <button
                        key={String(o._id || o.id || i)}
                        type="button"
                        className={`dotBtn ${i === idx ? "active" : ""}`}
                        onClick={() => setIdx(i)}
                        aria-label={`Slide ${i + 1}`}
                        title={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIdx((v) => (v + 1) % stableLen)}
                    aria-label="Next"
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              ) : (
                <div className="hv-wowSub">Secure checkout • Trusted by travelers</div>
              )}
            </div>

            {stableLen > 1 ? (
              <div className="hv-wowSwipeHint">Swipe to view more</div>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        .hv-wowShell{
          position: relative;
          border-radius: 26px;
          padding: 2px;
          overflow: hidden;
          box-shadow: 0 30px 105px rgba(0,0,0,.32);
          transform: translateZ(0);
        }

        .hv-wowShell:before{
          content:"";
          position:absolute;
          inset:-2px;
          background: conic-gradient(
            from 180deg,
            rgba(0,71,127,.95),
            rgba(208,101,73,.85),
            rgba(255,255,255,.55),
            rgba(0,71,127,.95)
          );
          animation: hvSpin 6s linear infinite;
          opacity: .95;
        }

        .hv-wowShell:after{
          content:"";
          position:absolute;
          inset: -18px;
          background: radial-gradient(circle at 25% 20%, rgba(208,101,73,.35), transparent 55%),
                      radial-gradient(circle at 80% 70%, rgba(0,71,127,.35), transparent 58%);
          filter: blur(18px);
          opacity: .9;
          pointer-events: none;
        }

        .hv-wowSparkle{
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 15% 25%, rgba(255,255,255,.35), transparent 28%),
            radial-gradient(circle at 55% 15%, rgba(255,255,255,.16), transparent 30%),
            radial-gradient(circle at 85% 45%, rgba(255,255,255,.20), transparent 32%),
            radial-gradient(circle at 70% 85%, rgba(255,255,255,.10), transparent 34%);
          opacity: .55;
          pointer-events:none;
        }

        .hv-wowCard{
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,.94), rgba(255,255,255,.78));
          border: 1px solid rgba(255,255,255,.52);
          backdrop-filter: blur(14px) saturate(1.35);
          -webkit-backdrop-filter: blur(14px) saturate(1.35);
          display: grid;
          gap: 16px;
          padding: 14px;
        }
        .hv-wowCard.hasImage{
          grid-template-columns: clamp(210px, 34vw, 280px) 1fr;
        }
        .hv-wowCard.noImage{
          grid-template-columns: 240px 1fr;
        }

        .hv-wowBanner{
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5; /* ✅ 1080x1350 */
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 22px 58px rgba(0,0,0,.20);
          border: 1px solid rgba(0,0,0,.06);
          background: rgba(255,255,255,.88);
          transform: translateZ(0);
        }

        .hv-wowImg{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
          transform: scale(1.02);
          transition: transform .55s ease;
        }
        .hv-wowShell:hover .hv-wowImg{ transform: scale(1.06); }

        .hv-wowImgGloss{
          position:absolute;
          inset:-40% -30%;
          background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,.34) 45%, transparent 55%);
          transform: rotate(12deg);
          animation: hvShine 3.2s ease-in-out infinite;
          pointer-events:none;
          mix-blend-mode: soft-light;
        }

        .hv-wowImg.hv-wowFallback{
          object-fit: contain;
          padding: 16px;
          background: #fff;
          transform: none;
        }

        /* no-image banner */
        .hv-wowNoImg{
          background: radial-gradient(circle at 25% 20%, rgba(208,101,73,.26), transparent 52%),
                      radial-gradient(circle at 80% 80%, rgba(0,71,127,.26), transparent 55%),
                      linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,255,255,.75));
        }
        .hv-wowNoImgInner{
          position:absolute;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-direction:column;
          gap: 10px;
          padding: 16px;
          text-align:center;
        }
        .hv-wowNoImgLogo{
          width: 64px;
          height: 64px;
          object-fit: contain;
          filter: drop-shadow(0 18px 30px rgba(0,0,0,.12));
        }
        .hv-wowNoImgText .t1{
          font-weight: 1100;
          letter-spacing: .08em;
          color: rgba(0,32,64,.92);
          font-size: 16px;
        }
        .hv-wowNoImgText .t2{
          margin-top: 2px;
          font-weight: 900;
          color: rgba(0,32,64,.70);
          font-size: 14px;
        }
        .hv-wowNoImgGlow{
          position:absolute;
          inset:-20%;
          background: radial-gradient(circle at 55% 45%, rgba(208,101,73,.22), transparent 55%);
          filter: blur(18px);
          opacity: .8;
          pointer-events:none;
        }

        .hv-wowRight{
          min-width: 0;
          padding: 6px 8px 10px;
          display:flex;
          flex-direction: column;
          justify-content: center;
        }

        .hv-wowTop{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
        }

        .hv-wowKicker{
          display:inline-flex;
          align-items:center;
          gap: 10px;
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(0,71,127,.10);
          border: 1px solid rgba(0,71,127,.18);
          color: rgba(0,32,64,.88);
          font-weight: 1000;
          letter-spacing: .02em;
          width: fit-content;
        }
        .hv-wowKicker .dot{
          width: 10px; height: 10px; border-radius: 999px;
          box-shadow: 0 0 0 6px rgba(208,101,73,.10);
        }

        .hv-wowClose{
          border:none;
          cursor:pointer;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          font-size: 26px;
          font-weight: 1000;
          color: #0c2a3b;
          background: rgba(255,255,255,.65);
          border: 1px solid rgba(0,0,0,.06);
          box-shadow: 0 18px 40px rgba(0,0,0,.14);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .hv-wowClose:hover{ transform: translateY(-1px); box-shadow: 0 22px 50px rgba(0,0,0,.18); }

        .hv-wowTitle{
          margin-top: 12px;
          font-weight: 1150;
          color: #003a67;
          font-size: clamp(24px, 2.4vw, 38px);
          letter-spacing: .02em;
          line-height: 1.06;
          text-shadow: 0 12px 30px rgba(0,0,0,.06);
        }

        .hv-wowMsg{
          margin-top: 8px;
          color: rgba(12,42,59,.92);
          font-weight: 850;
          font-size: clamp(15px, 1.45vw, 19px);
          line-height: 1.25;
        }

        .hv-wowRow{
          margin-top: 14px;
          display:flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
        }

        .hv-wowCode{
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 14px;
          background: rgba(208,101,73,.10);
          border: 1px solid rgba(208,101,73,.25);
          box-shadow: 0 18px 45px rgba(208,101,73,.12);
          max-width: 100%;
        }
        .hv-wowCode .label{
          font-weight: 1000;
          color: rgba(0,32,64,.75);
        }
        .hv-wowCode .value{
          font-weight: 1100;
          color: #0b2a4a;
          letter-spacing: .08em;
          padding: 6px 9px;
          background: rgba(255,255,255,.7);
          border: 1px dashed rgba(0,0,0,.12);
          border-radius: 12px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .hv-wowCopy{
          border:none;
          cursor:pointer;
          font-weight: 1000;
          color: #fff;
          background: linear-gradient(135deg, #d06549, #b94d37);
          padding: 9px 11px;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(208,101,73,.25);
        }

        .hv-wowHint{
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 14px;
          background: rgba(0,71,127,.09);
          border: 1px solid rgba(0,71,127,.18);
          color: rgba(0,32,64,.86);
          font-weight: 1000;
        }
        .hv-wowHint .spark{
          color: #d06549;
          filter: drop-shadow(0 10px 20px rgba(208,101,73,.30));
        }

        .hv-wowPills{ display:flex; gap: 8px; flex-wrap: wrap; justify-content:flex-end; }
        .hv-wowPills .pill{
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.70);
          border: 1px solid rgba(0,0,0,.07);
          color: rgba(0,32,64,.86);
          font-weight: 950;
          font-size: 13px;
          box-shadow: 0 14px 30px rgba(0,0,0,.06);
          white-space: nowrap;
        }

        .hv-wowActions{
          margin-top: 16px;
          display:flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .hv-wowCta{
          display:inline-flex;
          align-items:center;
          gap: 10px;
          padding: 11px 15px;
          border-radius: 14px;
          font-weight: 1100;
          color: #fff;
          text-decoration:none;
          background: linear-gradient(135deg, #0b2a4a, #00477f);
          box-shadow: 0 22px 60px rgba(0,71,127,.25);
          border: 1px solid rgba(255,255,255,.18);
          cursor: pointer;
        }
        .hv-wowCta .arrow{ font-size: 18px; transform: translateY(-1px); }

        .hv-wowNav{
          display:flex;
          align-items:center;
          gap: 10px;
          margin-left: auto;
        }
        .hv-wowNav .btn{
          width: 40px;
          height: 40px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,.06);
          background: rgba(255,255,255,.72);
          font-size: 22px;
          font-weight: 1000;
          cursor: pointer;
          box-shadow: 0 16px 40px rgba(0,0,0,.10);
        }
        .hv-wowNav .dots{
          display:flex;
          align-items:center;
          gap: 7px;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.56);
          border: 1px solid rgba(0,0,0,.06);
        }
        .hv-wowNav .dotBtn{
          width: 10px;
          height: 10px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          background: rgba(0,0,0,.22);
        }
        .hv-wowNav .dotBtn.active{
          background: rgba(0,71,127,.92);
          transform: scale(1.15);
        }

        .hv-wowSub{
          color: rgba(0,32,64,.62);
          font-weight: 900;
          margin-left: auto;
        }

        .hv-wowSwipeHint{
          margin-top: 10px;
          color: rgba(0,32,64,.55);
          font-weight: 900;
          font-size: 14px;
          opacity: .9;
        }

        @keyframes hvSpin{
          from{ transform: rotate(0deg); }
          to{ transform: rotate(360deg); }
        }
        @keyframes hvShine{
          0%{ transform: translateX(-40%) rotate(12deg); opacity:.0; }
          25%{ opacity:.32; }
          55%{ opacity:.0; }
          100%{ transform: translateX(40%) rotate(12deg); opacity:.0; }
        }

        @media (max-width: 860px){
          .hv-wowCard{ grid-template-columns: 1fr !important; }
          .hv-wowPills{ justify-content:flex-start; }
          .hv-wowRight{ padding: 6px 6px 10px; }
          .hv-wowSub{ margin-left: 0; }
        }
        @media (prefers-reduced-motion: reduce){
          .hv-wowShell:before{ animation:none !important; }
          .hv-wowImgGloss{ animation:none !important; }
        }
      `}</style>
    </div>
  );
}

export default function AnnouncementBar() {
  const location = useLocation();

  const [singletonAllowed, setSingletonAllowed] = useState(true);

  // unified state (supports NEW + OLD responses)
  const [data, setData] = useState({
    scroller: null,
    flash: [],
    offer: null,
    offers: [],
  });

  const isHome = useMemo(() => location?.pathname === "/", [location?.pathname]);

  // all offers (legacy + new)
  const allOffers = useMemo(() => {
    const legacyOffers = Array.isArray(data?.offers) ? data.offers : [];
    const flash = Array.isArray(data?.flash) ? data.flash : [];
    const sc = data?.scroller ? [data.scroller] : [];
    const merged = [...sc, ...flash, ...legacyOffers];
    if (!merged.length && data?.offer) return [data.offer];
    return merged;
  }, [data]);

  const [dismissedKeys, setDismissedKeys] = useState(() => new Set());

  useEffect(() => {
    const w = window;
    if (w.__HV_ANNOUNCEMENT_BAR_SINGLETON__) {
      setSingletonAllowed(false);
      return;
    }
    w.__HV_ANNOUNCEMENT_BAR_SINGLETON__ = true;
    setSingletonAllowed(true);

    return () => {
      try {
        delete w.__HV_ANNOUNCEMENT_BAR_SINGLETON__;
      } catch {}
    };
  }, []);

  useEffect(() => {
    // load dismiss set (best-effort)
    try {
      const known = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const k = localStorage.key(i);
        if (k && k.startsWith("hv_offer_dismiss:")) known.push(k);
      }
      setDismissedKeys(new Set(known));
    } catch {}
  }, []);

  useEffect(() => {
    let abort = false;

    async function load() {
      for (const url of ENDPOINTS) {
        try {
          const res = await fetch(url, { credentials: "include" });
          if (abort) return;
          if (!res.ok) continue;

          const raw = await res.json();
          const picked = pickOfferShape(raw);

          const anyMessage =
            (picked?.scroller && picked.scroller.message) ||
            (Array.isArray(picked?.flash) && picked.flash.some((x) => x && x.message)) ||
            (picked?.offer && picked.offer.message) ||
            (Array.isArray(picked?.offers) && picked.offers.some((x) => x && x.message));

          if (anyMessage) {
            setData(picked);
            return;
          }
        } catch {}
      }

      // localStorage fallback (dev only)
      try {
        const raw = localStorage.getItem("hv_offers");
        const arr = safeJsonParse(raw) || [];
        const active = (arr || []).filter((o) => o && o.message && inWindow(o));
        if (!abort && active.length) {
          setData({
            scroller: active.find((o) => normKind(o.kind) === "scroller") || null,
            flash: active.filter((o) => normKind(o.kind) === "flash"),
            offer: active[0],
            offers: active,
          });
        }
      } catch {}
    }

    load();
    return () => {
      abort = true;
    };
  }, []);

  const dismissOffer = (offer) => {
    try {
      const key = offerDismissKey(offer);
      localStorage.setItem(key, String(Date.now()));
      setDismissedKeys((prev) => {
        const n = new Set(prev);
        n.add(key);
        return n;
      });
    } catch {}
  };

  // choose scroller: prefer NEW data.scroller; else from offers list
  const scrollerOffer = useMemo(() => {
    const base = data?.scroller;
    if (base && base.message && (base.isActive === undefined || !!base.isActive) && inWindow(base)) return base;

    const offers = (Array.isArray(allOffers) ? allOffers : [])
      .filter((o) => o && (o.isActive === undefined || !!o.isActive))
      .filter((o) => inWindow(o))
      .filter((o) => normKind(o.kind) === "scroller")
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime()
      );

    return offers[0] || null;
  }, [allOffers, data?.scroller]);

  // flash list: prefer NEW data.flash; else from offers list
  const flashOffers = useMemo(() => {
    const base = Array.isArray(data?.flash) ? data.flash : [];
    const merged = base.length
      ? base
      : (Array.isArray(allOffers) ? allOffers : []).filter((o) => normKind(o?.kind) === "flash");
    return merged
      .filter((o) => o && (o.isActive === undefined || !!o.isActive))
      .filter((o) => inWindow(o))
      .filter((o) => !dismissedKeys.has(offerDismissKey(o)))
      .slice(0, FLASH_MAX_ITEMS);
  }, [allOffers, data?.flash, dismissedKeys]);

  if (!singletonAllowed) return null;

  const anyFlashShowing = flashOffers.length > 0;
  const scrollerDismissed = !scrollerOffer || dismissedKeys.has(offerDismissKey(scrollerOffer));

  return (
    <>
      {/* FlashCarousel (home-only inside component) */}
      <FlashCarousel offers={flashOffers} isHome={isHome} onDismissOffer={dismissOffer} />

      {/* SCROLLER (all pages) */}
      {!scrollerDismissed ? (
        <div
          role="region"
          aria-label="Announcement"
          style={{
            position: "fixed",
            top: HEADER_OFFSET_PX,
            left: 0,
            right: 0,
            zIndex: 1201,
            fontFamily: baseFont,
            // if flash is open on home, keep scroller a little below for neatness
            marginTop: anyFlashShowing && isHome ? 8 : 0,
          }}
        >
          <div
            style={{
              width: "min(1180px, 92vw)",
              margin: "0 auto",
              borderRadius: 999,
              overflow: "hidden",
              boxShadow: "0 18px 42px rgba(0,0,0,.14)",
              border: "1px solid rgba(255,255,255,.35)",
              background:
                "linear-gradient(135deg, rgba(0,71,127,.92), rgba(0,71,127,.78)), linear-gradient(135deg, rgba(208,101,73,.25), rgba(255,255,255,0))",
              backdropFilter: "blur(10px) saturate(1.12)",
              WebkitBackdropFilter: "blur(10px) saturate(1.12)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(208,101,73,.18)",
                  border: "1px solid rgba(208,101,73,.35)",
                  color: "#fff",
                  fontWeight: 900,
                  letterSpacing: ".02em",
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: scrollerOffer?.accent || "#d06549",
                    boxShadow: "0 0 0 4px rgba(208,101,73,.12)",
                  }}
                />
                {scrollerOffer?.title || "Limited Time Offer"}
              </div>

              <Marquee text={scrollerOffer?.message || ""} />

              {scrollerOffer?.link ? (
                <a
                  href={scrollerOffer.link}
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.10)",
                    border: "1px solid rgba(255,255,255,.22)",
                    whiteSpace: "nowrap",
                    flex: "0 0 auto",
                  }}
                >
                  Learn more →
                </a>
              ) : null}

              <button
                aria-label="Close announcement"
                onClick={() => dismissOffer(scrollerOffer)}
                style={{
                  border: "none",
                  background: "rgba(255,255,255,.12)",
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 900,
                  cursor: "pointer",
                  flex: "0 0 auto",
                  lineHeight: 1,
                }}
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @media (max-width: 720px){
          a[href]{ display:none; }
        }
      `}</style>
    </>
  );
}
