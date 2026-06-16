import React from "react";
import { Seo } from "./seo.jsx";

export function NotFoundPage({ onNav }) {
  return (
    <div data-screen-label="404">
      <Seo title="Halaman Tidak Ditemukan" description="Maaf, halaman yang kamu cari tidak ditemukan." noindex />

      <section className="shell" style={{ paddingTop: 48, paddingBottom: 64, textAlign: "center" }}>
        <div style={{ fontSize: "clamp(80px, 12vw, 160px)", fontWeight: 700, lineHeight: 1, color: "var(--sage-deep)", opacity: 0.3, fontFamily: "var(--font-display)" }}>
          404
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginTop: 8, lineHeight: 1.1 }}>
          Halaman tidak ditemukan
        </h1>
        <p style={{ color: "var(--ink-soft)", maxWidth: 400, margin: "16px auto 0", fontSize: 16 }}>
          Sepertinya halaman yang kamu cari sudah pindah atau memang tidak pernah ada. Yuk balik ke beranda!
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          <button className="btn btn--primary" onClick={() => onNav("home")}>
            ← Kembali ke beranda
          </button>
          <button className="btn" onClick={() => onNav("bacaan")}>
            Jelajahi bacaan
          </button>
        </div>

        <div style={{ marginTop: 48, fontSize: 80 }}>🌙</div>
      </section>
    </div>
  );
}

export default NotFoundPage;
