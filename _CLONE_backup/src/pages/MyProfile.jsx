import React, { useState, useEffect } from "react";
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

const baseFont = "'Barlow Condensed', Arial, sans-serif";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    avatarUrl: "", // for uploaded avatar image URL
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maritalOptions = ["Single", "Married", "Divorced", "Widowed", "Other"];

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        // Simulated fetched data:
        const data = {
          firstName: "Imran",
          lastName: "Ali",
          email: "imranalikhan.immi@gmail.com",
          phone: "+916200327336",
          dob: "1983-11-30",
          nationality: "Indian",
          maritalStatus: "Married",
          anniversary: "2010-12-15",
          city: "Kolkata",
          state: "West Bengal",
          passportNo: "X1234567",
          passportExpiry: "2030-12-01",
          issuingCountry: "India",
          panCard: "ABCDE1234F",
          domesticPlan: "Plan A",
          internationalPlan: "Plan B",
          avatarUrl: "", // Set to image URL if available
        };

        setForm(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data");
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Replace with actual API call to update profile
      await new Promise((res) => setTimeout(res, 1000));
      alert("Profile saved successfully!");
    } catch (err) {
      setError("Failed to save profile");
    }
    setLoading(false);
  };

  const InputField = ({ label, icon: Icon, ...props }) => (
    <label style={styles.inputLabel}>
      {Icon && <Icon style={styles.icon} />}
      <span style={styles.labelText}>{label}</span>
      <input style={styles.input} {...props} />
    </label>
  );

  const SelectField = ({ label, icon: Icon, options, ...props }) => (
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
  );

  const renderAvatar = () => {
    if (form.avatarUrl) {
      return (
        <img
          src={form.avatarUrl}
          alt="User Avatar"
          style={styles.avatarImage}
        />
      );
    } else {
      const initial = form.firstName ? form.firstName.charAt(0).toUpperCase() : "U";
      return <div style={styles.avatarFallback}>{initial}</div>;
    }
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: 40 }}>Loading profile...</div>;

  return (
    <div style={styles.pageWrapper}>
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
            {form.phone || "+91 12345 67890"}
          </p>
        </div>
      </header>

      <nav style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === "profile" ? styles.activeTabBtn : {}),
          }}
          onClick={() => setActiveTab("profile")}
          aria-selected={activeTab === "profile"}
        >
          <FaUserFriends style={styles.tabIcon} /> Profile Info
        </button>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === "documents" ? styles.activeTabBtn : {}),
          }}
          onClick={() => setActiveTab("documents")}
          aria-selected={activeTab === "documents"}
        >
          <FaPassport style={styles.tabIcon} /> Documents
        </button>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeTab === "preferences" ? styles.activeTabBtn : {}),
          }}
          onClick={() => setActiveTab("preferences")}
          aria-selected={activeTab === "preferences"}
        >
          <FaShieldAlt style={styles.tabIcon} /> Preferences
        </button>
      </nav>

      <form onSubmit={handleSave} style={styles.form}>
        {error && <div style={{ color: "red", marginBottom: 20 }}>{error}</div>}

        {activeTab === "profile" && (
          <div style={styles.grid}>
            <InputField
              label="First Name"
              icon={FaUser}
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="Enter first name"
            />
            <InputField
              label="Last Name"
              icon={FaUser}
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Enter last name"
            />
            <InputField
              label="Email"
              icon={FaEnvelope}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
            <InputField
              label="Mobile Number"
              icon={FaPhone}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
            <InputField
              label="Date of Birth"
              icon={FaBirthdayCake}
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
            <InputField
              label="Nationality"
              icon={FaFlag}
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder="Enter nationality"
            />
            <SelectField
              label="Marital Status"
              options={maritalOptions}
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
            />
            <InputField
              label="Anniversary"
              type="date"
              name="anniversary"
              value={form.anniversary}
              onChange={handleChange}
            />
            <InputField
              label="City of Residence"
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
            <InputField
              label="State"
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
          </div>
        )}

        {activeTab === "documents" && (
          <div style={styles.grid}>
            <InputField
              label="Passport Number"
              icon={FaPassport}
              type="text"
              name="passportNo"
              value={form.passportNo}
              onChange={handleChange}
              placeholder="Enter passport number"
            />
            <InputField
              label="Passport Expiry Date"
              type="date"
              name="passportExpiry"
              value={form.passportExpiry}
              onChange={handleChange}
            />
            <InputField
              label="Issuing Country"
              type="text"
              name="issuingCountry"
              value={form.issuingCountry}
              onChange={handleChange}
              placeholder="Enter issuing country"
            />
            <InputField
              label="PAN Card Number"
              icon={FaIdCard}
              type="text"
              name="panCard"
              value={form.panCard}
              onChange={handleChange}
              placeholder="Enter PAN card number"
            />
          </div>
        )}

        {activeTab === "preferences" && (
          <div style={styles.grid}>
            <InputField
              label="Domestic Trip Protection Plan"
              type="text"
              name="domesticPlan"
              value={form.domesticPlan}
              onChange={handleChange}
              placeholder="Enter domestic plan"
            />
            <InputField
              label="International Travel Insurance Plan"
              type="text"
              name="internationalPlan"
              value={form.internationalPlan}
              onChange={handleChange}
              placeholder="Enter international plan"
            />
          </div>
        )}

        <button type="submit" style={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  pageWrapper: {
    maxWidth: 900,
    margin: "120px auto",
    fontFamily: baseFont,
    padding: "0 20px",
    color: "#00477f",
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
  pageTitle: {
    fontSize: 30,
    fontWeight: 700,
  },
  subText: {
    fontSize: 16,
    opacity: 0.85,
    marginTop: 6,
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
  activeTabBtn: {
    color: "#d06549",
    borderBottomColor: "#d06549",
  },
  tabIcon: {
    fontSize: 18,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    boxShadow: "0 6px 20px rgba(0, 71, 127, 0.15)",
  },
  grid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "1fr 1fr",
  },
  inputLabel: {
    display: "flex",
    flexDirection: "column",
    fontWeight: 700,
    fontSize: 14,
    color: "#00477f",
  },
  labelText: {
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    color: "#d06549",
  },
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
