// CeritaPage — archive of articles ("Cerita & Catatan").

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob, SunDecor } from "./shell.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";

import { usePublicData } from "./hooks/usePublicData.js";

const KATEGORI = ["Semua", "Self-growth", "Parenting", "Tafsir santai", "Productivity", "Hubungan", "Ibadah harian"];

function normalizeArticles(api) {
  if (!api) return [];
  return api.map(a => ({ ...a, cat: a.category }));
}

export function CeritaPage({ onNav, onOpenCerita }) {
  const [cat, setCat] = React.useState("Semua");
  const { data: apiArticles, loading, error } = usePublicData("/public/articles");
  const articles = React.useMemo(() => {
    const normalized = normalizeArticles(apiArticles);
    return normalized;
  }, [apiArticles]);

  const list = cat === "Semua" ? articles : articles.filter(c => c.cat === cat);
  const featured = list.find(c => c.featured) || list[0];
  const rest = list.filter(c => c !== featured);

  return (
    <div data-screen-label="04 Bacaan">
      <CeritaHero/>

      <section className="shell" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 6 }}>kategori:</span>
          {KATEGORI.map(k => (
            <button key={k}
                    onClick={() => setCat(k)}
                    className="btn btn--sm"
                    style={{
                      background: cat === k ? "var(--ink)" : "var(--paper)",
                      color: cat === k ? "var(--bg)" : "var(--ink)",
                    }}>
              {k}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          {loading && <span style={{ fontSize: 13, color: "var(--sage-deep)" }}>Memuat…</span>}
          {error && <span style={{ fontSize: 13, color: "var(--coral-deep)" }}>Gagal memuat</span>}
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{list.length} bacaan</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 24, alignItems: "start" }}>
          {/* main column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {featured && <CeritaFeatured c={featured} onOpenCerita={onOpenCerita}/>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {rest.map(c => <CeritaCard key={c.id} c={c} onOpenCerita={onOpenCerita}/>)}
            </div>
          </div>

          {/* sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 100 }}>
            <PopularCerita articles={articles} onOpenCerita={onOpenCerita}/>
            <BrowseTags/>
            <AuthorSpotlight/>
          </aside>
        </div>
      </section>

      <NewsletterBlock/>
    </div>
  );
}

function CeritaHero() {
  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color="var(--butter)" size={240} top={40} right={80} opacity={0.45}/>
      <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center", position: "relative", overflow: "visible" }}>
        <div style={{ minWidth: 0 }}>
          <span className="pill pill--ink"><Icon.Sparkle size={12}/> 124 bacaan · update tiap pekan</span>
          <h1 style={{ fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 700, lineHeight: 0.95, marginTop: 16 }}>
            <span style={{ fontFamily: "var(--font-hand)", color: "var(--coral-deep)", fontWeight: 500 }}>Bacaan</span>{" "}
            <span style={{ background: "var(--sage)", padding: "0 12px 4px", borderRadius: 16, display: "inline-block", transform: "rotate(-1deg)" }}>&amp; Catatan</span><br/>
            yang nempel di hati.
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 16, maxWidth: 520 }}>
            Bacaan santai buat sore — dari self-growth, parenting, tafsir, sampai cerita-cerita kecil yang ternyata punya makna besar.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <button className="btn btn--primary">Lihat trending <Icon.Arrow size={14}/></button>
            <button className="btn">Acak satu bacaan</button>
          </div>
        </div>

        {/* sticker stack of bacaan */}
        <div style={{ position: "relative", height: 260 }}>
          <div className="card card--lilac drift" style={{ position: "absolute", top: 30, left: 0, width: 200, padding: 14, transform: "rotate(-5deg)", boxShadow: "4px 5px 0 var(--ink)" }}>
            <div style={{ fontSize: 36 }}>📖</div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", marginTop: 4, fontWeight: 700 }}>Tafsir santai</div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, marginTop: 2 }}>Al-Kahfi buat yang lagi galau</div>
          </div>
          <div className="card card--coral" style={{ position: "absolute", top: 0, right: 0, width: 200, padding: 14, transform: "rotate(4deg)", boxShadow: "4px 5px 0 var(--ink)" }}>
            <div style={{ fontSize: 36 }}>🌿</div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", marginTop: 4, fontWeight: 700 }}>Self-growth</div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, marginTop: 2 }}>5 hal kecil yang bikin tenang</div>
          </div>
          <span className="sticker illus-only wiggle" style={{ position: "absolute", bottom: 0, left: 100, background: "var(--butter)" }}>
            baca ini dulu ☕
          </span>
        </div>
      </div>
    </section>
  );
}

function CeritaFeatured({ c, onOpenCerita }) {
  return (
    <article className="card" style={{ padding: 0, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, overflow: "hidden" }}>
      <div style={{
        background: c.color, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 130, minHeight: 320
      }}>
        <span style={{ position: "relative", zIndex: 1 }}>{c.emoji}</span>
        <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.55), transparent 60%)" }}/>
        {c.tag && (
          <span className="sticker illus-only" style={{ position: "absolute", top: 18, left: 18, background: "var(--coral)" }}>
            ★ {c.tag}
          </span>
        )}
      </div>
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="pill" style={{ background: c.color, color: "var(--ink)", border: "1px solid var(--ink)" }}>{c.cat}</span>
          <span className="pill" style={{ fontSize: 11 }}><Icon.Clock size={11}/> {c.time}</span>
        </div>
        <h3 style={{ fontSize: 30, lineHeight: 1.1 }}>{c.title}</h3>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: 0 }}>{c.excerpt}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.color, border: "1.5px solid var(--ink)" }}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.author}</div>
              <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{c.date} · {c.reads.toLocaleString("id")} baca · {c.claps} 👏</div>
            </div>
          </div>
          <button className="btn btn--sm btn--primary" onClick={() => onOpenCerita(c)}>
            Baca <Icon.Arrow size={12}/>
          </button>
        </div>
      </div>
    </article>
  );
}

export function CeritaCard({ c, onOpenCerita }) {
  return (
    <article className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}
             onClick={() => onOpenCerita(c)}>
      <div style={{
        background: c.color, aspectRatio: "4/2.6",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 64, position: "relative"
      }}>
        <span style={{ position: "relative", zIndex: 1 }}>{c.emoji}</span>
        <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.4), transparent 60%)" }}/>
        <button style={{
          position: "absolute", top: 10, right: 10,
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--paper)", border: "1.5px solid var(--ink)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }} onClick={(e) => e.stopPropagation()}>
          <Icon.Bookmark size={13}/>
        </button>
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{c.cat}</span>
          <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>· {c.time}</span>
        </div>
        <h4 style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 600 }}>{c.title}</h4>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>{c.excerpt}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 6, fontSize: 11, color: "var(--ink-soft)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: c.color, border: "1px solid var(--ink)" }}/>
            {c.author}
          </span>
          <span>{c.reads.toLocaleString("id")} baca · {c.claps} 👏</span>
        </div>
      </div>
    </article>
  );
}

/* ─── Sidebar widgets ────────────────────────────────────────────── */

function PopularCerita({ articles, onOpenCerita }) {
  const pop = [...articles].sort((a, b) => b.reads - a.reads).slice(0, 5);
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h4 style={{ fontSize: 22, fontWeight: 700 }}>Lagi populer 🔥</h4>
        <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>minggu ini</span>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {pop.map((c, i) => (
          <li key={c.id}>
            <button onClick={() => onOpenCerita(c)} style={{
              background: "none", border: 0, padding: 0, textAlign: "left",
              display: "flex", gap: 12, width: "100%", cursor: "pointer", color: "var(--ink)"
            }}>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700,
                color: "var(--coral-deep)", lineHeight: 1, opacity: 0.55, minWidth: 28
              }}>0{i+1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>{c.author} · {c.reads.toLocaleString("id")} baca</div>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BrowseTags() {
  const tags = [
    { name: "ramadhan", color: "var(--peach)" },
    { name: "tahsin", color: "var(--sage)" },
    { name: "parenting", color: "var(--lilac)" },
    { name: "muhasabah", color: "var(--butter)" },
    { name: "doa harian", color: "var(--coral)" },
    { name: "muamalah", color: "var(--peach)" },
    { name: "akhlaq", color: "var(--sage)" },
    { name: "dakwah", color: "var(--lilac)" },
    { name: "self-care", color: "var(--coral)" },
  ];
  return (
    <div className="card card--butter" style={{ padding: 22 }}>
      <h4 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Jelajah per tag</h4>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tags.map(t => (
          <button key={t.name} className="pill" style={{
            background: t.color, fontSize: 12, padding: "6px 12px",
            border: "1px solid var(--ink)", cursor: "pointer", color: "var(--ink)"
          }}>
            #{t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function AuthorSpotlight() {
  return (
    <div className="card card--ink" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <SunDecor size={90} color="var(--peach)" style={{ position: "absolute", top: -25, right: -25, opacity: 0.6 }}/>
      <div style={{ position: "relative" }}>
        <span className="pill pill--paper" style={{ fontSize: 11 }}>✍️ penulis pilihan</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--peach)", border: "2px solid var(--bg)" }}/>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>Nadia R.</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Self-growth · 24 bacaan</div>
          </div>
        </div>
        <p style={{ fontSize: 12, marginTop: 12, opacity: 0.85, lineHeight: 1.5 }}>
          Bacaan-bacaan ringan tentang gimana caranya konsisten ibadah di tengah hidup yang berantakan.
        </p>
        <button className="btn btn--sm" style={{ marginTop: 12, background: "var(--peach)" }}>
          Lihat semua bacaan
        </button>
      </div>
    </div>
  );
}
