import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { useCta } from "./context/cta-context.jsx";

function rupiah(cents = 0, free = true) {
  return free || !cents ? "Gratis" : `Rp ${Number(cents).toLocaleString("id")}`;
}

export function KajianDetailPage({ event, onNav }) {
  const { openInterest } = useCta();
  const e = event;
  const price = rupiah(e.priceCents, e.free);
  const daftar = () => openInterest({ title: `Daftar: ${e.title}`, source: `kajian:${e.slug}`, intent: "event", price });
  const reminder = () => openInterest({ title: `Reminder: ${e.title}`, source: `kajian-reminder:${e.slug}`, intent: "reminder" });

  return (
    <div data-screen-label="Kajian Detail">
      <div className="shell" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, color: "inherit", padding: 0 }}>Beranda</button>
        {" › "}<button onClick={() => onNav("kajian")} style={{ background: "none", border: 0, color: "inherit", padding: 0 }}>Kajian</button>
        {" › "}<span style={{ color: "var(--coral-deep)", fontWeight: 700 }}>{e.title}</span>
      </div>

      <section className="shell" style={{ paddingTop: 24, paddingBottom: 40, position: "relative" }}>
        <Blob color={e.color || "var(--lilac)"} size={260} top={40} right={20} opacity={0.35}/>
        <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 34, alignItems: "center" }}>
          <div className="card" style={{ background: e.color || "var(--lilac)", border: "1.5px solid var(--ink)", padding: 28, minWidth: 160, textAlign: "center", boxShadow: "6px 7px 0 var(--ink)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 76, lineHeight: 1 }}>{e.date || "-"}</div>
            <div style={{ fontWeight: 800, textTransform: "uppercase" }}>{e.month || ""}</div>
            <div style={{ color: "var(--ink-soft)", marginTop: 4 }}>{e.day || ""}</div>
          </div>
          <div>
            <span className="pill pill--ink">{e.eventType || "Kajian"}</span>
            <span className="pill" style={{ marginLeft: 8 }}>{price}</span>
            <h1 style={{ fontSize: "clamp(42px, 5vw, 68px)", lineHeight: 0.98, marginTop: 16 }}>{e.title}</h1>
            <p style={{ fontSize: 18, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 620 }}>{e.excerpt}</p>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", color: "var(--ink-soft)", fontSize: 14, marginTop: 18 }}>
              <span><Icon.Smile size={13}/> {e.speaker || "Pemateri"}</span>
              <span><Icon.Clock size={13}/> {e.time || "Jadwal menyusul"}</span>
              <span><Icon.Pin size={13}/> {e.location || "Online"}</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <button className="btn btn--primary" onClick={daftar}>Daftar kajian <Icon.Arrow size={14}/></button>
              <button className="btn" onClick={reminder}><Icon.Bell size={13}/> Minta reminder</button>
            </div>
          </div>
        </div>
      </section>

      <section className="shell" style={{ marginBottom: 42 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <h2>Detail kajian</h2>
            <p style={{ lineHeight: 1.7, color: "var(--ink-soft)" }}>{e.excerpt}</p>
            <p><strong>Pemateri:</strong> {e.speaker || "-"}</p>
            <p><strong>Lokasi:</strong> {e.location || "-"}</p>
            <p><strong>Peserta daftar:</strong> {(e.attendees || 0).toLocaleString("id")}</p>
          </div>
          <div className="card card--sage" style={{ padding: 28 }}>
            <h2>Reminder</h2>
            <p>Klik reminder supaya tim Muslim Hebat bisa follow-up link, tempat, dan pengingat jadwal.</p>
            <button className="btn btn--primary" onClick={reminder}>Ingatkan saya</button>
          </div>
        </div>
      </section>

      <NewsletterBlock />
    </div>
  );
}
