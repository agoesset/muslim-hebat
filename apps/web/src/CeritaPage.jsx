// CeritaPage — arsip bacaan: header, filter kategori, daftar artikel.

import React from "react";
import { NewsletterBlock, PostList } from "./HomePage_more.jsx";
import { EmptyState } from "./EmptyState.jsx";

import { usePublicData } from "./hooks/usePublicData.js";
import { formatArticleDate, formatReadTime } from "./utils";

const KATEGORI = ["Semua", "Self-growth", "Parenting", "Tafsir santai", "Productivity", "Hubungan", "Ibadah harian"];

function normalizeArticles(apiArticles) {
  if (!apiArticles) return [];
  return apiArticles.map((a) => ({
    ...a,
    cat: a.category,
    time: formatReadTime(a),
    publishedLabel: formatArticleDate(a),
  }));
}

export function CeritaPage({ onNav }) {
  const [cat, setCat] = React.useState("Semua");
  const { data: apiArticles, loading, error } = usePublicData("/public/articles");
  const articles = React.useMemo(() => normalizeArticles(apiArticles), [apiArticles]);

  const list = cat === "Semua" ? articles : articles.filter((c) => c.cat === cat);

  return (
    <div data-screen-label="04 Bacaan">
      <section className="page blog-section">
        <div className="home-hero">
          <h1 className="home-hero__title">Bacaan</h1>
          <p className="home-hero__sub">
            Kumpulan tulisan ringan soal Islam, self-growth, dan ibadah harian.
          </p>
        </div>

        <div className="chip-row" role="group" aria-label="Filter kategori">
          {KATEGORI.map((k) => (
            <button
              key={k}
              type="button"
              className="chip"
              aria-pressed={cat === k}
              onClick={() => setCat(k)}
            >
              {k}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 4px" }}>
          {loading ? "Memuat…" : error ? "Gagal memuat bacaan." : `${list.length} bacaan`}
        </p>

        {!loading && !error && list.length === 0 && (
          <EmptyState
            icon="📖"
            title="Belum ada bacaan"
            message="Bacaan baru tiap Jum'at pagi — pantau terus ya."
            actionLabel="Ke beranda"
            onAction={() => onNav && onNav("home")}
          />
        )}

        {list.length > 0 && <PostList articles={list}/>}
      </section>

      <NewsletterBlock/>
    </div>
  );
}
