// HomePage — bento-heavy layout with all 7 sections.

import { Icon } from "./icons.jsx";
import { Blob, SunDecor } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { ArticleSection, ProductHighlight, KajianStrip, NewsletterBlock } from "./HomePage_more.jsx";

export function HomePage({ onNav, onOpenCerita, prayerNext }) {
  return (
    <div data-screen-label="01 Home">
      <Hero onNav={onNav}/>
      <QuoteRow/>
      <BentoMain onNav={onNav} prayerNext={prayerNext}/>
      <ArticleSection onNav={onNav} onOpenCerita={onOpenCerita}/>
      <ProductHighlight onNav={onNav}/>
      <KajianStrip onNav={onNav}/>
      <NewsletterBlock/>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
function Hero({ onNav }) {
  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 24, position: "relative" }}>
      <Blob color="var(--peach)" size={260} top={-40} right={120}/>
      <Blob color="var(--sage)" size={220} top={120} left={-40} opacity={0.4}/>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, alignItems: "stretch", position: "relative" }}>
        {/* Big headline card */}
        <div className="card" style={{ background: "var(--paper)", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="pill pill--ink"><Icon.Sparkle size={12}/> komunitas hangat sejak 2024</span>
            <span className="pill">+ 12,400 muslim</span>
          </div>

          <h1 style={{ fontSize: "clamp(52px, 6.5vw, 86px)", fontWeight: 700, lineHeight: 0.95 }}>
            Belajar Islam<br/>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ background: "var(--coral)", padding: "0 18px 6px", borderRadius: 18, display: "inline-block", transform: "rotate(-2deg)" }}>tanpa</span>
              <span style={{ fontFamily: "var(--font-hand)", color: "var(--sage-deep)", fontWeight: 500 }}>drama</span>
            </span><br/>
            santai &amp; <em style={{ fontFamily: "var(--font-hand)", fontStyle: "normal", color: "var(--coral-deep)", fontWeight: 500 }}>konsisten</em>.
          </h1>

          <p style={{ fontSize: 17, maxWidth: 480, color: "var(--ink-soft)", margin: 0 }}>
            Bacaan ringan, produk bermanfaat, dan jadwal ngaji bareng yang bikin kamu makin semangat — semua di satu tempat.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn--primary" onClick={() => onNav("produk")}>
              Lihat produk <Icon.Arrow size={16}/>
            </button>
            <button className="btn" onClick={() => onNav && onNav("bacaan")}>
              Baca bacaan terbaru
            </button>
          </div>

          {/* sticker */}
          <span className="sticker illus-only" style={{ position: "absolute", top: 22, right: 22, transform: "rotate(8deg)", background: "var(--butter)" }}>
            ✨ free for u
          </span>
        </div>

        {/* right column stack */}
        <div style={{ display: "grid", gridTemplateRows: "auto auto", gap: 20 }}>
          {/* Prayer reminder card */}
          <div className="card card--ink" style={{ position: "relative", overflow: "hidden" }}>
            <SunDecor size={140} color="var(--peach)" style={{ position: "absolute", top: -30, right: -30, opacity: 0.85 }}/>
            <div style={{ position: "relative" }}>
              <div className="pill pill--paper" style={{ fontSize: 12 }}>
                <Icon.Bell size={12}/> Sholat berikutnya
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 700, marginTop: 16, lineHeight: 1, letterSpacing: "-0.04em" }}>
                Ashar
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, marginTop: 4, color: "var(--peach)", fontWeight: 600 }}>
                15:24 <span style={{ fontSize: 14, color: "var(--bg)", opacity: 0.6, fontFamily: "var(--font-body)", fontWeight: 500 }}>· 1 jam 12 menit lagi</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 24, flexWrap: "wrap" }}>
                {[
                  { name: "Subuh", time: "04:38", done: true },
                  { name: "Dzuhur", time: "11:52", done: true },
                  { name: "Ashar", time: "15:24", active: true },
                  { name: "Maghrib", time: "17:58" },
                  { name: "Isya", time: "19:08" },
                ].map(s => (
                  <div key={s.name} style={{
                    flex: "1 1 80px", padding: "8px 10px", borderRadius: 12,
                    background: s.active ? "var(--peach)" : "rgba(251,243,226,0.08)",
                    color: s.active ? "var(--ink)" : "var(--bg)",
                    opacity: s.done ? 0.55 : 1,
                    border: s.active ? "1.5px solid var(--bg)" : "1px solid transparent",
                  }}>
                    <div style={{ fontSize: 10, opacity: 0.75, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginTop: 2 }}>{s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's micro stats card */}
          <div className="card card--peach" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "var(--coral-deep)" }}>hari ini</span>
              <span className="pill pill--paper" style={{ fontSize: 11 }}><Icon.Cal size={11}/> Rabu, 20 Mei</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Stat big="14" sub="hijriah" tag="11 Dzul-Q"/>
              <Stat big="3/5" sub="sholat selesai"/>
              <Stat big="2" sub="ngaji besok"/>
            </div>
            <button className="btn btn--sm" style={{ alignSelf: "flex-start" }}>
              Lihat tracker lengkap <Icon.Arrow size={12}/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ big, sub, tag }) {
  return (
    <div style={{ background: "rgba(255,252,245,0.65)", borderRadius: 14, padding: "10px 12px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 11, marginTop: 4, color: "var(--ink-soft)" }}>{sub}</div>
      {tag && <div style={{ fontSize: 9, marginTop: 2, fontFamily: "ui-monospace", color: "var(--ink-soft)", opacity: 0.7 }}>{tag}</div>}
    </div>
  );
}

/* ─── Quote of the day full-width strip ─────────────────────────────── */
function QuoteRow() {
  return (
    <section className="shell" style={{ marginTop: 8, marginBottom: 24 }}>
      <div className="card card--coral" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "center", padding: "28px 36px", position: "relative", overflow: "hidden" }}>
        <Blob color="var(--peach)" size={180} top={-60} left={-30} opacity={0.6}/>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "var(--ink)", lineHeight: 1 }}>quote</div>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "var(--coral-deep)", lineHeight: 1 }}>of the day</div>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="arabic" style={{ fontSize: 28, marginBottom: 10, color: "var(--ink)" }}>
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
            “Siapa pun yang bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar.”
          </div>
          <div style={{ fontSize: 13, marginTop: 8, color: "var(--ink-soft)" }}>— QS. Ath-Thalaq: 2</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", position: "relative", zIndex: 1 }}>
          <button className="btn btn--sm"><Icon.Heart size={12}/> Simpan</button>
          <button className="btn btn--sm"><Icon.ArrowUR size={12}/> Bagikan</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Main bento: dzikir + komunitas + reminder ─────────────────────── */
function BentoMain({ onNav }) {
  return (
    <section className="shell" style={{ marginBottom: 32 }}>
      <SectionHeader
        kicker="ngalir santai"
        title="Bekal harian buat hati"
        sub="Beberapa hal kecil yang bisa kamu lakuin hari ini biar makin dekat sama Allah."
      />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gridAutoRows: "minmax(180px, auto)", gap: 20 }}>
        {/* dzikir tracker */}
        <div className="card card--sage" style={{ gridRow: "span 2", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="pill pill--paper" style={{ fontSize: 11 }}><Icon.Sparkle size={11}/> Dzikir pagi</div>
              <h3 style={{ fontSize: 36, marginTop: 12, lineHeight: 1 }}>Mulai pagi<br/>dengan dzikir ✿</h3>
            </div>
            <SunDecor size={70} color="var(--butter)" style={{ flexShrink: 0 }}/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { txt: "Astaghfirullāh", n: "100×", done: true },
              { txt: "Subhānallāh wa bihamdihi", n: "33×", done: true },
              { txt: "Lā ilāha illallāh wahdahu lā syarīka lah…", n: "10×", done: false },
              { txt: "Allāhumma anta rabbī lā ilāha illā anta…", n: "1×", done: false },
            ].map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                background: "rgba(255,252,245,0.55)", borderRadius: 14,
                opacity: d.done ? 0.55 : 1
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 8, flexShrink: 0,
                  background: d.done ? "var(--sage-deep)" : "transparent",
                  border: "1.5px solid var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--paper)"
                }}>
                  {d.done && <Icon.Check size={14}/>}
                </span>
                <span style={{ flex: 1, fontSize: 14, textDecoration: d.done ? "line-through" : "none" }}>{d.txt}</span>
                <span style={{ fontFamily: "ui-monospace", fontSize: 12, color: "var(--ink-soft)" }}>{d.n}</span>
              </div>
            ))}
          </div>
          <button className="btn btn--sm" style={{ alignSelf: "flex-start" }}>
            Buka tracker dzikir <Icon.Arrow size={12}/>
          </button>
        </div>

        {/* Komunitas mini card */}
        <div className="card card--lilac" style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
          <div className="pill pill--paper" style={{ fontSize: 11, alignSelf: "flex-start" }}><Icon.Smile size={11}/> komunitas</div>
          <h3 style={{ fontSize: 28 }}>12,400+ teman seperjalanan</h3>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>Diskusi santai, sharing pengalaman, saling ingetin di Telegram &amp; Discord.</p>
          <div style={{ display: "flex", alignItems: "center", gap: -10, marginTop: "auto" }}>
            {["#FFD6A5", "#A8D8B9", "#FFADAD", "#D8CCEF", "#F7E4A0"].map((c, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: c, border: "2px solid var(--lilac)",
                marginLeft: i === 0 ? 0 : -10
              }}/>
            ))}
            <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 600 }}>+ ribuan lainnya</span>
          </div>
          <button className="btn btn--sm" style={{ alignSelf: "flex-start" }}>
            Gabung sekarang
          </button>
        </div>

        {/* Reminder card */}
        <div className="card card--butter" style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "visible" }}>
          <span className="sticker illus-only wiggle" style={{ position: "absolute", top: -14, right: 18, background: "var(--coral)", color: "var(--ink)" }}>
            jangan lupa!
          </span>
          <div className="pill pill--paper" style={{ fontSize: 11, alignSelf: "flex-start" }}><Icon.Bell size={11}/> reminder</div>
          <h3 style={{ fontSize: 26, lineHeight: 1.05 }}>Sudah baca Al-Mulk hari ini?</h3>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>30 ayat, ± 8 menit. Sunnah sebelum tidur biar dijauhkan dari azab kubur.</p>
          <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
            <button className="btn btn--sm btn--primary">Baca sekarang</button>
            <button className="btn btn--sm">Ingetin nanti</button>
          </div>
        </div>

        {/* Mini quote card */}
        <div className="card card--paper" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 60, color: "var(--coral)", lineHeight: 0.7, height: 24 }}>“</span>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.3, fontWeight: 500, margin: 0 }}>
            Yang penting jalan terus, gak perlu sempurna — cukup konsisten satu langkah tiap hari.
          </p>
          <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>— Ustadz Hanan Attaki</div>
        </div>

        {/* Mood / niat card */}
        <div className="card card--coral" style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
          <div className="pill pill--paper" style={{ fontSize: 11, alignSelf: "flex-start" }}>niat hari ini</div>
          <input
            placeholder="Hari ini aku mau…"
            style={{
              border: 0, background: "rgba(255,252,245,0.55)",
              borderRadius: 14, padding: "12px 14px",
              fontSize: 16, fontFamily: "var(--font-body)", color: "var(--ink)",
              outline: "none"
            }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["sholat tepat waktu", "baca 1 lembar Qur'an", "senyum ke ortu", "sedekah 5rb"].map(s => (
              <button key={s} className="pill" style={{ background: "var(--paper)", fontSize: 11, border: "1px solid var(--ink)", cursor: "pointer" }}>
                + {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
