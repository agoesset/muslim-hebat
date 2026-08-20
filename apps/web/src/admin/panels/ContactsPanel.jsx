import React from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";

export function ContactsPanel() {
  const { setUnreadMessages } = useOutletContext();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState("");

  const load = React.useCallback(() => {
    setLoading(true);
    api("/admin/contact")
      .then((data) => {
        setItems(data);
        setUnreadMessages?.(data.filter((m) => !m.read).length);
      })
      .catch((err) => setToastMessage(`Gagal memuat pesan: ${err.message}`))
      .finally(() => setLoading(false));
  }, [setUnreadMessages]);

  React.useEffect(() => { load(); }, [load]);

  async function markRead(item) {
    try {
      const updated = await api(`/admin/contact/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: true })
      });
      setItems((prev) => prev.map((row) => (row.id === item.id ? updated : row)));
      setUnreadMessages?.((count) => Math.max(0, (count || 1) - 1));
    } catch (err) {
      setToastMessage(err.message);
    }
  }

  async function removeItem(item) {
    if (!window.confirm(`Hapus pesan dari ${item.name}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api(`/admin/contact/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((row) => row.id !== item.id));
      if (!item.read) setUnreadMessages?.((count) => Math.max(0, (count || 1) - 1));
    } catch (err) {
      setToastMessage(err.message);
    }
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">{renderAdminIcon("mail", { size: 24 })} Pesan</h1>
          <p className="admin-panel-subtitle">{items.length} pesan masuk dari halaman kontak</p>
        </div>
      </header>
      {toastMessage && <div className="admin-toast admin-toast-error">{toastMessage}</div>}
      <div className="admin-card">
        {loading ? <p style={{ padding: 24 }}>Memuat…</p> : items.length === 0 ? (
          <div className="admin-empty-state" style={{ padding: 40 }}>
            <p>Belum ada pesan</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((item) => (
              <article key={item.id} style={{ padding: 20, borderBottom: "1px solid rgba(31,58,45,0.08)", background: item.read ? "transparent" : "rgba(184,221,196,0.18)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <strong>{item.subject}</strong>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>{item.name} · {item.email}</div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{new Date(item.createdAt).toLocaleString("id-ID")}</span>
                </div>
                <p style={{ margin: "12px 0 0", lineHeight: 1.6 }}>{item.message}</p>
                {!item.read && (
                  <button className="admin-btn admin-btn-sm" style={{ marginTop: 12 }} onClick={() => markRead(item)}>
                    Tandai dibaca
                  </button>
                )}
                <button
                  className="admin-btn admin-btn-sm admin-btn-danger"
                  style={{ marginTop: 12, marginLeft: !item.read ? 8 : 0 }}
                  onClick={() => removeItem(item)}
                >
                  Hapus
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
