// KajianPage — schedule list, calendar view, featured kajian.

import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons.jsx";
import { Blob, SunDecor } from "./shell.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { NewsletterBlock } from "./HomePage_more.jsx";

import { usePublicData } from "./hooks/usePublicData.js";
import { useCta } from "./context/cta-context.jsx";

export function KajianPage({ onNav }) {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState("Semua");

  const { data: apiEvents, loading, error } = usePublicData("/public/kajian");

  const events = React.useMemo(() => {
    if (!apiEvents) return [];
    return apiEvents.map(e => ({
      ...e,
      type: e.eventType,
      loc: e.location,
      cat: e.eventType,
      price: e.free ? "Gratis" : (e.priceCents ? `Rp ${e.priceCents.toLocaleString("id")}` : "Gratis")
    }));
  }, [apiEvents]);

  const filters = React.useMemo(() => {
    const tags = new Set();
    events.forEach(e => {
      if (e.tags) {
        e.tags.forEach(t => tags.add(t.charAt(0).toUpperCase() + t.slice(1)));
      }
    });
    return ["Semua", "Online", "Offline", "Minggu ini", ...Array.from(tags)];
  }, [events]);

  const filtered = React.useMemo(() => {
    if (filter === "Semua") return events;
    if (["Online", "Offline"].includes(filter)) return events.filter(e => e.eventType === filter);
    if (filter === "Minggu ini") return events.slice(0, 4);
    return events.filter(e => e.eventType === filter || (e.tags && e.tags.includes(filter.toLowerCase())));
  }, [events, filter]);

  return (
    <div data-screen-label="03 Ngaji Bareng">
      <KajianHero events={events}/>

      <section className="shell" style={{ marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "start" }}>
          {/* main list */}
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--coral-deep)", marginRight: 6 }}>filter:</span>
              {filters.map(f => (
                <button key={f}
                        onClick={() => setFilter(f)}
                        className="btn btn--sm"
                        style={{
                          background: filter === f ? "var(--ink)" : "var(--paper)",
                          color: filter === f ? "var(--bg)" : "var(--ink)",
                        }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {loading && <p>Memuat jadwal…</p>}
              {error && <p className="admin-error">Gagal memuat jadwal: {error}</p>}
              {filtered.map((e) => <KajianRow key={e.id || e.slug} e={e} onOpen={() => navigate(`/kajian/${e.slug}`)}/>) }
            </div>
          </div>

          {/* sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 100 }}>
            <MiniCalendar events={events}/>
            <SubmitKajian/>
            <FeaturedSpeaker events={events}/>
          </aside>
        </div>
      </section>

      <UpcomingMonth events={events}/>
      <NewsletterBlock/>
    </div>
  );
}

function KajianHero({ events }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const activeDays = React.useMemo(() => {
    if (!events) return [];
    return events
      .filter(e => {
        if (!e.startsAt) return false;
        const d = new Date(e.startsAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .map(e => new Date(e.startsAt).getDate());
  }, [events, currentMonth, currentYear]);

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = now.getDate() === d;
    const hasEvent = activeDays.includes(d);
    cells.push(
      <div key={d} style={{
        aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: isToday ? 700 : 500,
        background: isToday ? "var(--ink)" : hasEvent ? "var(--paper)" : "transparent",
        color: isToday ? "var(--bg)" : "var(--ink)",
        borderRadius: 8,
        border: hasEvent && !isToday ? "1.5px solid var(--ink)" : "none",
        position: "relative"
      }}>
        {d}
        {hasEvent && !isToday && <span style={{ position: "absolute", bottom: 2, width: 4, height: 4, borderRadius: "50%", background: "var(--coral-deep)" }}/>}
      </div>
    );
  }

  const thisMonthEvents = events.filter(e => {
    if (!e.startsAt) return false;
    const d = new Date(e.startsAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return (
    <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
      <Blob color="var(--lilac)" size={260} top={20} right={60} opacity={0.45}/>
      <div className="card card--paper" style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center", position: "relative", overflow: "visible" }}>
        <div style={{ minWidth: 0 }}>
          <span className="pill pill--ink"><Icon.Cal size={12}/> {thisMonthEvents} jadwal bulan ini</span>
          <h1 style={{ fontSize: "clamp(40px, 4.8vw, 64px)", fontWeight: 700, lineHeight: 1, marginTop: 16 }}>
            Yuk, ikut <span style={{ background: "var(--peach)", padding: "0 12px 4px", borderRadius: 14, display: "inline-block", transform: "rotate(-1deg)" }}>kajian</span><br/>
            <span style={{ fontFamily: "var(--font-hand)", color: "var(--sage-deep)", fontWeight: 500 }}>bareng</span> minggu ini.
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 16, maxWidth: 520 }}>
            Daftar gratis, kami kirim reminder lewat email & WhatsApp. Banyak juga yang bisa ditonton ulang di YouTube.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <button className="btn btn--primary">Lihat jadwal minggu ini <Icon.Arrow size={14}/></button>
            <button className="btn">Filter online aja</button>
          </div>
        </div>

        {/* mini calendar preview */}
        <div className="card card--sage kajian-hero-calendar" style={{ padding: 18, transform: "rotate(2deg)", boxShadow: "5px 6px 0 var(--ink)", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>{monthNames[currentMonth]} {currentYear}</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--coral-deep)", whiteSpace: "nowrap" }}>{thisMonthEvents} Kajian</span>
          </div>
          <div className="mini-calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 10 }}>
            {"Ahd Sen Sel Rab Kam Jum Sab".split(" ").map(d =>
              <div key={d} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 4, fontWeight: 600 }}>{d}</div>
            )}
            {cells}
          </div>
        </div>
      </div>
    </section>
  );
}

function KajianRow({ e, onOpen }) {
  const { openInterest } = useCta();
  return (
    <article className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>
      <div style={{
        background: e.color, borderRadius: 18, padding: "14px 18px",
        border: "1.5px solid var(--ink)", textAlign: "center", minWidth: 86
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{e.date}</div>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{e.month}</div>
        <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 2 }}>{e.day}</div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <span className={`pill ${e.type === "Online" ? "" : "pill--ink"}`} style={{ fontSize: 10 }}>
            {e.type === "Online" ? "🟢 Online" : "📍 Offline"}
          </span>
          {e.tags && e.tags.slice(0, 2).map(t => (
            <span key={t} className="pill" style={{ fontSize: 10 }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
          ))}
          {e.free
            ? <span className="pill" style={{ fontSize: 10, background: "var(--sage)", color: "var(--ink)", border: "1px solid var(--ink)" }}>Gratis</span>
            : <span className="pill" style={{ fontSize: 10, background: "var(--peach)", color: "var(--ink)", border: "1px solid var(--ink)" }}>{e.price}</span>
          }
        </div>
        <h4 style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 8 }}>{e.title}</h4>
        <div style={{ fontSize: 13, color: "var(--ink-soft)", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Smile size={12}/> {e.speaker}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Clock size={12}/> {e.time}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Pin size={12}/> {e.loc}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon.Smile size={12}/> {e.attendees.toLocaleString("id")} daftar</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button className="btn btn--sm btn--ghost" onClick={onOpen} style={{ fontSize: 12, padding: "6px 10px" }}>Detail</button>
        <button
          className="btn btn--sm btn--primary"
          onClick={() => openInterest({ title: `Daftar: ${e.title}`, source: `kajian:${e.slug || e.id}`, intent: "event", price: e.price || (e.free ? "Gratis" : "Berbayar") })}
        >
          Daftar <Icon.Arrow size={12}/>
        </button>
        <button
          className="btn btn--sm btn--ghost"
          style={{ fontSize: 12, padding: "6px 10px" }}
          onClick={() => openInterest({ title: `Reminder: ${e.title}`, source: `kajian-reminder:${e.slug || e.id}`, intent: "reminder" })}
        >
          <Icon.Bell size={11}/> Ingetin
        </button>
      </div>
    </article>
  );
}

function MiniCalendar({ events }) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(now.getMonth());
  const [currentYear, setCurrentYear] = React.useState(now.getFullYear());

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const activeDays = React.useMemo(() => {
    if (!events) return [];
    return events
      .filter(e => {
        if (!e.startsAt) return false;
        const d = new Date(e.startsAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .map(e => new Date(e.startsAt).getDate());
  }, [events, currentMonth, currentYear]);

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = now.getDate() === d && now.getMonth() === currentMonth && now.getFullYear() === currentYear;
    const hasEvent = activeDays.includes(d);
    cells.push(
      <div key={d} style={{
        aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: isToday ? 700 : 500,
        background: isToday ? "var(--ink)" : hasEvent ? "var(--paper)" : "transparent",
        color: isToday ? "var(--bg)" : "var(--ink)",
        borderRadius: 6,
        border: hasEvent && !isToday ? "1px solid var(--ink)" : "none"
      }}>{d}</div>
    );
  }

  return (
    <div className="card card--peach" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{monthNames[currentMonth]} {currentYear}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="btn btn--sm" style={{ padding: "4px 8px", fontSize: 11 }} onClick={handlePrev}>‹</button>
          <button className="btn btn--sm" style={{ padding: "4px 8px", fontSize: 11 }} onClick={handleNext}>›</button>
        </div>
      </div>
      <div className="mini-calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, fontSize: 11 }}>
        {"A S S R K J S".split(" ").map((d, i) => (
          <div key={i} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 2, fontWeight: 600 }}>{d}</div>
        ))}
        {cells}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--ink-soft)", marginTop: 12 }}>
        <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--ink)", borderRadius: 3, marginRight: 4 }}/>Hari ini</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--paper)", border: "1px solid var(--ink)", borderRadius: 3, marginRight: 4 }}/>Ada jadwal</span>
      </div>
    </div>
  );
}

function SubmitKajian() {
  return (
    <div className="card card--lilac" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <span className="sticker illus-only" style={{ alignSelf: "flex-start", background: "var(--butter)", fontSize: 16 }}>kabarin yuk!</span>
      <h4 style={{ fontSize: 22, lineHeight: 1.15, marginTop: 4 }}>Punya kajian buat dishare?</h4>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>Tim Muslim Hebat bantu broadcast ke 12rb+ anggota komunitas, gratis.</p>
      <button className="btn btn--sm btn--primary" style={{ alignSelf: "flex-start", marginTop: 4 }}>
        Submit jadwal <Icon.Arrow size={12}/>
      </button>
    </div>
  );
}

function FeaturedSpeaker({ events }) {
  const featuredEvent = events.find(e => e.featured) || events[0];
  if (!featuredEvent) return null;

  return (
    <div className="card card--ink" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <SunDecor size={80} color="var(--peach)" style={{ position: "absolute", top: -20, right: -20, opacity: 0.6 }}/>
      <div style={{ position: "relative" }}>
        <span className="pill pill--paper" style={{ fontSize: 11 }}>👤 ustadz minggu ini</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--peach)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{featuredEvent.speaker}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Pemateri utama kajian: <br/><strong>{featuredEvent.title}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingMonth({ events }) {
  const now = new Date();
  const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const fourWeeks = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const w1Count = events.filter(e => e.startsAt && new Date(e.startsAt) >= now && new Date(e.startsAt) <= oneWeek).length;
  const w2Count = events.filter(e => e.startsAt && new Date(e.startsAt) > oneWeek && new Date(e.startsAt) <= twoWeeks).length;
  const w3Count = events.filter(e => e.startsAt && new Date(e.startsAt) > twoWeeks && new Date(e.startsAt) <= fourWeeks).length;
  const w4Count = events.filter(e => e.startsAt && new Date(e.startsAt) > fourWeeks).length;

  const weeks = [
    { label: "Minggu ini", count: w1Count, color: "var(--peach)" },
    { label: "Minggu depan", count: w2Count, color: "var(--sage)" },
    { label: "Akhir bulan", count: w3Count, color: "var(--lilac)" },
    { label: "Bulan depan", count: w4Count, color: "var(--butter)" },
  ];

  return (
    <section className="shell" style={{ marginBottom: 32 }}>
      <SectionHeader
        kicker="lihat kedepan"
        title="Yang akan datang"
        sub="Snapshot cepat jadwal kajian untuk beberapa minggu ke depan."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {weeks.map((w, i) => (
          <div key={i} className="card" style={{
            background: w.color, padding: 22, position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", gap: 8, minHeight: 160
          }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--ink)" }}>{w.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em" }}>
              {w.count}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: "auto" }}>kajian dijadwalkan</div>
            <button className="btn btn--sm" style={{ alignSelf: "flex-start", background: "var(--paper)" }}>Lihat detail <Icon.Arrow size={12}/></button>
          </div>
        ))}
      </div>
    </section>
  );
}
