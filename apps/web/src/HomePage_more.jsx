// HomePage extension — Articles + Newsletter (blog-only home).

import React from "react";
import { Link } from "react-router-dom";
import { api } from "./api.js";
import { usePublicData } from "./hooks/usePublicData.js";
import { formatArticleDate, formatReadTime } from "./utils";

/* ─── Articles ──────────────────────────────────────────────────────── */
export function ArticleSection({ onNav }) {
  const { data: apiArticles, loading, error } = usePublicData("/public/articles");
  const articles = React.useMemo(
    () =>
      (apiArticles || []).map((a) => ({
        ...a,
        time: formatReadTime(a),
        publishedLabel: formatArticleDate(a),
      })),
    [apiArticles]
  );

  if (loading) {
    return (
      <section className="page blog-section">
        <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>Memuat bacaan…</p>
      </section>
    );
  }
  if (error || articles.length === 0) return null;

  return (
    <section className="page blog-section">
      <div className="blog-head">
        <h2 className="blog-head__title">Bacaan terbaru</h2>
        <button type="button" className="link-text link-text--muted" onClick={() => onNav && onNav("bacaan")}>
          Lihat semua →
        </button>
      </div>

      <PostList articles={articles.slice(0, 5)}/>
    </section>
  );
}

/* Daftar artikel — judul, excerpt, meta, dipisah garis rambut. */
export function PostList({ articles }) {
  return (
    <div className="post-list">
      {articles.map((a) => (
        <PostItem key={a.id || a.slug} article={a}/>
      ))}
    </div>
  );
}

function PostItem({ article }) {
  const meta = [article.time, article.publishedLabel || formatArticleDate(article)].filter(Boolean);

  return (
    <Link to={`/bacaan/${article.slug}`} className="post-item">
      {article.category && <div className="post-item__cat">{article.category}</div>}
      <h3 className="post-item__title">{article.title}</h3>
      {article.excerpt && <p className="post-item__excerpt">{article.excerpt}</p>}
      <div className="post-item__meta">
        {meta.map((m, i) => (
          <React.Fragment key={m}>
            {i > 0 && <span aria-hidden="true">·</span>}
            <span>{m}</span>
          </React.Fragment>
        ))}
      </div>
    </Link>
  );
}

/* ─── Newsletter ────────────────────────────────────────────────────── */
export function NewsletterBlock() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setMsg("");
    try {
      await api("/public/subscribers", {
        method: "POST",
        body: JSON.stringify({ email, source: "newsletter" })
      });
      setStatus("success");
      setMsg("Berhasil! Cek inbox kamu.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Gagal subscribe. Coba lagi ya.");
    }
  }

  return (
    <section id="newsletter" className="page blog-section">
      <div className="news">
        <h2 className="news__title">Bacaan tiap Jumat pagi</h2>
        <p className="news__sub">
          1 artikel pilihan, 1 doa, 1 reminder kecil — langsung ke inbox kamu.
        </p>

        <form className="news__form" onSubmit={submit}>
          <input
            className="field-line"
            type="email"
            required
            aria-label="Alamat email"
            placeholder="kamu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <button type="submit" className="link-text" disabled={status === "loading" || !email}>
            {status === "loading" ? "Mengirim…" : "Langganan →"}
          </button>
        </form>

        {msg && (
          <p
            role="status"
            aria-live="polite"
            className={`news__msg ${status === "error" ? "news__msg--error" : "news__msg--ok"}`}
          >
            {msg}
          </p>
        )}

        <p className="news__fine">Gratis selamanya · berhenti kapan saja.</p>
      </div>
    </section>
  );
}
