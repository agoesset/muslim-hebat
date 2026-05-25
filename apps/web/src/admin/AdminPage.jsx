import React from "react";
import { api } from "../api.js";
import { applyTheme } from "../theme.js";
import "../styles.css";
import "./admin.css";

const resources = [
  { key: "articles", label: "Bacaan", fields: ["slug", "title", "excerpt", "category", "author", "status"] },
  { key: "products", label: "Produk", fields: ["slug", "name", "excerpt", "category", "priceCents", "status"] },
  { key: "kajian", label: "Kajian", fields: ["slug", "title", "excerpt", "speaker", "location", "eventType", "startsAt", "status"] },
  { key: "classes", label: "Kelas", fields: ["slug", "title", "excerpt", "category", "level", "format", "priceCents", "status"] }
];

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

  if (loading) return <AdminShell><div className="admin-card">Memuat sesi admin...</div></AdminShell>;
  if (!user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

function AdminShell({ children }) {
  return (
    <main className="admin-shell">
      <div className="admin-brand">Muslim Hebat Admin</div>
      {children}
    </main>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = React.useState("admin@muslimhebat.local");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminShell>
      <form className="admin-card admin-login" onSubmit={submit}>
        <h1>Login Admin</h1>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="admin-error">{error}</p>}
        <button className="btn btn--primary" type="submit">Masuk</button>
      </form>
    </AdminShell>
  );
}

function Dashboard({ user, onLogout }) {
  const [active, setActive] = React.useState(resources[0].key);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    onLogout();
  }

  return (
    <AdminShell>
      <div className="admin-top">
        <div>
          <h1>Dashboard</h1>
          <p>{user.name} · {user.email}</p>
        </div>
        <button className="btn btn--sm" onClick={logout}>Logout</button>
      </div>
      <div className="admin-tabs">
        {resources.map((resource) => (
          <button key={resource.key} className={active === resource.key ? "active" : ""} onClick={() => setActive(resource.key)}>
            {resource.label}
          </button>
        ))}
        <button className={active === "subscribers" ? "active" : ""} onClick={() => setActive("subscribers")}>Subscribers</button>
        <button className={active === "settings" ? "active" : ""} onClick={() => setActive("settings")}>Settings</button>
      </div>
      {resources.map((resource) => active === resource.key && <ResourcePanel key={resource.key} resource={resource} />)}
      {active === "subscribers" && <ReadOnlyPanel path="/admin/subscribers" title="Subscribers" />}
      {active === "settings" && <SettingsPanel />}
    </AdminShell>
  );
}

function ResourcePanel({ resource }) {
  const emptyDraft = Object.fromEntries(resource.fields.map((field) => [field, field === "status" ? "DRAFT" : ""]));
  const [items, setItems] = React.useState([]);
  const [draft, setDraft] = React.useState(emptyDraft);
  const [editing, setEditing] = React.useState(null);
  const [error, setError] = React.useState("");

  const load = React.useCallback(() => {
    api(`/admin/${resource.key}`).then(setItems).catch((err) => setError(err.message));
  }, [resource.key]);

  React.useEffect(() => {
    setDraft(emptyDraft);
    setEditing(null);
    setError("");
    load();
  }, [resource.key]);

  async function save(event) {
    event.preventDefault();
    setError("");
    const body = normalizeDraft(draft);
    const path = editing ? `/admin/${resource.key}/${editing}` : `/admin/${resource.key}`;
    const method = editing ? "PATCH" : "POST";
    try {
      await api(path, { method, body: JSON.stringify(body) });
      setDraft(emptyDraft);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await api(`/admin/${resource.key}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <section className="admin-grid">
      <form className="admin-card admin-form" onSubmit={save}>
        <h2>{editing ? "Edit" : "Tambah"} {resource.label}</h2>
        {resource.fields.map((field) => (
          <label key={field}>{field}
            <input value={draft[field] ?? ""} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} />
          </label>
        ))}
        {error && <p className="admin-error">{error}</p>}
        <button className="btn btn--primary" type="submit">Simpan</button>
      </form>
      <div className="admin-card admin-list">
        <h2>Daftar {resource.label}</h2>
        {items.length === 0 && <p>Belum ada data.</p>}
        {items.map((item) => (
          <article key={item.id}>
            <strong>{item.title || item.name || item.email}</strong>
            <span>{item.slug || item.status}</span>
            <div>
              <button className="btn btn--sm" onClick={() => { setEditing(item.id); setDraft({ ...emptyDraft, ...item }); }}>Edit</button>
              <button className="btn btn--sm" onClick={() => remove(item.id)}>Hapus</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadOnlyPanel({ path, title }) {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => { api(path).then(setItems).catch(() => setItems([])); }, [path]);
  return (
    <div className="admin-card admin-list">
      <h2>{title}</h2>
      {items.length === 0 && <p>Belum ada data.</p>}
      {items.map((item) => <article key={item.id}><strong>{item.email}</strong><span>{item.name || item.source || "-"}</span></article>)}
    </div>
  );
}

function SettingsPanel() {
  const [theme, setTheme] = React.useState("cool");
  const [message, setMessage] = React.useState("");

  async function save() {
    await api("/admin/settings/theme", {
      method: "PUT",
      body: JSON.stringify({ key: "theme", value: { palette: theme, density: "cozy", font: "grotesk", illustrations: true } })
    });
    setMessage("Settings tersimpan.");
  }

  return (
    <div className="admin-card admin-form">
      <h2>Site Settings</h2>
      <label>Default Theme
        <select value={theme} onChange={(event) => setTheme(event.target.value)}>
          <option value="cool">cool</option>
          <option value="warm">warm</option>
          <option value="sage">sage</option>
          <option value="blossom">blossom</option>
        </select>
      </label>
      <button className="btn btn--primary" onClick={save}>Simpan Settings</button>
      {message && <p>{message}</p>}
    </div>
  );
}

function normalizeDraft(draft) {
  const normalized = {};
  for (const [key, value] of Object.entries(draft)) {
    if (value === "" || key === "id" || key === "createdAt" || key === "updatedAt") continue;
    normalized[key] = key === "priceCents" ? Number(value) : value;
  }
  return normalized;
}
