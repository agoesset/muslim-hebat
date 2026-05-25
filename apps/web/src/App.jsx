import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Nav, Footer } from "./shell.jsx";
import { HomePage } from "./HomePage.jsx";
import { ProdukPage } from "./ProdukPage.jsx";
import { KajianPage } from "./KajianPage.jsx";
import { KelasPage } from "./KelasPage.jsx";
import { CeritaPage } from "./CeritaPage.jsx";
import { CeritaDetailPage } from "./CeritaDetailPage.jsx";
import { AdminPage } from "./admin/AdminPage.jsx";
import { CERITA_DATA } from "./data/cerita.js";
import { applyTheme, DEFAULT_THEME } from "./theme.js";
import { Seo } from "./seo.jsx";

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
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  );
}

function PublicApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.pathname.startsWith("/bacaan/") ? "bacaan" : pageIds[location.pathname] || "home";
  const goNav = (id) => navigate(routeForPage(id));
  const openCerita = (cerita) => navigate(`/bacaan/${cerita.slug}`);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div>
      <Nav page={page} onNav={goNav} />
      <Routes>
        <Route path="/" element={<><Seo title="Muslim Hebat" description="Belajar Islam dengan bacaan ringan, produk bermanfaat, kelas, dan jadwal ngaji bareng." /><HomePage onNav={goNav} onOpenCerita={openCerita} /></>} />
        <Route path="/bacaan" element={<><Seo title="Bacaan | Muslim Hebat" description="Bacaan ringan tentang Islam, self-growth, parenting, dan ibadah harian." /><CeritaPage onNav={goNav} onOpenCerita={openCerita} /></>} />
        <Route path="/bacaan/:slug" element={<CeritaDetailRoute onNav={goNav} onOpenCerita={openCerita} />} />
        <Route path="/kelas" element={<><Seo title="Kelas | Muslim Hebat" description="Kelas online dan program belajar Islam untuk pemula sampai lanjutan." /><KelasPage onNav={goNav} /></>} />
        <Route path="/produk" element={<><Seo title="Produk | Muslim Hebat" description="Produk digital, worksheet, template, dan materi belajar untuk bantu konsisten." /><ProdukPage onNav={goNav} /></>} />
        <Route path="/kajian" element={<><Seo title="Ngaji Bareng | Muslim Hebat" description="Jadwal kajian online dan offline terdekat dari Muslim Hebat." /><KajianPage onNav={goNav} /></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function CeritaDetailRoute({ onNav, onOpenCerita }) {
  const { slug } = useParams();
  const cerita = CERITA_DATA.find((item) => item.slug === slug) || CERITA_DATA[0];

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

function routeForPage(id) {
  return {
    home: "/",
    bacaan: "/bacaan",
    kelas: "/kelas",
    produk: "/produk",
    kajian: "/kajian"
  }[id] || "/";
}
