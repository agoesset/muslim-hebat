import React from "react";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";

export function CommentsPanel() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState("");

  const load = React.useCallback(() => {
    setLoading(true);
    api("/admin/comments")
      .then(setItems)
      .catch((err) => setToastMessage(`Gagal memuat komentar: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function approve(item) {
    try {
      const updated = await api(`/admin/comments/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: true })
      });
      setItems((prev) => prev.map((row) => (row.id === item.id ? updated : row)));
    } catch (err) {
      setToastMessage(err.message);
    }
  }

  async function remove(item) {
    if (!confirm(`Hapus komentar dari ${item.name}?`)) return;
    try {
      await api(`/admin/comments/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((row) => row.id !== item.id));
    } catch (err) {
      setToastMessage(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">{renderAdminIcon("content", { size: 24 })} Komentar</h1>
          <p className="admin-panel-subtitle">{items.filter((i) => !i.approved).length} menunggu moderasi</p>
        </div>
      </header>
      {toastMessage && <div className="admin-toast admin-toast-error">{toastMessage}</div>}
      <div className="admin-card">
        {loading ? <p style={{ padding: 24 }}>Memuat…</p> : items.length === 0 ? (
          <div className="admin-empty-state" style={{ padding: 40 }}><p>Belum ada komentar</p></div>
        ) : (
          items.map((item) => (
            <article key={item.id} style={{ padding: 20, borderBottom: "1px solid rgba(31,58,45,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{item.name}</strong>
                <span style={{ fontSize: 12, color: item.approved ? "var(--sage-deep)" : "var(--peach-deep)" }}>
                  {item.approved ? "Disetujui" : "Menunggu"}
                </span>
              </div>
              <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>{item.text}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {!item.approved && (
                  <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => approve(item)}>Setujui</button>
                )}
                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(item)}>
                  {renderAdminIcon("delete", { size: 12 })} Hapus
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
