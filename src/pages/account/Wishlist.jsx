import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaTrashAlt,
  FaPlane,
  FaUmbrellaBeach,
  FaGlobe,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AccountSidebar from "../../components/account/Sidebar";

const baseFont = "'Barlow Condensed', Arial, sans-serif";
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://api.helloviza.com";

export default function Wishlist() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // store error *keys* so UI stays translated if language changes
  const [errorKey, setErrorKey] = useState("");

  useEffect(() => {
    async function fetchWishlist() {
      setLoading(true);
      setErrorKey("");
      try {
        const res = await fetch(`${API_BASE}/api/wishlist`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "fetchFailed");
        setItems(data.items || []);
      } catch (err) {
        console.error("❌ Wishlist Fetch Error:", err);
        setErrorKey("fetchFailed");
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  async function handleRemove(id) {
    if (!window.confirm(t("account.wishlist.confirmRemove"))) return;
    try {
      const res = await fetch(`${API_BASE}/api/wishlist/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "removeFailed");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("❌ Wishlist Remove Error:", err);
      setErrorKey("removeFailed");
    }
  }

  const iconForType = (type) => {
    if (!type) return <FaGlobe />;
    switch (type.toLowerCase()) {
      case "flight":
      case "visa":
        return <FaPlane />;
      case "holiday":
      case "package":
        return <FaUmbrellaBeach />;
      default:
        return <FaGlobe />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AccountSidebar />
      <div style={{ flex: 1, padding: "2rem", marginTop: "80px" }}>
        <div style={S.pageWrapper}>
          <header style={S.headerCard}>
            <FaHeart style={{ fontSize: 42, marginRight: 16 }} />
            <div>
              <h1 style={S.pageTitle}>{t("account.wishlist.title")}</h1>
              <p style={{ opacity: 0.8 }}>{t("account.wishlist.subtitle")}</p>
            </div>
          </header>

          {errorKey && (
            <div style={S.error}>
              {t(`account.wishlist.errors.${errorKey}`)}
            </div>
          )}

          {loading ? (
            <p style={{ textAlign: "center" }}>
              {t("account.wishlist.loading")}
            </p>
          ) : items.length === 0 ? (
            <div style={S.emptyState}>
              <FaHeart style={{ fontSize: 60, color: "#ccc" }} />
              <p>{t("account.wishlist.empty")}</p>
            </div>
          ) : (
            <div style={S.grid}>
              {items.map((item) => (
                <div key={item.id} style={S.card}>
                  <div style={S.iconBox}>{iconForType(item.type)}</div>
                  <h3 style={S.cardTitle}>
                    {item.title || t("account.wishlist.fallbackTitle")}
                  </h3>
                  <p style={S.cardSubtitle}>
                    {item.subtitle ||
                      item.country ||
                      item.category ||
                      t("account.wishlist.fallbackSubtitle")}
                  </p>
                  <div style={S.cardFooter}>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={S.linkBtn}
                      >
                        {t("account.wishlist.actions.view")}
                      </a>
                    )}
                    <button
                      onClick={() => handleRemove(item.id)}
                      style={S.deleteBtn}
                      aria-label={t("account.wishlist.actions.remove")}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
    background: "linear-gradient(135deg, #d06549, #00477f)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  },
  pageTitle: { fontSize: 28, fontWeight: 700 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 6px 18px rgba(0,71,127,0.15)",
    textAlign: "center",
    transition: "transform 0.25s ease",
  },
  iconBox: {
    fontSize: 36,
    color: "#d06549",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 20, fontWeight: 700, color: "#00477f" },
  cardSubtitle: { color: "#666", fontSize: 15, margin: "6px 0 12px" },
  cardFooter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  linkBtn: {
    background: "#00477f",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 8,
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.3s ease",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#d06549",
    cursor: "pointer",
    fontSize: 18,
  },
  error: {
    color: "#fff",
    backgroundColor: "#d06549",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: 600,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,71,127,0.1)",
    color: "#666",
    fontSize: 18,
  },
};
