import React from "react";
import { api } from "../api.js";
import { applyTheme } from "../theme.js";
import "../styles.css";
import "./admin.css";

const resources = [
  { key: "articles", label: "Bacaan", fields: ["slug", "title", "excerpt", "body", "category", "author", "color", "emoji", "date", "time", "reads", "claps", "tag", "featured", "size", "status"] },
  { key: "products", label: "Produk", fields: ["slug", "name", "excerpt", "description", "category", "priceCents", "originalPriceCents", "rating", "sold", "tag", "color", "emoji", "status"] },
  { key: "kajian", label: "Kajian", fields: ["slug", "title", "excerpt", "speaker", "location", "eventType", "startsAt", "date", "month", "day", "time", "attendees", "priceCents", "free", "color", "status"] },
  { key: "classes", label: "Kelas", fields: ["slug", "title", "excerpt", "description", "category", "level", "format", "instructor", "lessons", "duration", "students", "rating", "reviews", "priceCents", "originalPriceCents", "tag", "batch", "startDate", "startDay", "schedule", "platform", "slots", "slotsTaken", "statusDetail", "color", "emoji", "status"] }
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
      {active === "subscribers" && <SubscribersPanel />}
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
            {renderField(field, draft[field], (value) => setDraft({ ...draft, [field]: value }))}
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

function SubscribersPanel() {
  const [items, setItems] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [error, setError] = React.useState("");

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

  function exportCsv() {
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
  }

  return (
    <div className="admin-card admin-list">
      <div className="admin-list-head">
        <div>
          <h2>Leads / Subscribers</h2>
          <p>{filtered.length} dari {items.length} kontak</p>
        </div>
        <button className="btn btn--sm btn--primary" onClick={exportCsv} disabled={filtered.length === 0}>Export CSV</button>
      </div>

      <input
        className="admin-search"
        placeholder="Cari email, nama, source..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {Object.keys(sourceCounts).length > 0 && (
        <div className="admin-source-chips">
          {Object.entries(sourceCounts).slice(0, 12).map(([source, count]) => (
            <button key={source} className="pill" onClick={() => setQuery(source)}>
              {source} · {count}
            </button>
          ))}
        </div>
      )}

      {error && <p className="admin-error">{error}</p>}
      {filtered.length === 0 && <p>Belum ada data.</p>}
      {filtered.map((item) => (
        <article key={item.id}>
          <strong>{item.email}</strong>
          <span>{item.name || "Tanpa nama"}</span>
          <small>{item.source || "unknown"} · {formatDate(item.createdAt)}</small>
        </article>
      ))}
    </div>
  );
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
  if (field === "status") {
    return (
      <select value={value || "DRAFT"} onChange={(e) => onChange(e.target.value)}>
        <option value="DRAFT">DRAFT</option>
        <option value="PUBLISHED">PUBLISHED</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
    );
  }
  if (["featured", "free"].includes(field)) {
    return (
      <select value={value ? "true" : "false"} onChange={(e) => onChange(e.target.value === "true")}>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }
  if (["body", "description", "excerpt"].includes(field)) {
    return <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={field === "excerpt" ? 2 : 5} />;
  }
  return <input value={value || ""} onChange={(e) => onChange(e.target.value)} />;
}
