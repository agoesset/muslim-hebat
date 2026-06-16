// KelasPage — online classes / academy with live Zoom batches + on-demand.

import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";
import { usePublicData } from "./hooks/usePublicData.js";
import { useCta } from "./context/cta-context.jsx";

const KELAS_FALLBACK = [
  { id: 1, slug: "tahsin-pemula", cat: "Tahsin", color: "var(--sage)", emoji: "🎙",
    title: "Tahsin Pemula: Baca Qur'an dari Nol",
    instructor: "Ust. Hasan Bashri", instructorAvatar: "var(--peach)",
    lessons: 12, duration: "4 minggu", level: "Pemula",
    students: 480, rating: 5.0, reviews: 124,
    price: 249000, originalPrice: 399000,
    tag: "best seller",
    format: "Live Zoom",
    batch: "Batch #7",
    startDate: "5 Juni 2026",
    startDay: "Senin",
    schedule: "Senin & Rabu, 19:30–21:00 WIB",
    platform: "Zoom + grup WA",
    slots: 50, slotsTaken: 32,
    status: "open",
    desc: "Belajar makhraj huruf, tajwid dasar, sampai bisa baca 1 ayat dengan benar — pelan-pelan dari nol.",
    featured: true,
  },
  { id: 2, slug: "tahfidz-juz-30", cat: "Tahfidz", color: "var(--peach)", emoji: "🎧",
    title: "Tahfidz 30 Hari: Juz 30",
    instructor: "Ust. Ahmad Faiz", instructorAvatar: "var(--sage)",
    lessons: 30, duration: "30 hari", level: "Menengah",
    students: 220, rating: 5.0, reviews: 68,
    price: 399000,
    tag: "almost full",
    format: "Live Zoom",
    batch: "Batch #3",
    startDate: "10 Juni 2026",
    startDay: "Sabtu",
    schedule: "Setiap hari, 05:00–06:00 WIB",
    platform: "Zoom + mentor 1-on-1",
    slots: 25, slotsTaken: 22,
    status: "almost-full",
    desc: "Daily check-in + mentor 1-on-1. Selesaikan hafalan juz 30 dalam sebulan, target 1 halaman per hari.",
  },
  { id: 3, slug: "parenting-islami", cat: "Parenting Islami", color: "var(--lilac)", emoji: "👨‍👩‍👧",
    title: "Mendidik Anak Cara Nabi",
    instructor: "dr. Aisyah Dahlan", instructorAvatar: "var(--coral)",
    lessons: 8, duration: "Akses seumur hidup", level: "Semua level",
    students: 1240, rating: 4.9, reviews: 312,
    price: 199000,
    tag: "populer",
    format: "On-demand",
    desc: "Workshop video + studi kasus parenting muslim modern. Dari balita sampai remaja. Belajar kapan aja.",
  },
  { id: 4, slug: "tafsir-juz-amma", cat: "Tafsir", color: "var(--butter)", emoji: "📖",
    title: "Tafsir Juz 'Amma: Cerita di Balik Ayat",
    instructor: "Ust. Adi Hidayat", instructorAvatar: "var(--lilac)",
    lessons: 15, duration: "6 minggu", level: "Semua level",
    students: 890, rating: 4.9, reviews: 198,
    price: 299000,
    format: "Hybrid",
    batch: "Batch #2",
    startDate: "15 Juni 2026",
    startDay: "Kamis",
    schedule: "Kamis 19:30 WIB (live) + video on-demand",
    platform: "Zoom + akses rekaman",
    slots: 80, slotsTaken: 41,
    status: "open",
    desc: "8 sesi live Zoom + 7 sesi video on-demand. Bisa diulang kapan aja kalau ketinggalan.",
  },
  { id: 5, slug: "bahasa-arab-pemula", cat: "Bahasa Arab", color: "var(--coral)", emoji: "🔤",
    title: "Bahasa Arab buat yang Gak Punya Background",
    instructor: "Ustadzah Mariam Salim", instructorAvatar: "var(--peach)",
    lessons: 20, duration: "8 minggu", level: "Pemula",
    students: 620, rating: 4.8, reviews: 156,
    price: 349000, originalPrice: 449000,
    format: "Live Zoom",
    batch: "Batch #4",
    startDate: "22 Juni 2026",
    startDay: "Ahad",
    schedule: "Ahad, 09:00–11:00 WIB",
    platform: "Zoom + worksheet PDF",
    slots: 40, slotsTaken: 12,
    status: "open",
    desc: "Mulai dari huruf, kosakata sehari-hari, sampai paham 70% kata di Qur'an.",
  },
  { id: 6, slug: "bisnis-muslim", cat: "Bisnis Muslim", color: "var(--sage)", emoji: "💼",
    title: "Bisnis Muamalah: Halal, Berkah, Cuan",
    instructor: "Erick Yusuf", instructorAvatar: "var(--butter)",
    lessons: 10, duration: "3 minggu", level: "Menengah",
    students: 540, rating: 4.7, reviews: 102,
    price: 449000,
    tag: "baru",
    format: "Live Zoom",
    batch: "Batch #1",
    startDate: "1 Juli 2026",
    startDay: "Selasa",
    schedule: "Selasa & Jum'at, 20:00–21:30 WIB",
    platform: "Zoom + studi kasus real",
    slots: 60, slotsTaken: 8,
    status: "early-bird",
    desc: "Bangun bisnis tanpa riba, tanpa gharar. Studi kasus real dari pengusaha muslim Indonesia.",
  },
  { id: 7, slug: "sholat-khusyu", cat: "Ibadah Harian", color: "var(--lilac)", emoji: "🕌",
    title: "Sholat Khusyu' untuk yang Sibuk",
    instructor: "Ust. Hanan Attaki", instructorAvatar: "var(--coral)",
    lessons: 6, duration: "Akses seumur hidup", level: "Semua level",
    students: 2100, rating: 4.9, reviews: 487,
    price: 0,
    tag: "gratis",
    format: "On-demand",
    desc: "Workshop 6 sesi video: persiapan, fokus, dan after-sholat. Cocok untuk pekerja & mahasiswa.",
  },
  { id: 8, slug: "muslimah-confident", cat: "Muslimah", color: "var(--peach)", emoji: "🌸",
    title: "Muslimah Strong & Tenang",
    instructor: "Ust. Oki Setiana Dewi", instructorAvatar: "var(--sage)",
    lessons: 12, duration: "4 minggu", level: "Semua level",
    students: 1820, rating: 4.9, reviews: 401,
    price: 279000,
    format: "Hybrid",
    batch: "Batch #5",
    startDate: "28 Juni 2026",
    startDay: "Sabtu",
    schedule: "Sabtu 14:00 WIB (live) + video on-demand",
    platform: "Zoom · khusus perempuan",
    slots: 100, slotsTaken: 67,
    status: "open",
    desc: "Khusus perempuan — soal self-worth, hijab, hubungan, dan tanggung jawab di era sekarang.",
  },
];

const LEVELS = ["Semua level", "Pemula", "Menengah", "Lanjutan"];
const KELAS_FORMAT = ["Semua", "Live Zoom", "Hybrid", "On-demand"];
const KELAS_KATEGORI = ["Semua", "Tahsin", "Tahfidz", "Tafsir", "Parenting Islami", "Bahasa Arab", "Bisnis Muslim", "Ibadah Harian", "Muslimah"];

function normalizeCourses(api) {
  if (!api) return [];
  return api.map(c => ({
    ...c,
    id: c.id || c.slug,
    cat: c.category,
    desc: c.excerpt,
    price: c.priceCents || 0,
    originalPrice: c.originalPriceCents || 0,
    status: c.statusDetail || "open",
    instructorAvatar: "var(--peach)",
    featured: !!c.featured,
  }));
}

export function KelasPage({ onNav }) {
  const navigate = useNavigate();
  const [cat, setCat] = React.useState("Semua");
  const [level, setLevel] = React.useState("Semua level");
  const [fmt, setFmt] = React.useState("Semua");

  const { data: apiCourses, loading, error } = usePublicData("/public/classes");
  const courses = React.useMemo(() => {
    const normalized = normalizeCourses(apiCourses);
    return normalized;
  }, [apiCourses]);

  let list = courses;
  if (cat !== "Semua") list = list.filter(k => k.cat === cat);
  if (level !== "Semua level") list = list.filter(k => k.level === level);
  if (fmt !== "Semua") list = list.filter(k => k.format === fmt);

  return (
    <div data-screen-label="06 Kelas">
      <KelasHero onNav={onNav} featured={courses.find(k => k.featured) || null}/>
      <KelasStats/>
      <BatchOpenSection courses={courses}/>

      <section className="shell" style={{ marginBottom: 32 }}>
        <SectionHeader
          kicker="pilih sesuai mood"
          title="Semua kelas"
          sub="Live Zoom dengan batch terjadwal, on-demand video yang bisa diakses kapan aja, atau hybrid — pilih yang cocok sama jadwal kamu."
        />

        {/* filters */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 4, minWidth: 60 }}>format:</span>
          {KELAS_FORMAT.map(f => (
            <button key={f} onClick={() => setFmt(f)}
                    className="btn btn--sm"
                    style={{
                      background: fmt === f ? "var(--ink)" : "var(--paper)",
                      color: fmt === f ? "var(--bg)" : "var(--ink)",
                    }}>
              {f === "Live Zoom" && "🟢 "}{f === "Hybrid" && "🟡 "}{f === "On-demand" && "📺 "}{f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 4, minWidth: 60 }}>topik:</span>
          {KELAS_KATEGORI.map(c => (
            <button key={c} onClick={() => setCat(c)}
                    className="btn btn--sm"
                    style={{
                      background: cat === c ? "var(--ink)" : "var(--paper)",
                      color: cat === c ? "var(--bg)" : "var(--ink)",
                    }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 4, minWidth: 60 }}>level:</span>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
                    className="btn btn--sm"
                    style={{
                      background: level === l ? "var(--ink)" : "var(--paper)",
                      color: level === l ? "var(--bg)" : "var(--ink)",
                    }}>
              {l}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{list.length} kelas</span>
          {loading && <span style={{ fontSize: 13, color: "var(--sage-deep)", marginLeft: 8 }}>Memuat…</span>}
          {error && <span style={{ fontSize: 13, color: "var(--coral-deep)", marginLeft: 8 }}>Gagal memuat</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {list.map(k => <KelasCard key={k.id} k={k} onOpen={() => navigate(`/kelas/${k.slug}`)}/>) }
        </div>
      </section>

      <LearningPath/>
      <InstructorRow/>
      <KelasTestimoni/>
      <NewsletterBlock/>
    </div>
  );
}

function BatchOpenSection({ courses }) {
  const open = courses
    .filter(k => k.batch && k.status !== "closed")
    .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));

  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader
        kicker="batch lagi dibuka"
        title="Mulai bulan ini & Juni"
        sub="Pendaftaran kelas live Zoom dibuka per batch — daftar sebelum slot habis, biar bisa ikut dari sesi pertama."
        right={<button className="btn btn--sm btn--ghost">Semua jadwal batch <Icon.Arrow size={12}/></button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {open.slice(0, 4).map(k => <BatchOpenCard key={k.id} k={k}/>)}
      </div>
    </section>
  );
}

function BatchOpenCard({ k }) {
  const { openInterest } = useCta();
  const pct = Math.round((k.slotsTaken / k.slots) * 100);
  const sisa = k.slots - k.slotsTaken;
  const urgent = pct >= 80;
  return (
    <article className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
      {/* date block */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          background: k.color, borderRadius: 14, padding: "8px 10px",
          border: "1.5px solid var(--ink)", textAlign: "center", minWidth: 64
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--ink-soft)" }}>{k.startDay}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
            {k.startDate.split(" ")[0]}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {k.startDate.split(" ")[1]}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <span className="pill" style={{ fontSize: 10, background: "var(--ink)", color: "var(--bg)", border: "1px solid var(--ink)" }}>
              {k.format === "Live Zoom" ? "🟢 Live" : k.format === "Hybrid" ? "🟡 Hybrid" : "📺"}
            </span>
            <span className="pill" style={{ fontSize: 10 }}>{k.batch}</span>
          </div>
          <h4 style={{ fontSize: 16, lineHeight: 1.2, fontWeight: 600 }}>{k.title}</h4>
        </div>
      </div>

      {/* schedule */}
      <div style={{ fontSize: 12, color: "var(--ink-soft)", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Clock size={11}/> {k.schedule}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon.Pin size={11}/> {k.platform}</span>
      </div>

      {/* slots progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
          <span style={{ color: "var(--ink-soft)" }}>Slot terisi</span>
          <span style={{ fontWeight: 600, color: urgent ? "var(--coral-deep)" : "var(--ink)" }}>
            {k.slotsTaken}/{k.slots} {urgent && "· hampir penuh!"}
          </span>
        </div>
        <div style={{ height: 8, background: "rgba(31,58,45,0.08)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: urgent ? "var(--coral-deep)" : "var(--sage-deep)",
            borderRadius: 999, transition: "width 0.3s"
          }}/>
        </div>
      </div>

      {/* cta */}
      <div style={{ display: "flex", gap: 8, marginTop: "auto", alignItems: "center", justifyContent: "space-between", paddingTop: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
          {k.price === 0 ? "Gratis" : `Rp ${(k.price/1000).toFixed(0)}rb`}
        </span>
        <button
          className="btn btn--sm btn--primary"
          onClick={() => openInterest({ title: `Daftar batch: ${k.title}`, source: `kelas:${k.slug || k.id}`, intent: "class", price: k.price === 0 ? "Gratis" : `Rp ${k.price.toLocaleString("id")}` })}
        >
          Daftar batch <Icon.Arrow size={12}/>
        </button>
      </div>
    </article>
  );
}

function KelasHero({ onNav, featured }) {
  const { openInterest } = useCta();
  const f = featured;
  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color="var(--sage)" size={260} top={20} left={40} opacity={0.4}/>
      <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 32, alignItems: "center", position: "relative", overflow: "visible" }}>
        <div style={{ minWidth: 0 }}>
          <span className="pill pill--ink"><Icon.Sparkle size={12}/> 24 kelas · 8 kategori</span>
          <h1 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, lineHeight: 1, marginTop: 16, letterSpacing: "-0.02em" }}>
            Belajar Islam{" "}
            <span style={{ fontFamily: "var(--font-hand)", color: "var(--coral-deep)", fontWeight: 500, whiteSpace: "nowrap" }}>pelan-pelan</span>
            <br/>
            <span style={{ background: "var(--peach)", padding: "2px 16px 6px", borderRadius: 16, display: "inline-block", transform: "rotate(-1deg)", whiteSpace: "nowrap" }}>tapi nempel</span>{" "}
            <span style={{ fontFamily: "var(--font-hand)", color: "var(--sage-deep)", fontWeight: 500 }}>di hati.</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 16, maxWidth: 520 }}>
            Kelas online dengan ustadz pilihan. Sertifikat di akhir, akses seumur hidup, dan grup WhatsApp buat tanya kapan aja.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <button
              className="btn btn--primary"
              onClick={() => openInterest({ title: "Mulai kelas gratis", source: "kelas:gratis", intent: "class", price: "Gratis" })}
            >
              Mulai kelas gratis <Icon.Arrow size={14}/>
            </button>
            <button className="btn">Lihat best seller</button>
          </div>
        </div>

        {/* Featured kelas card */}
        {f && (
          <div className="card card--peach" style={{ padding: 20, transform: "rotate(2deg)", boxShadow: "5px 6px 0 var(--ink)", position: "relative" }}>
            <span className="sticker illus-only wiggle" style={{ position: "absolute", top: -14, right: -10, background: "var(--coral)" }}>
              ★ {f.tag}
            </span>
            <div style={{
              aspectRatio: "5/3", borderRadius: 14, background: "var(--paper)",
              border: "1.5px solid var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 64, position: "relative", overflow: "hidden"
            }}>
              <span style={{ position: "relative", zIndex: 1 }}>{f.emoji}</span>
              <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, var(--peach), transparent 70%)" }}/>
              <button style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--ink)", border: "2px solid var(--paper)",
                color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer"
              }}>
                <Icon.Play size={20}/>
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
                kelas unggulan · {f.cat}
              </div>
              <h4 style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 600, marginTop: 4 }}>{f.title}</h4>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
                {f.instructor} · {f.lessons} sesi
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function KelasStats() {
  const stats = [
    { big: "24", sub: "kelas tersedia", color: "var(--peach)" },
    { big: "8.5k+", sub: "santri belajar", color: "var(--sage)" },
    { big: "16", sub: "ustadz/ah pengajar", color: "var(--lilac)" },
    { big: "98%", sub: "selesaikan kelas", color: "var(--butter)" },
  ];
  return (
    <section className="shell" style={{ marginBottom: 36 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ background: s.color, padding: 20, position: "relative" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              {s.big}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function KelasCard({ k, onOpen }) {
  const { openInterest } = useCta();
  const isFree = k.price === 0;
  const isLive = k.format === "Live Zoom" || k.format === "Hybrid";
  const pct = k.slots ? Math.round((k.slotsTaken / k.slots) * 100) : 0;
  const urgent = pct >= 80;

  const statusBadge =
    k.status === "almost-full" ? { txt: "🔥 hampir penuh", bg: "var(--coral)" } :
    k.status === "early-bird"  ? { txt: "🐦 early bird",   bg: "var(--butter)" } :
    k.tag === "best seller"    ? { txt: "★ best seller",   bg: "var(--coral)" } :
    k.tag === "gratis"         ? { txt: "gratis",          bg: "var(--sage)" } :
    k.tag === "baru"           ? { txt: "baru",            bg: "var(--lilac)" } :
    k.tag === "populer"        ? { txt: "populer",         bg: "var(--coral)" } :
    null;

  return (
    <article className="card" style={{ padding: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "visible" }}>
      {statusBadge && (
        <span className="sticker illus-only" style={{
          position: "absolute", top: 10, right: -10, zIndex: 3,
          background: statusBadge.bg,
          fontSize: 14, padding: "5px 12px 7px",
          transform: "rotate(6deg)"
        }}>
          {statusBadge.txt}
        </span>
      )}

      {/* thumbnail */}
      <div style={{
        background: k.color, aspectRatio: "4/2.5", position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 72,
        borderTopLeftRadius: "calc(var(--radius) - 2px)",
        borderTopRightRadius: "calc(var(--radius) - 2px)",
        overflow: "hidden"
      }}>
        <span style={{ position: "relative", zIndex: 1 }}>{k.emoji}</span>
        <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,252,245,0.5), transparent 60%)" }}/>
        <button style={{
          position: "absolute", bottom: 12, left: 12,
          width: 36, height: 36, borderRadius: "50%",
          background: "var(--ink)", border: "1.5px solid var(--paper)",
          color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer"
        }}>
          <Icon.Play size={14}/>
        </button>
        <span className="pill" style={{ position: "absolute", top: 10, left: 10, background: "var(--paper)", fontSize: 10 }}>
          preview · 2 mnt
        </span>
        {/* format badge top-right INSIDE thumbnail */}
        <span style={{
          position: "absolute", bottom: 12, right: 12,
          background: "var(--paper)", border: "1.5px solid var(--ink)",
          borderRadius: 999, padding: "4px 10px",
          fontSize: 11, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 4,
          whiteSpace: "nowrap"
        }}>
          {k.format === "Live Zoom" ? "🟢 Live Zoom" : k.format === "Hybrid" ? "🟡 Hybrid" : "📺 On-demand"}
        </span>
      </div>

      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "var(--coral-deep)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{k.cat}</span>
          <span style={{ fontSize: 10, color: "var(--ink-soft)" }}>·</span>
          <span style={{ fontSize: 10, color: "var(--ink-soft)" }}>{k.level}</span>
        </div>
        <h4 style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 600 }}>{k.title}</h4>
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>{k.desc}</p>
        <button className="btn btn--sm btn--ghost" onClick={onOpen} style={{ alignSelf: "flex-start" }}>Lihat detail</button>

        {/* instructor */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: k.instructorAvatar, border: "1.5px solid var(--ink)", flexShrink: 0 }}/>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{k.instructor}</span>
        </div>

        {/* LIVE: batch info / ON-DEMAND: lesson info */}
        {isLive && k.batch ? (
          <div className="card" style={{
            padding: "10px 12px", background: "var(--bg-soft)",
            border: "1.5px dashed var(--ink)", borderRadius: 12,
            display: "flex", flexDirection: "column", gap: 6
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, gap: 6 }}>
              <span style={{ fontWeight: 700, color: "var(--coral-deep)", whiteSpace: "nowrap" }}>{k.batch}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>buka {k.startDate}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon.Clock size={11}/> {k.schedule}
            </div>
            <div style={{ marginTop: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: "var(--ink-soft)" }}>{k.slotsTaken}/{k.slots} slot terisi</span>
                <span style={{ fontWeight: 600, color: urgent ? "var(--coral-deep)" : "var(--ink)" }}>
                  sisa {k.slots - k.slotsTaken}{urgent ? " · cepetan!" : ""}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(31,58,45,0.1)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: urgent ? "var(--coral-deep)" : "var(--sage-deep)",
                  borderRadius: 999
                }}/>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--ink-soft)", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.Play size={10}/> {k.lessons} video</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.Clock size={10}/> {k.duration}</span>
          </div>
        )}

        {/* rating */}
        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "var(--ink-soft)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--coral-deep)" }}>
            <Icon.Star size={10}/> {k.rating} <span style={{ opacity: 0.7 }}>({k.reviews})</span>
          </span>
          <span>· {k.students.toLocaleString("id")} alumni</span>
        </div>

        {/* price + cta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(31,58,45,0.08)", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            {k.originalPrice && <div style={{ fontSize: 11, color: "var(--ink-soft)", textDecoration: "line-through" }}>Rp {k.originalPrice.toLocaleString("id")}</div>}
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, lineHeight: 1, color: isFree ? "var(--sage-deep)" : "var(--ink)", whiteSpace: "nowrap" }}>
              {isFree ? "Gratis" : `Rp ${k.price.toLocaleString("id")}`}
            </div>
          </div>
          <button
            className="btn btn--sm btn--primary"
            style={{ flexShrink: 0 }}
            onClick={() => openInterest({ title: `${isFree ? "Mulai" : isLive ? "Daftar batch" : "Ikut kelas"}: ${k.title}`, source: `kelas:${k.slug || k.id}`, intent: "class", price: isFree ? "Gratis" : `Rp ${k.price.toLocaleString("id")}` })}
          >
            {isFree ? "Mulai" : isLive ? "Daftar batch" : "Ikut kelas"} <Icon.Arrow size={12}/>
          </button>
        </div>
      </div>
    </article>
  );
}

function LearningPath() {
  const path = [
    { step: "01", title: "Pondasi: Tahsin Pemula", desc: "Bener-bener dari nol. Belajar makhraj & tajwid dasar.", time: "4 minggu", color: "var(--peach)", icon: "🎙" },
    { step: "02", title: "Pahami: Tafsir Juz 'Amma", desc: "Setelah bisa baca, sekarang pahami artinya.",          time: "6 minggu", color: "var(--sage)", icon: "📖" },
    { step: "03", title: "Hafal: Tahfidz Juz 30",    desc: "30 hari intensif menghafal juz 30 lengkap.",         time: "30 hari",  color: "var(--lilac)", icon: "🎧" },
    { step: "04", title: "Dalami: Bahasa Arab",       desc: "Biar Qur'an gak cuma bacaan, tapi obrolan.",         time: "8 minggu", color: "var(--butter)", icon: "🔤" },
  ];
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader
        kicker="ada panduan kok"
        title="Roadmap belajar Qur'an"
        sub="Bingung mulai dari mana? Ikut urutan ini — kalau konsisten, dalam 6 bulan kamu udah bisa baca, paham, dan hafal juz 30."
        right={<button className="btn btn--sm btn--ghost">Ambil semua bundle <Icon.Arrow size={12}/></button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
        {path.map((p, i) => (
          <div key={i} style={{ position: "relative", padding: "0 8px" }}>
            {i < path.length - 1 && (
              <svg style={{ position: "absolute", top: 40, right: -16, width: 32, height: 32, zIndex: 2 }} viewBox="0 0 32 32" fill="none">
                <path d="M4 16 L26 16 M20 8 L28 16 L20 24" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0"/>
              </svg>
            )}
            <div className="card" style={{ background: p.color, padding: 22, height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, lineHeight: 0.9, color: "var(--ink)", opacity: 0.35 }}>
                  {p.step}
                </span>
                <span style={{ fontSize: 32 }}>{p.icon}</span>
              </div>
              <h4 style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 600 }}>{p.title}</h4>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>{p.desc}</p>
              <span className="pill pill--paper" style={{ fontSize: 11, alignSelf: "flex-start", marginTop: "auto" }}>
                <Icon.Clock size={10}/> {p.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InstructorRow() {
  const ins = [
    { name: "Ust. Adi Hidayat", role: "Tafsir & Hadits", classes: 4, color: "var(--peach)" },
    { name: "dr. Aisyah Dahlan", role: "Parenting Islami", classes: 3, color: "var(--lilac)" },
    { name: "Ust. Hanan Attaki", role: "Ibadah Harian", classes: 5, color: "var(--coral)" },
    { name: "Ust. Hasan Bashri", role: "Tahsin & Tajwid", classes: 6, color: "var(--sage)" },
    { name: "Ustdzh. Mariam S.", role: "Bahasa Arab", classes: 3, color: "var(--butter)" },
    { name: "Erick Yusuf", role: "Bisnis Muslim", classes: 2, color: "var(--peach)" },
  ];
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader
        kicker="diajar langsung"
        title="Ustadz & ustadzah pilihan"
        sub="Yang ngajar bukan random orang — semua punya rekam jejak & sanad jelas."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
        {ins.map((p, i) => (
          <div key={i} className="card" style={{ padding: 16, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: p.color, border: "1.5px solid var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28
            }}>👤</div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{p.role}</div>
            <span className="pill" style={{ fontSize: 10, padding: "3px 8px" }}>{p.classes} kelas</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function KelasTestimoni() {
  const t = [
    { name: "Rina, 27", role: "Mahasiswa S2", text: "Awalnya cuma bisa baca alif-ba-ta. Sekarang udah hampir hatam juz 30. Pak Ustadnya sabar banget.", avatar: "var(--peach)", kelas: "Tahsin Pemula" },
    { name: "Faiz, 34", role: "Bapak 2 anak", text: "Workshop parentingnya bener-bener bantu pas anak pertama mulai sholat. Gak melulu teori, banyak studi kasus real.", avatar: "var(--sage)", kelas: "Mendidik Anak Cara Nabi" },
    { name: "Bunda Sari", role: "IRT", text: "Suka bgt kelas khusyu' sholatnya — singkat tapi praktis. Bisa diulang-ulang kapan aja. Worth it!", avatar: "var(--lilac)", kelas: "Sholat Khusyu'" },
  ];
  return (
    <section className="shell" style={{ marginBottom: 40 }}>
      <SectionHeader kicker="cerita santri" title="Yang udah belajar bareng" sub="Sedikit dari ribuan testimoni alumni kelas Muslim Hebat."/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {t.map((x, i) => (
          <article key={i} className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 4, color: "var(--coral)" }}>
              {[1,2,3,4,5].map(s => <Icon.Star key={s} size={14}/>)}
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.35, margin: 0, fontWeight: 500 }}>
              "{x.text}"
            </p>
            <div style={{ marginTop: "auto", paddingTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: x.avatar, border: "1.5px solid var(--ink)" }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{x.role}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--coral-deep)", marginTop: 8, fontStyle: "italic" }}>
                — alumni {x.kelas}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
