import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Nav, Footer } from "./shell.jsx";
import { HomePage } from "./HomePage.jsx";
import { ProdukPage } from "./ProdukPage.jsx";
import { KajianPage } from "./KajianPage.jsx";
import { KelasPage } from "./KelasPage.jsx";
import { CeritaPage } from "./CeritaPage.jsx";
import { CeritaDetailPage } from "./CeritaDetailPage.jsx";
import { ProdukDetailPage } from "./ProdukDetailPage.jsx";
import { KelasDetailPage } from "./KelasDetailPage.jsx";
import { KajianDetailPage } from "./KajianDetailPage.jsx";
import { AdminPage } from "./admin/AdminPage.jsx";
import { applyTheme, DEFAULT_THEME } from "./theme.js";
import { Seo } from "./seo.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { Analytics } from "./components/Analytics.jsx";

import { CtaProvider } from "./context/cta-context.jsx";

const pageIds = {
  "/": "home",
  "/bacaan": "bacaan",
  "/kelas": "kelas",
  "/produk": "produk",
  "/kajian": "kajian"
};

export default function App() {
  React.useEffect(() => applyTheme(DEFAULT_THEME), []);

  return (
    <BrowserRouter>
      <CtaProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<PublicApp />} />
        </Routes>
      </CtaProvider>
    </BrowserRouter>
  );
}

function PublicApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.pathname.startsWith("/bacaan/") ? "bacaan" :
    location.pathname.startsWith("/produk/") ? "produk" :
    location.pathname.startsWith("/kelas/") ? "kelas" :
    location.pathname.startsWith("/kajian/") ? "kajian" :
    pageIds[location.pathname] || "home";
  const goNav = (id) => navigate(routeForPage(id));
  const openCerita = (cerita) => navigate(`/bacaan/${cerita.slug}`);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div>
      <Analytics />
      <Nav page={page} onNav={goNav} />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<><Seo title="Muslim Hebat" description="Belajar Islam dengan bacaan ringan, produk bermanfaat, kelas, dan jadwal ngaji bareng." /><HomePage onNav={goNav} onOpenCerita={openCerita} /></>} />
          <Route path="/bacaan" element={<><Seo title="Bacaan | Muslim Hebat" description="Bacaan ringan tentang Islam, self-growth, parenting, dan ibadah harian." /><CeritaPage onNav={goNav} onOpenCerita={openCerita} /></>} />
          <Route path="/bacaan/:slug" element={<CeritaDetailRoute onNav={goNav} onOpenCerita={openCerita} />} />
          <Route path="/kelas" element={<><Seo title="Kelas | Muslim Hebat" description="Kelas online dan program belajar Islam untuk pemula sampai lanjutan." /><KelasPage onNav={goNav} /></>} />
          <Route path="/kelas/:slug" element={<KelasDetailRoute onNav={goNav} />} />
          <Route path="/produk" element={<><Seo title="Produk | Muslim Hebat" description="Produk digital, worksheet, template, dan materi belajar untuk bantu konsisten." /><ProdukPage onNav={goNav} /></>} />
          <Route path="/produk/:slug" element={<ProdukDetailRoute onNav={goNav} />} />
          <Route path="/kajian" element={<><Seo title="Ngaji Bareng | Muslim Hebat" description="Jadwal kajian online dan offline terdekat dari Muslim Hebat." /><KajianPage onNav={goNav} /></>} />
          <Route path="/kajian/:slug" element={<KajianDetailRoute onNav={goNav} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

import { usePublicData } from "./hooks/usePublicData.js";

function CeritaDetailRoute({ onNav, onOpenCerita }) {
  const { slug } = useParams();
  const { data: apiArticle, loading, error } = usePublicData(`/public/articles/${slug}`);

  const cerita = React.useMemo(() => {
    if (apiArticle) return { ...apiArticle, cat: apiArticle.category };
    return null;
  }, [apiArticle]);

  if (loading) return <div className="shell" style={{ padding: "60px 0" }}><p>Memuat bacaan…</p></div>;
  if (error || !cerita) return <div className="shell" style={{ padding: "60px 0" }}><p>Bacaan tidak ditemukan.</p></div>;

  return (
    <>
      <Seo
        title={`${cerita.title} | Muslim Hebat`}
        description={cerita.excerpt}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: cerita.title,
          description: cerita.excerpt,
          author: { "@type": "Person", name: cerita.author || "Muslim Hebat" }
        }}
      />
      <CeritaDetailPage onNav={onNav} cerita={cerita} onOpenCerita={onOpenCerita} />
    </>
  );
}

function ProductJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.excerpt,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: (product.priceCents || 0) / 100,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock"
    }
  };
}

function CourseJsonLd(course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.excerpt,
    provider: { "@type": "Organization", name: "Muslim Hebat", sameAs: "https://muslimhebat.com" }
  };
}

function EventJsonLd(event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.excerpt,
    startDate: event.startsAt,
    eventAttendanceMode: event.eventType === "Online" ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.location || "Online" },
    organizer: { "@type": "Organization", name: "Muslim Hebat", url: "https://muslimhebat.com" }
  };
}

function ProdukDetailRoute({ onNav }) {
  const { slug } = useParams();
  const { data: product, loading, error } = usePublicData(`/public/products/${slug}`);
  if (loading) return <div className="shell" style={{ padding: "60px 0" }}><p>Memuat produk…</p></div>;
  if (error || !product) return <div className="shell" style={{ padding: "60px 0" }}><p>Produk tidak ditemukan.</p></div>;
  return <><Seo title={`${product.name} | Muslim Hebat`} description={product.excerpt} jsonLd={ProductJsonLd(product)} /><ProdukDetailPage product={product} onNav={onNav} /></>;
}

function KelasDetailRoute({ onNav }) {
  const { slug } = useParams();
  const { data: course, loading, error } = usePublicData(`/public/classes/${slug}`);
  if (loading) return <div className="shell" style={{ padding: "60px 0" }}><p>Memuat kelas…</p></div>;
  if (error || !course) return <div className="shell" style={{ padding: "60px 0" }}><p>Kelas tidak ditemukan.</p></div>;
  return <><Seo title={`${course.title} | Muslim Hebat`} description={course.excerpt} jsonLd={CourseJsonLd(course)} /><KelasDetailPage course={course} onNav={onNav} /></>;
}

function KajianDetailRoute({ onNav }) {
  const { slug } = useParams();
  const { data: event, loading, error } = usePublicData(`/public/kajian/${slug}`);
  if (loading) return <div className="shell" style={{ padding: "60px 0" }}><p>Memuat kajian…</p></div>;
  if (error || !event) return <div className="shell" style={{ padding: "60px 0" }}><p>Kajian tidak ditemukan.</p></div>;
  return <><Seo title={`${event.title} | Muslim Hebat`} description={event.excerpt} jsonLd={EventJsonLd(event)} /><KajianDetailPage event={event} onNav={onNav} /></>;
}

function routeForPage(id) {
  return {
    home: "/",
    bacaan: "/bacaan",
    kelas: "/kelas",
    produk: "/produk",
    kajian: "/kajian"
  }[id] || "/";
}
