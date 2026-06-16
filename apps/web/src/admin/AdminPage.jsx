import React from "react";
import { api } from "../api.js";
import { applyTheme } from "../theme.js";
import { Icon } from "../icons.jsx";
import "../styles.css";
import "./admin.css";

const resources = [
  { key: "articles", label: "Bacaan", icon: "Book", fields: ["slug", "title", "excerpt", "body", "category", "author", "color", "emoji", "date", "time", "reads", "claps", "tag", "featured", "size", "status"] },
  { key: "products", label: "Produk", icon: "Package", fields: ["slug", "name", "excerpt", "description", "category", "priceCents", "originalPriceCents", "rating", "sold", "tag", "color", "emoji", "status"] },
  { key: "kajian", label: "Kajian", icon: "Mic", fields: ["slug", "title", "excerpt", "speaker", "location", "eventType", "startsAt", "date", "month", "day", "time", "attendees", "priceCents", "free", "color", "status"] },
  { key: "classes", label: "Kelas", icon: "GraduationCap", fields: ["slug", "title", "excerpt", "description", "category", "level", "format", "instructor", "lessons", "duration", "students", "rating", "reviews", "priceCents", "originalPriceCents", "tag", "batch", "startDate", "startDay", "schedule", "platform", "slots", "slotsTaken", "statusDetail", "color", "emoji", "status"] }
];

const statusBadge = {
  PUBLISHED: { color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Published" },
  DRAFT: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Draft" },
  ARCHIVED: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", label: "Archived" }
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

  if (loading) return <AdminShell><LoadingState/></AdminShell>;
  if (!user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

function LoadingState() {
  return (
    <div className="admin-loading">
      <div className="admin-spinner"/>
      <p>Memuat sesi admin...</p>
    </div>
  );
}

function AdminShell({ children, sidebar }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-logo">✦</span>
          <span>Muslim Hebat</span>
        </div>
        {sidebar}
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = React.useState("admin@muslimhebat.local");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-header">
          <span className="admin-logo-large">✦</span>
          <h1>Masuk Admin</h1>
          <p>Kelola konten Muslim Hebat</p>
        </div>
        
        <div className="admin-form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@muslimhebat.local"
          />
        </div>
        
        <div className="admin-form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        
        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        
        <button 
          className="admin-btn admin-btn-primary admin-btn-full" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Memuat..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [active, setActive] = React.useState(resources[0].key);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    onLogout();
  }

  const sidebar = (
    <>
      <nav className="admin-nav">
        <div className="admin-nav-section">
          <span className="admin-nav-label">Konten</span>
          {resources.map((resource) => (
            <button
              key={resource.key}
              className={`admin-nav-item ${active === resource.key ? "active" : ""}`}
              onClick={() => { setActive(resource.key); setIsMobileMenuOpen(false); }}
            >
              <span className="admin-nav-icon">{getIcon(resource.icon)}</span>
              <span>{resource.label}</span>
            </button>
          ))}
        </div>
        
        <div className="admin-nav-section">
          <span className="admin-nav-label">Data</span>
          <button
            className={`admin-nav-item ${active === "subscribers" ? "active" : ""}`}
            onClick={() => { setActive("subscribers"); setIsMobileMenuOpen(false); }}
          >
            <span className="admin-nav-icon">{getIcon("Users")}</span>
            <span>Subscribers</span>
          </button>
        </div>
        
        <div className="admin-nav-section">
          <span className="admin-nav-label">Sistem</span>
          <button
            className={`admin-nav-item ${active === "settings" ? "active" : ""}`}
            onClick={() => { setActive("settings"); setIsMobileMenuOpen(false); }}
          >
            <span className="admin-nav-icon">{getIcon("Settings")}</span>
            <span>Settings</span>
          </button>
        </div>
      </nav>
      
      <div className="admin-sidebar-footer">
        <div className="admin-user">
          <div className="admin-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="admin-user-info">
            <div className="admin-user-name">{user.name}</div>
            <div className="admin-user-email">{user.email}</div>
          </div>
        </div>
        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={logout}>
          {getIcon("LogOut")} Keluar
        </button>
      </div>
    </>
  );

  return (
    <AdminShell sidebar={sidebar}>
      <header className="admin-header">
        <button 
          className="admin-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {getIcon("Menu")}
        </button>
        <h1 className="admin-page-title">
          {resources.find(r => r.key === active)?.label || 
           (active === "subscribers" ? "Subscribers" : "Settings")}
        </h1>
        <div className="admin-header-actions">
          <a href="/" className="admin-btn admin-btn-ghost admin-btn-sm" target="_blank" rel="noopener">
            {getIcon("ExternalLink")} Lihat Site
          </a>
        </div>
      </header>
      
      {isMobileMenuOpen && (
        <div className="admin-mobile-nav" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="admin-mobile-nav-content" onClick={e => e.stopPropagation()}>
            <div className="admin-brand">
              <span className="admin-logo">✦</span>
              <span>Muslim Hebat</span>
            </div>
            {sidebar}
          </div>
        </div>
      )}
      
      <div className="admin-content">
        {resources.map((resource) => active === resource.key && (
          <ResourcePanel key={resource.key} resource={resource} />
        ))}
        {active === "subscribers" && <SubscribersPanel />}
        {active === "settings" && <SettingsPanel />}
      </div>
    </AdminShell>
  );
}

function ResourcePanel({ resource }) {
  const emptyDraft = Object.fromEntries(resource.fields.map((field) => [field, field === "status" ? "DRAFT" : ""]));
  const [items, setItems] = React.useState([]);
  const [draft, setDraft] = React.useState(emptyDraft);
  const [editing, setEditing] = React.useState(null);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [isSaving, setIsSaving] = React.useState(false);

  const load = React.useCallback(() => {
    api(`/admin/${resource.key}`).then(setItems).catch((err) => setError(err.message));
  }, [resource.key]);

  React.useEffect(() => {
    setDraft(emptyDraft);
    setEditing(null);
    setError("");
    setMessage("");
    setStatusFilter("ALL");
    load();
  }, [resource.key]);

  async function save(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    const body = normalizeDraft(draft);
    const path = editing ? `/admin/${resource.key}/${editing}` : `/admin/${resource.key}`;
    const method = editing ? "PATCH" : "POST";
    try {
      await api(path, { method, body: JSON.stringify(body) });
      setDraft(emptyDraft);
      setEditing(null);
      setMessage(`${resource.label} tersimpan.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    await api(`/admin/${resource.key}/${id}`, { method: "DELETE" });
    setMessage(`${resource.label} dihapus.`);
    load();
  }

  const visibleItems = React.useMemo(() => {
    if (statusFilter === "ALL") return items;
    return items.filter((item) => (item.status || "DRAFT") === statusFilter);
  }, [items, statusFilter]);

  const stats = React.useMemo(() => {
    const published = items.filter(i => i.status === "PUBLISHED").length;
    const draft = items.filter(i => i.status === "DRAFT").length;
    const archived = items.filter(i => i.status === "ARCHIVED").length;
    return { total: items.length, published, draft, archived };
  }, [items]);

  return (
    <div className="admin-panel">
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.total}</span>
          <span className="admin-stat-label">Total</span>
        </div>
        <div className="admin-stat-card admin-stat-published">
          <span className="admin-stat-value">{stats.published}</span>
          <span className="admin-stat-label">Published</span>
        </div>
        <div className="admin-stat-card admin-stat-draft">
          <span className="admin-stat-value">{stats.draft}</span>
          <span className="admin-stat-label">Draft</span>
        </div>
        <div className="admin-stat-card admin-stat-archived">
          <span className="admin-stat-value">{stats.archived}</span>
          <span className="admin-stat-label">Archived</span>
        </div>
      </div>

      <div className="admin-grid">
        <aside className="admin-form-panel">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>{editing ? "Edit" : "Tambah"} {resource.label}</h2>
              {editing && <span className="admin-badge admin-badge-ghost">Editing</span>}
            </div>
            
            <form onSubmit={save} className="admin-form">
              {resource.fields.map((field) => (
                <div key={field} className="admin-field">
                  <label htmlFor={field}>{field}</label>
                  {renderField(field, draft[field], (value) => setDraft({ ...draft, [field]: value }))}
                </div>
              ))}
              
              {error && <div className="admin-alert admin-alert-error">{error}</div>}
              {message && <div className="admin-alert admin-alert-success">{message}</div>}
              
              <div className="admin-form-actions">
                <button 
                  className="admin-btn admin-btn-primary" 
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
                {editing && (
                  <button 
                    className="admin-btn admin-btn-ghost" 
                    type="button" 
                    onClick={() => { setEditing(null); setDraft(emptyDraft); setMessage(""); }}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <section className="admin-list-panel">
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Daftar {resource.label}</h2>
                <p className="admin-text-muted">{visibleItems.length} dari {items.length} item</p>
              </div>
              <div className="admin-filter">
                <select 
                  className="admin-select" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Semua status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {visibleItems.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📭</div>
                <p>Belum ada data</p>
                <span>Tambah {resource.label} pertama menggunakan form di samping</span>
              </div>
            ) : (
              <div className="admin-table">
                {visibleItems.map((item) => {
                  const status = statusBadge[item.status] || statusBadge.DRAFT;
                  return (
                    <div key={item.id} className="admin-table-row">
                      <div className="admin-table-cell admin-table-main">
                        <div className="admin-item-title">{item.title || item.name || "Untitled"}</div>
                        <div className="admin-item-meta">
                          <span className="admin-item-slug">/{item.slug}</span>
                          <span 
                            className="admin-status-badge"
                            style={{ color: status.color, background: status.bg }}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <div className="admin-table-cell admin-table-actions">
                        <button 
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => { setEditing(item.id); setDraft({ ...emptyDraft, ...item }); setMessage(""); }}
                        >
                          Edit
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => remove(item.id)}
                        >
                          Hapus
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
  const [error, setError] = React.useState("");
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    api("/admin/subscribers")
      .then(setItems)
      .catch((err) => setError(err.message));
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => [item.email, item.name, item.source]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(q)));
  }, [items, query]);

  const sourceCounts = React.useMemo(() => {
    return filtered.reduce((acc, item) => {
      const key = item.source || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [filtered]);

  async function exportCsv() {
    setIsExporting(true);
    const rows = [["email", "name", "source", "createdAt"], ...filtered.map((item) => [item.email, item.name || "", item.source || "", item.createdAt || ""] )];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `muslim-hebat-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  }

  return (
    <div className="admin-panel">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2>Leads / Subscribers</h2>
            <p className="admin-text-muted">{filtered.length} dari {items.length} kontak</p>
          </div>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm" 
            onClick={exportCsv}
            disabled={filtered.length === 0 || isExporting}
          >
            {isExporting ? "Mengekspor..." : "Export CSV"}
          </button>
        </div>

        <div className="admin-search-bar">
          <span className="admin-search-icon">{getIcon("Search")}</span>
          <input
            className="admin-search-input"
            placeholder="Cari email, nama, source..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {Object.keys(sourceCounts).length > 0 && (
          <div className="admin-source-chips">
            {Object.entries(sourceCounts).slice(0, 12).map(([source, count]) => (
              <button 
                key={source} 
                className={`admin-chip ${query === source ? "active" : ""}`}
                onClick={() => setQuery(query === source ? "" : source)}
              >
                <span>{source}</span>
                <span className="admin-chip-count">{count}</span>
              </button>
            ))}
          </div>
        )}

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📭</div>
            <p>Tidak ada subscriber</p>
          </div>
        ) : (
          <div className="admin-table">
            {filtered.map((item) => (
              <div key={item.id} className="admin-table-row admin-table-row-subscriber">
                <div className="admin-table-cell">
                  <div className="admin-subscriber-email">{item.email}</div>
                  <div className="admin-subscriber-meta">
                    {item.name && <span>{item.name}</span>}
                    <span>{item.source || "unknown"}</span>
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
  const [activeTab, setActiveTab] = React.useState("theme");
  const [theme, setTheme] = React.useState("cool");
  const [message, setMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  async function saveTheme() {
    setIsSaving(true);
    await api("/admin/settings/theme", {
      method: "PUT",
      body: JSON.stringify({ key: "theme", value: { palette: theme, density: "cozy", font: "grotesk", illustrations: true } })
    });
    setMessage("Settings tersimpan.");
    setIsSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  const themeOptions = [
    { value: "cool", label: "Cool", desc: "Biru lembut, modern", color: "#F0F4FF" },
    { value: "warm", label: "Warm", desc: "Krem hangat, klasik", color: "#FBF3E2" },
    { value: "sage", label: "Sage", desc: "Hijau alami", color: "#F5F1E8" },
    { value: "blossom", label: "Blossom", desc: "Pink lembut", color: "#FFFAF0" }
  ];

  return (
    <div className="admin-panel">
      <div className="admin-settings-tabs">
        <button 
          className={`admin-settings-tab ${activeTab === "theme" ? "active" : ""}`}
          onClick={() => setActiveTab("theme")}
        >
          {getIcon("Palette")} Tema
        </button>
      </div>

      {activeTab === "theme" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Site Theme</h2>
          </div>
          
          <div className="admin-theme-grid">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                className={`admin-theme-option ${theme === opt.value ? "active" : ""}`}
                onClick={() => setTheme(opt.value)}
              >
                <div 
                  className="admin-theme-preview" 
                  style={{ background: opt.color }}
                />
                <div className="admin-theme-info">
                  <div className="admin-theme-label">{opt.label}</div>
                  <div className="admin-theme-desc">{opt.desc}</div>
                </div>
                {theme === opt.value && (
                  <div className="admin-theme-check">{getIcon("Check")}</div>
                )}
              </button>
            ))}
          </div>

          {message && <div className="admin-alert admin-alert-success">{message}</div>}
          
          <div className="admin-form-actions">
            <button 
              className="admin-btn admin-btn-primary" 
              onClick={saveTheme}
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan Tema"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeDraft(draft) {
  const normalized = {};
  for (const [key, value] of Object.entries(draft)) {
    if (value === "" || value === null || value === undefined || key === "id" || key === "createdAt" || key === "updatedAt") continue;
    if (["priceCents", "originalPriceCents", "reads", "claps", "sold", "date", "attendees", "lessons", "students", "reviews", "slots", "slotsTaken"].includes(key)) {
      normalized[key] = Number(value);
    } else if (["rating"].includes(key)) {
      normalized[key] = parseFloat(value);
    } else if (["featured", "free"].includes(key)) {
      normalized[key] = value === true || value === "true" || value === "on";
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

function renderField(field, value, onChange) {
  const baseProps = {
    id: field,
    value: value || "",
    onChange: (e) => onChange(e.target.type === "checkbox" ? e.target.checked : e.target.value)
  };

  if (field === "status") {
    return (
      <select {...baseProps} className="admin-select">
        <option value="DRAFT">DRAFT</option>
        <option value="PUBLISHED">PUBLISHED</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
    );
  }
  if (["featured", "free"].includes(field)) {
    return (
      <select {...baseProps} value={value ? "true" : "false"} className="admin-select">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }
  if (["body", "description", "excerpt"].includes(field)) {
    return <textarea {...baseProps} rows={field === "excerpt" ? 2 : 5} className="admin-textarea" />;
  }
  return <input {...baseProps} type="text" className="admin-input" />;
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getIcon(name) {
  const icons = {
    Book: "📖",
    Package: "📦", 
    Mic: "🎤",
    GraduationCap: "🎓",
    Users: "👥",
    Settings: "⚙️",
    LogOut: "→",
    ExternalLink: "↗",
    Menu: "☰",
    Search: "🔍",
    Palette: "🎨",
    Check: "✓"
  };
  return icons[name] || "•";
}
