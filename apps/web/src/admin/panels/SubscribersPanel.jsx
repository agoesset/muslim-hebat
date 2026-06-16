import React from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";

export function SubscribersPanel() {
  const { setSubscribers } = useOutletContext();
  const [items, setItems] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 15;

  // Add subscriber form states
  const [newEmail, setNewEmail] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newSource, setNewSource] = React.useState("manual");
  const [formError, setFormError] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const fetchSubscribers = React.useCallback(() => {
    setLoading(true);
    api("/admin/subscribers")
      .then((data) => {
        setItems(data);
        setSubscribers(data.length);
      })
      .catch((err) => {
        setToastMessage(`Gagal memuat subscribers: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [setSubscribers]);

  React.useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter((i) =>
      [i.email, i.name, i.source].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [items, query]);

  // Reset page to 1 when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const bySource = React.useMemo(() => {
    const groups = {};
    filtered.forEach((i) => {
      const s = i.source || "unknown";
      groups[s] = (groups[s] || 0) + 1;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedItems = React.useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filtered.slice(startIdx, startIdx + pageSize);
  }, [filtered, currentPage]);

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!newEmail) return;

    setAdding(true);
    try {
      await api("/public/subscribers", {
        method: "POST",
        body: JSON.stringify({
          email: newEmail.trim(),
          name: newName.trim() || null,
          source: newSource.trim() || "manual",
        }),
      });

      setNewEmail("");
      setNewName("");
      setNewSource("manual");
      setToastMessage("Subscriber berhasil ditambahkan!");
      fetchSubscribers();
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubscriber = async (email) => {
    if (!confirm(`Hapus subscriber dengan email ${email}?`)) return;

    try {
      await api("/public/subscribers/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setToastMessage(`Subscriber ${email} berhasil dihapus`);
      fetchSubscribers();
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setToastMessage(`Gagal menghapus subscriber: ${err.message}`);
    }
  };

  function exportCsv() {
    const rows = [
      ["Email", "Nama", "Source", "Tanggal"],
      ...filtered.map((i) => [i.email, i.name || "", i.source || "", formatDate(i.createdAt)]),
    ];
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
      <header className="admin-panel-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="admin-panel-title" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
            {renderAdminIcon("subscribers", { size: 24 })} Subscribers
          </h1>
          <p className="admin-panel-subtitle">
            {filtered.length} dari {items.length} email terdaftar
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv} disabled={filtered.length === 0}>
          {renderAdminIcon("download", { size: 14 })} Export CSV
        </button>
      </header>

      {toastMessage && (
        <div className={`admin-toast ${toastMessage.includes("Gagal") ? "admin-toast-error" : "admin-toast-success"}`} style={{ marginBottom: "20px" }}>
          {toastMessage}
        </div>
      )}

      {/* Manual Add Card */}
      <div className="admin-card" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Tambah Subscriber Baru (Manual)</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--ink-soft)" }}>Tambahkan pendaftar baru dari kegiatan offline atau administrasi manual.</p>
        </div>
        {formError && <div className="admin-toast admin-toast-error" style={{ marginBottom: "16px" }}>{formError}</div>}
        
        <form onSubmit={handleAddSubscriber} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px auto", gap: "16px", alignItems: "end" }}>
          <div className="admin-form-field" style={{ margin: 0 }}>
            <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Email *</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nama@email.com"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
            />
          </div>
          <div className="admin-form-field" style={{ margin: 0 }}>
            <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Nama Lengkap</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama subscriber..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
            />
          </div>
          <div className="admin-form-field" style={{ margin: 0 }}>
            <label style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Sumber</label>
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="manual"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
            />
          </div>
          <button type="submit" disabled={adding} className="admin-btn admin-btn-primary" style={{ padding: "0 24px", height: "42px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            {adding ? "Menambahkan..." : <>{renderAdminIcon("add", { size: 14 })} Tambah</>}
          </button>
        </form>
      </div>

      <div className="admin-card">
        {/* Table Filters & Search */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", padding: "20px 24px", borderBottom: "1.5px solid rgba(31,58,45,0.06)" }}>
          <div className="admin-search-box" style={{ maxWidth: "320px", flex: 1, margin: 0 }}>
            {renderAdminIcon("search", { size: 16 })}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari email atau nama..."
            />
          </div>
        </div>

        {bySource.length > 0 && (
          <div className="admin-source-tags" style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "16px 24px 20px" }}>
            {bySource.slice(0, 8).map(([source, count]) => (
              <button
                key={source}
                className={`admin-source-tag ${query === source ? "active" : ""}`}
                onClick={() => setQuery(query === source ? "" : source)}
                style={{
                  background: query === source ? "var(--ink)" : "rgba(31,58,45,0.04)",
                  color: query === source ? "var(--bg)" : "var(--ink)",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1.5px solid transparent",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease"
                }}
              >
                <span>{source}</span>
                <span style={{
                  background: query === source ? "rgba(255,255,255,0.2)" : "rgba(31,58,45,0.08)",
                  padding: "2px 6px",
                  borderRadius: "999px",
                  fontSize: "10px",
                  fontWeight: 600
                }}>{count}</span>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "rgba(31,58,45,0.03)", borderBottom: "1.5px solid rgba(31,58,45,0.06)", textAlign: "left" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Subscriber</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Sumber</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Tanggal Terdaftar</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} style={{ borderBottom: "1.5px solid rgba(31,58,45,0.04)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span className="admin-skeleton admin-skeleton-circle" />
                        <div>
                          <span className="admin-skeleton admin-skeleton-line" style={{ width: "140px", display: "block", marginBottom: "4px" }} />
                          <span className="admin-skeleton admin-skeleton-line" style={{ width: "80px", display: "block" }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "60px", height: "18px", borderRadius: "6px" }} />
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "90px" }} />
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "60px", height: "28px", borderRadius: "999px" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state" style={{ padding: "40px 20px" }}>
            <div className="admin-empty-emoji">{renderAdminIcon("empty", { size: 40 })}</div>
            <p>Tidak ada subscriber</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "rgba(31,58,45,0.03)", borderBottom: "1.5px solid rgba(31,58,45,0.06)", textAlign: "left" }}>
                    <th style={{ padding: "16px 24px", fontWeight: 600 }}>Subscriber</th>
                    <th style={{ padding: "16px 24px", fontWeight: 600 }}>Sumber</th>
                    <th style={{ padding: "16px 24px", fontWeight: 600 }}>Tanggal Terdaftar</th>
                    <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1.5px solid rgba(31,58,45,0.04)" }} className="admin-table-row">
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div className="admin-subscriber-avatar" style={{
                            width: "36px",
                            height: "36px",
                            background: "var(--sage)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            color: "var(--ink)",
                            fontSize: "14px",
                            flexShrink: 0
                          }}>
                            {(item.name || item.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--ink)" }}>{item.email}</div>
                            {item.name && <div style={{ fontSize: "12px", color: "var(--ink-soft)", marginTop: "2px" }}>{item.name}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span className="admin-subscriber-source" style={{
                          background: "rgba(31,58,45,0.06)",
                          color: "var(--ink)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 500
                        }}>
                          {item.source || "unknown"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--ink-soft)" }}>
                        {formatDate(item.createdAt)}
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteSubscriber(item.email)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          style={{ padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          title="Hapus subscriber"
                        >
                          {renderAdminIcon("delete", { size: 12 })} Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="admin-pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", padding: "20px 0" }}>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ border: "1.5px solid rgba(31,58,45,0.1)", display: "inline-flex", alignItems: "center" }}
                >
                  Sebelumnya
                </button>
                <span style={{ fontSize: "13px", fontWeight: 500 }}>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ border: "1.5px solid rgba(31,58,45,0.1)", display: "inline-flex", alignItems: "center" }}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
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

export default SubscribersPanel;


