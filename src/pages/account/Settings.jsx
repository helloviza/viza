import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaLock,
  FaKey,
  FaMobileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [devices, setDevices] = useState([]);
  const [twoFA, setTwoFA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load devices and 2FA status
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/settings`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load settings");

        setDevices(data.devices || []);
        setTwoFA(data.twoFAEnabled || false);
      } catch (err) {
        console.error("⚠ Settings fetch error:", err);
        setMessage("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/settings/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setMessage("✅ Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("❌ Change password error:", err);
      setMessage("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Toggle 2FA
  const handleToggle2FA = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings/toggle-2fa`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: !twoFA }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle 2FA");
      setTwoFA(data.enabled);
      setMessage(`Two-Factor Authentication ${data.enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      console.error("❌ 2FA toggle error:", err);
      setMessage("Failed to toggle 2FA");
    }
  };

  // Remove device
  const handleRemoveDevice = async (id) => {
    if (!window.confirm("Remove this device from your account?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/settings/device/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove device");
      setDevices((prev) => prev.filter((d) => d.id !== id));
      setMessage("Device removed successfully");
    } catch (err) {
      console.error("❌ Device remove error:", err);
      setMessage("Failed to remove device");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaCog style={{ fontSize: 42, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>Account Settings</h1>
              <p style={{ opacity: 0.8 }}>
                Manage your password, devices, and two-factor authentication preferences
              </p>
            </div>
          </header>

          {message && <div style={S.toast}>{message}</div>}

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading settings...</p>
          ) : (
            <>
              {/* === Change Password === */}
              <section style={S.card}>
                <h2 style={S.sectionTitle}>
                  <FaLock style={S.icon} /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} style={S.form}>
                  <label style={S.label}>
                    Current Password
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={(e) =>
                        setForm({ ...form, currentPassword: e.target.value })
                      }
                      style={S.input}
                      required
                    />
                  </label>
                  <label style={S.label}>
                    New Password
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={(e) =>
                        setForm({ ...form, newPassword: e.target.value })
                      }
                      style={S.input}
                      required
                    />
                  </label>
                  <label style={S.label}>
                    Confirm New Password
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      style={S.input}
                      required
                    />
                  </label>
                  <button type="submit" style={S.saveBtn}>
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </section>

              {/* === Two-Factor Authentication === */}
              <section style={S.card}>
                <h2 style={S.sectionTitle}>
                  <FaKey style={S.icon} /> Two-Factor Authentication
                </h2>
                <div style={S.twoFABox}>
                  {twoFA ? (
                    <>
                      <FaCheckCircle style={{ color: "#2ecc71", fontSize: 24 }} />
                      <span>Enabled</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle style={{ color: "#e74c3c", fontSize: 24 }} />
                      <span>Disabled</span>
                    </>
                  )}
                  <button onClick={handleToggle2FA} style={S.toggleBtn}>
                    {twoFA ? "Disable" : "Enable"} 2FA
                  </button>
                </div>
              </section>

              {/* === Linked Devices === */}
              <section style={S.card}>
                <h2 style={S.sectionTitle}>
                  <FaMobileAlt style={S.icon} /> Linked Devices
                </h2>
                {devices.length === 0 ? (
                  <p style={{ color: "#666" }}>No active devices found.</p>
                ) : (
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th>IP</th>
                        <th>Last Active</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((d) => (
                        <tr key={d.id}>
                          <td>{d.deviceName || "Unknown Device"}</td>
                          <td>{d.ip || "—"}</td>
                          <td>
                            {new Date(d.lastActive).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <button
                              onClick={() => handleRemoveDevice(d.id)}
                              style={S.deleteBtn}
                            >
                              <FaTrashAlt /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// === Styles ===
const S = {
  pageWrapper: {
    maxWidth: 1000,
    margin: "0 auto",
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
    background: "linear-gradient(135deg, #00477f, #d06549)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  },
  pageTitle: { fontSize: 28, fontWeight: 700 },
  toast: {
    background: "#00477f",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: 600,
    textAlign: "center",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 25,
    marginBottom: 30,
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  icon: { color: "#d06549" },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
    color: "#00477f",
    display: "flex",
    flexDirection: "column",
    gap: 6,
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
    gridColumn: "span 2",
    backgroundColor: "#d06549",
    color: "#fff",
    padding: "12px 40px",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    marginTop: 10,
  },
  twoFABox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8f9fc",
    padding: 20,
    borderRadius: 10,
  },
  toggleBtn: {
    backgroundColor: "#00477f",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#d06549",
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};
