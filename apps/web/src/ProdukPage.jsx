// ProdukPage — full digital product catalog.

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";

import { usePublicData } from "./hooks/usePublicData.js";

export function ProdukPage({ onNav }) {
  const [active, setActive] = React.useState("Semua");
  const cats = ["Semua", "E-book", "Worksheet", "Kelas", "Wallpaper", "Template"];

  const { data: apiProducts, loading, error } = usePublicData("/public/products");

  const products = React.useMemo(() => {
    if (!apiProducts) return [];
    return apiProducts.map(p => ({
      ...p,
      price: p.priceCents || 0,
      original: p.originalPriceCents || 0,
      cat: p.category,
      desc: p.excerpt
    }));
  }, [apiProducts]);

  const filtered = active === "Semua" ? products : products.filter(p => p.cat === active);

  return (
    <div data-screen-label="02 Produk">
      <ProdukHero/>
      <section className="shell" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 8 }}>filter:</span>
          {cats.map(c => (
            <button key={c}
                    onClick={() => setActive(c)}
                    className="btn btn--sm"
                    style={{
                      background: active === c ? "var(--ink)" : "var(--paper)",
                      color: active === c ? "var(--bg)" : "var(--ink)",
                    }}>
              {c}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{filtered.length} produk</span>
          <button className="btn btn--sm btn--ghost">Urutkan: Terbaru ↓</button>
        </div>

        {loading && <p>Memuat produk…</p>}
        {error && <p className="admin-error">Gagal memuat produk: {error}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map((p, i) => <ProdukCard key={p.id || p.slug} p={p}/>)}
        </div>
      </section>

      <ProdukBundle/>
      <ProdukTestimonials/>
      <NewsletterBlock/>
    </div>
  );
}

function ProdukHero() {
  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color="var(--sage)" size={240} top={20} right={60} opacity={0.4}/>
      <div className="card card--paper" style={{ padding: "48px 48px 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center", position: "relative", overflow: "visible" }}>
        <div>
          <span className="pill pill--ink"><Icon.Sparkle size={12}/> 9 produk · selalu update</span>
          <h1 style={{ fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 700, lineHeight: 0.95, marginTop: 16 }}>
            Produk yang<br/>
            <span style={{ background: "var(--peach)", padding: "0 14px 4px", borderRadius: 16, display: "inline-block", transform: "rotate(-1deg)" }}>bermanfaat</span> <span style={{ fontFamily: "var(--font-hand)", color: "var(--sage-deep)", fontWeight: 500 }}>buat akhirat</span>.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", marginTop: 16, maxWidth: 520 }}>
            Worksheet, e-book, kelas online, wallpaper, sampai template — semua dirancang biar bantu kamu makin konsisten dan dekat sama Allah.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button className="btn btn--primary">Lihat best seller <Icon.Arrow size={14}/></button>
            <button className="btn">Cek yang gratis</button>
          </div>
        </div>

        {/* sticker stack of products */}
        <div style={{ position: "relative", height: 320 }}>
          <div className="card card--peach drift" style={{ position: "absolute", top: 20, left: 40, width: 180, height: 220, transform: "rotate(-6deg)", padding: 14, boxShadow: "4px 5px 0 var(--ink)" }}>
            <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 10, background: "var(--paper)", border: "1.5px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>📓</div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Jurnal Ramadhan</div>
          </div>
          <div className="card card--sage" style={{ position: "absolute", top: 0, right: 0, width: 180, height: 220, transform: "rotate(4deg)", padding: 14, boxShadow: "4px 5px 0 var(--ink)" }}>
            <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 10, background: "var(--paper)", border: "1.5px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🎙</div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Kelas Tahsin</div>
          </div>
          <div className="card card--lilac" style={{ position: "absolute", bottom: -10, left: 110, width: 180, height: 220, transform: "rotate(-2deg)", padding: 14, boxShadow: "4px 5px 0 var(--ink)" }}>
            <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 10, background: "var(--paper)", border: "1.5px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>📱</div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>Wallpaper Pack</div>
          </div>
          <span className="sticker illus-only wiggle" style={{ position: "absolute", top: -10, right: 40, background: "var(--coral)", zIndex: 2 }}>
            new!
          </span>
        </div>
      </div>
    </section>
  );
}

function ProdukCard({ p }) {
  return (
    <article className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
      {p.tag && (
        <span className="sticker illus-only" style={{
          position: "absolute", top: 12, right: -10, zIndex: 2,
          background: p.tag === "free" ? "var(--sage)" : p.tag === "new" ? "var(--lilac)" : "var(--coral)",
          fontSize: 16, padding: "5px 12px 7px",
          transform: "rotate(6deg)"
        }}>
          {p.tag}
        </span>
      )}
      <div style={{
        aspectRatio: "5/4", borderRadius: 18, background: p.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 80, border: "1.5px solid var(--ink)",
        position: "relative", overflow: "hidden"
      }}>
        <span style={{ position: "relative", zIndex: 1 }}>{p.emoji}</span>
        <span style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 25% 25%, rgba(255,252,245,0.45), transparent 60%)"
        }}/>
        <button style={{
          position: "absolute", top: 10, right: 10,
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--paper)", border: "1.5px solid var(--ink)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer"
        }}>
          <Icon.Bookmark size={14}/>
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
        <span style={{ color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.cat}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-soft)" }}>
          <Icon.Star size={11}/>{p.rating} · {p.sold.toLocaleString("id")} terjual
        </span>
      </div>
      <h4 style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 600 }}>{p.name}</h4>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>{p.desc}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 4, gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          {p.original && <div style={{ fontSize: 11, color: "var(--ink-soft)", textDecoration: "line-through" }}>Rp {p.original.toLocaleString("id")}</div>}
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, lineHeight: 1, color: p.price === 0 ? "var(--sage-deep)" : "var(--ink)", whiteSpace: "nowrap" }}>
            {p.price === 0 ? "Gratis" : `Rp ${p.price.toLocaleString("id")}`}
          </div>
        </div>
        <button className="btn btn--sm btn--primary" style={{ flexShrink: 0 }}>
          {p.price === 0 ? "Unduh" : "Beli"} <Icon.Arrow size={12}/>
        </button>
      </div>
    </article>
  );
}

function ProdukBundle() {
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <div className="card card--coral" style={{ padding: "40px 48px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32, alignItems: "center", position: "relative", overflow: "hidden" }}>
        <Blob color="var(--peach)" size={200} top={-40} right={120} opacity={0.7}/>
        <div style={{ position: "relative" }}>
          <span className="sticker illus-only" style={{ background: "var(--butter)" }}>hemat 40% 🎁</span>
          <h2 style={{ fontSize: 48, lineHeight: 1, marginTop: 16, fontWeight: 700 }}>
            Bundle "Konsisten<br/>Setahun"
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink)", maxWidth: 380, marginTop: 12, opacity: 0.8 }}>
            Semua worksheet + planner hijriah + 4 e-book pilihan. Cukup beli sekali, bermanfaat sepanjang tahun.
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 20 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 700, lineHeight: 1 }}>Rp 149rb</div>
            <div style={{ fontSize: 18, color: "var(--ink-soft)", textDecoration: "line-through" }}>Rp 249rb</div>
          </div>
          <button className="btn btn--primary" style={{ marginTop: 16 }}>Ambil bundle ini <Icon.Arrow size={14}/></button>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { e: "📓", c: "var(--peach)" },
              { e: "📅", c: "var(--sage)" },
              { e: "📖", c: "var(--lilac)" },
              { e: "💼", c: "var(--butter)" },
              { e: "🗒", c: "var(--coral)" },
              { e: "🎁", c: "var(--paper)" },
            ].map((x, i) => (
              <div key={i} style={{
                aspectRatio: "1/1", background: x.c,
                border: "1.5px solid var(--ink)", borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, boxShadow: "3px 3px 0 var(--ink)",
                transform: `rotate(${(i % 2 ? 1 : -1) * 2}deg)`
              }}>{x.e}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProdukTestimonials() {
  const t = [
    { name: "Sarah, 24", role: "Mahasiswi", text: "Jurnal Ramadhannya bener-bener nempel banget sama anak muda. Gak menggurui, dan layoutnya cantik!", color: "var(--peach)" },
    { name: "Faiz, 31", role: "Karyawan", text: "Beli template Notion-nya, sekarang doa harian gampang dibuka pas jeda kerja. Worth it banget.", color: "var(--sage)" },
    { name: "Bunda Lia", role: "Ibu rumah tangga", text: "E-book parentingnya santai, gak bikin guilty. Suka banget gaya bahasa muslim hebat.", color: "var(--lilac)" },
  ];
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader
        kicker="kata mereka"
        title="Cerita yang udah pakai"
        sub="Sedikit dari ribuan testimoni teman seperjalanan."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {t.map((x, i) => (
          <article key={i} className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
            <div style={{ display: "flex", gap: 4, color: "var(--coral)" }}>
              {[1,2,3,4,5].map(s => <Icon.Star key={s} size={14}/>)}
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.3, margin: 0 }}>
              "{x.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto", paddingTop: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: x.color, border: "1.5px solid var(--ink)" }}/>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{x.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
