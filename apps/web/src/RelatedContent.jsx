import React from "react";
import { SectionHeader } from "./SectionHeader.jsx";

export function RelatedArticles({ articles, onOpenCerita, title = "Bacaan serupa", subtitle = "Mungkin nyambung sama yang barusan kamu baca." }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader kicker="lanjut baca" title={title} sub={subtitle} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(articles.length, 3)}, 1fr)`, gap: 20 }}>
        {articles.map(c => (
          <article
            key={c.id}
            className="card"
            style={{ padding: 20, cursor: "pointer", transition: "transform 0.15s" }}
            onClick={() => onOpenCerita && onOpenCerita(c)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
          >
            <div style={{
              aspectRatio: "16/10", borderRadius: "var(--radius-sm)", background: c.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, border: "1.5px solid var(--ink)", marginBottom: 14
            }}>
              {c.emoji}
            </div>
            <span className="pill" style={{ fontSize: 11 }}>{c.cat}</span>
            <h4 style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 600, marginTop: 8 }}>{c.title}</h4>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.45 }}>{c.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RelatedProducts({ products, title = "Produk serupa", subtitle = "Yang lain juga lihat ini." }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader kicker="lihat juga" title={title} sub={subtitle} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(products.length, 3)}, 1fr)`, gap: 20 }}>
        {products.map(p => (
          <article key={p.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              aspectRatio: "5/4", borderRadius: "var(--radius-sm)", background: p.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 56, border: "1.5px solid var(--ink)"
            }}>
              {p.emoji}
            </div>
            <span style={{ fontSize: 11, color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase" }}>{p.cat}</span>
            <h4 style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 600 }}>{p.name}</h4>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginTop: "auto" }}>
              {p.price === 0 ? "Gratis" : `Rp ${p.price.toLocaleString("id")}`}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RelatedCourses({ courses, title = "Kelas lainnya", subtitle = "Mungkin cocok buat kamu." }) {
  if (!courses || courses.length === 0) return null;
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader kicker="juga tersedia" title={title} sub={subtitle} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(courses.length, 3)}, 1fr)`, gap: 20 }}>
        {courses.map(k => (
          <article key={k.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              aspectRatio: "4/2.5", borderRadius: "var(--radius-sm)", background: k.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, border: "1.5px solid var(--ink)"
            }}>
              {k.emoji}
            </div>
            <span style={{ fontSize: 10, color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase" }}>{k.cat} · {k.level}</span>
            <h4 style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 600 }}>{k.title}</h4>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{k.instructor} · {k.lessons} sesi</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginTop: "auto" }}>
              {k.price === 0 ? "Gratis" : `Rp ${k.price.toLocaleString("id")}`}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
