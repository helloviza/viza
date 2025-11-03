// helloviza/client/src/pages/account/MyProfile.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaFlag,
  FaPassport,
  FaIdCard,
  FaShieldAlt,
  FaUserFriends,
} from "react-icons/fa";
import AccountSidebar from "../../components/account/Sidebar";
import { api, API } from "../../utils/api";

const baseFont = "'Barlow Condensed', Arial, sans-serif";

/* -----------------------------------------
   Small input components
------------------------------------------ */
const InputField = React.memo(({ label, icon: Icon, ...props }) => (
  <label style={styles.inputLabel}>
    {Icon && <Icon style={styles.icon} />}
    <span style={styles.labelText}>{label}</span>
    <input style={styles.input} {...props} />
  </label>
));

const SelectField = React.memo(({ label, options, icon: Icon, ...props }) => (
  <label style={styles.inputLabel}>
    {Icon && <Icon style={styles.icon} />}
    <span style={styles.labelText}>{label}</span>
    <select style={styles.input} {...props}>
      <option value="">{`Select ${label.toLowerCase()}`}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
));

/* -----------------------------------------
   Helpers
------------------------------------------ */
function coalesceProfileShape(data) {
  // Accept shapes: {profile}, {user}, or flat
  const root = data || {};
  const u = root.profile || root.user || root;

  return {
    firstName: u.firstName || u.given_name || "",
    lastName: u.lastName || u.family_name || "",
    email: root.email || u.email || "",
    mobile: root.mobile || u.mobile || "",
    dob: u.dob || "",
    nationality: u.nationality || u.country || "",
    maritalStatus: u.maritalStatus || "",
    anniversary: u.anniversary || "",
    city: u.city || "",
    state: u.state || "",
    passportNo: u.passportNo || "",
    passportExpiry: u.passportExpiry || "",
    issuingCountry: u.issuingCountry || "",
    panCard: u.panCard || "",
    domesticPlan: u.domesticPlan || "",
    internationalPlan: u.internationalPlan || "",
    avatarUrl: u.avatarUrl || root.profileImageUrl || "",
  };
}

function sanitizeForSave(form) {
  const payload = { ...form };
  // don’t blank-out unique fields
  if (typeof payload.email === "string" && payload.email.trim() === "") {
    delete payload.email;
  }
  if (typeof payload.mobile === "string" && payload.mobile.trim() === "") {
    delete payload.mobile;
  }
  return payload;
}

/* -----------------------------------------
   Main
------------------------------------------ */
export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    nationality: "",
    maritalStatus: "",
    anniversary: "",
    city: "",
    state: "",
    passportNo: "",
    passportExpiry: "",
    issuingCountry: "",
    panCard: "",
    domesticPlan: "",
    internationalPlan: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionError, setSessionError] = useState("");

  // ---- central fetch (also syncs localStorage so header/avatar update)
  const fetchProfile = useCallback(async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await api.get(API.PROFILE); // cookie-based auth via api.js
      const next = coalesceProfileShape(data);
      setForm((prev) => ({ ...prev, ...next }));

      // cache for header widgets
      const cached = { ...data, profile: { ...(data.profile || {}), ...next } };
      localStorage.setItem("hv_user", JSON.stringify(cached));
      window.dispatchEvent(new StorageEvent("storage", { key: "hv_user" }));
    } catch (e) {
      setError(e.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- check session gently (explains why refresh may send you to Login)
  useEffect(() => {
    (async () => {
      try {
        setSessionError("");
        await api.get("/api/auth/me");
      } catch (_e) {
        setSessionError("Your session might have expired. Please log in again.");
      }
    })();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload = sanitizeForSave(form);

      // Server expects/returns the unified shape; even if it returns 204,
      // we refetch to display the canonical values.
      const saved = await api.put(API.PROFILE, payload);

      if (saved && typeof saved === "object") {
        const next = coalesceProfileShape(saved);
        setForm((p) => ({ ...p, ...next }));
        localStorage.setItem(
          "hv_user",
          JSON.stringify({ ...saved, profile: { ...(saved.profile || {}), ...next } })
        );
        window.dispatchEvent(new StorageEvent("storage", { key: "hv_user" }));
      } else {
        await fetchProfile();
      }

      setSuccess("✅ Profile saved successfully!");
    } catch (e) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const renderAvatar = () => {
    if (form.avatarUrl)
      return <img src={form.avatarUrl} alt="Avatar" style={styles.avatarImage} />;
    const initial = form.firstName ? form.firstName[0].toUpperCase() : "U";
    return <div style={styles.avatarFallback}>{initial}</div>;
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: 40 }}>Loading profile...</div>;

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={styles.pageWrapper}>
          {/* Session warning (non-blocking) */}
          {sessionError && (
            <div style={styles.sessionWarn}>{sessionError}</div>
          )}

          {/* Header */}
          <header style={styles.headerCard}>
            {renderAvatar()}
            <div>
              <h1 style={styles.pageTitle}>
                {form.firstName || "Your"} {form.lastName || "Name"}
              </h1>
              <p style={styles.subText}>
                <FaEnvelope style={{ marginRight: 8 }} />
                {form.email || "your.email@example.com"}
              </p>
              <p style={styles.subText}>
                <FaPhone style={{ marginRight: 8 }} />
                {form.mobile || "+91 00000 00000"}
              </p>
            </div>
          </header>

          {/* Tabs */}
          <nav style={styles.tabs}>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === "profile" ? styles.activeTabBtn : {}),
              }}
              onClick={() => setActiveTab("profile")}
            >
              <FaUserFriends style={styles.tabIcon} /> Profile Info
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === "documents" ? styles.activeTabBtn : {}),
              }}
              onClick={() => setActiveTab("documents")}
            >
              <FaPassport style={styles.tabIcon} /> Documents
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === "preferences" ? styles.activeTabBtn : {}),
              }}
              onClick={() => setActiveTab("preferences")}
            >
              <FaShieldAlt style={styles.tabIcon} /> Preferences
            </button>
          </nav>

          {/* Form */}
          <form onSubmit={handleSave} style={styles.form}>
            {error && <div style={{ color: "red", marginBottom: 20 }}>{error}</div>}
            {success && (
              <div style={{ color: "green", marginBottom: 20 }}>{success}</div>
            )}

            {activeTab === "profile" && (
              <div style={styles.grid}>
                <InputField label="First Name" icon={FaUser} name="firstName" value={form.firstName} onChange={handleChange} />
                <InputField label="Last Name"  icon={FaUser} name="lastName"  value={form.lastName}  onChange={handleChange} />
                <InputField label="Email"      icon={FaEnvelope} name="email" value={form.email} onChange={handleChange} />
                <InputField label="Mobile"     icon={FaPhone} name="mobile" value={form.mobile} onChange={handleChange} />
                <InputField label="Date of Birth" icon={FaBirthdayCake} type="date" name="dob" value={form.dob} onChange={handleChange} />
                <InputField label="Nationality" icon={FaFlag} name="nationality" value={form.nationality} onChange={handleChange} />
                <SelectField  label="Marital Status" options={["Single","Married","Divorced","Widowed","Other"]} name="maritalStatus" value={form.maritalStatus} onChange={handleChange} />
                <InputField label="Anniversary" type="date" name="anniversary" value={form.anniversary} onChange={handleChange} />
                <InputField label="City"  name="city"  value={form.city}  onChange={handleChange} />
                <InputField label="State" name="state" value={form.state} onChange={handleChange} />
              </div>
            )}

            {activeTab === "documents" && (
              <div style={styles.grid}>
                <InputField label="Passport Number" icon={FaPassport} name="passportNo" value={form.passportNo} onChange={handleChange} />
                <InputField label="Passport Expiry Date" type="date" name="passportExpiry" value={form.passportExpiry} onChange={handleChange} />
                <InputField label="Issuing Country" name="issuingCountry" value={form.issuingCountry} onChange={handleChange} />
                <InputField label="PAN Card Number" icon={FaIdCard} name="panCard" value={form.panCard} onChange={handleChange} />
              </div>
            )}

            {activeTab === "preferences" && (
              <div style={styles.grid}>
                <InputField label="Domestic Plan" name="domesticPlan" value={form.domesticPlan} onChange={handleChange} />
                <InputField label="International Plan" name="internationalPlan" value={form.internationalPlan} onChange={handleChange} />
              </div>
            )}

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------
   Styles
------------------------------------------ */
const styles = {
  pageWrapper: {
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: baseFont,
    padding: "0 20px",
    color: "#00477f",
  },
  sessionWarn: {
    background: "#fff4e5",
    border: "1px solid #ffd6a8",
    color: "#7a4d00",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 14,
    fontWeight: 700,
  },
  headerCard: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 30,
    borderRadius: 12,
    padding: 25,
    background: "linear-gradient(135deg, #d06549, #00477f)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(208, 101, 73, 0.6)",
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "4px solid #fff",
    objectFit: "cover",
  },
  avatarFallback: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "4px solid #fff",
    backgroundColor: "#d06549",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: 48,
    userSelect: "none",
    fontFamily: baseFont,
  },
  pageTitle: { fontSize: 30, fontWeight: 700 },
  subText: {
    fontSize: 16,
    opacity: 0.85,
    marginTop: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  tabs: {
    display: "flex",
    gap: 24,
    marginBottom: 24,
    borderBottom: "2px solid #d06549",
  },
  tabBtn: {
    background: "none",
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    padding: "8px 12px",
    color: "#666",
    fontFamily: baseFont,
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderBottom: "3px solid transparent",
    transition: "all 0.3s ease",
  },
  activeTabBtn: { color: "#d06549", borderBottomColor: "#d06549" },
  tabIcon: { fontSize: 18 },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    boxShadow: "0 6px 20px rgba(0, 71, 127, 0.15)",
  },
  grid: { display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" },
  inputLabel: {
    display: "flex",
    flexDirection: "column",
    fontWeight: 700,
    fontSize: 14,
    color: "#00477f",
  },
  labelText: { marginBottom: 6, display: "flex", alignItems: "center", gap: 8 },
  icon: { color: "#d06549" },
  input: {
    padding: "10px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #d06549",
    outline: "none",
    fontFamily: baseFont,
    color: "#00477f",
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#d06549",
    color: "#fff",
    padding: "14px 60px",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    transition: "background-color 0.3s ease",
  },
};
