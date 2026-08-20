import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { Icon } from "./icons.jsx";
import { Blob, SunDecor } from "./shell.jsx";
import { ArticleSection, NewsletterBlock } from "./HomePage_more.jsx";
import { usePublicData } from "./hooks/usePublicData.js";

const FALLBACK = null;

export function HomePage({ onNav, onOpenCerita }) {
  const { data: home } = usePublicData("/public/home", FALLBACK);

  return (
    <div data-screen-label="01 Home">
      <Hero onNav={onNav} home={home}/>
      <ArticleSection onNav={onNav} onOpenCerita={onOpenCerita}/>
      <NewsletterBlock/>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
function Hero({ onNav, home }) {
  const hero = home?.hero || {};
  const prayer = home?.prayer || {};
  const daily = home?.daily || {};

  const headline = hero.headline || ["Baca Islam", "tanpa drama", "pelan-pelan tiap hari."];
  const stat = hero.stat || "+ 12,400 pembaca";
  const pill = hero.pill || "bacaan baru tiap minggu";
  const sub = hero.sub || "Tulisan ringan tentang Islam, self-growth, dan ibadah harian — dibahas santai, tanpa menggurui.";
  const ctaPrimary = hero.ctaPrimary || "Mulai baca";
  const ctaSecondary = hero.ctaSecondary || "Langganan buletin";

  const schedule = prayer.schedule || [
    { name: "Subuh", time: "04:38", done: true },
    { name: "Dzuhur", time: "11:52", done: true },
    { name: "Ashar", time: "15:24", active: true },
    { name: "Maghrib", time: "17:58" },
    { name: "Isya", time: "19:08" }
  ];
  const nextName = prayer.nextName || "Ashar";
  const nextTime = prayer.nextTime || "15:24";
  const nextLabel = prayer.nextLabel || "· 1 jam 12 menit lagi";

  const dailyStats = daily.stats || [
    { big: "14", sub: "hijriah", tag: "11 Dzul-Q" },
    { big: "3/5", sub: "sholat selesai" },
    { big: "3", sub: "bacaan baru" }
  ];
  const dailyDate = daily.date || "Rabu, 20 Mei";
  const dailyLabel = daily.label || "hari ini";

  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 24, position: "relative" }}>
      <Blob color="var(--peach)" size={260} top={-40} right={120}/>
      <Blob color="var(--sage)" size={220} top={120} left={-40} opacity={0.4}/>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, alignItems: "stretch", position: "relative" }}>
        {/* Big headline card */}
        <div className="card" style={{ background: "var(--paper)", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="pill pill--ink"><Icon.Sparkle size={12}/> {pill}</span>
            <span className="pill">{stat}</span>
          </div>

          <h1 style={{ fontSize: "clamp(52px, 6.5vw, 86px)", fontWeight: 700, lineHeight: 0.95 }}>
            {headline[0] || "Belajar Islam"}<br/>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ background: "var(--coral)", padding: "0 18px 6px", borderRadius: 18, display: "inline-block", transform: "rotate(-2deg)" }}>{headline[1] || "tanpa"}</span>
              <span style={{ fontFamily: "var(--font-hand)", color: "var(--sage-deep)", fontWeight: 500 }}>{headline[2]?.split(" ")[0] || "drama"}</span>
            </span><br/>
            {headline[2] ? headline[2].split(" ").slice(1).join(" ") : "santai & konsisten."}
          </h1>

          <p style={{ fontSize: 17, maxWidth: 480, color: "var(--ink-soft)", margin: 0 }}>
            {sub}
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn--primary" onClick={() => onNav && onNav("bacaan")}>
              {ctaPrimary} <Icon.Arrow size={16}/>
            </button>
            <a className="btn" href="#newsletter">
              {ctaSecondary}
            </a>
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
                {nextName}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, marginTop: 4, color: "var(--peach)", fontWeight: 600 }}>
                {nextTime} <span style={{ fontSize: 14, color: "var(--bg)", opacity: 0.6, fontFamily: "var(--font-body)", fontWeight: 500 }}>{nextLabel}</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 24, flexWrap: "wrap" }}>
                {schedule.map(s => (
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
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "var(--coral-deep)" }}>{dailyLabel}</span>
              <span className="pill pill--paper" style={{ fontSize: 11 }}><Icon.Cal size={11}/> {dailyDate}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {dailyStats.map(s => <Stat key={s.sub} big={s.big} sub={s.sub} tag={s.tag}/>)}
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
