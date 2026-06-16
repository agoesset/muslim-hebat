import React from "react";
import { useOutletContext, Link } from "react-router-dom";
import { renderAdminIcon } from "../../lucide-icons.jsx";
import { Blob, SunDecor } from "../../shell.jsx";
import { resources } from "../constants.js";

export function DashboardPanel() {
  const { counts, subscribers } = useOutletContext();
  const totalContent = Object.values(counts).reduce((a, b) => a + b, 0);

  const quickStats = [
    { label: "Total Konten", value: totalContent, icon: "total", color: "var(--sage)", trend: "+12%" },
    { label: "Bacaan", value: counts.articles, icon: "articles", color: "var(--sage)", trend: "" },
    { label: "Produk", value: counts.products, icon: "products", color: "var(--peach)", trend: "" },
    { label: "Kajian", value: counts.kajian, icon: "kajian", color: "var(--coral)", trend: "" },
    { label: "Kelas", value: counts.classes, icon: "classes", color: "var(--lilac)", trend: "" },
    { label: "Subscribers", value: subscribers, icon: "subscribers", color: "var(--butter)", trend: "+5" },
  ];

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">Dashboard</h1>
          <p className="admin-panel-subtitle">Ringkasan performa konten Muslim Hebat</p>
        </div>
        <div className="admin-header-actions">
          <a href="/" target="_blank" className="admin-btn admin-btn-secondary" rel="noreferrer">
            {renderAdminIcon("externalLink", { size: 14 })} Lihat Website
          </a>
        </div>
      </header>

      {/* Quick Stats Bento Grid */}
      <div className="admin-bento-grid">
        {quickStats.map((stat, i) => (
          <div
            key={stat.label}
            className={`admin-stat-card ${i === 0 ? "admin-stat-card-large" : ""}`}
            style={{ background: stat.color }}
          >
            <div className="admin-stat-emoji">
              {renderAdminIcon(stat.icon, { size: i === 0 ? 52 : 38 })}
            </div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stat.value.toLocaleString()}</div>
              <div className="admin-stat-label">{stat.label}</div>
              {stat.trend && <div className="admin-stat-trend">{renderAdminIcon("trend", { size: 14 })} {stat.trend} bulan ini</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2 className="admin-section-title">Aksi Cepat</h2>
        <div className="admin-actions-row">
          {resources.map((r) => (
            <Link
              key={r.key}
              to={`/admin/konten/${r.key}`}
              className="admin-action-card"
              style={{ "--action-color": r.color }}
            >
              <span className="admin-action-emoji">{renderAdminIcon(r.icon, { size: 24 })}</span>
              <span className="admin-action-label">Tambah {r.label}</span>
              {renderAdminIcon("arrow", { size: 14 })}
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome Card */}
      <div className="admin-welcome-card">
        <Blob color="var(--peach)" size={180} top={-60} right={-40} />
        <SunDecor size={100} color="var(--butter)" style={{ position: "absolute", bottom: -20, left: 40 }} />
        <div className="admin-welcome-content">
          <span className="admin-sticker">Tips harian {renderAdminIcon("tip", { size: 14 })}</span>
          <h3>Kelola konten dengan konsisten!</h3>
          <p>Tambah bacaan baru minimal 2x seminggu untuk menjaga engagement pembaca.</p>
        </div>
      </div>
    </div>
  );
}
export default DashboardPanel;
