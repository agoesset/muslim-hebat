import React from "react";
import { api } from "../../api.js";
import { renderAdminIcon } from "../../lucide-icons.jsx";

export function SettingsPanel() {
  const [theme, setTheme] = React.useState("cool");
  const [siteMetadata, setSiteMetadata] = React.useState({
    title: "",
    description: "",
    contactEmail: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    telegramUrl: "",
    spotifyUrl: ""
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    api("/admin/settings")
      .then((settings) => {
        if (Array.isArray(settings)) {
          const themeSetting = settings.find((s) => s.key === "theme");
          if (themeSetting && themeSetting.value && themeSetting.value.palette) {
            setTheme(themeSetting.value.palette);
          }

          const siteSetting = settings.find((s) => s.key === "site");
          if (siteSetting && siteSetting.value) {
            setSiteMetadata({
              title: siteSetting.value.title || "",
              description: siteSetting.value.description || "",
              contactEmail: siteSetting.value.contactEmail || "",
              facebookUrl: siteSetting.value.facebookUrl || "",
              instagramUrl: siteSetting.value.instagramUrl || "",
              youtubeUrl: siteSetting.value.youtubeUrl || "",
              tiktokUrl: siteSetting.value.tiktokUrl || "",
              telegramUrl: siteSetting.value.telegramUrl || "",
              spotifyUrl: siteSetting.value.spotifyUrl || "",
            });
          }
        }
      })
      .catch((err) => {
        console.error("Gagal memuat pengaturan:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all([
        api("/admin/settings/theme", {
          method: "PUT",
          body: JSON.stringify({ key: "theme", value: { palette: theme, density: "cozy", font: "grotesk" } }),
        }),
        api("/admin/settings/site", {
          method: "PUT",
          body: JSON.stringify({ key: "site", value: siteMetadata }),
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(`Gagal menyimpan pengaturan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const themes = [
    { id: "warm", label: "Warm", icon: "warm", desc: "Krem hangat", bg: "#FBF3E2" },
    { id: "cool", label: "Cool", icon: "cool", desc: "Biru fresh", bg: "#F0F4FF" },
    { id: "sage", label: "Sage", icon: "sage", desc: "Hijau natural", bg: "#F5F1E8" },
    { id: "blossom", label: "Blossom", icon: "blossom", desc: "Pink lembut", bg: "#FFFAF0" },
  ];

  if (loading) {
    return (
      <div className="admin-panel">
        <header className="admin-panel-header" style={{ marginBottom: "24px" }}>
          <div>
            <span className="admin-skeleton" style={{ width: "160px", height: "28px", display: "block", marginBottom: "8px" }} />
            <span className="admin-skeleton" style={{ width: "320px", height: "14px", display: "block" }} />
          </div>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Theme card skeleton */}
          <div className="admin-card" style={{ padding: "24px" }}>
            <span className="admin-skeleton" style={{ width: "120px", height: "18px", marginBottom: "16px", display: "block" }} />
            <div className="admin-theme-grid" style={{ padding: 0 }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="admin-card" style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "center", border: "1.5px solid rgba(31,58,45,0.06)", height: "98px", background: "rgba(31,58,45,0.01)" }}>
                  <span className="admin-skeleton admin-skeleton-circle" style={{ width: "56px", height: "56px" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    <span className="admin-skeleton admin-skeleton-line" style={{ width: "60px" }} />
                    <span className="admin-skeleton admin-skeleton-line" style={{ width: "100px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form card skeleton */}
          <div className="admin-card" style={{ padding: "24px" }}>
            <span className="admin-skeleton" style={{ width: "180px", height: "18px", marginBottom: "20px", display: "block" }} />
            <div className="admin-form-field" style={{ marginBottom: "16px" }}>
              <span className="admin-skeleton" style={{ width: "120px", height: "14px", marginBottom: "8px", display: "block" }} />
              <span className="admin-skeleton admin-skeleton-rect" />
            </div>
            <div className="admin-form-field" style={{ marginBottom: "16px" }}>
              <span className="admin-skeleton" style={{ width: "140px", height: "14px", marginBottom: "8px", display: "block" }} />
              <span className="admin-skeleton" style={{ width: "100%", height: "80px", borderRadius: "6px" }} />
            </div>
            <div className="admin-form-field" style={{ marginBottom: "20px" }}>
              <span className="admin-skeleton" style={{ width: "100px", height: "14px", marginBottom: "8px", display: "block" }} />
              <span className="admin-skeleton admin-skeleton-rect" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="admin-panel-title" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
            {renderAdminIcon("settings", { size: 24 })} Settings
          </h1>
          <p className="admin-panel-subtitle">Konfigurasi tampilan dan metadata utama website Muslim Hebat.</p>
        </div>
      </header>

      {saved && (
        <div className="admin-toast admin-toast-success" style={{ marginBottom: "24px" }}>
          {renderAdminIcon("check", { size: 16 })} Pengaturan berhasil disimpan!
        </div>
      )}

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Theme Settings Card */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 className="admin-settings-title" style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 16px 0" }}>Tampilan & Tema</h3>
          <div className="admin-theme-grid">
            {themes.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`admin-theme-card ${theme === t.id ? "active" : ""}`}
                onClick={() => setTheme(t.id)}
                style={{ "--theme-bg": t.bg }}
              >
                <span className="admin-theme-preview" style={{ background: t.bg }}>
                  {renderAdminIcon(t.icon, { size: 24 })}
                </span>
                <div className="admin-theme-info">
                  <span className="admin-theme-label">{t.label}</span>
                  <span className="admin-theme-desc">{t.desc}</span>
                </div>
                {theme === t.id && <span className="admin-theme-check">{renderAdminIcon("check", { size: 16 })}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Settings Card */}
        <div className="admin-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 20px 0" }}>Informasi Umum Website</h3>
          
          <div className="admin-form-field" style={{ marginBottom: "16px" }}>
            <label>Nama / Judul Situs</label>
            <input
              type="text"
              value={siteMetadata.title}
              onChange={(e) => setSiteMetadata((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Muslim Hebat"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
            />
          </div>

          <div className="admin-form-field" style={{ marginBottom: "16px" }}>
            <label>Deskripsi Situs (SEO)</label>
            <textarea
              value={siteMetadata.description}
              onChange={(e) => setSiteMetadata((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Portal inspirasi keislaman modern..."
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)", resize: "vertical" }}
            />
          </div>

          <div className="admin-form-field" style={{ marginBottom: "20px" }}>
            <label>Email Kontak</label>
            <input
              type="email"
              value={siteMetadata.contactEmail}
              onChange={(e) => setSiteMetadata((prev) => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="kontak@muslimhebat.id"
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
            />
          </div>

          <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "24px 0 12px 0", borderTop: "1px solid rgba(31,58,45,0.08)", paddingTop: "16px" }}>Tautan Sosial Media</h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div className="admin-form-field">
              <label>Facebook URL</label>
              <input
                type="url"
                value={siteMetadata.facebookUrl}
                onChange={(e) => setSiteMetadata((prev) => ({ ...prev, facebookUrl: e.target.value }))}
                placeholder="https://facebook.com/muslimhebat"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
              />
            </div>
            <div className="admin-form-field">
              <label>Instagram URL</label>
              <input
                type="url"
                value={siteMetadata.instagramUrl}
                onChange={(e) => setSiteMetadata((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                placeholder="https://instagram.com/muslimhebat"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
              />
            </div>
            <div className="admin-form-field">
              <label>YouTube URL</label>
              <input
                type="url"
                value={siteMetadata.youtubeUrl}
                onChange={(e) => setSiteMetadata((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                placeholder="https://youtube.com/c/muslimhebat"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
              />
            </div>
            <div className="admin-form-field">
              <label>TikTok URL</label>
              <input
                type="url"
                value={siteMetadata.tiktokUrl || ""}
                onChange={(e) => setSiteMetadata((prev) => ({ ...prev, tiktokUrl: e.target.value }))}
                placeholder="https://tiktok.com/@muslimhebat"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
              />
            </div>
            <div className="admin-form-field">
              <label>Telegram URL</label>
              <input
                type="url"
                value={siteMetadata.telegramUrl || ""}
                onChange={(e) => setSiteMetadata((prev) => ({ ...prev, telegramUrl: e.target.value }))}
                placeholder="https://t.me/muslimhebat"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
              />
            </div>
            <div className="admin-form-field">
              <label>Spotify Podcast URL</label>
              <input
                type="url"
                value={siteMetadata.spotifyUrl || ""}
                onChange={(e) => setSiteMetadata((prev) => ({ ...prev, spotifyUrl: e.target.value }))}
                placeholder="https://open.spotify.com/show/..."
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1.5px solid rgba(31,58,45,0.15)" }}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}>
            {saving ? (
              <>
                <div className="admin-spinner" style={{ width: "14px", height: "14px", borderColor: "white", borderTopColor: "transparent" }} /> Menyimpan...
              </>
            ) : (
              <>
                {renderAdminIcon("save", { size: 16 })} Simpan Semua Pengaturan
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default SettingsPanel;

