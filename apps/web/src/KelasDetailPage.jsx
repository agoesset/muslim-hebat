import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { useCta } from "./context/cta-context.jsx";

function rupiah(cents = 0) {
  return cents === 0 ? "Gratis" : `Rp ${Number(cents).toLocaleString("id")}`;
}

export function KelasDetailPage({ course, onNav }) {
  const { openInterest } = useCta();
  const k = course;
  const price = rupiah(k.priceCents || 0);
  const isFree = !k.priceCents;
  const cta = () => openInterest({
    title: `${isFree ? "Mulai" : "Daftar batch"}: ${k.title}`,
    source: `kelas:${k.slug}`,
    intent: "class",
    price,
  });

  return (
    <div data-screen-label="Kelas Detail">
      <div className="shell" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, color: "inherit", padding: 0 }}>Beranda</button>
        {" › "}<button onClick={() => onNav("kelas")} style={{ background: "none", border: 0, color: "inherit", padding: 0 }}>Kelas</button>
        {" › "}<span style={{ color: "var(--coral-deep)", fontWeight: 700 }}>{k.title}</span>
      </div>

      <section className="shell" style={{ paddingTop: 24, paddingBottom: 40, position: "relative" }}>
        <Blob color={k.color || "var(--sage)"} size={260} top={40} right={20} opacity={0.35}/>
        <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 34, alignItems: "center" }}>
          <div>
            <span className="pill pill--ink">{k.category || "Kelas"}</span>
            <span className="pill" style={{ marginLeft: 8 }}>{k.format || "Online"}</span>
            <h1 style={{ fontSize: "clamp(42px, 5vw, 68px)", lineHeight: 0.98, marginTop: 16 }}>{k.title}</h1>
            <p style={{ fontSize: 18, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 620 }}>{k.excerpt}</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", color: "var(--ink-soft)", fontSize: 14, marginTop: 18 }}>
              <span><Icon.Smile size={13}/> {k.instructor || "Mentor Muslim Hebat"}</span>
              <span><Icon.Clock size={13}/> {k.duration || "Fleksibel"}</span>
              <span><Icon.Star size={13}/> {k.rating || 4.9} ({k.reviews || 0} ulasan)</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <button className="btn btn--primary" onClick={cta}>{isFree ? "Mulai gratis" : "Daftar via WhatsApp"} <Icon.Arrow size={14}/></button>
              <button className="btn" onClick={() => onNav("kelas")}>Lihat kelas lain</button>
            </div>
          </div>
          <aside className="card card--sage" style={{ padding: 26, boxShadow: "6px 7px 0 var(--ink)" }}>
            <div style={{ fontSize: 96, textAlign: "center" }}>{k.emoji || "🎓"}</div>
            <h3 style={{ marginBottom: 8 }}>Info batch</h3>
            <p><strong>Harga:</strong> {price}</p>
            <p><strong>Batch:</strong> {k.batch || "On-demand"}</p>
            <p><strong>Mulai:</strong> {k.startDate || "Bisa mulai kapan aja"}</p>
            <p><strong>Jadwal:</strong> {k.schedule || "Fleksibel"}</p>
            <p><strong>Platform:</strong> {k.platform || "Online"}</p>
          </aside>
        </div>
      </section>

      <section className="shell" style={{ marginBottom: 42 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <h2>Kurikulum singkat</h2>
            <ul style={{ lineHeight: 1.9 }}>
              <li>Materi inti disusun bertahap dari dasar.</li>
              <li>{k.lessons || 6} sesi/modul dengan latihan praktis.</li>
              <li>Grup pendamping atau akses rekaman sesuai format kelas.</li>
            </ul>
          </div>
          <div className="card card--peach" style={{ padding: 28 }}>
            <h2>Slot & benefit</h2>
            <p>{k.description || k.excerpt}</p>
            {!!k.slots && <p><strong>Slot:</strong> {k.slotsTaken || 0}/{k.slots} terisi</p>}
            <button className="btn btn--primary" onClick={cta}>Amankan slot</button>
          </div>
        </div>
      </section>

      <NewsletterBlock />
    </div>
  );
}
