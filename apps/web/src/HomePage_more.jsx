// HomePage extension — Articles, Product highlight, Kajian strip, Newsletter.

import { Icon } from "./icons.jsx";
import { Blob, SunDecor, WaveDivider } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { CERITA_DATA } from "./data/cerita.js";
import { api } from "./api.js";
import { useCta } from "./context/cta-context.jsx";
import { usePublicData } from "./hooks/usePublicData.js";

/* ─── Articles ──────────────────────────────────────────────────────── */
export function ArticleSection({ onNav, onOpenCerita }) {
  const { data: articles, loading, error } = usePublicData("/public/articles");

  if (loading) return <section className="shell" style={{ marginBottom: 40 }}><p>Memuat bacaan…</p></section>;
  if (error || !articles || articles.length === 0) return null;

  const featured = articles.find(c => c.featured) || articles[0];
  const more = articles.filter(c => c !== featured).slice(0, 4);

  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader
        kicker="bacaan ringan"
        title="Bacaan terbaru"
        sub="Dibahas santai, tanpa menggurui. Cocok dibaca sambil ngopi sore."
        right={
          <button className="btn btn--sm btn--ghost" onClick={() => onNav("bacaan")}>
            Lihat semua bacaan <Icon.Arrow size={12}/>
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Featured */}
        <article className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}
                 onClick={() => onOpenCerita && onOpenCerita(featured)}>
          <div style={{
            background: featured.color, aspectRatio: "16/8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 140, position: "relative"
          }}>
            <span style={{ position: "relative", zIndex: 1 }}>{featured.emoji}</span>
            <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.4), transparent 60%)" }}/>
          </div>
          <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {featured.tag && <span className="pill" style={{ background: "var(--coral)", color: "var(--ink)", border: "1px solid var(--ink)" }}>★ {featured.tag}</span>}
              <span className="pill">{featured.category}</span>
            </div>
            <h3 style={{ fontSize: 30, lineHeight: 1.1 }}>{featured.title}</h3>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: 0 }}>{featured.excerpt}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: featured.color, border: "1.5px solid var(--ink)" }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{featured.author}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{featured.time} baca</div>
                </div>
              </div>
              <button className="btn btn--sm btn--primary" onClick={(e) => { e.stopPropagation(); onOpenCerita && onOpenCerita(featured); }}>
                Baca <Icon.Arrow size={12}/>
              </button>
            </div>
          </div>
        </article>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {more.map((a, i) => (
            <article key={a.id} className="card" style={{ padding: 18, display: "flex", gap: 16, alignItems: "center", cursor: "pointer" }}
                     onClick={() => onOpenCerita && onOpenCerita(a)}>
              <div style={{
                width: 76, height: 76, borderRadius: 18, flexShrink: 0,
                background: a.color, border: "1.5px solid var(--ink)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                position: "relative"
              }}>
                <span style={{ position: "absolute", top: 4, right: 6, fontFamily: "ui-monospace", fontSize: 9, opacity: 0.55 }}>0{i+1}</span>
                {a.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--coral-deep)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{a.category}</div>
                <h4 style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.25, marginTop: 2 }}>{a.title}</h4>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Clock size={11}/> {a.time}
                </div>
              </div>
              <button className="btn btn--sm" style={{ padding: "6px 8px", flexShrink: 0 }}>
                <Icon.Arrow size={14}/>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Product highlight ───────────────────────────────────────────────────────────────── */
export function ProductHighlight({ onNav }) {
  const { data: products, loading, error } = usePublicData("/public/products");
  const { openInterest } = useCta();

  if (loading) return <section className="shell" style={{ marginBottom: 40 }}><p>Memuat produk…</p></section>;
  if (error || !products || products.length === 0) return null;

  const display = products.slice(0, 5).map(p => ({
    name: p.name,
    price: p.priceCents || 0,
    original: p.originalPriceCents || 0,
    cat: p.category,
    color: p.color,
    emoji: p.emoji,
    rating: p.rating,
    sold: p.sold,
    tag: p.tag,
    desc: p.excerpt
  }));

  return (
    <section style={{ background: "var(--bg-soft)", padding: "56px 0 64px", position: "relative", marginBottom: 32 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, transform: "translateY(-100%)", lineHeight: 0 }}>
        <WaveDivider color="var(--bg-soft)" height={48}/>
      </div>

      <div className="shell">
        <SectionHeader
          kicker="bantu kamu konsisten"
          title="Produk"
          sub="Dirancang biar mudah diunduh, langsung dipakai, dan bermanfaat untuk akhirat."
          right={
            <button className="btn btn--sm btn--primary" onClick={() => onNav("produk")}>
              Lihat semua produk <Icon.Arrow size={12}/>
            </button>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {display.map((p, i) => (
            <article key={i} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
              {p.tag && (
                <span className="sticker illus-only" style={{
                  position: "absolute", top: 8, right: -8, zIndex: 2,
                  background: p.tag === "new" ? "var(--sage)" : "var(--coral)",
                  fontSize: 14, padding: "4px 10px 6px",
                  transform: "rotate(6deg)"
                }}>
                  {p.tag}
                </span>
              )}
              <div style={{
                aspectRatio: "1/1", borderRadius: 14, background: p.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 56, border: "1.5px solid var(--ink)",
                position: "relative", overflow: "hidden"
              }}>
                <span style={{ position: "relative", zIndex: 1 }}>{p.emoji}</span>
                <span style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.5), transparent 60%)"
                }}/>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{p.cat}</div>
              <h4 style={{ fontSize: 16, lineHeight: 1.2, fontWeight: 600 }}>{p.name}</h4>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: p.price === 0 ? "var(--sage-deep)" : "var(--ink)", whiteSpace: "nowrap" }}>
                  {p.price === 0 ? "Gratis" : `Rp ${p.price.toLocaleString("id")}`}
                </span>
                <button
                  className="btn btn--sm"
                  style={{ padding: "6px 10px", boxShadow: "2px 2px 0 var(--ink)", flexShrink: 0 }}
                  aria-label={`Minat ${p.name}`}
                  onClick={() => openInterest({ title: `Minat: ${p.name}`, source: `produk:${p.slug || p.id}`, intent: p.price === 0 ? "download" : "buy", price: p.price === 0 ? "Gratis" : `Rp ${p.price.toLocaleString("id")}` })}
                >
                  <Icon.Download size={12}/>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, transform: "translateY(100%) scaleY(-1)", lineHeight: 0 }}>
        <WaveDivider color="var(--bg-soft)" height={48}/>
      </div>
    </section>
  );
}

/* ─── Kajian strip ────────────────────────────────────────────────────────────────────── */
export function KajianStrip({ onNav }) {
  const { data: events, loading, error } = usePublicData("/public/kajian");
  const { openInterest } = useCta();

  if (loading) return <section className="shell" style={{ marginBottom: 40 }}><p>Memuat jadwal…</p></section>;
  if (error || !events || events.length === 0) return null;
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader
        kicker="catat di kalender"
        title="Ngaji bareng terdekat"
        sub="Pilih yang paling cocok, daftar dulu biar dapet reminder."
        right={
          <button className="btn btn--sm btn--ghost" onClick={() => onNav("kajian")}>
            Lihat semua jadwal <Icon.Arrow size={12}/>
          </button>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {events.map((e, i) => (
          <article key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                background: e.color, borderRadius: 16, padding: "10px 14px",
                border: "1.5px solid var(--ink)", textAlign: "center", minWidth: 72
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{e.date}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{e.month}</div>
                <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 2 }}>{e.day}</div>
              </div>
              <span className={`pill ${e.eventType === "Online" ? "" : "pill--ink"}`} style={{ fontSize: 11 }}>
                {e.eventType === "Online" ? "🟢 Online" : "📍 Offline"}
              </span>
            </div>
            <h4 style={{ fontSize: 20, lineHeight: 1.2 }}>{e.title}</h4>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Smile size={12}/> {e.speaker}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Clock size={12}/> {e.time}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Pin size={12}/> {e.location}</div>
              </div>
            <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
              <button
                className="btn btn--sm btn--primary"
                style={{ flex: 1 }}
                onClick={() => openInterest({ title: `Daftar: ${e.title}`, source: `kajian:${e.slug || e.id}`, intent: "event", price: e.price || (e.free ? "Gratis" : "Berbayar") })}
              >
                Daftar gratis
              </button>
              <button
                className="btn btn--sm"
                aria-label="Ingatkan saya"
                onClick={() => openInterest({ title: `Reminder: ${e.title}`, source: `kajian-reminder:${e.slug || e.id}`, intent: "reminder" })}
              >
                <Icon.Bell size={12}/>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter ──────────────────────────────────────────────────────────────────────────────────────────────── */
export function NewsletterBlock() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setMsg("");
    try {
      await api("/public/subscribers", {
        method: "POST",
        body: JSON.stringify({ email, source: "newsletter" })
      });
      setStatus("success");
      setMsg("Berhasil subscribe! Cek inbox kamu ✌️");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Gagal subscribe. Coba lagi ya.");
    }
  }

  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <div className="card card--ink" style={{ padding: "56px 56px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center", position: "relative", overflow: "hidden" }}>
        <Blob color="var(--coral)" size={220} top={-80} right={-40} opacity={0.6}/>
        <SunDecor size={120} color="var(--peach)" style={{ position: "absolute", bottom: -30, left: -30, opacity: 0.8 }}/>

        <div style={{ position: "relative" }}>
          <span className="sticker illus-only" style={{ background: "var(--coral)", marginBottom: 16 }}>
            tiap Jum'at pagi ✉️
          </span>
          <h2 style={{ fontSize: 56, lineHeight: 0.95, color: "var(--bg)", marginTop: 16 }}>
            Dapatkan <span style={{ fontFamily: "var(--font-hand)", color: "var(--peach)", fontWeight: 500 }}>bacaan</span><br/>
            yang nempel di hati.
          </h2>
          <p style={{ fontSize: 16, color: "var(--bg)", opacity: 0.75, maxWidth: 460, marginTop: 16 }}>
            1 artikel pilihan, 1 doa, dan 1 reminder kecil. Tanpa spam, tanpa promosi gak penting — janji.
          </p>

          <form style={{ display: "flex", gap: 8, marginTop: 24, maxWidth: 460 }} onSubmit={submit}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--paper)", borderRadius: 999, padding: "0 8px 0 20px", border: "1.5px solid var(--bg)" }}>
              <Icon.Mail size={16}/>
              <input
                type="email"
                required
                placeholder="kamu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                style={{
                  flex: 1, border: 0, padding: "16px 0",
                  background: "transparent", outline: "none",
                  fontFamily: "var(--font-body)", fontSize: 15
                }}
              />
            </div>
            <button type="submit" className="btn btn--coral" disabled={status === "loading" || !email}>
              {status === "loading" ? "Mengirim..." : "Subscribe"} <Icon.Arrow size={14}/>
            </button>
          </form>

          {msg && (
            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: 12,
                fontSize: 14,
                color: status === "error" ? "var(--coral)" : "var(--peach)",
                fontWeight: 600,
              }}
            >
              {msg}
            </div>
          )}

          <div style={{ marginTop: 18, display: "flex", gap: 16, color: "var(--bg)", opacity: 0.65, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Check size={12}/> Gratis selamanya</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Check size={12}/> Berhenti kapan saja</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Check size={12}/> 12.400+ pembaca</span>
          </div>
        </div>

        {/* preview card */}
        <div style={{ position: "relative" }}>
          <div className="card card--paper" style={{ padding: 22, transform: "rotate(2deg)", boxShadow: "8px 10px 0 var(--coral)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--ink-soft)", marginBottom: 12 }}>
              <span>Buletin Jum'at #84</span>
              <span>20 Mei 2026</span>
            </div>
            <h4 style={{ fontSize: 22, lineHeight: 1.1 }}>"Bagaimana kalau kita pelan-pelan aja?"</h4>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8, margin: 0 }}>
              Minggu ini kita ngobrolin tentang konsistensi yang bukan tentang sempurna — tapi tentang gak nyerah aja…
            </p>
            <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="pill" style={{ fontSize: 10 }}>📰 1 artikel</span>
              <span className="pill" style={{ fontSize: 10 }}>🤲 1 doa</span>
              <span className="pill" style={{ fontSize: 10 }}>💭 1 reminder</span>
            </div>
          </div>
          <div className="card card--paper" style={{ padding: 22, transform: "rotate(-4deg)", position: "absolute", inset: 0, zIndex: -1, top: 18, left: -18, opacity: 0.7 }}>
            <div style={{ height: 14, width: 100, background: "var(--bg-soft)", borderRadius: 4 }}/>
            <div style={{ height: 14, width: "100%", background: "var(--bg-soft)", borderRadius: 4, marginTop: 16 }}/>
            <div style={{ height: 14, width: "80%", background: "var(--bg-soft)", borderRadius: 4, marginTop: 8 }}/>
          </div>
        </div>
      </div>
    </section>
  );
}
