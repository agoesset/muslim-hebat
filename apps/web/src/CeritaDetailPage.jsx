// CeritaDetailPage — tampilan baca satu artikel.

import React from "react";
import DOMPurify from "dompurify";
import { Bookmark } from "lucide-react";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { api } from "./api.js";
import { usePublicData } from "./hooks/usePublicData.js";
import { toast } from "./Toast.jsx";
import { shareContent } from "./share.js";
import { formatReadTime } from "./utils";

export function CeritaDetailPage({ onNav, cerita }) {
  const c = cerita;
  const [progress, setProgress] = React.useState(0);
  const [clapped, setClapped] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-screen-label="05 Bacaan Detail">
      {/* progress baca — garis tipis di atas */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "transparent", zIndex: 100 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--ink)", transition: "width 0.05s linear" }}/>
      </div>

      <div className="page" style={{ paddingTop: 20, fontSize: 12, color: "var(--ink-soft)" }}>
        <button
          type="button"
          onClick={() => onNav("bacaan")}
          style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0, font: "inherit" }}
        >
          ← Bacaan
        </button>
      </div>

      <CeritaDetailHero c={c}/>
      <CeritaBody c={c} clapped={clapped} setClapped={setClapped}/>
      <CommentsSection slug={c.slug} />
      <NewsletterBlock/>
    </div>
  );
}

function CeritaDetailHero({ c }) {
  const meta = [c.cat, formatArticleDate(c), formatReadTime(c)].filter(Boolean);

  return (
    <section className="page blog-section" style={{ paddingTop: 20 }}>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 38px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
        {c.title}
      </h1>
      {c.excerpt && (
        <p style={{ fontSize: 16, color: "var(--ink-soft)", margin: "12px 0 0", lineHeight: 1.6 }}>
          {c.excerpt}
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16, fontSize: 12, color: "var(--ink-soft)" }}>
        {c.author && (
          <>
            <span>{c.author}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        {meta.map((m, i) => (
          <React.Fragment key={m}>
            {i > 0 && <span aria-hidden="true">·</span>}
            <span>{m}</span>
          </React.Fragment>
        ))}
      </div>

      {c.coverImage && (
        <img
          src={c.coverImage}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ width: "100%", marginTop: 24, borderRadius: "var(--radius)", display: "block" }}
        />
      )}
    </section>
  );
}

function CeritaBody({ c, clapped, setClapped }) {
  const tags = [c.cat, c.tag].filter(Boolean);
  const storageKey = `muslim-hebat:bookmark:${c.slug}`;
  const [saved, setSaved] = React.useState(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // Bookmark tetap berfungsi untuk sesi aktif jika storage tidak tersedia.
    }
  }

  return (
    <section className="page blog-section">
      <article style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 24 }}>
        <ArticleBodyText c={c}/>

        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 28 }}>
            {tags.map((t) => (
              <span key={t} className="pill">#{String(t).toLowerCase().replaceAll(" ", "-")}</span>
            ))}
          </div>
        )}

        <button type="button" className={saved ? "btn btn--primary article-save" : "btn btn--outline article-save"} onClick={toggleSaved} aria-pressed={saved}>
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
          {saved ? "Artikel Tersimpan" : "Simpan Artikel"}
        </button>

        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid var(--line-soft)",
          }}
        >
          <button type="button" className="link-text" onClick={() => handleClap(c, clapped, setClapped)}>
            {clapped ? "Terima kasih ♥" : "Suka bacaan ini"} · {(c.claps || 0) + (clapped ? 1 : 0)}
          </button>
          <button type="button" className="link-text link-text--muted" onClick={() => shareArticle(c)}>
            Bagikan
          </button>
        </div>
      </article>
    </section>
  );
}

function looksLikeHtml(text) {
  return /<\/?[a-z][\s\S]*>/i.test(text || "");
}

function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "h2", "h3", "ul", "ol", "li", "a", "strong", "em", "blockquote", "br", "span"],
    ALLOWED_ATTR: ["href", "target", "rel"]
  });
}

function formatArticleDate(c) {
  const raw = c.publishedAt || c.createdAt;
  if (!raw) return c.date || "";
  try {
    return new Date(raw).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return c.date || "";
  }
}

async function handleClap(c, clapped, setClapped) {
  if (clapped) return;
  setClapped(true);
  try {
    await api(`/public/articles/${c.slug}/clap`, { method: "POST" });
  } catch {
    setClapped(false);
    toast("Gagal kasih clap. Coba lagi ya.", "error");
  }
}

function shareArticle(c) {
  shareContent({
    title: c.title,
    text: c.excerpt,
    url: window.location.href
  });
}

function ArticleBodyText({ c }) {
  const text = (c.body && c.body.trim()) || c.excerpt || "Konten bacaan sedang disiapkan.";

  if (looksLikeHtml(text)) {
    return (
      <div
        className="article-html"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
      />
    );
  }

  const paragraphs = text.split(/\n{2,}|\r?\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="article-html">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {!c.body && (
        <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          Ringkasan sudah tersedia. Artikel lengkap sedang disiapkan tim Muslim Hebat.
        </p>
      )}
    </div>
  );
}

function CommentsSection({ slug }) {
  const { data: apiComments } = usePublicData(`/public/articles/${slug}/comments`, []);
  const [name, setName] = React.useState("");
  const [text, setText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const comments = Array.isArray(apiComments) ? apiComments : [];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await api(`/public/articles/${slug}/comments`, {
        method: "POST",
        body: JSON.stringify({ name, text })
      });
      setName("");
      setText("");
      toast(newComment.approved ? "Komentar berhasil dikirim!" : "Komentar terkirim dan menunggu moderasi.", "success");
    } catch (err) {
      toast(err.message || "Gagal mengirim komentar. Coba lagi ya.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page blog-section">
      <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 24 }}>
        <h2 style={{ fontSize: 20 }}>Obrolan ({comments.length})</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
          <input
            className="field-line"
            type="text"
            aria-label="Nama kamu"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="field-line"
            aria-label="Komentar"
            placeholder="Tulis pendapat kamu pelan-pelan…"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            style={{ resize: "vertical" }}
          />
          <button type="submit" className="link-text" disabled={submitting} style={{ alignSelf: "flex-start" }}>
            {submitting ? "Mengirim…" : "Kirim →"}
          </button>
        </form>

        {comments.length === 0 && (
          <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 24 }}>
            Belum ada obrolan. Jadi yang pertama, yuk.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
          {comments.map((cm, i) => {
            const dateStr = cm.createdAt ? new Date(cm.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            }) : cm.date;

            return (
              <div
                key={cm.id || i}
                style={{ padding: "16px 0", borderTop: i === 0 ? 0 : "1px solid var(--line-soft)" }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 12, color: "var(--ink-soft)" }}>
                  <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{cm.name}</strong>
                  <span>{dateStr}</span>
                </div>
                <p style={{ fontSize: 14, margin: "6px 0 0", lineHeight: 1.6 }}>{cm.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
