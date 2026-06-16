import React from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";
import { resources, statusConfig } from "../constants.js";

export function ContentListPanel() {
  const { resourceType = "articles" } = useParams();
  const { counts, setCounts } = useOutletContext();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [message, setMessage] = React.useState("");

  const resource = resources.find((r) => r.key === resourceType) || resources[0];

  const fetchItems = React.useCallback(() => {
    setLoading(true);
    api(`/admin/${resourceType}`)
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        setMessage(`Error loading items: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [resourceType]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const refreshCounts = React.useCallback(() => {
    api(`/admin/${resourceType}`).then((d) => {
      setCounts((c) => ({ ...c, [resourceType]: d.length }));
    });
  }, [resourceType, setCounts]);

  async function remove(id) {
    if (!confirm(`Hapus ${resource.label.toLowerCase()} ini?`)) return;
    try {
      await api(`/admin/${resourceType}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
      refreshCounts();
      setMessage("Item berhasil dihapus!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`Gagal menghapus: ${err.message}`);
    }
  }

  const filteredItems = React.useMemo(() => {
    let result = items;
    if (filter !== "ALL") {
      result = result.filter((i) => (i.status || "DRAFT") === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) => {
        const title = (i.title || i.name || "").toLowerCase();
        const slug = (i.slug || "").toLowerCase();
        const category = (i.category || i.speaker || i.instructor || "").toLowerCase();
        return title.includes(q) || slug.includes(q) || category.includes(q);
      });
    }
    return result;
  }, [items, filter, searchQuery]);

  const formatPrice = (cents) => {
    if (cents === undefined || cents === null) return "-";
    const rp = cents / 100;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(rp);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-panel-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="admin-panel-title">Kelola {resource.label}</h1>
          <p className="admin-panel-subtitle">Daftar keseluruhan data {resource.label.toLowerCase()} yang tersimpan.</p>
        </div>
        <div className="admin-header-actions">
          <Link to={`/admin/konten/${resourceType}/new`} className="admin-btn admin-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            {renderAdminIcon("add", { size: 16 })} Tambah {resource.label} Baru
          </Link>
        </div>
      </header>

      {message && (
        <div className={`admin-toast ${message.includes("Error") || message.includes("Gagal") ? "admin-toast-error" : "admin-toast-success"}`} style={{ marginBottom: "20px" }}>
          {message}
        </div>
      )}

      <div className="admin-card">
        {/* Table Filters & Search */}
        <div className="admin-card-header" style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
          <div className="admin-search-box" style={{ maxWidth: "320px", flex: 1, margin: 0 }}>
            {renderAdminIcon("search", { size: 16 })}
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari ${resource.label.toLowerCase()}...`}
            />
          </div>
          <select
            className="admin-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.1)" }}
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {loading ? (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "rgba(31,58,45,0.03)", borderBottom: "1.5px solid rgba(31,58,45,0.06)", textAlign: "left" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Info Utama</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Slug</th>
                  
                  {/* Dynamic headers depending on resourceType */}
                  {resourceType === "articles" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Kategori</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Penulis</th>
                    </>
                  )}
                  {resourceType === "products" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Kategori</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Harga</th>
                    </>
                  )}
                  {resourceType === "kajian" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Pemateri</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Tanggal Mulai</th>
                    </>
                  )}
                  {resourceType === "classes" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Instruktur</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Kuota</th>
                    </>
                  )}

                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} style={{ borderBottom: "1.5px solid rgba(31,58,45,0.04)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "160px" }} />
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "100px" }} />
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "80px" }} />
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "120px" }} />
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "70px", height: "18px", borderRadius: "999px" }} />
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <span className="admin-skeleton admin-skeleton-line" style={{ width: "80px", height: "28px", borderRadius: "999px" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="admin-empty-state" style={{ padding: "60px 40px" }}>
            <div className="admin-empty-emoji">{renderAdminIcon("empty", { size: 40 })}</div>
            <p>Tidak ditemukan {resource.label.toLowerCase()}</p>
            <span>Silakan tambahkan data baru dengan menekan tombol di pojok kanan atas.</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "rgba(31,58,45,0.03)", borderBottom: "1.5px solid rgba(31,58,45,0.06)", textAlign: "left" }}>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Info Utama</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Slug</th>
                  
                  {/* Dynamic headers depending on resourceType */}
                  {resourceType === "articles" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Kategori</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Penulis</th>
                    </>
                  )}
                  {resourceType === "products" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Kategori</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Harga</th>
                    </>
                  )}
                  {resourceType === "kajian" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Pemateri</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Tanggal Mulai</th>
                    </>
                  )}
                  {resourceType === "classes" && (
                    <>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Instruktur</th>
                      <th style={{ padding: "16px 24px", fontWeight: 600 }}>Kuota</th>
                    </>
                  )}

                  <th style={{ padding: "16px 24px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const status = statusConfig[item.status || "DRAFT"];
                  const isFeatured = !!item.featured;
                  
                  return (
                    <tr key={item.id} style={{ borderBottom: "1.5px solid rgba(31,58,45,0.04)" }} className="admin-table-row">
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {isFeatured && (
                            <span title="Featured" style={{ color: "#f59e0b", display: "inline-flex" }}>
                              {renderAdminIcon("sparkle", { size: 14 })}
                            </span>
                          )}
                          <span style={{ fontWeight: 500, color: "var(--ink)" }}>
                            {item.title || item.name || "Untitled"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}><code style={{ background: "rgba(31,58,45,0.05)", padding: "2px 6px", borderRadius: "4px" }}>/{item.slug}</code></td>

                      {/* Dynamic columns */}
                      {resourceType === "articles" && (
                        <>
                          <td style={{ padding: "16px 24px" }}>{item.category || "-"}</td>
                          <td style={{ padding: "16px 24px" }}>{item.author || "-"}</td>
                        </>
                      )}
                      {resourceType === "products" && (
                        <>
                          <td style={{ padding: "16px 24px" }}>{item.category || "-"}</td>
                          <td style={{ padding: "16px 24px" }}>{formatPrice(item.priceCents)}</td>
                        </>
                      )}
                      {resourceType === "kajian" && (
                        <>
                          <td style={{ padding: "16px 24px" }}>{item.speaker || "-"}</td>
                          <td style={{ padding: "16px 24px" }}>{formatDate(item.startsAt)}</td>
                        </>
                      )}
                      {resourceType === "classes" && (
                        <>
                          <td style={{ padding: "16px 24px" }}>{item.instructor || "-"}</td>
                          <td style={{ padding: "16px 24px" }}>{item.slotsTaken || 0} / {item.slots || 0}</td>
                        </>
                      )}

                      <td style={{ padding: "16px 24px" }}>
                        <span className="admin-status-pill" style={{ color: status.color, background: status.bg }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <Link to={`/admin/konten/${resourceType}/edit/${item.id}`} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            {renderAdminIcon("edit", { size: 12 })} Edit
                          </Link>
                          <button onClick={() => remove(item.id)} className="admin-btn admin-btn-danger admin-btn-sm" style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px" }}>
                            {renderAdminIcon("delete", { size: 12 })}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentListPanel;
