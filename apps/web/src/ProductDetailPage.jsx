// ProductDetailPage — individual product view.

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { RelatedProducts } from "./RelatedContent.jsx";
import { LazyImage } from "./LazyImage.jsx";
import { Skeleton, SkeletonText } from "./Skeleton.jsx";
import { ProductSeo } from "./seo.jsx";
import { toast } from "./Toast.jsx";
import { getProduct, getProducts } from "./api/public.js";

export function ProductDetailPage({ slug, onNav }) {
  const [product, setProduct] = React.useState(null);
  const [related, setRelated] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      getProduct(slug).catch(() => null),
      getProducts().catch(() => [])
    ]).then(([p, all]) => {
      setProduct(p);
      if (p) {
        const rel = all.filter(x => x.id !== p.id && x.cat === p.cat).slice(0, 3);
        setRelated(rel.length >= 3 ? rel : [...rel, ...all.filter(x => x.id !== p.id && !rel.includes(x)).slice(0, 3 - rel.length)]);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading || !product) {
    return (
      <div data-screen-label="Product Detail">
        <div className="shell" style={{ paddingTop: 24, paddingBottom: 32 }}>
          <div className="card" style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, minHeight: 400 }}>
            <Skeleton height="100%" style={{ borderRadius: "var(--radius)", minHeight: 320 }} />
            <div>
              <Skeleton width={100} height={20} style={{ marginBottom: 12 }} />
              <Skeleton height={40} style={{ marginBottom: 12 }} />
              <SkeletonText lines={4} />
              <Skeleton width={120} height={36} style={{ marginTop: 24, borderRadius: 999 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="Product Detail">
      <ProductSeo product={product} />

      {/* Breadcrumb */}
      <div className="shell" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Beranda</button>
        {" › "}
        <button onClick={() => onNav("produk")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Produk</button>
        {" › "}
        <span style={{ color: "var(--coral-deep)", fontWeight: 600 }}>{product.cat}</span>
      </div>

      <ProductHero product={product} onNav={onNav} />
      <ProductBody product={product} />
      <RelatedProducts products={related} />
      <NewsletterBlock />
    </div>
  );
}

function ProductHero({ product, onNav }) {
  const isFree = product.price === 0;

  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color={product.color} size={240} top={40} right={-40} opacity={0.35} />
      <div className="card" style={{
        padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, overflow: "hidden",
        border: "1.5px solid var(--ink)", position: "relative"
      }}>
        {/* Image area */}
        <div style={{
          background: product.color, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 400, fontSize: 160
        }}>
          {product.image ? (
            <LazyImage
              src={product.image}
              alt={product.name}
              containerStyle={{ position: "absolute", inset: 0, borderRadius: 0 }}
              placeholderColor={product.color}
            />
          ) : (
            <span style={{ position: "relative", zIndex: 1 }}>{product.emoji}</span>
          )}
          <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.45), transparent 60%)" }} />
          {product.tag && (
            <span className="sticker illus-only" style={{
              position: "absolute", top: 18, left: 18,
              background: product.tag === "gratis" ? "var(--sage)" : "var(--coral)",
              fontSize: 18
            }}>
              {product.tag}
            </span>
          )}
        </div>

        {/* Info area */}
        <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="pill" style={{ background: product.color, border: "1px solid var(--ink)" }}>{product.cat}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--ink-soft)" }}>
              <Icon.Star size={12} style={{ color: "var(--coral-deep)" }} /> {product.rating} · {product.sold.toLocaleString("id")} terjual
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.05 }}>
            {product.name}
          </h1>

          <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.5, margin: 0 }}>
            {product.desc || product.excerpt}
          </p>

          {/* Price */}
          <div style={{
            padding: "20px 24px", background: "var(--bg-soft)",
            borderRadius: "var(--radius-sm)", display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap"
          }}>
            {product.original ? (
              <span style={{ fontSize: 18, color: "var(--ink-soft)", textDecoration: "line-through" }}>
                Rp {product.original.toLocaleString("id")}
              </span>
            ) : null}
            <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, lineHeight: 1, color: isFree ? "var(--sage-deep)" : "var(--ink)" }}>
              {isFree ? "Gratis" : `Rp ${product.price.toLocaleString("id")}`}
            </span>
            {product.original ? (
              <span className="pill" style={{ background: "var(--coral)", fontSize: 12 }}>
                Hemat {Math.round((1 - product.price / product.original) * 100)}%
              </span>
            ) : null}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <button className="btn btn--primary" onClick={() => toast("Fitur checkout akan segera hadir! 🔜", "info")}>
              {isFree ? "Unduh sekarang" : "Beli sekarang"} <Icon.Arrow size={14} />
            </button>
            <button className="btn">
              <Icon.Bookmark size={14} /> Simpan
            </button>
          </div>

          {/* Tags */}
          {(product.tags || []).length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {(product.tags || []).map(t => (
                <a key={t} href={`/produk?tag=${encodeURIComponent(t)}`} className="pill" style={{ fontSize: 11, textDecoration: "none", cursor: "pointer" }}>#{t}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductBody({ product }) {
  const hasHtmlBody = product.body && product.body.includes("<");
  const hasDesc = product.desc || product.excerpt;

  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionHeader
          kicker="deskripsi"
          title="Tentang produk ini"
          sub="Detail lengkap dan isi dari produk ini."
        />

        <div className="card" style={{ padding: 32 }}>
          <article style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink)" }}>
            {hasHtmlBody ? (
              <div dangerouslySetInnerHTML={{ __html: product.body }} />
            ) : (
              <>
                <p>{hasDesc}</p>
                <h3 style={{ fontSize: 22, marginTop: 28 }}>Isi produk:</h3>
                <ul style={{ paddingLeft: 20 }}>
                  <li>Format: Digital download</li>
                  <li>File: PDF / JPG / PNG</li>
                  <li>Ukuran: A4, siap cetak</li>
                  <li>Akses: Seumur hidup</li>
                </ul>
              </>
            )}
          </article>

          {/* Rating summary */}
          {product.rating > 0 && (
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(31,58,45,0.08)", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, lineHeight: 1 }}>{product.rating}</div>
                <div>
                  <div style={{ display: "flex", gap: 2, color: "var(--coral-deep)" }}>
                    {[1, 2, 3, 4, 5].map(s => <Icon.Star key={s} size={14} fill={s <= Math.round(product.rating) ? 1 : 0} />)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{product.sold.toLocaleString("id")} terjual</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
