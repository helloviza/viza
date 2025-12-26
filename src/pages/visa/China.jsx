// src/pages/visa/China.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function ChinaVisa() {
  const [selected, setSelected] = useState("Tourist");

  // Wizard state
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [caseId, setCaseId] = useState("");

  const [lead, setLead] = useState({ email: "", phone: "", consent: false });
  const [docs, setDocs] = useState({ passport: null, photo: null, supporting: [] });

  const [extract, setExtract] = useState(null);
  const [review, setReview] = useState({
    passportNumber: "",
    surname: "",
    givenNames: "",
    nationality: "",
    dateOfBirth: "",
    sex: "",
    expiryDate: "",
    // add china-specific fields next:
    occupation: "",
    employer: "",
    travelStart: "",
    travelEnd: "",
  });

  const pricing = useMemo(
    () => [
      {
        key: "Tourist",
        name: "Tourist Visa (Sticker)",
        price: "₹ 0 (set your price)",
        eta: "7–15 working days",
        badge: "Most Popular",
        perks: ["Manual application", "Document submission required", "Biometrics/appointment may apply"],
      },
      {
        key: "Business",
        name: "Business Visa (Sticker)",
        price: "₹ 0 (set your price)",
        eta: "7–15 working days",
        badge: "For Work Trips",
        perks: ["Invitation letter may be required", "Manual application", "Priority handling optional"],
      },
    ],
    []
  );

  const selectedPlan = useMemo(() => pricing.find((p) => p.key === selected) || pricing[0], [pricing, selected]);

  const styles = useMemo(
    () => ({
      page: {
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(0,71,127,.18), rgba(255,255,255,0) 60%), radial-gradient(900px 520px at 90% 10%, rgba(208,101,73,.16), rgba(255,255,255,0) 55%), linear-gradient(180deg, #f8fafc 0%, #ffffff 60%, #f8fafc 100%)",
      },
      container: { maxWidth: 1120, margin: "0 auto", padding: "26px 16px 40px" },

      topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 },
      crumbs: { display: "flex", gap: 8, alignItems: "center", color: "#64748b", fontSize: 13 },
      dot: { width: 5, height: 5, borderRadius: 999, background: "rgba(100,116,139,.6)" },

      backBtn: {
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,.9)",
        border: "1px solid rgba(2,6,23,.10)",
        color: "#0b2a4a",
        fontWeight: 800,
        letterSpacing: 0.2,
        boxShadow: "0 10px 30px rgba(2,6,23,.06)",
        whiteSpace: "nowrap",
      },

      hero: {
        marginTop: 14,
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid rgba(2,6,23,.10)",
        background:
          "linear-gradient(135deg, rgba(0,71,127,.96) 0%, rgba(0,71,127,.78) 45%, rgba(208,101,73,.75) 100%)",
        boxShadow: "0 24px 60px rgba(2,6,23,.18)",
        position: "relative",
      },
      heroInner: {
        padding: "26px 18px",
        display: "grid",
        gridTemplateColumns: "1.45fr .85fr",
        gap: 16,
        alignItems: "stretch",
      },
      heroTitle: { margin: 0, fontSize: 36, color: "#fff", letterSpacing: 0.2, lineHeight: 1.1 },
      heroSub: { margin: "10px 0 0", color: "rgba(255,255,255,.92)", lineHeight: 1.55, maxWidth: 720 },

      ctaPrimary: {
        border: 0,
        borderRadius: 14,
        padding: "12px 14px",
        background: "#ffffff",
        color: "#0b2a4a",
        fontWeight: 900,
        cursor: "pointer",
        width: "100%",
        letterSpacing: 0.2,
        boxShadow: "0 14px 34px rgba(2,6,23,.20)",
      },

      sectionTitleRow: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 22,
        marginBottom: 10,
      },
      h2: { margin: 0, fontSize: 20, letterSpacing: 0.2, color: "#0f172a" },
      subText: { margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.4 },

      grid: {
        display: "grid",
        gridTemplateColumns: "1.05fr .95fr",
        gap: 14,
        alignItems: "start",
      },

      card: {
        borderRadius: 18,
        background: "rgba(255,255,255,.92)",
        border: "1px solid rgba(2,6,23,.08)",
        boxShadow: "0 16px 45px rgba(2,6,23,.08)",
        overflow: "hidden",
      },

      planTabs: {
        display: "flex",
        gap: 10,
        padding: 12,
        background: "linear-gradient(180deg, rgba(248,250,252,.9), rgba(255,255,255,.92))",
        borderBottom: "1px solid rgba(2,6,23,.06)",
      },
      tabBtn: (active) => ({
        flex: 1,
        border: "1px solid rgba(2,6,23,.10)",
        borderRadius: 14,
        padding: "10px 12px",
        background: active ? "#00477f" : "#ffffff",
        color: active ? "#fff" : "#0f172a",
        cursor: "pointer",
        fontWeight: 900,
        letterSpacing: 0.2,
        boxShadow: active ? "0 14px 34px rgba(0,71,127,.18)" : "none",
      }),

      planBody: { padding: 16 },
      planBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 999,
        background: "rgba(208,101,73,.12)",
        border: "1px solid rgba(208,101,73,.25)",
        color: "#9a3412",
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: 0.3,
      },
      planName: { marginTop: 10, marginBottom: 0, fontSize: 18, fontWeight: 900, color: "#0f172a" },
      priceRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginTop: 10 },
      price: { fontSize: 30, fontWeight: 1000, color: "#d06549", letterSpacing: 0.2 },
      eta: { color: "#475569", fontWeight: 700, fontSize: 13 },

      list: { marginTop: 12, paddingLeft: 18, color: "#334155", lineHeight: 1.7 },

      // Modal
      overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,.55)",
        zIndex: 99999,
        display: "grid",
        placeItems: "center",
        padding: 12,
      },
      modal: {
        width: "min(920px, 100%)",
        borderRadius: 22,
        background: "rgba(255,255,255,.96)",
        border: "1px solid rgba(2,6,23,.10)",
        boxShadow: "0 30px 90px rgba(2,6,23,.40)",
        overflow: "hidden",
      },
      modalHead: {
        padding: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        borderBottom: "1px solid rgba(2,6,23,.08)",
        background: "linear-gradient(180deg, rgba(248,250,252,.9), rgba(255,255,255,.96))",
      },
      modalTitle: { fontWeight: 1000, color: "#0f172a", letterSpacing: 0.2 },
      closeBtn: {
        border: "1px solid rgba(2,6,23,.12)",
        background: "#fff",
        borderRadius: 12,
        padding: "8px 10px",
        cursor: "pointer",
        fontWeight: 900,
      },
      modalBody: { padding: 14 },
      row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
      input: {
        width: "100%",
        padding: "12px 12px",
        borderRadius: 14,
        border: "1px solid rgba(2,6,23,.12)",
        outline: "none",
        fontSize: 14,
      },
      label: { fontSize: 12, color: "#64748b", fontWeight: 800, marginBottom: 6 },
      hint: { fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.5 },

      footer: {
        padding: 14,
        borderTop: "1px solid rgba(2,6,23,.08)",
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        background: "rgba(248,250,252,.7)",
      },
      btn: (kind) => ({
        border: kind === "primary" ? 0 : "1px solid rgba(2,6,23,.12)",
        background: kind === "primary" ? "#00477f" : "#fff",
        color: kind === "primary" ? "#fff" : "#0f172a",
        borderRadius: 14,
        padding: "12px 14px",
        fontWeight: 900,
        cursor: "pointer",
        minWidth: 140,
        opacity: busy ? 0.7 : 1,
      }),
      err: {
        marginTop: 10,
        padding: 10,
        borderRadius: 14,
        background: "rgba(220,38,38,.08)",
        border: "1px solid rgba(220,38,38,.25)",
        color: "#7f1d1d",
        fontSize: 13,
        lineHeight: 1.45,
      },

      responsive: `
        @media (max-width: 900px) {
          .hz-hero-inner { grid-template-columns: 1fr !important; }
          .hz-grid { grid-template-columns: 1fr !important; }
          .hz-row { grid-template-columns: 1fr !important; }
        }
      `,
    }),
    [busy]
  );

  async function postJson(url, body) {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j?.ok === false) throw new Error(j?.error || j?.message || `Request failed (${r.status})`);
    return j;
  }

  async function startCase() {
    setErr("");
    setBusy(true);
    try {
      const j = await postJson("/api/manual-visa/cases", {
        country: "china",
        visaType: selectedPlan.key,
        email: lead.email,
        phone: lead.phone,
        consent: lead.consent,
      });
      setCaseId(j.id);
      setStep(2);
    } catch (e) {
      setErr(e?.message || "Failed to start case");
    } finally {
      setBusy(false);
    }
  }

  async function uploadDocs() {
    if (!caseId) return setErr("Case not created yet.");
    if (!docs.passport) return setErr("Please upload passport bio page image first.");
    setErr("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("passport", docs.passport);
      if (docs.photo) fd.append("photo", docs.photo);
      (docs.supporting || []).forEach((f) => fd.append("supporting", f));

      const r = await fetch(`/api/manual-visa/cases/${caseId}/upload`, { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j?.ok === false) throw new Error(j?.error || `Upload failed (${r.status})`);

      setStep(3);
    } catch (e) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function extractPassport() {
    if (!caseId) return setErr("Case not created yet.");
    setErr("");
    setBusy(true);
    try {
      const r = await fetch(`/api/manual-visa/cases/${caseId}/extract-passport`, { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j?.ok === false) throw new Error(j?.error || `Extract failed (${r.status})`);

      setExtract(j.passportExtract);
      const f = j.passportExtract?.fields || {};
      setReview((prev) => ({
        ...prev,
        passportNumber: f.passportNumber || "",
        surname: f.surname || "",
        givenNames: f.givenNames || "",
        nationality: f.nationality || "",
        dateOfBirth: f.dateOfBirth || "",
        sex: f.sex || "",
        expiryDate: f.expiryDate || "",
      }));

      setStep(4);
    } catch (e) {
      setErr(e?.message || "Extraction failed");
    } finally {
      setBusy(false);
    }
  }

  async function submitCase() {
    if (!caseId) return setErr("Case not created yet.");
    setErr("");
    setBusy(true);
    try {
      const j = await postJson(`/api/manual-visa/cases/${caseId}/submit`, {
        country: "china",
        visaType: selectedPlan.key,
        passportExtract: extract || null,
        applicant: {
          passportNumber: review.passportNumber,
          surname: review.surname,
          givenNames: review.givenNames,
          nationality: review.nationality,
          dateOfBirth: review.dateOfBirth,
          sex: review.sex,
          expiryDate: review.expiryDate,
          email: lead.email,
          phone: lead.phone,
        },
        china: {
          occupation: review.occupation,
          employer: review.employer,
          travelStart: review.travelStart,
          travelEnd: review.travelEnd,
        },
      });
      setStep(5);
    } catch (e) {
      setErr(e?.message || "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  function openWizard() {
    setErr("");
    setCaseId("");
    setExtract(null);
    setReview({
      passportNumber: "",
      surname: "",
      givenNames: "",
      nationality: "",
      dateOfBirth: "",
      sex: "",
      expiryDate: "",
      occupation: "",
      employer: "",
      travelStart: "",
      travelEnd: "",
    });
    setDocs({ passport: null, photo: null, supporting: [] });
    setLead({ email: "", phone: "", consent: false });
    setStep(1);
    setOpen(true);
  }

  return (
    <div style={styles.page}>
      <style>{styles.responsive}</style>

      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={styles.crumbs}>
            <span style={{ fontWeight: 800, color: "#0b2a4a" }}>Helloviza</span>
            <span style={styles.dot} />
            <span>Manual Visa</span>
            <span style={styles.dot} />
            <span style={{ color: "#0f172a", fontWeight: 800 }}>China</span>
          </div>

          <Link to="/" style={styles.backBtn} aria-label="Back to home">
            ← Back
          </Link>
        </div>

        <section style={styles.hero}>
          <div className="hz-hero-inner" style={styles.heroInner}>
            <div>
              <h1 style={styles.heroTitle}>
                China Visa
                <span style={{ display: "block", fontSize: 18, fontWeight: 800, marginTop: 10, color: "rgba(255,255,255,.92)" }}>
                  Manual / Sticker Application
                </span>
              </h1>

              <p style={styles.heroSub}>
                Upload your documents once — we’ll auto-read your passport (MRZ), pre-fill the form, and your team can
                manually file the application with maximum accuracy. You always get a review step before submission.
              </p>
            </div>

            <div style={{ borderRadius: 18, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)", padding: 16 }}>
              <div style={{ color: "rgba(255,255,255,.95)", fontWeight: 900 }}>Quick Start</div>
              <div style={{ color: "rgba(255,255,255,.90)", marginTop: 8, lineHeight: 1.5, fontSize: 13 }}>
                Pick visa type and start. Passport extraction works best with a clear JPG/PNG photo.
              </div>
              <button type="button" style={{ ...styles.ctaPrimary, marginTop: 14 }} onClick={openWizard}>
                Start Application
              </button>
            </div>
          </div>
        </section>

        <div style={styles.sectionTitleRow}>
          <div>
            <h2 style={styles.h2}>Choose your visa type</h2>
            <p style={styles.subText}>We’ll start with China and reuse the exact engine for other manual visa countries.</p>
          </div>
          <p style={styles.subText}>Route: <b>/visa/china</b></p>
        </div>

        <div className="hz-grid" style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.planTabs}>
              {pricing.map((p) => (
                <button key={p.key} type="button" style={styles.tabBtn(p.key === selected)} onClick={() => setSelected(p.key)}>
                  {p.key}
                </button>
              ))}
            </div>

            <div style={styles.planBody}>
              <span style={styles.planBadge}>{selectedPlan.badge}</span>
              <h3 style={styles.planName}>{selectedPlan.name}</h3>

              <div style={styles.priceRow}>
                <div style={styles.price}>{selectedPlan.price}</div>
                <div style={styles.eta}>
                  Processing <span style={{ opacity: 0.7 }}>•</span> <span>{selectedPlan.eta}</span>
                </div>
              </div>

              <ul style={styles.list}>
                {selectedPlan.perks.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>

              <button type="button" style={{ ...styles.ctaPrimary, marginTop: 14 }} onClick={openWizard}>
                Start {selectedPlan.key} Application
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ padding: 14, borderBottom: "1px solid rgba(2,6,23,.06)" }}>
              <div style={{ fontWeight: 1000, color: "#0f172a" }}>How it works</div>
              <div style={{ marginTop: 6, color: "#64748b", fontSize: 13, lineHeight: 1.45 }}>
                Upload → Extract passport MRZ → Review → Submit (manual filing by team).
              </div>
            </div>
            <div style={{ padding: 14, color: "#334155", lineHeight: 1.7 }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li><b>Passport photo</b> should be clear, flat, no glare, MRZ visible.</li>
                <li>We validate MRZ and auto-fill the form. You can edit before submitting.</li>
                <li>All files remain under <b>/uploads</b> (your server) for MVP.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal wizard */}
      {open && (
        <div style={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHead}>
              <div style={styles.modalTitle}>
                China Manual Visa • {selectedPlan.key} • Step {step}/5 {caseId ? `• Case: ${caseId}` : ""}
              </div>
              <button type="button" style={styles.closeBtn} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              {step === 1 && (
                <>
                  <div className="hz-row" style={styles.row}>
                    <div>
                      <div style={styles.label}>Email</div>
                      <input
                        style={styles.input}
                        value={lead.email}
                        onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <div style={styles.label}>Phone</div>
                      <input
                        style={styles.input}
                        value={lead.phone}
                        onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+91..."
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={lead.consent}
                        onChange={(e) => setLead((p) => ({ ...p, consent: e.target.checked }))}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>
                        I authorize Helloviza to process my uploaded documents to auto-fill the China visa form (I will review before submission).
                      </div>
                    </label>
                    <div style={styles.hint}>
                      Next we create a case and generate a file folder under <b>/uploads/manual-visa/china/&lt;caseId&gt;</b>.
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="hz-row" style={styles.row}>
                    <div>
                      <div style={styles.label}>Passport bio page (JPG/PNG) *</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDocs((p) => ({ ...p, passport: e.target.files?.[0] || null }))}
                      />
                      <div style={styles.hint}>MVP supports image extraction only (not PDF) for best MRZ reliability.</div>
                    </div>

                    <div>
                      <div style={styles.label}>Photo (optional)</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDocs((p) => ({ ...p, photo: e.target.files?.[0] || null }))}
                      />
                      <div style={styles.hint}>You can add supporting docs next.</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={styles.label}>Supporting documents (optional)</div>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setDocs((p) => ({ ...p, supporting: Array.from(e.target.files || []) }))}
                    />
                    <div style={styles.hint}>Hotel/itinerary/invite letter etc. Upload what you have.</div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div style={{ color: "#0f172a", fontWeight: 900 }}>Ready to extract passport fields</div>
                  <div style={styles.hint}>
                    Click <b>Extract</b> to read the MRZ lines and auto-fill the key fields (passport no, name, DOB, expiry).
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div style={{ color: "#0f172a", fontWeight: 1000 }}>Review & confirm extracted details</div>
                  <div className="hz-row" style={{ ...styles.row, marginTop: 12 }}>
                    {[
                      ["passportNumber", "Passport Number"],
                      ["surname", "Surname"],
                      ["givenNames", "Given Names"],
                      ["nationality", "Nationality"],
                      ["dateOfBirth", "Date of Birth (YYMMDD / parsed format)"],
                      ["sex", "Sex"],
                      ["expiryDate", "Expiry Date (YYMMDD / parsed format)"],
                    ].map(([k, label]) => (
                      <div key={k}>
                        <div style={styles.label}>{label}</div>
                        <input
                          style={styles.input}
                          value={review[k]}
                          onChange={(e) => setReview((p) => ({ ...p, [k]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "rgba(0,71,127,.06)", border: "1px solid rgba(0,71,127,.12)" }}>
                    <div style={{ fontWeight: 900, color: "#0b2a4a" }}>China details (MVP)</div>
                    <div className="hz-row" style={{ ...styles.row, marginTop: 10 }}>
                      <div>
                        <div style={styles.label}>Occupation</div>
                        <input style={styles.input} value={review.occupation} onChange={(e) => setReview((p) => ({ ...p, occupation: e.target.value }))} />
                      </div>
                      <div>
                        <div style={styles.label}>Employer</div>
                        <input style={styles.input} value={review.employer} onChange={(e) => setReview((p) => ({ ...p, employer: e.target.value }))} />
                      </div>
                      <div>
                        <div style={styles.label}>Travel Start</div>
                        <input style={styles.input} value={review.travelStart} onChange={(e) => setReview((p) => ({ ...p, travelStart: e.target.value }))} placeholder="YYYY-MM-DD" />
                      </div>
                      <div>
                        <div style={styles.label}>Travel End</div>
                        <input style={styles.input} value={review.travelEnd} onChange={(e) => setReview((p) => ({ ...p, travelEnd: e.target.value }))} placeholder="YYYY-MM-DD" />
                      </div>
                    </div>
                  </div>

                  {!!extract && (
                    <div style={styles.hint}>
                      MRZ Valid: <b>{String(extract.valid)}</b> • MRZ Lines: <code>{(extract.mrzLines || []).join(" / ")}</code>
                    </div>
                  )}
                </>
              )}

              {step === 5 && (
                <>
                  <div style={{ fontWeight: 1000, color: "#0f172a", fontSize: 18 }}>Submitted ✅</div>
                  <div style={styles.hint}>
                    Your China manual visa case is saved. Next we’ll add: checklist, payment, admin view, status tracking & WhatsApp/email updates.
                  </div>
                  <div style={{ marginTop: 10, padding: 12, borderRadius: 14, background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.22)", color: "#065f46" }}>
                    Case ID: <b>{caseId}</b>
                  </div>
                </>
              )}

              {err && <div style={styles.err}>{err}</div>}
            </div>

            <div style={styles.footer}>
              <button
                type="button"
                style={styles.btn("ghost")}
                onClick={() => {
                  setErr("");
                  if (step > 1) setStep((s) => s - 1);
                }}
                disabled={busy || step === 1 || step === 5}
              >
                Back
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                {step === 1 && (
                  <button type="button" style={styles.btn("primary")} onClick={startCase} disabled={busy}>
                    Create Case
                  </button>
                )}

                {step === 2 && (
                  <button type="button" style={styles.btn("primary")} onClick={uploadDocs} disabled={busy}>
                    Upload Docs
                  </button>
                )}

                {step === 3 && (
                  <>
                    <button type="button" style={styles.btn("ghost")} onClick={() => setStep(4)} disabled={busy}>
                      Skip Extract
                    </button>
                    <button type="button" style={styles.btn("primary")} onClick={extractPassport} disabled={busy}>
                      Extract
                    </button>
                  </>
                )}

                {step === 4 && (
                  <button type="button" style={styles.btn("primary")} onClick={submitCase} disabled={busy}>
                    Submit
                  </button>
                )}

                {step === 5 && (
                  <button type="button" style={styles.btn("primary")} onClick={() => setOpen(false)}>
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
