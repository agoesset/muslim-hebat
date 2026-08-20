// HomePage extension — Articles + Newsletter (blog-only home).

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, Mail } from "lucide-react";
import { api } from "./api.js";
import { usePublicData } from "./hooks/usePublicData.js";
import { formatArticleDate, formatReadTime } from "./utils";

/* Lebar container blog — dipakai seragam oleh hero, artikel, dan newsletter.
   Sengaja inline (bukan ubah .shell global 90%, itu dipakai halaman admin). */
export const BLOG_CONTAINER = 680;

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
      <section className="shell blog-section" style={{ maxWidth: BLOG_CONTAINER }}>
        <p style={{ color: "var(--ink-soft)" }}>Memuat bacaan…</p>
      </section>
    );
  }
  if (error || articles.length === 0) return null;

  const featured = articles.find((a) => a.featured) || articles[0];
  const more = articles.filter((a) => a !== featured).slice(0, 4);

  return (
    <section className="shell blog-section" style={{ maxWidth: BLOG_CONTAINER }}>
      <div className="blog-head">
        <div>
          <h2 className="blog-head__title">Bacaan terbaru</h2>
          <p className="blog-head__sub">Dibahas santai, tanpa menggurui</p>
        </div>
        <button type="button" className="blog-head__link" onClick={() => onNav && onNav("bacaan")}>
          Lihat semua <ArrowRight size={13} strokeWidth={2} aria-hidden="true"/>
        </button>
      </div>

      <ArticleCard article={featured} featured/>

      {more.length > 0 && (
        <div className="blog-grid">
          {more.map((a) => (
            <ArticleCard key={a.id || a.slug} article={a}/>
          ))}
        </div>
      )}
    </section>
  );
}

/* Satu kartu artikel — varian featured (horizontal) & default (image di atas). */
function ArticleCard({ article, featured = false, onOpen }) {
  return (
    <article
      className={`blog-card${featured ? " blog-card--featured" : ""}`}
      onClick={() => onOpen && onOpen(article)}
      style={{ cursor: "pointer" }}
    >
      <ArticleMedia article={article} featured={featured}/>

      <div className="blog-card__body">
        {article.category && <div className="blog-card__cat">{article.category}</div>}

        {featured ? (
          <h3 className="blog-card__title">{article.title}</h3>
        ) : (
          <h4 className="blog-card__title blog-card__title--sm">{article.title}</h4>
        )}

        {article.excerpt && <p className="blog-card__excerpt">{article.excerpt}</p>}

        <div className="blog-card__meta">
          <span>
            <Clock size={12} strokeWidth={1.8} aria-hidden="true"/> {article.time}
          </span>
          {article.publishedLabel && (
            <>
              <span className="blog-card__dot" aria-hidden="true">·</span>
              <span>{article.publishedLabel}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/* Cover dari API kalau ada; kalau tidak, gradient pastel sage → peach + emoji artikel. */
function ArticleMedia({ article, featured }) {
  return (
    <div className={`blog-card__media${featured ? "" : " blog-card__media--top"}`}>
      {article.coverImage ? (
        <img className="blog-card__img" src={article.coverImage} alt="" loading="lazy" decoding="async"/>
      ) : (
        <span className="blog-card__emoji" aria-hidden="true">{article.emoji || "📖"}</span>
      )}
    </div>
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
      setMsg("Berhasil! Cek inbox kamu");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Gagal subscribe. Coba lagi ya.");
    }
  }

  return (
    <section id="newsletter" className="shell blog-section" style={{ maxWidth: BLOG_CONTAINER }}>
      <div className="newsletter-card">
        <h2 className="newsletter-card__title">
          <Mail size={22} strokeWidth={1.7} aria-hidden="true"/>
          Bacaan tiap Jumat pagi
        </h2>
        <p className="newsletter-card__sub">
          1 artikel pilihan, 1 doa, 1 reminder kecil — langsung ke inbox kamu.
        </p>

        <form className="newsletter-form" onSubmit={submit}>
          <div className="newsletter-form__field">
            <Mail size={16} strokeWidth={1.8} aria-hidden="true" style={{ color: "var(--ink-soft)" }}/>
            <input
              type="email"
              required
              aria-label="Alamat email"
              placeholder="kamu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <button type="submit" className="btn btn--coral" disabled={status === "loading" || !email}>
            {status === "loading" ? "Mengirim…" : "Langganan"}
          </button>
        </form>

        {msg && (
          <div
            role="status"
            aria-live="polite"
            className={`newsletter-msg ${status === "error" ? "newsletter-msg--error" : "newsletter-msg--ok"}`}
          >
            {status === "success" && <CheckCircle size={16} strokeWidth={2} aria-hidden="true"/>}
            {msg}
          </div>
        )}

        <p className="newsletter-card__fine">Gratis selamanya · berhenti kapan saja.</p>
      </div>
    </section>
  );
}
