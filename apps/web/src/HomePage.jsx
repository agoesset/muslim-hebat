import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { ArticleSection, NewsletterBlock } from "./HomePage_more.jsx";

export function HomePage({ onNav, onOpenCerita }) {
  const homeRef = React.useRef(null);

  React.useEffect(() => {
    const root = homeRef.current;
    const sections = root?.querySelectorAll(".section-reveal");
    if (!root || !sections?.length) return undefined;
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    const observeSections = (scope) => {
      if (scope.matches?.(".section-reveal")) observer.observe(scope);
      scope.querySelectorAll?.(".section-reveal").forEach((section) => observer.observe(section));
    };
    sections.forEach((section) => observer.observe(section));
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) observeSections(node);
      }));
    });
    mutationObserver.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div ref={homeRef} className="home-reveal-root" data-screen-label="01 Home">
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
    <section className="page blog-section section-reveal">
      <div className="home-hero">
        <svg className="hero-crescent float" viewBox="0 0 260 260" aria-hidden="true">
          <circle cx="130" cy="130" r="92" fill="currentColor"/>
          <circle cx="170" cy="92" r="92" fill="var(--bg)"/>
        </svg>
        <div className="hero-sparkles" aria-hidden="true">
          {["one", "two", "three", "four"].map((name) => (
            <svg key={name} className={`hero-sparkle hero-sparkle--${name} twinkle`} viewBox="0 0 32 32">
              <path d="M16 1c1.5 7.5 7.5 13.5 15 15-7.5 1.5-13.5 7.5-15 15C14.5 23.5 8.5 17.5 1 16 8.5 14.5 14.5 8.5 16 1Z" fill="currentColor"/>
            </svg>
          ))}
        </div>
        <div className="home-hero__content">
          <span className="pill">{HERO_COPY.pill}</span>
          <h1 className="home-hero__title">{HERO_COPY.title}</h1>
          <p className="home-hero__sub">{HERO_COPY.sub}</p>
          <button type="button" className="link-text" onClick={() => onNav && onNav("bacaan")}>
            {HERO_COPY.cta} →
          </button>
        </div>
        <div className="hero-leaves drift" aria-hidden="true">
          {["one", "two", "three"].map((name) => (
            <svg key={name} className={`hero-leaf hero-leaf--${name}`} viewBox="0 0 48 48">
              <path d="M42 6C21 7 8 18 7 40c18-1 31-11 35-34Z" fill="currentColor"/>
              <path d="M10 37c8-9 16-15 27-25" fill="none" stroke="var(--sage-deep)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ))}
        </div>
      </div>
    </section>
  );
}
