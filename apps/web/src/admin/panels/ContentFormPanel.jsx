import React from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";
import { resources, statusConfig } from "../constants.js";
import { RichTextEditor } from "../RichTextEditor.jsx";

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function ContentFormPanel() {
  const { resourceType = "articles", id } = useParams();
  const navigate = useNavigate();
  const { setCounts } = useOutletContext();

  const [draft, setDraft] = React.useState({ status: "DRAFT" });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSlugTouched, setIsSlugTouched] = React.useState(false);

  const resource = resources.find((r) => r.key === resourceType) || resources[0];
  const isEdit = !!id;

  // Fetch item details if editing
  React.useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api(`/admin/${resourceType}/${id}`)
        .then((data) => {
          setDraft(data);
          setIsSlugTouched(true);
        })
        .catch((err) => {
          setMessage(`Gagal memuat detail: ${err.message}`);
        })
        .finally(() => setLoading(false));
    } else {
      setDraft({ status: "DRAFT", featured: false });
      setIsSlugTouched(false);
    }
  }, [resourceType, id, isEdit]);

  // Sync slug auto-generation from Title/Name
  const handleTitleChange = (val) => {
    const updates = { title: val, name: val };
    if (!isEdit && !isSlugTouched) {
      updates.slug = generateSlug(val);
    }
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  // Dynamic readingTime calculation (200 words/min)
  React.useEffect(() => {
    if (resourceType === "articles" && draft.body !== undefined) {
      const words = draft.body
        ? draft.body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(w => w.length > 0).length
        : 0;
      const computedTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;
      
      // Update only if it differs to prevent infinite loop
      if (draft.readingTime !== computedTime) {
        setDraft((prev) => ({ ...prev, readingTime: computedTime }));
      }
    }
  }, [draft.body, resourceType]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api("/upload", {
        method: "POST",
        body: formData,
      });
      const imageField = (resourceType === "articles" || resourceType === "kajian") ? "coverImage" : "image";
      setDraft((prev) => ({ ...prev, [imageField]: res.url }));
    } catch (err) {
      alert(`Gagal mengunggah file: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const refreshCounts = React.useCallback(() => {
    api(`/admin/${resourceType}`).then((d) => {
      setCounts((c) => ({ ...c, [resourceType]: d.length }));
    });
  }, [resourceType, setCounts]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const path = isEdit ? `/admin/${resourceType}/${id}` : `/admin/${resourceType}`;
    const method = isEdit ? "PATCH" : "POST";

    // Clean up empty strings or fields to match backend DB expectations
    const payload = { ...draft };
    if (payload.priceCents) payload.priceCents = parseInt(payload.priceCents);
    if (payload.originalPriceCents) payload.originalPriceCents = parseInt(payload.originalPriceCents);
    if (payload.readingTime) payload.readingTime = parseInt(payload.readingTime);
    if (payload.slots) payload.slots = parseInt(payload.slots);
    if (payload.slotsTaken) payload.slotsTaken = parseInt(payload.slotsTaken);
    if (payload.lessons) payload.lessons = parseInt(payload.lessons);

    try {
      await api(path, {
        method,
        body: JSON.stringify(payload),
      });
      refreshCounts();
      setMessage("Data berhasil disimpan!");
      setTimeout(() => {
        navigate(`/admin/konten/${resourceType}`);
      }, 1500);
    } catch (err) {
      setMessage(`Gagal menyimpan: ${err.message}`);
      setSaving(false);
    }
  };

  const imageField = (resourceType === "articles" || resourceType === "kajian") ? "coverImage" : "image";
  const imageUrl = draft[imageField] || "";

  if (loading) {
    return (
      <div className="admin-panel admin-form-page">
        <header className="admin-panel-header" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="admin-skeleton" style={{ width: "80px", height: "32px", borderRadius: "999px" }} />
            <div>
              <span className="admin-skeleton" style={{ width: "200px", height: "24px", display: "block", marginBottom: "8px" }} />
              <span className="admin-skeleton" style={{ width: "300px", height: "14px", display: "block" }} />
            </div>
          </div>
        </header>

        <div className="admin-full-form">
          <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", alignItems: "start" }}>
            {/* Left Column Skeleton */}
            <div className="admin-form-left-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="admin-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="admin-form-field">
                    <span className="admin-skeleton" style={{ width: "80px", height: "14px", marginBottom: "8px" }} />
                    <span className="admin-skeleton admin-skeleton-rect" />
                  </div>
                  <div className="admin-form-field">
                    <span className="admin-skeleton" style={{ width: "60px", height: "14px", marginBottom: "8px" }} />
                    <span className="admin-skeleton admin-skeleton-rect" />
                  </div>
                </div>
                <div className="admin-form-field">
                  <span className="admin-skeleton" style={{ width: "160px", height: "14px", marginBottom: "8px" }} />
                  <span className="admin-skeleton" style={{ width: "100%", height: "80px", borderRadius: "6px" }} />
                </div>
                <div className="admin-form-field">
                  <span className="admin-skeleton" style={{ width: "120px", height: "14px", marginBottom: "8px" }} />
                  <span className="admin-skeleton" style={{ width: "100%", height: "240px", borderRadius: "6px" }} />
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="admin-form-right-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="admin-card" style={{ padding: "20px" }}>
                <span className="admin-skeleton" style={{ width: "100px", height: "18px", marginBottom: "16px", display: "block" }} />
                <span className="admin-skeleton admin-skeleton-rect" style={{ marginBottom: "16px" }} />
                <span className="admin-skeleton" style={{ width: "140px", height: "18px" }} />
              </div>
              <div className="admin-card" style={{ padding: "20px" }}>
                <span className="admin-skeleton" style={{ width: "120px", height: "18px", marginBottom: "16px", display: "block" }} />
                <span className="admin-skeleton" style={{ width: "100%", height: "120px", borderRadius: "8px", marginBottom: "16px" }} />
                <span className="admin-skeleton admin-skeleton-rect" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel admin-form-page">
      <header className="admin-panel-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to={`/admin/konten/${resourceType}`} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            {renderAdminIcon("arrow", { size: 14, style: { transform: "rotate(180deg)" } })} Kembali
          </Link>
          <div>
            <h1 className="admin-panel-title">
              {isEdit ? "Edit" : "Tambah"} {resource.label}
            </h1>
            <p className="admin-panel-subtitle">
              {isEdit ? "Perbarui informasi konten yang sudah ada." : "Buat entri konten baru di sistem."}
            </p>
          </div>
        </div>
      </header>

      {message && (
        <div className={`admin-toast ${message.includes("Gagal") ? "admin-toast-error" : "admin-toast-success"}`} style={{ marginBottom: "24px" }}>
          {message}
        </div>
      )}

      <form onSubmit={save} className="admin-full-form">
        <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", alignItems: "start" }}>
          
          {/* Left Column: Core Fields */}
          <div className="admin-form-left-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="admin-card" style={{ padding: "24px" }}>
              <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div className="admin-form-field">
                  <label>Judul / Nama *</label>
                  <input
                    type="text"
                    value={draft.title || draft.name || ""}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={`Masukkan nama/judul ${resource.label.toLowerCase()}...`}
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                  />
                </div>
                <div className="admin-form-field">
                  <label>Slug *</label>
                  <input
                    type="text"
                    value={draft.slug || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIsSlugTouched(val.trim() !== "");
                      setDraft((prev) => ({ ...prev, slug: val }));
                    }}
                    placeholder="url-friendly-slug-konten"
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                  />
                </div>
              </div>

              <div className="admin-form-field" style={{ marginBottom: "20px" }}>
                <label>Excerpt / Deskripsi Singkat</label>
                <textarea
                  value={draft.excerpt || ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  placeholder="Ringkasan singkat untuk tampilan kartu depan..."
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)", resize: "vertical" }}
                />
              </div>

              {/* Rich Text Editor for Body / Description */}
              {resourceType === "articles" ? (
                <div className="admin-form-field">
                  <label>Konten Artikel / Body</label>
                  <RichTextEditor
                    value={draft.body || ""}
                    onChange={(html) => setDraft((prev) => ({ ...prev, body: html }))}
                    placeholder="Mulai menulis konten artikel yang menginspirasi di sini..."
                  />
                </div>
              ) : (
                <div className="admin-form-field">
                  <label>Deskripsi Detail</label>
                  <RichTextEditor
                    value={draft.description || ""}
                    onChange={(html) => setDraft((prev) => ({ ...prev, description: html }))}
                    placeholder="Mulai menulis detail lengkap konten di sini..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Settings & Metadata */}
          <div className="admin-form-right-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Status & Featured */}
            <div className="admin-card" style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>Penerbitan</h3>
              <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                <label>Status</label>
                <select
                  value={draft.status || "DRAFT"}
                  onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="admin-form-field" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={!!draft.featured}
                  onChange={(e) => setDraft((prev) => ({ ...prev, featured: e.target.checked }))}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="featured-checkbox" style={{ margin: 0, cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
                  Featured / Unggulan
                </label>
              </div>
            </div>

            {/* Media Upload & Preview */}
            <div className="admin-card" style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>Media Utama</h3>
              
              <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                <label>Unggah Gambar</label>
                <div className="admin-file-upload-wrapper" style={{ border: "2px dashed rgba(31,58,45,0.2)", borderRadius: "8px", padding: "20px", textAlign: "center", background: "rgba(31,58,45,0.02)", cursor: "pointer", position: "relative" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                  />
                  {uploading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div className="admin-spinner" style={{ width: "24px", height: "24px" }} />
                      <span style={{ fontSize: "13px", color: "var(--ink)" }}>Mengunggah...</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--sage)" }}>{renderAdminIcon("image", { size: 28 })}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>Pilih file atau drop disini</span>
                      <span style={{ fontSize: "11px", color: "rgba(31,58,45,0.5)" }}>Maksimal 5MB (JPG, PNG, WEBP)</span>
                    </div>
                  )}
                </div>
              </div>

              {imageUrl && (
                <div className="admin-image-preview-container" style={{ marginBottom: "16px", borderRadius: "8px", overflow: "hidden", border: "1.5px solid rgba(31,58,45,0.1)" }}>
                  <img src={imageUrl} alt="Preview" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                </div>
              )}

              <div className="admin-form-field">
                <label>Atau URL Gambar Manual</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [imageField]: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                />
              </div>
            </div>

            {/* Resource Specific Side Panels */}
            <div className="admin-card" style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>Atribut Tambahan</h3>
              
              {resourceType === "articles" && (
                <>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Penulis</label>
                    <input
                      type="text"
                      value={draft.author || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="Nama penulis..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Kategori</label>
                    <input
                      type="text"
                      value={draft.category || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Kategori..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field">
                    <label>Waktu Baca (Menit)</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.readingTime || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, readingTime: parseInt(e.target.value) || 0 }))}
                      placeholder="Dihitung otomatis..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                </>
              )}

              {resourceType === "products" && (
                <>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Harga Jual (Rp) *</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.priceCents ? draft.priceCents / 100 : ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, priceCents: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                      placeholder="Contoh: 50000"
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Harga Coret / Asli (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.originalPriceCents ? draft.originalPriceCents / 100 : ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, originalPriceCents: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                      placeholder="Contoh: 75000"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field">
                    <label>Kategori</label>
                    <input
                      type="text"
                      value={draft.category || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Kategori..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                </>
              )}

              {resourceType === "kajian" && (
                <>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Pemateri (Ustadz)</label>
                    <input
                      type="text"
                      value={draft.speaker || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, speaker: e.target.value }))}
                      placeholder="Nama Ustadz pemateri..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Lokasi / Platform</label>
                    <input
                      type="text"
                      value={draft.location || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Masjid Jami / Zoom Link"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Tipe Kajian</label>
                    <select
                      value={draft.eventType || "Offline"}
                      onChange={(e) => setDraft((prev) => ({ ...prev, eventType: e.target.value }))}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    >
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Tanggal Kajian</label>
                    <input
                      type="date"
                      value={draft.startsAt ? new Date(draft.startsAt).toISOString().slice(0, 10) : ""}
                      onChange={(e) => {
                        const dateStr = e.target.value;
                        if (!dateStr) {
                          setDraft((prev) => ({ ...prev, startsAt: null, date: null, month: null, day: null }));
                          return;
                        }
                        const d = new Date(dateStr);
                        const dateNum = d.getDate();
                        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                        const monthName = months[d.getMonth()];
                        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                        const dayName = days[d.getDay()];
                        setDraft((prev) => ({
                          ...prev,
                          startsAt: d.toISOString(),
                          date: dateNum,
                          month: monthName,
                          day: dayName,
                        }));
                      }}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Waktu / Jam</label>
                    <input
                      type="text"
                      value={draft.time || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, time: e.target.value }))}
                      placeholder="Contoh: 19:30 - 21:00"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Harga Tiket (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      disabled={!!draft.free}
                      value={draft.free ? "" : (draft.priceCents ? draft.priceCents / 100 : "")}
                      onChange={(e) => setDraft((prev) => ({ ...prev, priceCents: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                      placeholder={draft.free ? "Gratis" : "Contoh: 25000"}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      id="free-checkbox"
                      checked={!!draft.free}
                      onChange={(e) => setDraft((prev) => ({ ...prev, free: e.target.checked, priceCents: e.target.checked ? 0 : prev.priceCents }))}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <label htmlFor="free-checkbox" style={{ margin: 0, cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
                      Kajian Gratis (Free)
                    </label>
                  </div>
                </>
              )}

              {resourceType === "classes" && (
                <>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Instruktur / Pengajar</label>
                    <input
                      type="text"
                      value={draft.instructor || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, instructor: e.target.value }))}
                      placeholder="Nama pengajar..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Jumlah Sesi / Materi</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.lessons || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, lessons: parseInt(e.target.value) || 0 }))}
                      placeholder="Contoh: 8"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Durasi</label>
                    <input
                      type="text"
                      value={draft.duration || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="Contoh: 4 Minggu"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Platform Belajar</label>
                    <input
                      type="text"
                      value={draft.platform || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, platform: e.target.value }))}
                      placeholder="Contoh: Zoom / Meet"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Harga Kelas (Rp) *</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.priceCents ? draft.priceCents / 100 : ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, priceCents: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                      placeholder="Contoh: 150000"
                      required
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Harga Coret / Asli (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.originalPriceCents ? draft.originalPriceCents / 100 : ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, originalPriceCents: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                      placeholder="Contoh: 300000"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Kategori</label>
                    <input
                      type="text"
                      value={draft.category || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Kategori..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Batch / Gelombang</label>
                    <input
                      type="text"
                      value={draft.batch || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, batch: e.target.value }))}
                      placeholder="Contoh: Batch 1"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Tanggal Mulai (Teks)</label>
                    <input
                      type="text"
                      value={draft.startDate || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, startDate: e.target.value }))}
                      placeholder="Contoh: 1 Juli 2026"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Jadwal Belajar</label>
                    <input
                      type="text"
                      value={draft.schedule || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, schedule: e.target.value }))}
                      placeholder="Contoh: Sabtu & Minggu, 10:00"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Format</label>
                    <input
                      type="text"
                      value={draft.format || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, format: e.target.value }))}
                      placeholder="Contoh: Live Webinar / Recording"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: "16px" }}>
                    <label>Total Slot Kuota</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.slots || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, slots: parseInt(e.target.value) || 0 }))}
                      placeholder="Contoh: 50"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                  <div className="admin-form-field">
                    <label>Slot Terisi</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.slotsTaken || ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, slotsTaken: parseInt(e.target.value) || 0 }))}
                      placeholder="Contoh: 12"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons card */}
            <div className="admin-card" style={{ padding: "20px", display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ flex: 1, display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px" }}
              >
                {saving ? (
                  <>
                    <div className="admin-spinner" style={{ width: "14px", height: "14px", borderColor: "white", borderTopColor: "transparent" }} /> Simpan...
                  </>
                ) : (
                  <>
                    {renderAdminIcon("save", { size: 16 })} Simpan Konten
                  </>
                )}
              </button>
              <Link
                to={`/admin/konten/${resourceType}`}
                className="admin-btn admin-btn-ghost"
                style={{ flex: 1, display: "inline-flex", justifyContent: "center", alignItems: "center", border: "1.5px solid rgba(31,58,45,0.15)", padding: "12px" }}
              >
                Batal
              </Link>
            </div>
            
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContentFormPanel;
