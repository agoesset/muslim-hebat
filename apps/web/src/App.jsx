import React from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Bookmark, Search, UserRound } from "lucide-react";
import { Nav, SiteCredits } from "./shell.jsx";
import { HomePage } from "./HomePage.jsx";
import { CeritaPage } from "./CeritaPage.jsx";
import { CeritaDetailPage } from "./CeritaDetailPage.jsx";
import { applyTheme, DEFAULT_THEME } from "./theme.js";
import { Seo } from "./seo.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { Analytics } from "./components/Analytics.jsx";
import { usePublicData } from "./hooks/usePublicData.js";
import { CtaProvider } from "./context/cta-context.jsx";
import { ToastContainer } from "./Toast.jsx";
import { GlobalSearch } from "./GlobalSearch.jsx";
import { SkeletonGrid } from "./Skeleton.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { ContactPage } from "./ContactPage.jsx";
import { UnsubscribePage } from "./UnsubscribePage.jsx";
import { NotFoundPage } from "./NotFoundPage.jsx";

const AdminPage = React.lazy(() =>
  import("./admin/AdminPage.jsx").then((mod) => ({ default: mod.AdminPage }))
);

const pageIds = {
  "/": "home",
  "/bacaan": "bacaan",
  "/cari": "cari",
  "/profil": "profil",
  "/kontak": "kontak"
};

export default function App() {
  const { data: settings } = usePublicData("/public/settings");

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("muslim-hebat-theme");
      if (savedTheme) {
        applyTheme(JSON.parse(savedTheme));
      } else {
        applyTheme(DEFAULT_THEME);
      }
    } catch (e) {
      applyTheme(DEFAULT_THEME);
    }
  }, []);

  React.useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const themeSetting = settings.find((s) => s.key === "theme");
      if (themeSetting && themeSetting.value) {
        const themeVal = typeof themeSetting.value === "string"
          ? JSON.parse(themeSetting.value)
          : themeSetting.value;
        applyTheme(themeVal);
        try {
          localStorage.setItem("muslim-hebat-theme", JSON.stringify(themeVal));
        } catch (e) {
          /* localStorage unavailable (private mode) — non-fatal */
        }
      }
    }
  }, [settings]);

  return (
    <BrowserRouter>
      <CtaProvider>
        <ToastContainer />
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ErrorBoundary>
                <React.Suspense fallback={<div className="shell" style={{ padding: 48 }}>Memuat admin…</div>}>
                  <AdminPage />
                </React.Suspense>
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<PublicApp />} />
        </Routes>
      </CtaProvider>
    </BrowserRouter>
  );
}

function PublicApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const page = location.pathname.startsWith("/bacaan/") ? "bacaan" :
    pageIds[location.pathname] || "home";
  const goNav = (id) => navigate(routeForPage(id));
  const openCerita = (cerita) => navigate(`/bacaan/${cerita.slug}`);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div>
      <Analytics />
      <GlobalSearch open={searchOpen} onClose={setSearchOpen} onNavigate={navigate} />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<><Seo title="Muslim Hebat — Blog" description="Bacaan ringan tentang Islam, self-growth, dan ibadah harian." /><HomePage onNav={goNav} onOpenCerita={openCerita} onSearch={() => setSearchOpen(true)} /></>} />
          <Route path="/bacaan" element={<><Seo title="Bacaan | Muslim Hebat" description="Kumpulan tulisan ringan tentang Islam, self-growth, dan ibadah harian." /><CeritaPage onNav={goNav} onOpenCerita={openCerita} /></>} />
          <Route path="/bacaan/:slug" element={<CeritaDetailRoute onNav={goNav} onOpenCerita={openCerita} />} />
          <Route path="/cari" element={<PlaceholderPage icon={Search} eyebrow="Temukan inspirasi" title="Cari Bacaan" description="Cari artikel berdasarkan topik, judul, atau kata kunci." search />} />
          <Route path="/disimpan" element={<PlaceholderPage icon={Bookmark} eyebrow="Koleksi pribadi" title="Artikel Disimpan" description="Artikel yang kamu simpan akan tampil di sini." />} />
          <Route path="/profil" element={<PlaceholderPage icon={UserRound} eyebrow="Ruangmu" title="Profil" description="Kelola profil dan temukan kembali bacaan favoritmu." savedLink />} />
          <Route path="/kontak" element={<ContactPage onNav={goNav} />} />
          <Route path="/unsubscribe" element={<UnsubscribePage onNav={goNav} />} />
          <Route path="*" element={<NotFoundPage onNav={goNav} />} />
        </Routes>
      </ErrorBoundary>
      <SiteCredits />
      <Nav page={page} />
    </div>
  );
}

function PlaceholderPage({ icon: PageIcon, eyebrow, title, description, search = false, savedLink = false }) {
  return (
    <main className="page placeholder-page">
      <span className="placeholder-page__icon"><PageIcon size={28} strokeWidth={1.7} aria-hidden="true" /></span>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {search && <label className="search-bar"><Search size={19} aria-hidden="true" /><input type="search" placeholder="istighfar" aria-label="Cari bacaan" /></label>}
      {savedLink && <Link className="btn btn--outline" to="/disimpan"><Bookmark size={17} aria-hidden="true" />Lihat artikel disimpan</Link>}
    </main>
  );
}

function CeritaDetailRoute({ onNav, onOpenCerita }) {
  const { slug } = useParams();
  const { data: apiArticle, loading, error } = usePublicData(`/public/articles/${slug}`);

  const cerita = React.useMemo(() => {
    if (apiArticle) return { ...apiArticle, cat: apiArticle.category };
    return null;
  }, [apiArticle]);

  if (loading) return <div className="shell" style={{ padding: "60px 0" }}><SkeletonGrid count={1} columns={1} cardHeight={280} /></div>;
  if (error || !cerita) return <div className="shell" style={{ padding: "60px 0" }}><EmptyState icon="📖" title="Bacaan tidak ditemukan" message="Mungkin sudah dipindahkan — coba cari lewat pencarian." /></div>;

  return (
    <>
      <Seo
        title={`${cerita.title} | Muslim Hebat`}
        description={cerita.excerpt}
        image={cerita.coverImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: cerita.title,
          description: cerita.excerpt,
          datePublished: cerita.publishedAt || cerita.createdAt,
          image: cerita.coverImage,
          author: { "@type": "Person", name: cerita.author || "Muslim Hebat" }
        }}
      />
      <CeritaDetailPage onNav={onNav} cerita={cerita} onOpenCerita={onOpenCerita} />
    </>
  );
}

function routeForPage(id) {
  return {
    home: "/",
    bacaan: "/bacaan",
    cari: "/cari",
    profil: "/profil",
    kontak: "/kontak"
  }[id] || "/";
}
