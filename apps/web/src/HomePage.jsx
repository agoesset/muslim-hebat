import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { ArticleSection, NewsletterBlock } from "./HomePage_more.jsx";

export function HomePage({ onNav, onOpenCerita }) {
  return (
    <div data-screen-label="01 Home">
      <Hero onNav={onNav}/>
      <ArticleSection onNav={onNav} onOpenCerita={onOpenCerita}/>
      <NewsletterBlock/>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
/* Copy hero di-hardcode: nilai lama di DB masih ngomongin produk/jadwal ngaji,
   sedangkan site sekarang blog-only. */
const HERO_COPY = {
  pill: "bacaan baru tiap minggu",
  title: "Belajar Islam yang santai.",
  sub: "Tulisan ringan soal Islam, self-growth, dan ibadah harian.",
  cta: "Mulai baca",
};

/* Hero minimal — pill, satu judul, satu kalimat, CTA berupa text link. */
function Hero({ onNav }) {
  return (
    <section className="page blog-section">
      <div className="home-hero">
        <span className="pill">{HERO_COPY.pill}</span>
        <h1 className="home-hero__title">{HERO_COPY.title}</h1>
        <p className="home-hero__sub">{HERO_COPY.sub}</p>
        <button type="button" className="link-text" onClick={() => onNav && onNav("bacaan")}>
          {HERO_COPY.cta} →
        </button>
      </div>
    </section>
  );
}
