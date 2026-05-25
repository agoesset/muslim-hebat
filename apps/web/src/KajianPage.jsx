// KajianPage — schedule list, calendar view, featured kajian.

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob, SunDecor } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";

export function KajianPage({ onNav }) {
  const [filter, setFilter] = React.useState("Semua");
  const filters = ["Semua", "Online", "Offline", "Minggu ini", "Tahsin", "Tafsir", "Parenting"];

  const events = [
    { date: 22, month: "Mei", day: "Jum'at", title: "Tafsir Surat Al-Kahfi", speaker: "Ust. Adi Hidayat", time: "Ba'da Maghrib · 18.10 WIB", loc: "Masjid Istiqlal · Jakarta", type: "Offline", cat: "Tafsir", color: "var(--sage)", attendees: 240, free: true },
    { date: 24, month: "Mei", day: "Ahad", title: "Parenting in Islam: Ngomong sama Remaja", speaker: "dr. Aisyah Dahlan", time: "10.00 WIB", loc: "Zoom + YouTube live", type: "Online", cat: "Parenting", color: "var(--lilac)", attendees: 1820, free: true },
    { date: 27, month: "Mei", day: "Rabu", title: "Kelas Tahsin: Makhraj huruf hijaiyah", speaker: "Ust. Hasan Bashri", time: "19.30 WIB", loc: "Google Meet", type: "Online", cat: "Tahsin", color: "var(--peach)", attendees: 86, free: false, price: "Rp 50rb" },
    { date: 29, month: "Mei", day: "Jum'at", title: "Khusyu' dalam sholat: tips praktis", speaker: "Ust. Hanan Attaki", time: "Ba'da Isya · 19.45 WIB", loc: "Masjid Agung Sunda Kelapa", type: "Offline", cat: "Tafsir", color: "var(--butter)", attendees: 410, free: true },
    { date: 1,  month: "Jun", day: "Ahad", title: "Muslimah Talk: self-worth dari sudut Islam", speaker: "Ust. Oki Setiana Dewi", time: "14.00 WIB", loc: "Zoom · Khusus perempuan", type: "Online", cat: "Parenting", color: "var(--coral)", attendees: 980, free: true },
    { date: 3,  month: "Jun", day: "Selasa", title: "Tadabbur Juz 30 — bagian 1", speaker: "Ust. Nouman Ali Khan (Sub-id)", time: "20.00 WIB", loc: "YouTube live", type: "Online", cat: "Tafsir", color: "var(--sage)", attendees: 2400, free: true },
  ];

  return (
    <div data-screen-label="03 Ngaji Bareng">
      <KajianHero/>

      <section className="shell" style={{ marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "start" }}>
          {/* main list */}
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 6 }}>filter:</span>
              {filters.map(f => (
                <button key={f}
                        onClick={() => setFilter(f)}
                        className="btn btn--sm"
                        style={{
                          background: filter === f ? "var(--ink)" : "var(--paper)",
                          color: filter === f ? "var(--bg)" : "var(--ink)",
                        }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {events.map((e, i) => <KajianRow key={i} e={e}/>)}
            </div>
          </div>

          {/* sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 100 }}>
            <MiniCalendar/>
            <SubmitKajian/>
            <FeaturedSpeaker/>
          </aside>
        </div>
      </section>

      <UpcomingMonth/>
      <NewsletterBlock/>
    </div>
  );
}

function KajianHero() {
  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color="var(--lilac)" size={260} top={20} right={60} opacity={0.45}/>
      <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center", position: "relative", overflow: "visible" }}>
        <div style={{ minWidth: 0 }}>
          <span className="pill pill--ink"><Icon.Cal size={12}/> 24 jadwal bulan ini</span>
          <h1 style={{ fontSize: "clamp(40px, 4.8vw, 64px)", fontWeight: 700, lineHeight: 1, marginTop: 16 }}>
            Yuk, ikut <span style={{ background: "var(--peach)", padding: "0 12px 4px", borderRadius: 14, display: "inline-block", transform: "rotate(-1deg)" }}>kajian</span><br/>
            <span style={{ fontFamily: "var(--font-hand)", color: "var(--sage-deep)", fontWeight: 500 }}>bareng</span> minggu ini.
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 16, maxWidth: 520 }}>
            Daftar gratis, kami kirim reminder lewat email & WhatsApp. Banyak juga yang bisa ditonton ulang di YouTube.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <button className="btn btn--primary">Lihat jadwal minggu ini <Icon.Arrow size={14}/></button>
            <button className="btn">Filter online aja</button>
          </div>
        </div>

        {/* mini calendar preview */}
        <div className="card card--sage kajian-hero-calendar" style={{ padding: 18, transform: "rotate(2deg)", boxShadow: "5px 6px 0 var(--ink)", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>Mei 2026</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--coral-deep)", whiteSpace: "nowrap" }}>14 Dzul-Q</span>
          </div>
          <div className="mini-calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 10 }}>
            {"Ahd Sen Sel Rab Kam Jum Sab".split(" ").map(d =>
              <div key={d} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 4, fontWeight: 600 }}>{d}</div>
            )}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
              const has = [22, 24, 27, 29].includes(d);
              const today = d === 20;
              return (
                <div key={d} style={{
                  aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: today ? 700 : 500,
                  background: today ? "var(--ink)" : has ? "var(--paper)" : "transparent",
                  color: today ? "var(--bg)" : "var(--ink)",
                  borderRadius: 8,
                  border: has && !today ? "1.5px solid var(--ink)" : "none",
                  position: "relative"
                }}>
                  {d}
                  {has && !today && <span style={{ position: "absolute", bottom: 2, width: 4, height: 4, borderRadius: "50%", background: "var(--coral-deep)" }}/>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function KajianRow({ e }) {
  return (
    <article className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>
      <div style={{
        background: e.color, borderRadius: 18, padding: "14px 18px",
        border: "1.5px solid var(--ink)", textAlign: "center", minWidth: 86
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{e.date}</div>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{e.month}</div>
        <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 2 }}>{e.day}</div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <span className={`pill ${e.type === "Online" ? "" : "pill--ink"}`} style={{ fontSize: 10 }}>
            {e.type === "Online" ? "🟢 Online" : "📍 Offline"}
          </span>
          <span className="pill" style={{ fontSize: 10 }}>{e.cat}</span>
          {e.free
            ? <span className="pill" style={{ fontSize: 10, background: "var(--sage)", color: "var(--ink)", border: "1px solid var(--ink)" }}>Gratis</span>
            : <span className="pill" style={{ fontSize: 10, background: "var(--peach)", color: "var(--ink)", border: "1px solid var(--ink)" }}>{e.price}</span>
          }
        </div>
        <h4 style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 8 }}>{e.title}</h4>
        <div style={{ fontSize: 13, color: "var(--ink-soft)", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Smile size={12}/> {e.speaker}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Clock size={12}/> {e.time}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Pin size={12}/> {e.loc}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Smile size={12}/> {e.attendees.toLocaleString("id")} daftar</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button className="btn btn--sm btn--primary">Daftar <Icon.Arrow size={12}/></button>
        <button className="btn btn--sm btn--ghost" style={{ fontSize: 12, padding: "6px 10px" }}>
          <Icon.Bell size={11}/> Ingetin
        </button>
      </div>
    </article>
  );
}

function MiniCalendar() {
  return (
    <div className="card card--peach" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>Mei 2026</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="btn btn--sm" style={{ padding: "4px 8px", fontSize: 11 }}>‹</button>
          <button className="btn btn--sm" style={{ padding: "4px 8px", fontSize: 11 }}>›</button>
        </div>
      </div>
      <div className="mini-calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, fontSize: 11 }}>
        {"A S S R K J S".split(" ").map((d, i) => (
          <div key={i} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 2, fontWeight: 600 }}>{d}</div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
          const has = [22, 24, 27, 29].includes(d);
          const today = d === 20;
          return (
            <div key={d} style={{
              aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: today ? 700 : 500,
              background: today ? "var(--ink)" : has ? "var(--paper)" : "transparent",
              color: today ? "var(--bg)" : "var(--ink)",
              borderRadius: 6,
              border: has && !today ? "1px solid var(--ink)" : "none"
            }}>{d}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--ink-soft)", marginTop: 12 }}>
        <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--ink)", borderRadius: 3, marginRight: 4 }}/>Hari ini</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--paper)", border: "1px solid var(--ink)", borderRadius: 3, marginRight: 4 }}/>Ada jadwal</span>
      </div>
    </div>
  );
}

function SubmitKajian() {
  return (
    <div className="card card--lilac" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <span className="sticker illus-only" style={{ alignSelf: "flex-start", background: "var(--butter)", fontSize: 16 }}>kabarin yuk!</span>
      <h4 style={{ fontSize: 22, lineHeight: 1.15, marginTop: 4 }}>Punya kajian buat dishare?</h4>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>Tim Muslim Hebat bantu broadcast ke 12rb+ anggota komunitas, gratis.</p>
      <button className="btn btn--sm btn--primary" style={{ alignSelf: "flex-start", marginTop: 4 }}>
        Submit jadwal <Icon.Arrow size={12}/>
      </button>
    </div>
  );
}

function FeaturedSpeaker() {
  return (
    <div className="card card--ink" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <SunDecor size={80} color="var(--peach)" style={{ position: "absolute", top: -20, right: -20, opacity: 0.6 }}/>
      <div style={{ position: "relative" }}>
        <span className="pill pill--paper" style={{ fontSize: 11 }}>👤 ustadz minggu ini</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--peach)", border: "2px solid var(--bg)" }}/>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Ust. Adi Hidayat</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Tafsir & Hadits · 4 kajian bulan ini</div>
          </div>
        </div>
        <button className="btn btn--sm" style={{ marginTop: 14 }}>Lihat semua kajiannya →</button>
      </div>
    </div>
  );
}

function UpcomingMonth() {
  const weeks = [
    { label: "Minggu ini", count: 4, color: "var(--peach)" },
    { label: "Minggu depan", count: 6, color: "var(--sage)" },
    { label: "Akhir bulan", count: 5, color: "var(--lilac)" },
    { label: "Bulan depan", count: 9, color: "var(--butter)" },
  ];
  return (
    <section className="shell" style={{ marginBottom: 32 }}>
      <SectionHeader
        kicker="lihat kedepan"
        title="Yang akan datang"
        sub="Snapshot cepat jadwal kajian untuk beberapa minggu ke depan."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {weeks.map((w, i) => (
          <div key={i} className="card" style={{
            background: w.color, padding: 22, position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", gap: 8, minHeight: 160
          }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--ink)" }}>{w.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em" }}>
              {w.count}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: "auto" }}>kajian dijadwalkan</div>
            <button className="btn btn--sm" style={{ alignSelf: "flex-start", background: "var(--paper)" }}>Lihat detail <Icon.Arrow size={12}/></button>
          </div>
        ))}
      </div>
    </section>
  );
}
