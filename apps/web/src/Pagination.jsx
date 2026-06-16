import React from "react";

export function SortControl({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: "1.5px solid rgba(31,58,45,0.12)",
        background: "var(--paper)",
        fontFamily: "var(--font-body)",
        fontSize: 13,
        color: "var(--ink)",
        cursor: "pointer",
        outline: "none",
        ...style
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function Pagination({ page, totalPages, onChange, style = {} }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 24,
        ...style
      }}
    >
      <button
        className="btn btn--sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        style={{ opacity: page <= 1 ? 0.4 : 1 }}
      >
        ‹
      </button>
      {start > 1 && (
        <>
          <PageButton page={1} current={page} onClick={() => onChange(1)} />
          {start > 2 && <span style={{ fontSize: 13, color: "var(--ink-soft)", padding: "0 4px" }}>…</span>}
        </>
      )}
      {pages.map((p) => (
        <PageButton key={p} page={p} current={page} onClick={() => onChange(p)} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ fontSize: 13, color: "var(--ink-soft)", padding: "0 4px" }}>…</span>}
          <PageButton page={totalPages} current={page} onClick={() => onChange(totalPages)} />
        </>
      )}
      <button
        className="btn btn--sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        style={{ opacity: page >= totalPages ? 0.4 : 1 }}
      >
        ›
      </button>
    </div>
  );
}

function PageButton({ page, current, onClick }) {
  const isCurrent = page === current;
  return (
    <button
      className="btn btn--sm"
      onClick={onClick}
      style={{
        minWidth: 36,
        padding: "6px 10px",
        background: isCurrent ? "var(--ink)" : "var(--paper)",
        color: isCurrent ? "var(--bg)" : "var(--ink)",
        fontWeight: isCurrent ? 600 : 500
      }}
    >
      {page}
    </button>
  );
}

export function usePagination(items, pageSize = 9) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(items.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  // Reset to page 1 when items change
  React.useEffect(() => {
    setPage(1);
  }, [items.length]);

  return { page, setPage, totalPages, paginated, start, end: Math.min(start + pageSize, items.length) };
}
