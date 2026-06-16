// CeritaDetailPage — single article reading view.

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";

export function CeritaDetailPage({ onNav, cerita }) {
  const c = cerita;
  const [progress, setProgress] = React.useState(0);
  const [clapped, setClapped] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-screen-label="05 Bacaan Detail">
      {/* progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "rgba(31,58,45,0.08)", zIndex: 100 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--coral-deep)", transition: "width 0.05s linear" }}/>
      </div>

      {/* breadcrumb */}
      <div className="shell" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Beranda</button>
        {" › "}
        <button onClick={() => onNav("bacaan")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Bacaan</button>
        {" › "}
        <span style={{ color: "var(--coral-deep)", fontWeight: 600 }}>{c.cat}</span>
      </div>

      <CeritaDetailHero c={c}/>
      <CeritaBody c={c} clapped={clapped} setClapped={setClapped} saved={saved} setSaved={setSaved}/>
      <AuthorCard c={c}/>
      <CommentsSection/>
      <NewsletterBlock/>
    </div>
  );
}

function CeritaDetailHero({ c }) {
  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color={c.color} size={300} top={60} right={-40} opacity={0.35}/>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
          <span className="pill" style={{ background: c.color, color: "var(--ink)", border: "1px solid var(--ink)" }}>{c.cat}</span>
          {c.tag && <span className="pill pill--ink"><Icon.Star size={11}/> {c.tag}</span>}
        </div>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "var(--coral-deep)", marginBottom: 8 }}>
          ditulis pelan-pelan ☕
        </div>
        <h1 style={{ fontSize: "clamp(40px, 5.5vw, 64px)", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.02em", textWrap: "balance" }}>
          {c.title}
        </h1>
        <p style={{ fontSize: 19, color: "var(--ink-soft)", maxWidth: 580, margin: "20px auto 0", lineHeight: 1.5 }}>
          {c.excerpt}
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: c.color, border: "1.5px solid var(--ink)" }}/>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{c.author}</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{c.date}, 2026 · {c.time} baca</div>
            </div>
          </div>
          <span style={{ color: "var(--ink-soft)" }}>·</span>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.reads.toLocaleString("id")} baca</span>
          <span style={{ color: "var(--ink-soft)" }}>·</span>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.claps} 👏</span>
        </div>
      </div>

      {/* cover image */}
      <div className="card" style={{
        marginTop: 36, padding: 0, overflow: "hidden", aspectRatio: "16/7",
        background: c.color, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", border: "1.5px solid var(--ink)"
      }}>
        <span style={{ fontSize: 200, position: "relative", zIndex: 1 }}>{c.emoji}</span>
        <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 35%, rgba(255,252,245,0.4), transparent 65%)" }}/>
        <span className="sticker illus-only" style={{ position: "absolute", bottom: 20, right: 24, background: "var(--paper)", fontSize: 18 }}>
          ilustrasi bacaan
        </span>
      </div>
    </section>
  );
}

function CeritaBody({ c, clapped, setClapped, saved, setSaved }) {
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 32, maxWidth: 920, margin: "0 auto" }}>
        {/* floating sidebar actions */}
        <div style={{ position: "sticky", top: 90, alignSelf: "start", display: "flex", flexDirection: "column", gap: 10 }}>
          <ActionBtn icon={<Icon.Heart size={16}/>} label={c.claps + (clapped ? 1 : 0)} active={clapped} onClick={() => setClapped(!clapped)} activeBg="var(--coral)"/>
          <ActionBtn icon={<Icon.Bookmark size={16}/>} label="Simpan" active={saved} onClick={() => setSaved(!saved)} activeBg="var(--butter)"/>
          <ActionBtn icon={<Icon.ArrowUR size={16}/>} label="Bagikan"/>
          <ActionBtn icon={<Icon.Mail size={16}/>}/>
        </div>

        {/* article body */}
        <article style={{ fontSize: 18, lineHeight: 1.75, color: "var(--ink)" }}>
          <ArticleBodyText c={c}/>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(31,58,45,0.12)" }}>
            {[c.cat, c.tag].filter(Boolean).map(t => (
              <span key={t} className="pill" style={{ fontSize: 12 }}>#{String(t).toLowerCase().replaceAll(" ", "-")}</span>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: 28, background: "var(--bg-soft)", borderRadius: 24, textAlign: "center" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--coral-deep)" }}>kalau bacaan ini ngena</p>
            <button onClick={() => setClapped(!clapped)} className="btn" style={{
              background: clapped ? "var(--coral)" : "var(--paper)",
              marginTop: 12, fontSize: 16, padding: "16px 28px"
            }}>
              <Icon.Heart size={18}/> {clapped ? "Sudah dikasih ❤️" : "Kasih clap"} · {c.claps + (clapped ? 1 : 0)}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ArticleBodyText({ c }) {
  const text = (c.body && c.body.trim()) || c.excerpt || "Konten bacaan sedang disiapkan.";
  const paragraphs = text.split(/\n{2,}|\r?\n/).map((p) => p.trim()).filter(Boolean);
  const first = paragraphs[0] || text;
  const initial = first.charAt(0);
  const rest = first.slice(1);

  return (
    <>
      <p style={{ marginTop: 0 }}>
        {initial && <span style={{
          float: "left", fontFamily: "var(--font-display)", fontSize: 72,
          fontWeight: 700, lineHeight: 0.85, padding: "4px 12px 0 0",
          color: "var(--coral-deep)"
        }}>{initial}</span>}
        {rest}
      </p>
      {paragraphs.slice(1).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {!c.body && (
        <aside className="card card--sage" style={{ margin: "32px 0", padding: 24 }}>
          <p style={{ margin: 0, fontSize: 16, color: "var(--ink-soft)" }}>
            Ringkasan sudah tersedia. Artikel lengkap sedang disiapkan tim Muslim Hebat.
          </p>
        </aside>
      )}
    </>
  );
}

function ActionBtn({ icon, label, active, onClick, activeBg = "var(--coral)" }) {
  return (
    <button onClick={onClick} className="btn" style={{
      flexDirection: "column", padding: "12px 6px", minWidth: 52,
      background: active ? activeBg : "var(--paper)",
      fontSize: 10, gap: 2, boxShadow: active ? "2px 3px 0 var(--ink)" : "2px 3px 0 var(--ink)"
    }}>
      {icon}
      {label !== undefined && <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>}
    </button>
  );
}

function AuthorCard({ c }) {
  return (
    <section className="shell" style={{ marginBottom: 32 }}>
      <div className="card card--paper" style={{ maxWidth: 800, margin: "0 auto", padding: 28, display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: c.color, border: "2px solid var(--ink)",
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40
        }}>
          {c.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <span className="pill" style={{ fontSize: 11 }}>✍️ tentang penulis</span>
          <h3 style={{ fontSize: 24, marginTop: 8 }}>{c.author}</h3>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 6, margin: 0 }}>
            Suka nulis tentang self-growth dan gimana caranya jadi muslim yang lebih sabar — terutama sama diri sendiri. 24 bacaan, sejak 2024.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn--sm btn--primary">+ Ikuti</button>
          <button className="btn btn--sm">Semua tulisan</button>
        </div>
      </div>
    </section>
  );
}

function CommentsSection() {
  const comments = [
    { name: "Rina", avatar: "var(--peach)", date: "1 jam lalu", text: "Yang nomor 2 ngena banget. Sering banget ngerasa berat sholat, padahal pas wudhu aja, mood udah lumayan." },
    { name: "Faiz", avatar: "var(--sage)", date: "3 jam lalu", text: "Suka banget gaya nulisnya — santai tapi nendang. Lanjut bikin yang serupa dong!" },
    { name: "Bunda Lia", avatar: "var(--lilac)", date: "kemarin", text: "Aku praktekin yang nomor 3 minggu lalu — beneran works. Kerjaan rumah jadi gak overwhelming." },
  ];
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h3 style={{ fontSize: 32 }}>Obrolan ({comments.length})</h3>
          <button className="btn btn--sm">Urutkan: Terbaru ↓</button>
        </div>

        <div className="card" style={{ padding: 22, marginBottom: 20 }}>
          <textarea
            placeholder="Tulis pendapat kamu pelan-pelan…"
            rows={3}
            style={{
              width: "100%", border: 0, padding: 0,
              background: "transparent", outline: "none", resize: "none",
              fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink)"
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(31,58,45,0.08)" }}>
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Tolong baik-baik aja ya. Kita semua lagi belajar 🤍</span>
            <button className="btn btn--sm btn--primary">Kirim <Icon.Arrow size={12}/></button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {comments.map((cm, i) => (
            <div key={i} className="card" style={{ padding: 20, display: "flex", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: cm.avatar, border: "1.5px solid var(--ink)", flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: 14 }}>{cm.name}</strong>
                  <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>{cm.date}</span>
                </div>
                <p style={{ fontSize: 14, marginTop: 6, margin: 0, lineHeight: 1.5 }}>{cm.text}</p>
                <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}>
                  <button style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon.Heart size={11}/> 12
                  </button>
                  <button style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Balas</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
