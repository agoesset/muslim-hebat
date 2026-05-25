// HomePage extension — Articles, Product highlight, Kajian strip, Newsletter.

import { Icon } from "./icons.jsx";
import { Blob, SunDecor, WaveDivider } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { CERITA_DATA } from "./data/cerita.js";

/* ─── Articles ──────────────────────────────────────────────────────── */
export function ArticleSection({ onNav, onOpenCerita }) {
  const featured = CERITA_DATA.find(c => c.featured) || CERITA_DATA[0];
  const more = CERITA_DATA.filter(c => c !== featured).slice(0, 4);

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
              <span className="pill">{featured.cat}</span>
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
                <div style={{ fontSize: 11, color: "var(--coral-deep)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{a.cat}</div>
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

/* ─── Product highlight ─────────────────────────────────────────────── */
export function ProductHighlight({ onNav }) {
  const products = [
    { name: "Jurnal Ramadhan 30 Hari", price: "Rp 39.000", cat: "Printable", color: "var(--peach)", emoji: "📓", tag: "best seller" },
    { name: "Wallpaper Pack: Quotes Ayat", price: "Gratis", cat: "Wallpaper",  color: "var(--lilac)", emoji: "📱", tag: "new" },
    { name: "Kelas Tahsin Pemula (12 sesi)", price: "Rp 249.000", cat: "Kelas online", color: "var(--sage)", emoji: "🎙" },
    { name: "E-book: Anak Tenang, Bunda Senang", price: "Rp 59.000", cat: "E-book", color: "var(--butter)", emoji: "📖" },
    { name: "Template Doa Harian (Notion)", price: "Rp 19.000", cat: "Template", color: "var(--coral)", emoji: "🗒" },
  ];

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
          {products.map((p, i) => (
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
                <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: p.price === "Gratis" ? "var(--sage-deep)" : "var(--ink)", whiteSpace: "nowrap" }}>
                  {p.price}
                </span>
                <button className="btn btn--sm" style={{ padding: "6px 10px", boxShadow: "2px 2px 0 var(--ink)", flexShrink: 0 }}>
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

/* ─── Kajian strip ──────────────────────────────────────────────────── */
export function KajianStrip({ onNav }) {
  const events = [
    { date: "22", month: "Mei", day: "Jum'at", title: "Tafsir Surat Al-Kahfi", speaker: "Ust. Adi Hidayat", time: "Ba'da Maghrib", loc: "Masjid Istiqlal · Jakarta", type: "Offline", color: "var(--sage)" },
    { date: "24", month: "Mei", day: "Ahad",   title: "Parenting in Islam: Ngomong sama Remaja", speaker: "dr. Aisyah Dahlan", time: "10.00 WIB",   loc: "Zoom + YouTube live",    type: "Online",  color: "var(--lilac)" },
    { date: "27", month: "Mei", day: "Rabu",   title: "Kelas Tahsin: Makhraj huruf",     speaker: "Ust. Hasan Bashri",  time: "19.30 WIB",   loc: "Google Meet",            type: "Online",  color: "var(--peach)" },
  ];
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
              <span className={`pill ${e.type === "Online" ? "" : "pill--ink"}`} style={{ fontSize: 11 }}>
                {e.type === "Online" ? "🟢 Online" : "📍 Offline"}
              </span>
            </div>
            <h4 style={{ fontSize: 20, lineHeight: 1.2 }}>{e.title}</h4>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Smile size={12}/> {e.speaker}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Clock size={12}/> {e.time}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Pin size={12}/> {e.loc}</div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
              <button className="btn btn--sm btn--primary" style={{ flex: 1 }}>Daftar gratis</button>
              <button className="btn btn--sm">
                <Icon.Bell size={12}/>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter ────────────────────────────────────────────────────── */
export function NewsletterBlock() {
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

          <form style={{ display: "flex", gap: 8, marginTop: 24, maxWidth: 460 }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--paper)", borderRadius: 999, padding: "0 8px 0 20px", border: "1.5px solid var(--bg)" }}>
              <Icon.Mail size={16}/>
              <input
                type="email"
                placeholder="kamu@email.com"
                style={{
                  flex: 1, border: 0, padding: "16px 0",
                  background: "transparent", outline: "none",
                  fontFamily: "var(--font-body)", fontSize: 15
                }}
              />
            </div>
            <button type="submit" className="btn btn--coral">
              Subscribe <Icon.Arrow size={14}/>
            </button>
          </form>

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
