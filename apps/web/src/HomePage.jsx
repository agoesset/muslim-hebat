import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { BookOpen, Sparkles } from "lucide-react";

import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { ArticleSection, NewsletterBlock, BLOG_CONTAINER } from "./HomePage_more.jsx";
import { usePublicData } from "./hooks/usePublicData.js";
import { useMediaQuery } from "./useMediaQuery.js";

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
/* Copy hero di-hardcode: nilai lama di DB masih ngomongin produk/jadwal ngaji,
   sedangkan site sekarang blog-only. Hanya pill yang masih boleh di-override DB. */
const HERO_COPY = {
  line1: "Belajar Islam",
  line2Lead: "yang",
  line2Mark: "santai.",
  pill: "bacaan baru tiap minggu",
  sub: "Tulisan ringan tentang Islam, self-growth, dan ibadah harian — dibahas santai, tanpa menggurui.",
  ctaPrimary: "Mulai baca",
  ctaSecondary: "Langganan buletin",
};

function Hero({ onNav, home }) {
  const compact = useMediaQuery("(max-width: 760px)");
  const pill = HERO_COPY.pill; // blog-only: ignore stale DB copy

  return (
    <section
      className="shell"
      style={{
        position: "relative",
        overflow: "hidden",
        maxWidth: BLOG_CONTAINER,
        paddingTop: "clamp(32px, 5vw, 48px)",
        paddingBottom: "clamp(24px, 4vw, 40px)",
      }}
    >
      <HeroDecor compact={compact}/>

      <div style={{
        position: "relative",
        zIndex: 1,
        margin: "0 auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(10px, 1.8vw, 16px)",
      }}>
        <BookOpen
          size={22}
          strokeWidth={1.6}
          color="var(--sage-deep)"
          aria-hidden="true"
          className="illus-only"
          style={{ marginBottom: -2 }}
        />

        <span
          className="pill"
          style={{ background: "var(--sage)", borderColor: "transparent", color: "var(--ink)", fontSize: 12 }}
        >
          <Sparkles size={12} strokeWidth={1.8} aria-hidden="true"/>
          {pill}
        </span>

        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(34px, 6vw, 56px)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}>
          {HERO_COPY.line1}
          <br/>
          {HERO_COPY.line2Lead}{" "}
          <span style={{
            display: "inline-block",
            background: "var(--coral)",
            borderRadius: 10,
            padding: "0 0.24em 0.06em",
            transform: "rotate(-1deg)",
          }}>
            {HERO_COPY.line2Mark}
          </span>
        </h1>

        <p style={{
          margin: 0,
          maxWidth: 420,
          color: "var(--ink-soft)",
          fontSize: "clamp(15px, 1.6vw, 16px)",
          lineHeight: 1.55,
        }}>
          {HERO_COPY.sub}
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 4, width: "100%" }}>
          <button
            type="button"
            className="btn btn--primary hero-cta"
            onClick={() => onNav && onNav("bacaan")}
          >
            {HERO_COPY.ctaPrimary} <Icon.Arrow size={18}/>
          </button>
          <a className="hero-cta-link" href="#newsletter">
            {HERO_COPY.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

/* Dekorasi hero — satu blob pastel, murni ilustratif & disembunyikan dari screen reader. */
function HeroDecor({ compact }) {
  return (
    <div aria-hidden="true" className="illus-only" style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <Blob color="var(--peach)" size={compact ? 160 : 220} top={-70} right={compact ? -60 : 10} opacity={0.3}/>
    </div>
  );
}
