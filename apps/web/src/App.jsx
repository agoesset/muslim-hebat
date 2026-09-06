import React from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Nav, SiteCredits } from "./shell.jsx";
import { HomePage } from "./HomePage.jsx";
import { CeritaPage } from "./CeritaPage.jsx";
import { CeritaDetailPage } from "./CeritaDetailPage.jsx";
import { applyTheme, DEFAULT_THEME } from "./theme.ts";
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
import { SearchPage } from "./SearchPage.jsx";
import { SavedArticlesPage } from "./SavedArticlesPage.jsx";
import { ProfilePage } from "./ProfilePage.jsx";
import { KajianPage } from "./KajianPage.jsx";
import { KajianDetailPage } from "./KajianDetailPage.jsx";
import { KelasPage } from "./KelasPage.jsx";
import { KelasDetailPage } from "./KelasDetailPage.jsx";
import { ProdukPage } from "./ProdukPage.jsx";
import { ProdukDetailPage } from "./ProdukDetailPage.jsx";
import { getKajianBySlug, getClass, getProduct } from "./api/public.js";
import { applyReadingPreferences } from "./ProfilePage.jsx";

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
  const page = location.pathname.startsWith("/bacaan/") ? "bacaan"
    : location.pathname.startsWith("/kajian/") || location.pathname === "/kajian" ? "kajian"
    : location.pathname.startsWith("/kelas/") || location.pathname === "/kelas" ? "kelas"
    : location.pathname.startsWith("/produk/") || location.pathname === "/produk" ? "produk"
    : pageIds[location.pathname] || "home";
  const goNav = (id) => navigate(routeForPage(id));
  const openCerita = (cerita) => navigate(`/bacaan/${cerita.slug}`);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    applyReadingPreferences();
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
          <Route path="/kajian" element={<><Seo title="Kajian | Muslim Hebat" description="Jadwal kajian mingguan dan acara komunitas Muslim Hebat." /><KajianPage onNav={goNav} /></>} />
          <Route path="/kajian/:slug" element={<DetailRoute getter={getKajianBySlug} component={KajianDetailPage} loadingLabel="Kajian" onNav={goNav} seoKey="Event" />} />
          <Route path="/kelas" element={<><Seo title="Kelas | Muslim Hebat" description="Kelas online tahsin, tahfidz, dan pengembangan diri Muslim." /><KelasPage onNav={goNav} /></>} />
          <Route path="/kelas/:slug" element={<DetailRoute getter={getClass} component={KelasDetailPage} loadingLabel="Kelas" onNav={goNav} seoKey="Course" />} />
          <Route path="/produk" element={<><Seo title="Produk | Muslim Hebat" description="Worksheets, planner, dan produk digital Muslim Hebat." /><ProdukPage onNav={goNav} /></>} />
          <Route path="/produk/:slug" element={<DetailRoute getter={getProduct} component={ProdukDetailPage} loadingLabel="Produk" onNav={goNav} seoKey="Product" />} />
          <Route path="/cari" element={<SearchPage />} />
          <Route path="/disimpan" element={<SavedArticlesPage />} />
          <Route path="/profil" element={<ProfilePage />} />
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
    kajian: "/kajian",
    kelas: "/kelas",
    produk: "/produk",
    cari: "/cari",
    profil: "/profil",
    kontak: "/kontak"
  }[id] || "/";
}

function DetailRoute({ getter, component: Page, loadingLabel, onNav, seoKey, map = (item) => item }) {
  const { slug } = useParams();
  const [item, setItem] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const getterRef = React.useRef(getter);
  const mapRef = React.useRef(map);

  React.useEffect(() => {
    getterRef.current = getter;
    mapRef.current = map;
  });

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getterRef.current(slug)
      .then((data) => { if (!cancelled) setItem(mapRef.current(data)); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <div className="shell" style={{ padding: "60px 0" }}><p style={{ color: "var(--ink-soft)" }}>Memuat {loadingLabel}…</p></div>;
  if (error || !item) return <div className="shell" style={{ padding: "60px 0" }}><EmptyState icon="🧭" title={`${loadingLabel} tidak ditemukan`} message="Mungkin sudah dipindahkan atau belum diterbitkan." /></div>;

  return (
    <>
      <Seo
        title={`${item.title || item.name} | Muslim Hebat`}
        description={item.excerpt}
        image={item.coverImage || item.image}
        jsonLd={{ "@context": "https://schema.org", "@type": seoKey, name: item.title || item.name, description: item.excerpt, image: item.coverImage || item.image }}
      />
      <Page event={item} course={item} product={item} item={item} onNav={onNav} />
    </>
  );
}
