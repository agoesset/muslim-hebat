import React from "react";
// HomePage — blog-first layout: hero, bacaan terbaru, newsletter.

import { ArticleSection, NewsletterBlock } from "./HomePage_more.jsx";
import { Link } from "react-router-dom";

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
  pill: "Bacaan baru hari ini",
  title: "Menjadi lebih baik, satu bacaan dalam satu waktu.",
  sub: "Temukan inspirasi hangat untuk bertumbuh, mendekat, dan menjalani hari dengan lebih bermakna.",
  cta: "Mulai membaca",
};

const TOPICS = ["Self-Growth", "Ibadah Harian", "Dzikir Pagi", "Muhasabah"];

/* Hero minimal — pill, satu judul, satu kalimat, CTA berupa text link. */
function Hero({ onNav }) {
  return (
    <section className="page blog-section section-reveal">
      <div className="home-hero">
        <svg className="hero-mosque" viewBox="0 0 320 240" aria-hidden="true">
          <path d="M42 208h236M76 208v-72h64v72m40 0v-94h66v94M92 136c0-24 32-43 32-43s32 19 32 43m38-22c0-30 19-54 19-54s19 24 19 54M213 60V38m-7 0h14" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M102 208v-31c0-13 10-23 22-23s22 10 22 23v31m98 0v-40h22v40" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
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
          <button type="button" className="btn btn--primary home-hero__cta" onClick={() => onNav && onNav("bacaan")}>
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
      <div className="topic-strip">
        <div className="blog-head"><h2 className="blog-head__title">Topik Populer</h2></div>
        <div className="chip-row">
          {TOPICS.map((topic, index) => <Link key={topic} to="/bacaan" className="chip" aria-current={index === 0 ? "true" : undefined}>{topic}</Link>)}
        </div>
      </div>
    </section>
  );
}
