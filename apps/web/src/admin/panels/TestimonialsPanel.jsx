import React from "react";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";

const EMPTY_FORM = { name: "", role: "", text: "", color: "", targetType: "product", targetId: "" };

const TARGET_TYPES = [
  { value: "product", label: "Produk" },
  { value: "class", label: "Kelas" },
];

// Hanya field TestimonialDto (name, role, text, color, targetType, targetId).
// id/createdAt/updatedAt tidak pernah dikirim ke BE.
function buildPayload(form) {
  const payload = {
    name: form.name.trim(),
    text: form.text.trim(),
    targetType: form.targetType
  };
  const role = form.role.trim();
  if (role) payload.role = role;
  const color = form.color.trim();
  if (color) payload.color = color;
  const targetId = form.targetId.trim();
  if (targetId) payload.targetId = targetId;
  return payload;
}

export function TestimonialsPanel() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editing, setEditing] = React.useState(null); // null | "new" | item
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);

  const notify = React.useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  const load = React.useCallback(() => {
    setLoading(true);
    api("/admin/testimonials")
      .then(setItems)
      .catch((err) => setToastMessage(`Gagal memuat testimonials: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing("new");
    setForm(EMPTY_FORM);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name || "",
      role: item.role || "",
      text: item.text || "",
      color: item.color || "",
      targetType: item.targetType || "product",
      targetId: item.targetId || ""
    });
  }

  function closeForm() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload(form);
      if (editing === "new") {
        await api("/admin/testimonials", { method: "POST", body: JSON.stringify(payload) });
        notify("Testimonial berhasil dibuat!");
      } else {
        await api(`/admin/testimonials/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        notify("Testimonial berhasil diperbarui!");
      }
      closeForm();
      load();
    } catch (err) {
      notify(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!confirm(`Hapus testimonial dari ${item.name}?`)) return;
    try {
      await api(`/admin/testimonials/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((row) => row.id !== item.id));
      if (editing && editing.id === item.id) closeForm();
      notify("Testimonial berhasil dihapus!");
    } catch (err) {
      notify(`Gagal menghapus: ${err.message}`);
    }
  }

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((i) => {
      const name = (i.name || "").toLowerCase();
      const role = (i.role || "").toLowerCase();
      const text = (i.text || "").toLowerCase();
      const targetType = (i.targetType || "").toLowerCase();
      const targetId = (i.targetId || "").toLowerCase();
      return name.includes(q) || role.includes(q) || text.includes(q) || targetType.includes(q) || targetId.includes(q);
    });
  }, [items, searchQuery]);

  const targetLabel = (item) => {
    const typeLabel = TARGET_TYPES.find((t) => t.value === item.targetType)?.label || item.targetType;
    return item.targetId ? `${typeLabel} · ${item.targetId}` : typeLabel;
  };

  return (
    <div className="admin-panel">
      <header className="admin-panel-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="admin-panel-title">{renderAdminIcon("sparkle", { size: 24 })} Testimonials</h1>
          <p className="admin-panel-subtitle">Kelola testimoni yang tampil di halaman publik ({items.length} data).</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={openCreate} disabled={editing !== null}>
            {renderAdminIcon("add", { size: 16 })} Tambah Testimonial
          </button>
        </div>
      </header>

      {toastMessage && (
        <div className={`admin-toast ${toastMessage.includes("Gagal") ? "admin-toast-error" : "admin-toast-success"}`} style={{ marginBottom: 20 }}>
          {toastMessage}
        </div>
      )}

      {editing && (
        <form className="admin-card" onSubmit={submit} style={{ marginBottom: 24, padding: 24 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>
            {editing === "new" ? "Testimonial Baru" : `Edit: ${editing.name}`}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div className="admin-form-group">
              <label>Nama *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth: Bunda Lia"
                required
                minLength={2}
              />
            </div>
            <div className="admin-form-group">
              <label>Role</label>
              <input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="cth: Ibu rumah tangga"
              />
            </div>
            <div className="admin-form-group">
              <label>Warna avatar (CSS color)</label>
              <input
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                placeholder="cth: var(--peach) atau #f97316"
              />
            </div>
            <div className="admin-form-group">
              <label>Target *</label>
              <select
                value={form.targetType}
                onChange={(e) => setForm((f) => ({ ...f, targetType: e.target.value }))}
                required
              >
                {TARGET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Target ID (opsional, slug/id konten)</label>
              <input
                value={form.targetId}
                onChange={(e) => setForm((f) => ({ ...f, targetId: e.target.value }))}
                placeholder="kosong = tampil di semua halaman target"
              />
            </div>
          </div>
          <div className="admin-form-group" style={{ marginTop: 16 }}>
            <label>Testimoni *</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="Tulis isi testimoni di sini…"
              rows={4}
              required
              minLength={2}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(31,58,45,0.1)", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {renderAdminIcon("save", { size: 14 })} {saving ? "Menyimpan…" : "Simpan"}
            </button>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={closeForm} disabled={saving}>
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="admin-card">
        <div className="admin-card-header" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between" }}>
          <div className="admin-search-box" style={{ maxWidth: 320, flex: 1, margin: 0 }}>
            {renderAdminIcon("search", { size: 16 })}
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari testimonial…"
            />
          </div>
        </div>

        {loading ? <p style={{ padding: 24 }}>Memuat…</p> : filteredItems.length === 0 ? (
          <div className="admin-empty-state" style={{ padding: 40 }}>
            <div className="admin-empty-emoji">{renderAdminIcon("empty", { size: 40 })}</div>
            <p>Belum ada testimonial</p>
            <span>Tambahkan testimonial pertama dengan tombol di pojok kanan atas.</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "rgba(31,58,45,0.03)", borderBottom: "1.5px solid rgba(31,58,45,0.06)", textAlign: "left" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Nama</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Role</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Testimoni</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Target</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1.5px solid rgba(31,58,45,0.04)" }} className="admin-table-row">
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", background: item.color || "var(--sage)", border: "1.5px solid var(--ink)" }} title={item.color || "default"} />
                        <span style={{ fontWeight: 500, color: "var(--ink)" }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--ink-soft)" }}>{item.role || "-"}</td>
                    <td style={{ padding: "16px 24px", maxWidth: 360 }}>
                      <span style={{ color: "var(--ink-soft)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.text}>
                        {item.text.length > 80 ? `${item.text.slice(0, 80)}…` : item.text}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <code style={{ background: "rgba(31,58,45,0.05)", padding: "2px 6px", borderRadius: 4 }}>{targetLabel(item)}</code>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button onClick={() => openEdit(item)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {renderAdminIcon("edit", { size: 12 })} Edit
                        </button>
                        <button onClick={() => remove(item)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ display: "inline-flex", alignItems: "center" }}>
                          {renderAdminIcon("delete", { size: 12 })}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestimonialsPanel;
