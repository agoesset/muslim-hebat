import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getSearchResults } from "./api/public.js";
import { Seo } from "./seo.jsx";

const GROUPS = [
  ["articles", "Bacaan", "/bacaan/", "title"],
  ["kajian", "Kajian", "/kajian/", "title"],
  ["courses", "Kelas", "/kelas/", "title"],
  ["products", "Produk", "/produk/", "name"],
];

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [draft, setDraft] = React.useState(query);
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    if (query.trim().length < 2) { setResults(null); setLoading(false); return undefined; }
    setLoading(true); setError("");
    getSearchResults(query).then((data) => active && setResults(data)).catch((err) => active && setError(err.message || "Pencarian gagal.")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [query]);

  const total = results ? GROUPS.reduce((sum, [key]) => sum + (results[key]?.length || 0), 0) : 0;
  return (
    <main className="page search-page">
      <Seo title={`${query ? `${query} — ` : ""}Pencarian | Muslim Hebat`} description="Cari bacaan, kajian, kelas, dan produk Muslim Hebat." noindex />
      <span className="eyebrow">Temukan inspirasi</span><h1>Cari</h1>
      <form onSubmit={(event) => { event.preventDefault(); setParams(draft.trim() ? { q: draft.trim() } : {}); }}>
        <label className="search-bar"><Search size={19} aria-hidden="true"/><input value={draft} onChange={(event) => setDraft(event.target.value)} type="search" placeholder="Cari doa, kajian, kelas…" aria-label="Cari semua konten"/><button className="btn btn--primary" type="submit">Cari</button></label>
      </form>
      {loading && <p>Memuat hasil…</p>}{error && <p role="alert">{error}</p>}
      {!loading && query.length > 0 && query.trim().length < 2 && <p>Masukkan minimal 2 karakter.</p>}
      {!loading && results && total === 0 && <p>Tidak ada hasil untuk “{query}”.</p>}
      {results && GROUPS.map(([key, label, prefix, field]) => results[key]?.length > 0 && <section key={key} className="search-results"><h2>{label}</h2>{results[key].map((item) => <Link className="card search-result" key={item.id} to={`${prefix}${item.slug}`}><span>{item.emoji || "•"}</span><span><strong>{item[field]}</strong><small>{item.excerpt}</small></span></Link>)}</section>)}
    </main>
  );
}
