// Shared components: Nav, Footer, WaveDivider, sticker decorations.

import { Icon } from "./icons.jsx";
import { useCta } from "./context/cta-context.jsx";

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

export function Nav({ page, onNav }) {
  const { openInterest } = useCta();
  const links = [
    { id: "home",   label: "Beranda" },
    { id: "bacaan", label: "Bacaan" },
    { id: "kelas",  label: "Kelas" },
    { id: "produk", label: "Produk" },
    { id: "kajian", label: "Ngaji Bareng" },
  ];
  return (
    <header style={{ paddingTop: 24, paddingBottom: 8, position: "sticky", top: 0, zIndex: 50, background: "var(--bg)" }}>
      <div className="shell row" style={{ gap: 18 }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, padding: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
        </button>
        <div className="grow"/>
        <nav className="row illus-only" style={{ gap: 4, background: "var(--paper)", padding: 6, borderRadius: 999, border: "1.5px solid rgba(31,58,45,0.1)" }}>
          {links.map(l => (
            <button key={l.id}
                    className="nav-link"
                    aria-current={page === l.id ? "page" : undefined}
                    onClick={() => onNav(l.id)}
                    style={{ border: 0, background: page === l.id ? "var(--ink)" : "transparent", color: page === l.id ? "var(--bg)" : "var(--ink)" }}>
              {l.label}
            </button>
          ))}
        </nav>
        <button className="btn btn--sm">
          <Icon.Search size={14}/> Cari
        </button>
        <button className="btn btn--sm btn--primary" onClick={() => openInterest({ title: "Daftar gratis di Muslim Hebat", source: "header:daftar-gratis", intent: "subscribe" })}>
          Daftar gratis <Icon.Arrow size={14}/>
        </button>
      </div>
    </header>
  );
}

export function Logo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.95 }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em" }}>
        Muslim Hebat<span style={{ color: "var(--coral-deep)" }}>.</span>
      </span>
      <span style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--coral-deep)", marginTop: 2 }}>tumbuh bareng, yuk!</span>
    </div>
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

export function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bg)", marginTop: 80, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, transform: "translateY(-100%)", lineHeight: 0 }}>
        <WaveDivider color="var(--ink)" height={56}/>
      </div>
      <div className="shell" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
              Muslim<br/>Hebat<span style={{ color: "var(--coral)" }}>.</span>
            </div>
            <p style={{ marginTop: 16, opacity: 0.7, fontSize: 14, maxWidth: 280 }}>
              Tumbuh bareng jadi muslim yang lebih dekat sama Allah — pelan-pelan, gak harus sempurna.
            </p>
          </div>
          <FooterCol title="Jelajahi" items={["Bacaan", "Kelas", "Produk", "Ngaji Bareng", "Komunitas"]}/>
          <FooterCol title="Bantuan" items={["FAQ", "Kontak", "Refund", "Syarat", "Privasi"]}/>
          <FooterCol title="Sosial" items={["Instagram", "TikTok", "YouTube", "Spotify", "Telegram"]}/>
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
        {items.map(i => <li key={i}><a href="#">{i}</a></li>)}
      </ul>
    </div>
  );
}
