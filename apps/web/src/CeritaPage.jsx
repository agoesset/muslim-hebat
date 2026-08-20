// CeritaPage — arsip bacaan: header, filter kategori, daftar artikel.

import React from "react";
import { NewsletterBlock, PostList } from "./HomePage_more.jsx";
import { EmptyState } from "./EmptyState.jsx";

import { usePublicData } from "./hooks/usePublicData.js";
import { formatArticleDate, formatReadTime } from "./utils";

const TABS = ["Terbaru", "Populer", "Ditandai"];

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
  const [tab, setTab] = React.useState("Terbaru");
  const { data: apiArticles, loading, error } = usePublicData("/public/articles");
  const articles = React.useMemo(() => normalizeArticles(apiArticles), [apiArticles]);

  const list = React.useMemo(() => {
    if (tab === "Populer") return [...articles].sort((a, b) => (b.claps || 0) - (a.claps || 0));
    if (tab === "Ditandai") return articles.filter((article) => article.bookmarked || article.saved);
    return articles;
  }, [articles, tab]);

  return (
    <div data-screen-label="04 Bacaan">
      <section className="page blog-section">
        <div className="archive-head">
          <span className="eyebrow">Ruang baca</span>
          <h1 className="home-hero__title">Bacaan</h1>
          <p className="home-hero__sub">
            Kumpulan tulisan ringan soal Islam, self-growth, dan ibadah harian.
          </p>
        </div>

        <div className="reading-tabs" role="tablist" aria-label="Urutkan bacaan">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className="reading-tab"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
            >
              {item}
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
