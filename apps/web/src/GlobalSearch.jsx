import React from "react";
import { Icon } from "./icons.jsx";
import { Skeleton } from "./Skeleton.jsx";
import { api } from "./api.js";

export function GlobalSearch({ open, onClose, onNavigate }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef(null);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
    }
  }, [open]);

  // Keyboard shortcut: Cmd/Ctrl + K
  React.useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(!open);
      }
      if (e.key === "Escape" && open) {
        onClose(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api(`/public/search?q=${encodeURIComponent(query.trim())}`)
        .then(data => setResults(data))
        .catch(() => setResults({ articles: [], products: [], kajian: [], courses: [] }))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  const totalCount = results
    ? results.articles.length + results.products.length + results.kajian.length + results.courses.length
    : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(31, 58, 45, 0.35)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      <div
        className="card"
        style={{
          width: "min(640px, calc(100vw - 32px))",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1.5px solid rgba(31,58,45,0.08)",
          }}
        >
          <Icon.Search size={18} style={{ color: "var(--ink-soft)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari bacaan, produk, kajian, atau kelas..."
            style={{
              flex: 1,
              border: 0,
              background: "transparent",
              outline: "none",
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--ink)",
            }}
          />
          <kbd
            style={{
              padding: "2px 8px",
              borderRadius: 6,
              background: "var(--bg-soft)",
              border: "1px solid rgba(31,58,45,0.1)",
              fontSize: 12,
              color: "var(--ink-soft)",
              fontFamily: "var(--font-body)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 0" }}>
          {loading && (
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Skeleton circle width={36} height={36} />
                  <div style={{ flex: 1 }}>
                    <Skeleton height={16} style={{ marginBottom: 6, width: "60%" }} />
                    <Skeleton height={12} style={{ width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--ink-soft)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <p style={{ margin: 0 }}>Ketik minimal 2 karakter untuk mencari</p>
              <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
                Tips: Gunakan <kbd style={{ padding: "1px 4px", borderRadius: 4, background: "var(--bg-soft)" }}>Ctrl/⌘ + K</kbd> untuk membuka search
              </div>
            </div>
          )}

          {!loading && results && totalCount === 0 && query.trim().length >= 2 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--ink-soft)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>😕</div>
              <p style={{ margin: 0 }}>Tidak ada hasil untuk "{query.trim()}"</p>
            </div>
          )}

          {!loading && results && (
            <>
              <SearchGroup
                title="Bacaan"
                icon="📖"
                color="var(--sage)"
                items={results.articles}
                renderItem={(a) => ({ label: a.title, sub: a.excerpt?.substring(0, 60) + "...", onClick: () => { onNavigate(`/bacaan/${a.slug}`); onClose(false); } })}
              />
              <SearchGroup
                title="Produk"
                icon="📦"
                color="var(--peach)"
                items={results.products}
                renderItem={(p) => ({ label: p.name, sub: p.excerpt?.substring(0, 60) + "...", onClick: () => { onNavigate(`/produk`); onClose(false); } })}
              />
              <SearchGroup
                title="Kajian"
                icon="🕌"
                color="var(--lilac)"
                items={results.kajian}
                renderItem={(k) => ({ label: k.title, sub: k.speaker || k.location, onClick: () => { onNavigate(`/kajian`); onClose(false); } })}
              />
              <SearchGroup
                title="Kelas"
                icon="🎓"
                color="var(--coral)"
                items={results.courses}
                renderItem={(c) => ({ label: c.title, sub: c.instructor || c.category, onClick: () => { onNavigate(`/kelas`); onClose(false); } })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchGroup({ title, icon, color, items, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ padding: "8px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 20px",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "var(--ink-soft)",
        }}
      >
        <span style={{ fontSize: 14 }}>{icon}</span>
        {title}
      </div>
      {items.map((item) => {
        const rendered = renderItem(item);
        return (
          <button
            key={item.id}
            onClick={rendered.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 20px",
              border: 0,
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: color,
                border: "1.5px solid var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {item.emoji || icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{rendered.label}</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {rendered.sub}
              </div>
            </div>
            <Icon.Arrow size={12} style={{ color: "var(--ink-soft)", flexShrink: 0 }} />
          </button>
        );
      })}
    </div>
  );
}
