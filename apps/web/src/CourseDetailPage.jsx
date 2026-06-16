// CourseDetailPage — individual class view.

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { RelatedCourses } from "./RelatedContent.jsx";
import { LazyImage } from "./LazyImage.jsx";
import { Skeleton, SkeletonText } from "./Skeleton.jsx";
import { CourseSeo } from "./seo.jsx";
import { toast } from "./Toast.jsx";
import { getClass, getClasses } from "./api/public.js";

export function CourseDetailPage({ slug, onNav }) {
  const [course, setCourse] = React.useState(null);
  const [related, setRelated] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      getClass(slug).catch(() => null),
      getClasses().catch(() => [])
    ]).then(([c, all]) => {
      setCourse(c);
      if (c) {
        const rel = all.filter(x => x.id !== c.id && x.cat === c.cat).slice(0, 3);
        setRelated(rel.length >= 3 ? rel : [...rel, ...all.filter(x => x.id !== c.id && !rel.includes(x)).slice(0, 3 - rel.length)]);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading || !course) {
    return (
      <div data-screen-label="Course Detail">
        <div className="shell" style={{ paddingTop: 24, paddingBottom: 32 }}>
          <div className="card" style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, minHeight: 400 }}>
            <Skeleton height="100%" style={{ borderRadius: "var(--radius)", minHeight: 320 }} />
            <div>
              <Skeleton width={100} height={20} style={{ marginBottom: 12 }} />
              <Skeleton height={40} style={{ marginBottom: 12 }} />
              <SkeletonText lines={3} />
              <Skeleton width={120} height={36} style={{ marginTop: 24, borderRadius: 999 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="Course Detail">
      <CourseSeo course={course} />

      {/* Breadcrumb */}
      <div className="shell" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <button onClick={() => onNav("home")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Beranda</button>
        {" › "}
        <button onClick={() => onNav("kelas")} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}>Kelas</button>
        {" › "}
        <span style={{ color: "var(--coral-deep)", fontWeight: 600 }}>{course.cat}</span>
      </div>

      <CourseHero course={course} onNav={onNav} />
      <CourseBody course={course} />
      <CourseInstructor course={course} />
      <RelatedCourses courses={related} />
      <NewsletterBlock />
    </div>
  );
}

function CourseHero({ course, onNav }) {
  const isFree = course.price === 0;
  const isLive = course.format === "Live Zoom" || course.format === "Hybrid";

  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color={course.color} size={240} top={40} right={-40} opacity={0.35} />
      <div className="card" style={{
        padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, overflow: "hidden",
        border: "1.5px solid var(--ink)", position: "relative"
      }}>
        {/* Image area */}
        <div style={{
          background: course.color, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 400, fontSize: 120
        }}>
          {course.image ? (
            <LazyImage
              src={course.image}
              alt={course.title}
              containerStyle={{ position: "absolute", inset: 0, borderRadius: 0 }}
              placeholderColor={course.color}
            />
          ) : (
            <span style={{ position: "relative", zIndex: 1 }}>{course.emoji}</span>
          )}
          <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.45), transparent 60%)" }} />

          {/* Play button overlay */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--ink)", border: "2px solid var(--paper)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2
          }}>
            <Icon.Play size={20} color="var(--bg)" />
          </div>

          {course.tag && (
            <span className="sticker illus-only" style={{
              position: "absolute", top: 16, left: 16,
              background: course.tag === "gratis" ? "var(--sage)" : "var(--coral)",
              fontSize: 16
            }}>
              {course.tag === "gratis" ? "Gratis" : course.tag}
            </span>
          )}
        </div>

        {/* Info area */}
        <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="pill" style={{ background: course.color, border: "1px solid var(--ink)" }}>{course.cat}</span>
            <span className="pill" style={{ fontSize: 11 }}>{course.level}</span>
            <span className="pill" style={{ fontSize: 11, background: "var(--ink)", color: "var(--bg)" }}>
              {course.format === "Live Zoom" ? "🟢 Live" : course.format === "Hybrid" ? "🟡 Hybrid" : "📺 On-demand"}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.05 }}>
            {course.title}
          </h1>

          <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.5, margin: 0 }}>
            {course.desc || course.excerpt}
          </p>

          {/* Meta info */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--ink-soft)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.Play size={12} /> {course.lessons} sesi</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.Clock size={12} /> {course.duration}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--coral-deep)" }}>
              <Icon.Star size={12} /> {course.rating} ({course.reviews})
            </span>
            <span>{course.students.toLocaleString("id")} alumni</span>
          </div>

          {/* Batch info for live classes */}
          {isLive && course.batch && (
            <div className="card" style={{
              padding: "14px 16px", background: "var(--bg-soft)",
              border: "1.5px dashed var(--ink)", borderRadius: 12,
              display: "flex", flexDirection: "column", gap: 6
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, gap: 6 }}>
                <span style={{ fontWeight: 700, color: "var(--coral-deep)" }}>{course.batch}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>{course.startDate}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                <Icon.Clock size={11} /> {course.schedule}
              </div>
            </div>
          )}

          {/* Price */}
          <div style={{
            padding: "16px 20px", background: "var(--bg-soft)",
            borderRadius: "var(--radius-sm)", display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap"
          }}>
            {course.originalPrice ? (
              <span style={{ fontSize: 16, color: "var(--ink-soft)", textDecoration: "line-through" }}>
                Rp {course.originalPrice.toLocaleString("id")}
              </span>
            ) : null}
            <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, lineHeight: 1, color: isFree ? "var(--sage-deep)" : "var(--ink)" }}>
              {isFree ? "Gratis" : `Rp ${course.price.toLocaleString("id")}`}
            </span>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="btn btn--primary" onClick={() => toast("Fitur pendaftaran kelas akan segera hadir! 🔜", "info")}>
              {isFree ? "Mulai belajar" : isLive ? "Daftar batch" : "Ikut kelas"} <Icon.Arrow size={14} />
            </button>
            <button className="btn">
              <Icon.Bookmark size={14} /> Simpan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseBody({ course }) {
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionHeader kicker="kurikulum" title="Apa yang akan dipelajari" sub="Materi dan sesi yang ada di kelas ini." />
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "01", title: "Pengenalan & overview", time: "Sesi 1", desc: "Perkenalan, aturan main, dan gambaran besar materi yang akan dipelajari." },
              { n: "02", title: "Dasar-dasar utama", time: "Sesi 2-3", desc: "Pemahaman fundamental yang wajib dikuasai sebelum lanjut." },
              { n: "03", title: "Praktik & latihan", time: "Sesi 4-5", desc: "Latihan langsung dengan studi kasus dan feedback personal." },
              { n: "04", title: "Pendalaman materi", time: "Sesi 6-8", desc: "Materi lanjutan untuk pemahaman yang lebih dalam." },
              { n: "05", title: "Proyek akhir & evaluasi", time: "Sesi 9-12", desc: "Tugas akhir, review, dan sertifikat kelulusan." },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, padding: "12px 16px",
                background: i % 2 === 0 ? "var(--bg-soft)" : "transparent",
                borderRadius: 12, alignItems: "flex-start"
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--sage)", border: "1.5px solid var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, flexShrink: 0, color: "var(--ink)"
                }}>
                  {item.n}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</h4>
                    <span className="pill" style={{ fontSize: 10, whiteSpace: "nowrap" }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 0", lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {(course.tags || []).length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(31,58,45,0.08)" }}>
              {(course.tags || []).map(t => (
                <a key={t} href={`/kelas?tag=${encodeURIComponent(t)}`} className="pill" style={{ fontSize: 11, textDecoration: "none", cursor: "pointer" }}>#{t}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CourseInstructor({ course }) {
  return (
    <section className="shell" style={{ marginBottom: 32 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionHeader kicker="pengajar" title="Yang akan mengajar" sub="Kelas ini diajar langsung oleh ahlinya." />
        <div className="card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: course.color, border: "2px solid var(--ink)",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32
          }}>
            {course.instructorAvatar ? (
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: course.instructorAvatar }} />
            ) : "👤"}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>{course.instructor || "Muslim Hebat"}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
              Berpengalaman mengajar dan memiliki rekam jejak yang jelas di bidang {course.cat}.
            </p>
          </div>
          <button className="btn btn--sm">Lihat profil lengkap</button>
        </div>
      </div>
    </section>
  );
}

export default CourseDetailPage;
