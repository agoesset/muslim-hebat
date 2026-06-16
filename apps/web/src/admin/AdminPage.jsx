import React from "react";
import { api } from "../api.js";
import { applyTheme } from "../theme.js";
import { Icon } from "../icons.jsx";
import { Blob, SunDecor } from "../shell.jsx";
import "../styles.css";

const resources = [
  { key: "articles", label: "Bacaan", emoji: "📖", color: "var(--sage)", count: 0 },
  { key: "products", label: "Produk", emoji: "📦", color: "var(--peach)", count: 0 },
  { key: "kajian", label: "Kajian", emoji: "🎤", color: "var(--coral)", count: 0 },
  { key: "classes", label: "Kelas", emoji: "🎓", color: "var(--lilac)", count: 0 },
];

const statusConfig = {
  PUBLISHED: { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Published", dot: "🟢" },
  DRAFT: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Draft", dot: "🟡" },
  ARCHIVED: { color: "#6b7280", bg: "rgba(107,114,128,0.12)", label: "Archived", dot: "⚪" },
};

export function AdminPage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    applyTheme();
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
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
          <span className="admin-login-emoji">✨</span>
          <h1>Masuk Admin</h1>
          <p>Kelola konten Muslim Hebat dengan mudah</p>
        </div>
        
        {error && (
          <div className="admin-toast admin-toast-error">
            <span>⚠️</span> {error}
          </div>
        )}
        
        <div className="admin-form-group">
          <label>Email</label>
          <div className="admin-input-wrapper">
            <Icon.Mail size={16} />
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
            <Icon.Lock size={16} />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <button className="admin-btn admin-btn-primary admin-btn-lg" disabled={isLoading}>
          {isLoading ? "Memuat..." : "Masuk Dashboard"} <Icon.Arrow size={14} />
        </button>
      </form>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [counts, setCounts] = React.useState({ articles: 0, products: 0, kajian: 0, classes: 0 });
  const [subscribers, setSubscribers] = React.useState(0);

  React.useEffect(() => {
    Promise.all([
      api("/admin/articles").then(d => setCounts(c => ({ ...c, articles: d.length }))),
      api("/admin/products").then(d => setCounts(c => ({ ...c, products: d.length }))),
      api("/admin/kajian").then(d => setCounts(c => ({ ...c, kajian: d.length }))),
      api("/admin/classes").then(d => setCounts(c => ({ ...c, classes: d.length }))),
      api("/admin/subscribers").then(d => setSubscribers(d.length)),
    ]);
  }, []);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "Grid", color: "var(--sage)" },
    { id: "content", label: "Konten", icon: "FileText", color: "var(--peach)" },
    { id: "subscribers", label: "Subscribers", icon: "Users", color: "var(--coral)" },
    { id: "settings", label: "Settings", icon: "Settings", color: "var(--lilac)" },
  ];

  return (
    <div className="admin-app">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-logo">✦</span>
          <span className="admin-brand-text">Muslim Hebat</span>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              style={{ "--nav-accent": item.color }}
            >
              <span className="admin-nav-icon" style={{ background: item.color }}>
                {getIcon(item.icon)}
              </span>
              <span className="admin-nav-label">{item.label}</span>
              {item.id === "subscribers" && subscribers > 0 && (
                <span className="admin-nav-badge">{subscribers}</span>
              )}
            </button>
          ))}
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
            <Icon.LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === "dashboard" && <DashboardPanel counts={counts} subscribers={subscribers} onNavigate={setActiveTab} />}
        {activeTab === "content" && <ContentPanel counts={counts} />}
        {activeTab === "subscribers" && <SubscribersPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}

function DashboardPanel({ counts, subscribers, onNavigate }) {
  const totalContent = Object.values(counts).reduce((a, b) => a + b, 0);

  const quickStats = [
    { label: "Total Konten", value: totalContent, emoji: "📚", color: "var(--sage)", trend: "+12%" },
    { label: "Bacaan", value: counts.articles, emoji: "📖", color: "var(--sage)", trend: "" },
    { label: "Produk", value: counts.products, emoji: "📦", color: "var(--peach)", trend: "" },
    { label: "Kajian", value: counts.kajian, emoji: "🎤", color: "var(--coral)", trend: "" },
    { label: "Kelas", value: counts.classes, emoji: "🎓", color: "var(--lilac)", trend: "" },
    { label: "Subscribers", value: subscribers, emoji: "👥", color: "var(--butter)", trend: "+5" },
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
          <a href="/" target="_blank" className="admin-btn admin-btn-secondary">
            <Icon.ExternalLink size={14} /> Lihat Website
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
            <div className="admin-stat-emoji">{stat.emoji}</div>
            <div className="admin-stat-content">
              <div className="admin-stat-value">{stat.value.toLocaleString()}</div>
              <div className="admin-stat-label">{stat.label}</div>
              {stat.trend && <div className="admin-stat-trend">📈 {stat.trend} bulan ini</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2 className="admin-section-title">Aksi Cepat</h2>
        <div className="admin-actions-row">
          {resources.map((r) => (
            <button 
              key={r.key} 
              className="admin-action-card"
              onClick={() => onNavigate("content")}
              style={{ "--action-color": r.color }}
            >
              <span className="admin-action-emoji">{r.emoji}</span>
              <span className="admin-action-label">Tambah {r.label}</span>
              <Icon.Arrow size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Card */}
      <div className="admin-welcome-card">
        <Blob color="var(--peach)" size={180} top={-60} right={-40} />
        <SunDecor size={100} color="var(--butter)" style={{ position: "absolute", bottom: -20, left: 40 }} />
        <div className="admin-welcome-content">
          <span className="admin-sticker">Tips harian 💡</span>
          <h3>Kelola konten dengan konsisten!</h3>
          <p>Tambah bacaan baru minimal 2x seminggu untuk menjaga engagement pembaca.</p>
        </div>
      </div>
    </div>
  );
}

function ContentPanel({ counts }) {
  const [activeResource, setActiveResource] = React.useState("articles");
  const [items, setItems] = React.useState([]);
  const [draft, setDraft] = React.useState({});
  const [editing, setEditing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("ALL");
  const [message, setMessage] = React.useState("");

  const resource = resources.find((r) => r.key === activeResource);

  React.useEffect(() => {
    setLoading(true);
    api(`/admin/${activeResource}`)
      .then((data) => {
        setItems(data);
        setDraft({ status: "DRAFT" });
        setEditing(null);
      })
      .finally(() => setLoading(false));
  }, [activeResource]);

  const filteredItems = React.useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((i) => (i.status || "DRAFT") === filter);
  }, [items, filter]);

  async function save(e) {
    e.preventDefault();
    const path = editing ? `/admin/${activeResource}/${editing}` : `/admin/${activeResource}`;
    const method = editing ? "PATCH" : "POST";
    try {
      await api(path, { method, body: JSON.stringify(draft) });
      setMessage(`${resource.label} tersimpan!`);
      setEditing(null);
      setDraft({ status: "DRAFT" });
      api(`/admin/${activeResource}`).then(setItems);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  async function remove(id) {
    if (!confirm("Hapus item ini?")) return;
    await api(`/admin/${activeResource}/${id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
    setMessage("Item dihapus");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">Kelola Konten</h1>
          <p className="admin-panel-subtitle">Tambah, edit, dan hapus konten website</p>
        </div>
      </header>

      {/* Resource Tabs */}
      <div className="admin-resource-tabs">
        {resources.map((r) => (
          <button
            key={r.key}
            className={`admin-resource-tab ${activeResource === r.key ? "active" : ""}`}
            onClick={() => setActiveResource(r.key)}
          >
            <span>{r.emoji}</span>
            <span>{r.label}</span>
            <span className="admin-tab-count">{counts[r.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="admin-content-grid">
        {/* Form Panel */}
        <aside className="admin-form-panel">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>{editing ? "✏️ Edit" : "➕ Tambah"} {resource.label}</h3>
              {editing && (
                <button 
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => { setEditing(null); setDraft({ status: "DRAFT" }); }}
                >
                  Batal
                </button>
              )}
            </div>

            {message && (
              <div className={`admin-toast ${message.includes("Error") ? "admin-toast-error" : "admin-toast-success"}`}>
                {message}
              </div>
            )}

            <form onSubmit={save} className="admin-compact-form">
              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Judul / Nama</label>
                  <input 
                    value={draft.title || draft.name || ""} 
                    onChange={(e) => setDraft({ ...draft, title: e.target.value, name: e.target.value })}
                    placeholder={`Nama ${resource.label.toLowerCase()}...`}
                    required
                  />
                </div>
                <div className="admin-form-field">
                  <label>Slug</label>
                  <input 
                    value={draft.slug || ""} 
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label>Excerpt / Deskripsi Singkat</label>
                <textarea 
                  value={draft.excerpt || ""} 
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi singkat..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label>Kategori</label>
                  <input 
                    value={draft.category || ""} 
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    placeholder="Kategori..."
                  />
                </div>
                <div className="admin-form-field">
                  <label>Status</label>
                  <select 
                    value={draft.status || "DRAFT"} 
                    onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                  >
                    <option value="DRAFT">🟡 Draft</option>
                    <option value="PUBLISHED">🟢 Published</option>
                    <option value="ARCHIVED">⚪ Archived</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editing ? "💾 Simpan Perubahan" : "➕ Buat Baru"}
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* List Panel */}
        <section className="admin-list-panel">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>📋 Daftar {resource.label}</h3>
              <select 
                className="admin-filter-select"
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">Semua Status</option>
                <option value="PUBLISHED">🟢 Published</option>
                <option value="DRAFT">🟡 Draft</option>
                <option value="ARCHIVED">⚪ Archived</option>
              </select>
            </div>

            {loading ? (
              <div className="admin-loading-inline">
                <div className="admin-spinner" />
                <p>Memuat data...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-emoji">📭</div>
                <p>Belum ada {resource.label.toLowerCase()}</p>
                <span>Tambahkan yang pertama menggunakan form di samping</span>
              </div>
            ) : (
              <div className="admin-items-list">
                {filteredItems.map((item) => {
                  const status = statusConfig[item.status || "DRAFT"];
                  return (
                    <div key={item.id} className="admin-item-card">
                      <div className="admin-item-main">
                        <div className="admin-item-title">{item.title || item.name || "Untitled"}</div>
                        <div className="admin-item-meta">
                          <code className="admin-item-slug">/{item.slug}</code>
                          <span 
                            className="admin-status-pill"
                            style={{ color: status.color, background: status.bg }}
                          >
                            {status.dot} {status.label}
                          </span>
                          {item.category && (
                            <span className="admin-item-category">{item.category}</span>
                          )}
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <button 
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => { setEditing(item.id); setDraft(item); }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => remove(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SubscribersPanel() {
  const [items, setItems] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api("/admin/subscribers")
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter((i) => 
      [i.email, i.name, i.source].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [items, query]);

  const bySource = React.useMemo(() => {
    const groups = {};
    filtered.forEach((i) => {
      const s = i.source || "unknown";
      groups[s] = (groups[s] || 0) + 1;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  function exportCsv() {
    const rows = [["Email", "Nama", "Source", "Tanggal"], ...filtered.map((i) => [
      i.email, i.name || "", i.source || "", formatDate(i.createdAt)
    ])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">👥 Subscribers</h1>
          <p className="admin-panel-subtitle">{filtered.length} dari {items.length} email terdaftar</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv}>
          <Icon.Download size={14} /> Export CSV
        </button>
      </header>

      <div className="admin-card">
        <div className="admin-search-box">
          <Icon.Search size={16} />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari email atau nama..."
          />
        </div>

        {bySource.length > 0 && (
          <div className="admin-source-tags">
            {bySource.slice(0, 8).map(([source, count]) => (
              <button 
                key={source}
                className={`admin-source-tag ${query === source ? "active" : ""}`}
                onClick={() => setQuery(query === source ? "" : source)}
              >
                {source} <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="admin-loading-inline">
            <div className="admin-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-emoji">📭</div>
            <p>Tidak ada subscriber</p>
          </div>
        ) : (
          <div className="admin-subscriber-list">
            {filtered.map((item) => (
              <div key={item.id} className="admin-subscriber-item">
                <div className="admin-subscriber-avatar">
                  {(item.name || item.email).charAt(0).toUpperCase()}
                </div>
                <div className="admin-subscriber-info">
                  <div className="admin-subscriber-email">{item.email}</div>
                  <div className="admin-subscriber-meta">
                    {item.name && <span>{item.name}</span>}
                    <span className="admin-subscriber-source">{item.source || "unknown"}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [theme, setTheme] = React.useState("cool");
  const [saved, setSaved] = React.useState(false);

  async function save() {
    await api("/admin/settings/theme", {
      method: "PUT",
      body: JSON.stringify({ key: "theme", value: { palette: theme, density: "cozy", font: "grotesk" } }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const themes = [
    { id: "warm", label: "Warm", emoji: "🌅", desc: "Krem hangat", bg: "#FBF3E2" },
    { id: "cool", label: "Cool", emoji: "❄️", desc: "Biru fresh", bg: "#F0F4FF" },
    { id: "sage", label: "Sage", emoji: "🌿", desc: "Hijau natural", bg: "#F5F1E8" },
    { id: "blossom", label: "Blossom", emoji: "🌸", desc: "Pink lembut", bg: "#FFFAF0" },
  ];

  return (
    <div className="admin-panel">
      <header className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">⚙️ Settings</h1>
          <p className="admin-panel-subtitle">Konfigurasi website</p>
        </div>
      </header>

      <div className="admin-card">
        <h3 className="admin-settings-title">Pilih Tema Website</h3>
        <div className="admin-theme-grid">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`admin-theme-card ${theme === t.id ? "active" : ""}`}
              onClick={() => setTheme(t.id)}
              style={{ "--theme-bg": t.bg }}
            >
              <span className="admin-theme-preview" style={{ background: t.bg }} />
              <div className="admin-theme-info">
                <span className="admin-theme-emoji">{t.emoji}</span>
                <span className="admin-theme-label">{t.label}</span>
                <span className="admin-theme-desc">{t.desc}</span>
              </div>
              {theme === t.id && <span className="admin-theme-check">✓</span>}
            </button>
          ))}
        </div>

        {saved && (
          <div className="admin-toast admin-toast-success">
            ✅ Tema tersimpan!
          </div>
        )}

        <div className="admin-form-actions" style={{ marginTop: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={save}>
            💾 Simpan Tema
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getIcon(name) {
  const icons = {
    Grid: "⊞",
    FileText: "📝",
    Users: "👥",
    Settings: "⚙️",
    Mail: "✉️",
    Lock: "🔒",
    Arrow: "→",
    ExternalLink: "↗",
    Search: "🔍",
    Download: "⬇",
    LogOut: "→",
  };
  return icons[name] || "•";
}
