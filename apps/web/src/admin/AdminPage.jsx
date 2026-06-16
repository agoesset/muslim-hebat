import React from "react";
import { NavLink, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { api } from "../api.js";
import { applyTheme } from "../theme.js";
import { renderAdminIcon } from "../lucide-icons.jsx";
import "../styles.css";
import "./admin.css";

// Import panel components
import { DashboardPanel } from "./panels/DashboardPanel.jsx";
import { ContentListPanel } from "./panels/ContentListPanel.jsx";
import { ContentFormPanel } from "./panels/ContentFormPanel.jsx";
import { SubscribersPanel } from "./panels/SubscribersPanel.jsx";
import { SettingsPanel } from "./panels/SettingsPanel.jsx";

export function AdminPage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 1. Try to restore from localStorage first for instant visual styling
    try {
      const savedTheme = localStorage.getItem("muslim-hebat-theme");
      if (savedTheme) {
        applyTheme(JSON.parse(savedTheme));
      } else {
        applyTheme();
      }
    } catch (e) {
      applyTheme();
    }

    // 2. Fetch admin settings (which contains the theme) and update/apply
    api("/admin/settings")
      .then((settings) => {
        if (Array.isArray(settings)) {
          const themeSetting = settings.find((s) => s.key === "theme");
          if (themeSetting && themeSetting.value) {
            applyTheme(themeSetting.value);
            try {
              localStorage.setItem("muslim-hebat-theme", JSON.stringify(themeSetting.value));
            } catch (e) {}
          }
        }
      })
      .catch((err) => {
        console.error("Gagal memuat theme settings di admin:", err);
      });

    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) return <Login onLogin={setUser} />;

  // Render nested routes inside AdminLayout
  return (
    <Routes>
      <Route element={<AdminLayout user={user} onLogout={() => setUser(null)} />}>
        <Route index element={<DashboardPanel />} />
        <Route path="konten" element={<Navigate to="/admin/konten/articles" replace />} />
        <Route path="konten/:resourceType" element={<ContentListPanel />} />
        <Route path="konten/:resourceType/new" element={<ContentFormPanel />} />
        <Route path="konten/:resourceType/edit/:id" element={<ContentFormPanel />} />
        <Route path="subscribers" element={<SubscribersPanel />} />
        <Route path="settings" element={<SettingsPanel />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

function LoadingScreen() {
  return (
    <div className="admin-loading-screen">
      <div className="admin-loading-card">
        <div className="admin-spinner-large" />
        <p>Memuat dashboard...</p>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = React.useState("admin@muslimhebat.local");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-blob" style={{ top: "10%", left: "5%", background: "var(--peach)" }} />
      <div className="admin-login-blob" style={{ bottom: "10%", right: "5%", background: "var(--sage)", width: 300, height: 300 }} />
      
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-header">
          <span className="admin-login-emoji">{renderAdminIcon("sparkle", { size: 32 })}</span>
          <h1>Masuk Admin</h1>
          <p>Kelola konten Muslim Hebat dengan mudah</p>
        </div>

        {error && (
          <div className="admin-toast admin-toast-error">
            {renderAdminIcon("warning", { size: 16 })} {error}
          </div>
        )}

        <div className="admin-form-group">
          <label>Email</label>
          <div className="admin-input-wrapper">
            {renderAdminIcon("mail", { size: 16 })}
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@muslimhebat.local"
            />
          </div>
        </div>
        
        <div className="admin-form-group">
          <label>Password</label>
          <div className="admin-input-wrapper">
            {renderAdminIcon("lock", { size: 16 })}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button className="admin-btn admin-btn-primary admin-btn-lg" disabled={isLoading}>
          {isLoading ? "Memuat..." : "Masuk Dashboard"} {renderAdminIcon("arrow", { size: 14 })}
        </button>
      </form>
    </div>
  );
}

function AdminLayout({ user, onLogout }) {
  const [counts, setCounts] = React.useState({ articles: 0, products: 0, kajian: 0, classes: 0 });
  const [subscribers, setSubscribers] = React.useState(0);

  React.useEffect(() => {
    Promise.all([
      api("/admin/articles").then(d => setCounts(c => ({ ...c, articles: d.length }))).catch(() => {}),
      api("/admin/products").then(d => setCounts(c => ({ ...c, products: d.length }))).catch(() => {}),
      api("/admin/kajian").then(d => setCounts(c => ({ ...c, kajian: d.length }))).catch(() => {}),
      api("/admin/classes").then(d => setCounts(c => ({ ...c, classes: d.length }))).catch(() => {}),
      api("/admin/subscribers").then(d => setSubscribers(d.length)).catch(() => {}),
    ]);
  }, []);

  const sidebarItems = [
    { id: "", label: "Dashboard", icon: "dashboard", color: "var(--sage)" },
    { id: "konten/articles", label: "Bacaan", icon: "articles", color: "var(--sage)", badgeKey: "articles" },
    { id: "konten/products", label: "Produk", icon: "products", color: "var(--peach)", badgeKey: "products" },
    { id: "konten/kajian", label: "Kajian", icon: "kajian", color: "var(--coral)", badgeKey: "kajian" },
    { id: "konten/classes", label: "Kelas", icon: "classes", color: "var(--lilac)", badgeKey: "classes" },
    { id: "subscribers", label: "Subscribers", icon: "subscribers", color: "var(--coral)", badgeKey: "subscribers" },
    { id: "settings", label: "Settings", icon: "settings", color: "var(--lilac)" },
  ];

  return (
    <div className="admin-app">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-logo">{renderAdminIcon("logo", { size: 20 })}</span>
          <span className="admin-brand-text">Muslim Hebat</span>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => {
            const targetPath = item.id ? `/admin/${item.id}` : "/admin";
            
            return (
              <NavLink
                key={item.id}
                to={targetPath}
                end={true}
                className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
                style={{ "--nav-accent": item.color }}
              >
                <span className="admin-nav-icon" style={{ background: item.color }}>
                  {renderAdminIcon(item.icon, { size: 18 })}
                </span>
                <span className="admin-nav-label">{item.label}</span>
                {item.badgeKey === "subscribers" && subscribers > 0 && (
                  <span className="admin-nav-badge">{subscribers}</span>
                )}
                {item.badgeKey && item.badgeKey !== "subscribers" && counts[item.badgeKey] > 0 && (
                  <span className="admin-nav-badge" style={{ background: "rgba(31,58,45,0.08)", color: "var(--ink)" }}>
                    {counts[item.badgeKey]}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">{user.name}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={onLogout}>
            {renderAdminIcon("logOut", { size: 16 })} Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Pass shared state down to routing panels */}
        <Outlet context={{ user, counts, setCounts, subscribers, setSubscribers }} />
      </main>
    </div>
  );
}
