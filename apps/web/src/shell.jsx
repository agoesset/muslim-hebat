import React from "react";
// Shared components: Nav (bottom floating pill), SiteCredits, WaveDivider, sticker decorations.

import { SITE_LINKS } from "./site-links.ts";

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

const NAV_LINKS = [
  { id: "home",   label: "Beranda", path: "/" },
  { id: "bacaan", label: "Bacaan",  path: "/bacaan" },
  { id: "kontak", label: "Kontak",  path: "/kontak" },
];

/* Bottom nav — pill teks saja; halaman aktif ditandai bold + underline. */
export function Nav({ page }) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      <div className="bottom-nav__pill">
        {NAV_LINKS.map(({ id, label, path }) => (
          <Link
            key={id}
            to={path}
            className="bottom-nav__link"
            aria-current={page === id ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
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

/* Footer super simpel — center, teks kecil, link underline. */
export function SiteCredits() {
  const link = { textDecoration: "underline", textUnderlineOffset: 3 };
  return (
    <div
      style={{
        padding: "28px 16px 8px",
        textAlign: "center",
        fontSize: 10,
        color: "var(--ink-soft)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span>© 2026 Muslim Hebat</span>
      <Link to={SITE_LINKS.kontak} style={link}>Kontak</Link>
      <Link to="/unsubscribe" style={link}>Unsubscribe</Link>
    </div>
  );
}
