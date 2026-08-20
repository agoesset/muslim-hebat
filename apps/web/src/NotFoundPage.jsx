import React from "react";
import { Seo } from "./seo.jsx";

export function NotFoundPage({ onNav }) {
  return (
    <div data-screen-label="404">
      <Seo title="Halaman Tidak Ditemukan" description="Maaf, halaman yang kamu cari tidak ditemukan." noindex />

      <section className="page" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--ink-soft)" }}>404</div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 38px)", marginTop: 10, letterSpacing: "-0.03em" }}>
          Halaman tidak ditemukan
        </h1>
        <p style={{ color: "var(--ink-soft)", maxWidth: "46ch", margin: "12px 0 0", fontSize: 15 }}>
          Sepertinya halaman yang kamu cari sudah pindah atau memang tidak pernah ada.
        </p>

        <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
          <button type="button" className="link-text" onClick={() => onNav("home")}>
            Ke beranda →
          </button>
          <button type="button" className="link-text link-text--muted" onClick={() => onNav("bacaan")}>
            Jelajahi bacaan
          </button>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
