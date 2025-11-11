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
import { useTranslation } from "react-i18next";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Settings() {
  const { t, i18n } = useTranslation("common");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [devices, setDevices] = useState([]);
  const [twoFA, setTwoFA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const locale = i18n.language === "ar" ? "ar-EG" : "en-IN";

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
        setMessage(t("account.settings.toast.loadFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [t]);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage(t("account.settings.toast.passwordMismatch"));
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
      setMessage(t("account.settings.toast.passwordChanged"));
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("❌ Change password error:", err);
      setMessage(t("account.settings.toast.passwordChangeFailed"));
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
      setMessage(
        data.enabled
          ? t("account.settings.toast.twoFAEnabled")
          : t("account.settings.toast.twoFADisabled")
      );
    } catch (err) {
      console.error("❌ 2FA toggle error:", err);
      setMessage(t("account.settings.toast.twoFAToggleFailed"));
    }
  };

  // Remove device
  const handleRemoveDevice = async (id) => {
    if (!window.confirm(t("account.settings.devices.confirmRemove"))) return;
    try {
      const res = await fetch(`${API_BASE}/api/settings/device/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove device");
      setDevices((prev) => prev.filter((d) => d.id !== id));
      setMessage(t("account.settings.toast.deviceRemoved"));
    } catch (err) {
      console.error("❌ Device remove error:", err);
      setMessage(t("account.settings.toast.deviceRemoveFailed"));
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
              <h1 style={S.pageTitle}>{t("account.settings.title")}</h1>
              <p style={{ opacity: 0.8 }}>{t("account.settings.subtitle")}</p>
            </div>
          </header>

          {message && <div style={S.toast}>{message}</div>}

          {loading ? (
            <p style={{ textAlign: "center" }}>{t("account.settings.loading")}</p>
          ) : (
            <>
              {/* === Change Password === */}
              <section style={S.card}>
                <h2 style={S.sectionTitle}>
                  <FaLock style={S.icon} /> {t("account.settings.password.sectionTitle")}
                </h2>
                <form onSubmit={handlePasswordChange} style={S.form}>
                  <label style={S.label}>
                    {t("account.settings.password.current")}
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
                    {t("account.settings.password.new")}
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
                    {t("account.settings.password.confirm")}
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
                    {loading
                      ? t("account.settings.password.updating")
                      : t("account.settings.password.updateBtn")}
                  </button>
                </form>
              </section>

              {/* === Two-Factor Authentication === */}
              <section style={S.card}>
                <h2 style={S.sectionTitle}>
                  <FaKey style={S.icon} /> {t("account.settings.twoFA.sectionTitle")}
                </h2>
                <div style={S.twoFABox}>
                  {twoFA ? (
                    <>
                      <FaCheckCircle style={{ color: "#2ecc71", fontSize: 24 }} />
                      <span>{t("account.settings.twoFA.enabled")}</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle style={{ color: "#e74c3c", fontSize: 24 }} />
                      <span>{t("account.settings.twoFA.disabled")}</span>
                    </>
                  )}
                  <button onClick={handleToggle2FA} style={S.toggleBtn}>
                    {twoFA
                      ? t("account.settings.twoFA.disableBtn")
                      : t("account.settings.twoFA.enableBtn")}
                  </button>
                </div>
              </section>

              {/* === Linked Devices === */}
              <section style={S.card}>
                <h2 style={S.sectionTitle}>
                  <FaMobileAlt style={S.icon} />{" "}
                  {t("account.settings.devices.sectionTitle")}
                </h2>
                {devices.length === 0 ? (
                  <p style={{ color: "#666" }}>
                    {t("account.settings.devices.empty")}
                  </p>
                ) : (
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th>{t("account.settings.devices.headers.device")}</th>
                        <th>{t("account.settings.devices.headers.ip")}</th>
                        <th>{t("account.settings.devices.headers.lastActive")}</th>
                        <th>{t("account.settings.devices.headers.action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((d) => (
                        <tr key={d.id}>
                          <td>
                            {d.deviceName ||
                              t("account.settings.devices.fallbackDevice")}
                          </td>
                          <td>{d.ip || t("account.settings.devices.fallbackIp")}</td>
                          <td>
                            {d.lastActive
                              ? new Date(d.lastActive).toLocaleString(locale, {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                          <td>
                            <button
                              onClick={() => handleRemoveDevice(d.id)}
                              style={S.deleteBtn}
                            >
                              <FaTrashAlt />{" "}
                              {t("account.settings.devices.removeBtn")}
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
