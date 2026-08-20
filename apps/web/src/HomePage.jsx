import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { ArrowRight, BookOpen, Moon, Sun } from "lucide-react";

import { Blob } from "./shell.jsx";
import { ArticleSection, NewsletterBlock, BLOG_CONTAINER } from "./HomePage_more.jsx";
import { useMediaQuery } from "./useMediaQuery.js";

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
  line1: "Belajar Islam",
  mark: "yang santai.",
  pill: "bacaan baru tiap minggu",
  sub: "Tulisan ringan soal Islam, self-growth, dan ibadah harian.",
  ctaPrimary: "Mulai baca",
  ctaSecondary: "Langganan",
};

function Hero({ onNav }) {
  const compact = useMediaQuery("(max-width: 760px)");

  return (
    <section className="shell blog-section" style={{ maxWidth: BLOG_CONTAINER }}>
      <div className="home-hero">
        <HeroDecor compact={compact}/>

        <div className="home-hero__inner">
          <span
            className="pill"
            style={{ background: "var(--sage)", borderColor: "transparent", color: "var(--ink)", fontSize: 12 }}
          >
            <BookOpen size={13} strokeWidth={1.9} aria-hidden="true"/>
            {HERO_COPY.pill}
          </span>

          <h1 className="home-hero__title">
            {HERO_COPY.line1}
            <br/>
            <span className="home-hero__mark">{HERO_COPY.mark}</span>
          </h1>

          <p className="home-hero__sub">{HERO_COPY.sub}</p>

          <div className="home-hero__cta">
            <button
              type="button"
              className="btn btn--primary hero-cta"
              onClick={() => onNav && onNav("bacaan")}
            >
              {HERO_COPY.ctaPrimary} <ArrowRight size={18} strokeWidth={2} aria-hidden="true"/>
            </button>
            <a className="hero-cta-link" href="#newsletter">
              {HERO_COPY.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Dekorasi hero — blob pastel + matahari/bulan floating.
   Murni ilustratif, disembunyikan dari screen reader & dari mode data-illus="false". */
function HeroDecor({ compact }) {
  return (
    <div aria-hidden="true" className="home-hero__decor illus-only">
      <Blob color="var(--peach)" size={compact ? 150 : 210} top={-80} right={compact ? -60 : -30} opacity={0.35}/>
      <Blob color="var(--lilac)" size={compact ? 130 : 180} bottom={-80} left={compact ? -60 : -30} opacity={0.28}/>
      <Sun className="home-hero__sun" size={compact ? 30 : 40} strokeWidth={1.4}/>
      <Moon className="home-hero__moon" size={compact ? 24 : 32} strokeWidth={1.4}/>
    </div>
  );
}
