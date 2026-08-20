import React from "react";
// Shared components: Nav, Footer, WaveDivider, sticker decorations.

import { Icon } from "./icons.jsx";
import { useCta } from "./context/cta-context.jsx";
import { SOCIAL_LINKS, SITE_LINKS } from "./site-links.ts";

export function WaveDivider({ color = "var(--ink)", flip = false, height = 48 }) {
  // scalloped wave — bumps that read as friendly, organic
  return (
    <svg className="wave-divider" viewBox="0 0 1200 60" preserveAspectRatio="none"
         style={{ height, transform: flip ? "scaleY(-1)" : "none", display: "block" }}>
      <path d="M0,60 L0,30
               C 50,30 50,5  100,5  S 150,30 200,30
               S 250,5  300,5  S 350,30 400,30
               S 450,5  500,5  S 550,30 600,30
               S 650,5  700,5  S 750,30 800,30
               S 850,5  900,5  S 950,30 1000,30
               S 1050,5 1100,5 S 1150,30 1200,30
               L 1200,60 Z"
            fill={color}/>
    </svg>
  );
}

import { Link } from "react-router-dom";

export function Nav({ page, onSearch }) {
  const { openInterest } = useCta();
  const links = [
    { id: "home",   label: "Beranda", path: "/" },
    { id: "bacaan", label: "Bacaan", path: "/bacaan" },
    { id: "kontak", label: "Kontak", path: "/kontak" },
  ];
  return (
    <header className="site-header blog-container" style={{ paddingTop: 24, paddingBottom: 8, position: "sticky", top: 0, zIndex: 50, background: "var(--bg)" }}>
      <div className="blog-container row" style={{ gap: 18 }}>
        <Link to="/" style={{ background: "none", border: 0, padding: 0, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo />
        </Link>
        <div className="grow"/>
        <nav className="row illus-only" style={{ gap: 4, background: "var(--paper)", padding: 6, borderRadius: 999, border: "1.5px solid rgba(26,26,24,0.1)" }}>
          {links.map(l => (
            <Link key={l.id}
                  to={l.path}
                  className="nav-link"
                  aria-current={page === l.id ? "page" : undefined}
                  style={{ border: 0, background: page === l.id ? "var(--ink)" : "transparent", color: page === l.id ? "var(--bg)" : "var(--ink)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="btn btn--sm header-search" onClick={onSearch} aria-label="Cari">
          <Icon.Search size={14}/> <span className="btn-label">Cari</span>
        </button>
        <button type="button" className="btn btn--sm btn--primary header-cta" onClick={() => openInterest({ title: "Daftar gratis di Muslim Hebat", source: "header:daftar-gratis", intent: "subscribe" })}>
          Daftar gratis <Icon.Arrow size={14}/>
        </button>
      </div>
    </header>
  );
}

export function LogoMark({ size = 32, style = {} }) {
  // crescent + star — konsisten dengan favicon/PWA icon set
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Logo Muslim Hebat" style={{ display: "block", flexShrink: 0, ...style }}>
      <rect width="100" height="100" rx="22" fill="var(--ink)" />
      <path d="M55 25 A18 18 0 1 1 42 65 A22 22 0 1 0 55 25Z" fill="var(--paper)" transform="translate(-7,2)" />
      <path d="M74 16 L77.5 25 L86 28 L77.5 31 L74 40 L70.5 31 L62 28 L70.5 25 Z" fill="var(--coral)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={36} />
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink)", letterSpacing: "-0.01em" }}>
        Muslim&nbsp;Hebat
      </span>
    </span>
  );
}

export function StarDecor({ size = 24, color = "var(--coral)", rotate = 0, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `rotate(${rotate}deg)`, ...style }} className="illus-only">
      <path d="M20 2 c2 8 8 14 16 18 c-8 4 -14 10 -16 18 c-2 -8 -8 -14 -16 -18 c8 -4 14 -10 16 -18z" fill={color}/>
    </svg>
  );
}

export function SunDecor({ size = 80, color = "var(--peach)", style = {} }) {
  // 8 rays + center circle
  const rays = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const x1 = 50 + Math.cos(a) * 22;
    const y1 = 50 + Math.sin(a) * 22;
    const x2 = 50 + Math.cos(a) * 38;
    const y2 = 50 + Math.sin(a) * 38;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="6" strokeLinecap="round"/>;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} className="illus-only">
      {rays}
      <circle cx="50" cy="50" r="18" fill={color}/>
    </svg>
  );
}

export function Blob({ color = "var(--peach)", size = 200, top, left, right, bottom, opacity = 0.55 }) {
  return (
    <span className="blob illus-only" style={{
      background: color, width: size, height: size,
      top, left, right, bottom, opacity
    }}/>
  );
}

export function Footer({ settings }) {
  const siteSetting = React.useMemo(() => {
    if (!settings) return null;
    const site = settings.find((s) => s.key === "site");
    if (!site) return null;
    return typeof site.value === "string" ? JSON.parse(site.value) : site.value;
  }, [settings]);

  const explore = [
    { label: "Bacaan", href: SITE_LINKS.bacaan },
  ];
  const help = [
    { label: "Kontak", href: SITE_LINKS.kontak },
  ];
  const social = [
    { label: "Instagram", href: siteSetting?.instagramUrl || SOCIAL_LINKS.instagram, icon: Icon.Instagram },
    { label: "TikTok", href: siteSetting?.tiktokUrl || SOCIAL_LINKS.tiktok, icon: Icon.TikTok },
    { label: "YouTube", href: siteSetting?.youtubeUrl || SOCIAL_LINKS.youtube, icon: Icon.Youtube },
    { label: "Spotify", href: siteSetting?.spotifyUrl || SOCIAL_LINKS.spotify, icon: Icon.Spotify },
    { label: "Telegram", href: siteSetting?.telegramUrl || SOCIAL_LINKS.telegram, icon: Icon.Telegram },
  ];

  return (
    <footer className="blog-container" style={{ background: "var(--ink)", color: "var(--bg)", position: "relative", borderRadius: "32px 32px 0 0" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, transform: "translateY(-100%)", lineHeight: 0 }}>
        <WaveDivider color="var(--ink)" height={56}/>
      </div>
      <div className="blog-container" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <LogoMark size={56} />
          </div>
          <FooterCol title="Jelajahi" items={explore} />
          <FooterCol title="Bantuan" items={help} />
          <FooterCol title="Sosial" items={social} />
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(251,243,226,0.18)", display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.6 }}>
          <span>© 2026 Muslim Hebat. Dibuat dengan ❤️ di Indonesia.</span>
          <span>v1.0 · barakallahu fiikum</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--peach)", marginBottom: 8 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 14, opacity: 0.85 }}>
        {items.map((item) => {
          const { label, href, icon: IconComponent } = item;
          const isPlaceholder = href === "#";
          return (
            <li key={label}>
              <a
                href={href}
                aria-label={isPlaceholder ? `${label} (akan segera hadir)` : undefined}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 0", minHeight: 32 }}
              >
                {IconComponent && <IconComponent size={14} />}
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
