import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { BookOpen, Moon, Sparkles, Star, Sun } from "lucide-react";

import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { ArticleSection, NewsletterBlock } from "./HomePage_more.jsx";
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
function Hero({ onNav, home }) {
  const hero = home?.hero || {};
  const compact = useMediaQuery("(max-width: 760px)");

  const headline = hero.headline || [];
  const line1 = headline[0] || "Belajar Islam";
  const line2Lead = headline[1] || "yang";
  const line2Mark = headline[2] || "santai.";
  const pill = hero.pill || "bacaan baru tiap minggu";
  const sub = hero.sub || "Tulisan ringan tentang Islam, self-growth, dan ibadah harian — dibahas santai, tanpa menggurui.";
  const ctaPrimary = hero.ctaPrimary || "Mulai baca";
  const ctaSecondary = hero.ctaSecondary || "Langganan buletin";

  return (
    <section
      className="shell"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "clamp(40px, 7vw, 64px)",
        paddingBottom: "clamp(32px, 6vw, 56px)",
      }}
    >
      <HeroDecor compact={compact}/>

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 760,
        margin: "0 auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(14px, 2.4vw, 22px)",
      }}>
        <span className="pill" style={{ background: "var(--sage)", borderColor: "transparent", color: "var(--ink)" }}>
          <Sparkles size={13} aria-hidden="true"/> {pill}
        </span>

        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(42px, 8.5vw, 82px)",
          lineHeight: 1.03,
          letterSpacing: "-0.03em",
        }}>
          {line1}
          <br/>
          {line2Lead}{" "}
          <span style={{
            display: "inline-block",
            background: "var(--coral)",
            borderRadius: "16px 22px 18px 24px",
            padding: "0 0.28em 0.08em",
            transform: "rotate(-1.5deg)",
          }}>
            {line2Mark}
          </span>
        </h1>

        <p style={{
          margin: 0,
          maxWidth: 540,
          color: "var(--ink-soft)",
          fontSize: "clamp(15px, 2.2vw, 18px)",
          lineHeight: 1.6,
        }}>
          {sub}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 4 }}>
          <button type="button" className="btn btn--primary" onClick={() => onNav && onNav("bacaan")}>
            {ctaPrimary} <Icon.Arrow size={16}/>
          </button>
          <a className="btn" href="#newsletter">
            {ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

/* Dekorasi hero — murni ilustratif, disembunyikan dari screen reader. */
function HeroDecor({ compact }) {
  const base = { position: "absolute", pointerEvents: "none" };
  return (
    <div aria-hidden="true" className="illus-only" style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <Blob color="var(--peach)" size={compact ? 180 : 260} top={-60} right={compact ? -60 : 40} opacity={0.5}/>
      <Blob color="var(--sage)" size={compact ? 160 : 230} top={100} left={compact ? -80 : -30} opacity={0.35}/>

      {!compact && (
        <>
          <BookOpen
            size={44}
            strokeWidth={1.6}
            color="var(--sage-deep)"
            style={{ ...base, top: 34, left: "3%", opacity: 0.55, transform: "rotate(-12deg)" }}
          />
          <Sun
            size={58}
            strokeWidth={1.5}
            color="var(--peach-deep)"
            style={{ ...base, top: 12, right: "4%", opacity: 0.6, transform: "rotate(8deg)" }}
          />
          <Moon
            size={34}
            strokeWidth={1.6}
            color="var(--lilac-deep)"
            style={{ ...base, bottom: "16%", left: "7%", opacity: 0.5, transform: "rotate(-8deg)" }}
          />
          <Star
            size={26}
            strokeWidth={1.6}
            color="var(--coral-deep)"
            style={{ ...base, bottom: "22%", right: "8%", opacity: 0.5, transform: "rotate(10deg)" }}
          />
          <Sparkles
            size={22}
            strokeWidth={1.6}
            color="var(--peach-deep)"
            style={{ ...base, top: "42%", left: "1%", opacity: 0.45, transform: "rotate(6deg)" }}
          />
        </>
      )}

      {compact && (
        <Star
          size={20}
          strokeWidth={1.6}
          color="var(--coral-deep)"
          style={{ ...base, top: 16, right: 10, opacity: 0.45, transform: "rotate(10deg)" }}
        />
      )}
    </div>
  );
}
