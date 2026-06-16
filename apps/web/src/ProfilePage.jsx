import React from "react";
import { Icon } from "./icons.jsx";
import { Seo } from "./seo.jsx";

export function ProfilePage({ onNav, onOpenCerita }) {
  const [savedArticles, setSavedArticles] = React.useState([]);
  const [profile, setProfile] = React.useState({ name: "", email: "" });
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("mh-saved-articles") || "[]");
      setSavedArticles(saved);
      const prof = JSON.parse(localStorage.getItem("mh-profile") || "{\"name\":\"\",\"email\":\"\"}");
      setProfile(prof);
    } catch {
      // ignore
    }
  }, []);

  function saveProfile() {
    localStorage.setItem("mh-profile", JSON.stringify(profile));
    setEditing(false);
  }

  function removeArticle(id) {
    const next = savedArticles.filter(a => a.id !== id);
    setSavedArticles(next);
    localStorage.setItem("mh-saved-articles", JSON.stringify(next));
  }

  const hasSaved = savedArticles.length > 0;

  return (
    <div data-screen-label="Profile">
      <Seo title="Profil Kamu" description="Kelola profil, bacaan tersimpan, dan preferensi akun Muslim Hebat." noindex />

      <section className="shell" style={{ paddingTop: 24, paddingBottom: 32 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
            Profil <span style={{ fontFamily: "var(--font-hand)", color: "var(--coral-deep)", fontWeight: 500 }}>kamu</span>.
          </h1>
          <p style={{ color: "var(--ink-soft)", marginBottom: 32 }}>Kelola bacaan tersimpan dan preferensi akun.</p>

          {/* Profile card */}
          <div className="card" style={{ padding: 28, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", background: "var(--sage)",
                border: "2px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32
              }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 24, marginBottom: 4 }}>{profile.name || "Pengunjung"}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{profile.email || "Belum mengisi email"}</p>
              </div>
              <button className="btn btn--sm" onClick={() => setEditing(!editing)}>
                {editing ? "Batal" : "Edit profil"}
              </button>
            </div>

            {editing && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Nama</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      style={inputStyle}
                      placeholder="Nama kamu"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--ink-soft)", display: "block", marginBottom: 4 }}>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                      style={inputStyle}
                      placeholder="email@kamu.com"
                    />
                  </div>
                </div>
                <button className="btn btn--primary btn--sm" onClick={saveProfile} style={{ alignSelf: "flex-start" }}>
                  Simpan perubahan
                </button>
              </div>
            )}
          </div>

          {/* Saved articles */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 22 }}>📌 Bacaan tersimpan</h3>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{savedArticles.length} bacaan</span>
            </div>

            {hasSaved ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {savedArticles.map(a => (
                  <div key={a.id} className="card" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 14, background: a.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, border: "1.5px solid var(--ink)", flexShrink: 0
                    }}>
                      {a.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase" }}>{a.cat}</div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, margin: "4px 0", cursor: "pointer" }}
                          onClick={() => onOpenCerita && onOpenCerita(a)}>
                        {a.title}
                      </h4>
                      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.4 }}>{a.excerpt}</p>
                    </div>
                    <button
                      className="btn btn--sm btn--ghost"
                      onClick={() => removeArticle(a.id)}
                      title="Hapus dari simpanan"
                    >
                      <Icon.Bookmark size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>Belum ada bacaan tersimpan. Yuk baca dan simpan artikel yang kamu suka!</p>
                <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => onNav("bacaan")}>
                  Jelajahi bacaan
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 12,
  border: "1.5px solid rgba(31,58,45,0.12)",
  background: "var(--paper)",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  color: "var(--ink)",
  outline: "none",
};

export default ProfilePage;
