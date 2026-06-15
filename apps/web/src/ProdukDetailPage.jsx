import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { useCta } from "./context/cta-context.jsx";

function rupiah(cents = 0) {
  return cents === 0 ? "Gratis" : `Rp ${Number(cents).toLocaleString("id")}`;
}

export function ProdukDetailPage({ product, onNav }) {
  const { openInterest } = useCta();
  const p = product;
  const price = rupiah(p.priceCents || 0);
  const isFree = !p.priceCents;

  return (
    <div data-screen-label="Produk Detail">
      <div className="shell" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, color: "inherit", padding: 0 }}>Beranda</button>
        {" › "}<button onClick={() => onNav("produk")} style={{ background: "none", border: 0, color: "inherit", padding: 0 }}>Produk</button>
        {" › "}<span style={{ color: "var(--coral-deep)", fontWeight: 700 }}>{p.name}</span>
      </div>

      <section className="shell" style={{ paddingTop: 24, paddingBottom: 40, position: "relative" }}>
        <Blob color={p.color || "var(--peach)"} size={260} top={40} right={30} opacity={0.35}/>
        <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center", position: "relative" }}>
          <div>
            <span className="pill pill--ink">{p.category || "Produk digital"}</span>
            {p.tag && <span className="pill" style={{ marginLeft: 8, background: "var(--peach)" }}>{p.tag}</span>}
            <h1 style={{ fontSize: "clamp(42px, 5vw, 68px)", lineHeight: 0.98, marginTop: 16 }}>{p.name}</h1>
            <p style={{ fontSize: 18, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 560 }}>{p.excerpt}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 22 }}>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: 44 }}>{price}</strong>
              {!!p.originalPriceCents && <span style={{ textDecoration: "line-through", color: "var(--ink-soft)" }}>{rupiah(p.originalPriceCents)}</span>}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
              <button
                className="btn btn--primary"
                onClick={() => openInterest({
                  title: `${isFree ? "Unduh" : "Beli"}: ${p.name}`,
                  source: `produk:${p.slug}`,
                  intent: isFree ? "download" : "buy",
                  price,
                })}
              >
                {isFree ? "Unduh gratis" : "Beli via WhatsApp"} <Icon.Arrow size={14}/>
              </button>
              <button className="btn" onClick={() => onNav("produk")}>Lihat produk lain</button>
            </div>
          </div>
          <div className="card" style={{ minHeight: 360, background: p.color || "var(--peach)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 150, border: "1.5px solid var(--ink)", boxShadow: "6px 7px 0 var(--ink)" }}>
            {p.emoji || "🎁"}
          </div>
        </div>
      </section>

      <section className="shell" style={{ marginBottom: 42 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <h2>Yang kamu dapat</h2>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.7 }}>{p.description || p.excerpt}</p>
            <ul style={{ lineHeight: 1.9 }}>
              <li>File digital/akses dikirim setelah follow-up.</li>
              <li>Bisa ditanyakan dulu via WhatsApp sebelum beli.</li>
              <li>Cocok untuk bantu ibadah dan habit harian lebih konsisten.</li>
            </ul>
          </div>
          <aside className="card card--sage" style={{ padding: 28 }}>
            <h3>Ringkasan</h3>
            <p><strong>Kategori:</strong> {p.category || "Produk"}</p>
            <p><strong>Rating:</strong> {p.rating || 4.9} / 5</p>
            <p><strong>Terjual:</strong> {(p.sold || 0).toLocaleString("id")}</p>
            <button className="btn btn--primary" style={{ width: "100%" }} onClick={() => openInterest({ title: `${isFree ? "Unduh" : "Beli"}: ${p.name}`, source: `produk:${p.slug}`, intent: isFree ? "download" : "buy", price })}>
              {isFree ? "Unduh" : "Beli sekarang"}
            </button>
          </aside>
        </div>
      </section>

      <NewsletterBlock />
    </div>
  );
}
