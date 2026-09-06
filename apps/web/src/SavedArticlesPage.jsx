import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getSavedArticles, toggleSavedArticle } from "./saved-articles.js";
import { formatArticleDate } from "./utils";
import { Seo } from "./seo.jsx";
import { EmptyState } from "./EmptyState.jsx";

export function SavedArticlesPage() {
  const [articles, setArticles] = React.useState(() => getSavedArticles());

  React.useEffect(() => {
    const sync = () => setArticles(getSavedArticles());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const remove = (slug) => {
    const saved = articles.find((a) => a.slug === slug);
    if (saved) toggleSavedArticle(saved);
    setArticles(getSavedArticles());
  };

  return (
    <main className="page saved-page">
      <Seo title="Artikel Disimpan | Muslim Hebat" description="Koleksi bacaan yang kamu simpan." noindex />
      <span className="eyebrow">Koleksi pribadi</span>
      <h1>Artikel Disimpan</h1>
      {articles.length === 0 ? (
        <EmptyState icon="🔖" title="Belum ada artikel disimpan" message="Simpan bacaan favoritmu lewat tombol Simpan di halaman artikel." />
      ) : (
        <div className="saved-list">
          {articles.map((a) => (
            <article key={a.slug} className="card saved-item">
              <div>
                {a.category && <div className="post-item__cat">{a.category}</div>}
                <h3 className="post-item__title"><Link to={`/bacaan/${a.slug}`}>{a.title}</Link></h3>
                {a.excerpt && <p className="post-item__excerpt">{a.excerpt}</p>}
                {a.savedAt && <small>Disimpan {formatArticleDate({ createdAt: a.savedAt })}</small>}
              </div>
              <button type="button" className="btn btn--sm btn--ghost" aria-label={`Hapus ${a.title}`} onClick={() => remove(a.slug)}>
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
