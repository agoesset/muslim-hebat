import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const articles = [
  { slug: "hal-kecil-bikin-tenang", title: "5 hal kecil yang bikin hati lebih tenang saat overwhelmed", excerpt: "Spoiler: bukan tentang langsung jadi orang yang super tenang. Tapi tentang nyari celah-celah kecil di hari kamu.", body: "Mulai dari hal kecil, ulangi pelan-pelan, dan jaga niat baiknya.", category: "Self-growth", author: "Nadia R.", color: "var(--peach)", emoji: "🌿", date: "20 Mei", time: "6 mnt", readingTime: 6, reads: 1240, claps: 84, tag: "trending", tags: ["trending", "self-growth"], featured: true, size: "lg", coverImage: null },
  { slug: "ngajarin-anak-sholat", title: "Ngajarin anak sholat tanpa marah-marah, mungkin gak sih?", excerpt: "Ternyata kuncinya bukan di anak — tapi di kita yang dewasa.", body: "", category: "Parenting", author: "Bunda Aisyah", color: "var(--sage)", emoji: "👨‍👩‍👧", date: "19 Mei", time: "4 mnt", readingTime: 4, reads: 880, claps: 56, tag: "", tags: ["parenting"], featured: false, size: "md", coverImage: null },
  { slug: "al-kahfi-buat-galau", title: "Surat Al-Kahfi ayat 1–10 buat yang lagi galau", excerpt: "Ada cerita 4 pemuda yang ngelawan kebatilan. Relate banget sama kita yang lagi mempertanyakan banyak hal.", body: "", category: "Tafsir santai", author: "Ust. Faris", color: "var(--lilac)", emoji: "📖", date: "18 Mei", time: "8 mnt", readingTime: 8, reads: 2100, claps: 142, tag: "", tags: ["tafsir", "quran"], featured: false, size: "md", coverImage: null },
  { slug: "todo-list-tanpa-burnout", title: "Bikin to-do list ala muslim yang gak bikin burnout", excerpt: "Niat dulu, baru list. Ternyata orderingnya penting.", body: "", category: "Productivity", author: "Faiz H.", color: "var(--butter)", emoji: "✅", date: "17 Mei", time: "5 mnt", readingTime: 5, reads: 1560, claps: 98, tag: "", tags: ["productivity"], featured: false, size: "sm", coverImage: null },
  { slug: "belajar-maafin", title: "Belajar maafin orang lain (dan diri sendiri) pelan-pelan", excerpt: "Spoiler: maafin diri sendiri jauh lebih susah.", body: "", category: "Hubungan", author: "Sarah M.", color: "var(--coral)", emoji: "🤲", date: "15 Mei", time: "7 mnt", readingTime: 7, reads: 1820, claps: 124, tag: "", tags: ["relationship"], featured: false, size: "sm", coverImage: null },
  { slug: "istighfar-reset-hari", title: "Kenapa istighfar bisa nge-reset hari kamu?", excerpt: "Ada alasan kenapa Rasulullah istighfar 100 kali sehari, padahal beliau ma'shum.", body: "", category: "Self-growth", author: "Nadia R.", color: "var(--sage)", emoji: "✨", date: "14 Mei", time: "5 mnt", readingTime: 5, reads: 940, claps: 72, tag: "", tags: ["self-growth"], featured: false, size: "sm", coverImage: null },
  { slug: "tahajud-pemula", title: "Tahajud buat pemula: gimana mulai tanpa terasa berat", excerpt: "Mulai dari 2 rakaat di jam 4 pagi. Itu aja udah cukup.", body: "", category: "Ibadah harian", author: "Ust. Hasan", color: "var(--lilac)", emoji: "🌙", date: "12 Mei", time: "6 mnt", readingTime: 6, reads: 1340, claps: 89, tag: "", tags: ["ibadah"], featured: false, size: "sm", coverImage: null },
  { slug: "sholat-tengah-notif", title: "Sholat khusyu' di tengah notif WhatsApp yang gak berhenti", excerpt: "Tips digital muslim biar 5 menit aja bener-bener buat Allah.", body: "", category: "Self-growth", author: "Faiz H.", color: "var(--peach)", emoji: "📵", date: "10 Mei", time: "4 mnt", readingTime: 4, reads: 1120, claps: 78, tag: "", tags: ["self-growth", "digital"], featured: false, size: "sm", coverImage: null },
  { slug: "sedekah-5rb", title: "Sedekah 5 ribu yang ternyata ngubah pandangan hidup", excerpt: "Cerita kecil dari pengamen di stasiun Bekasi.", body: "", category: "Hubungan", author: "Bunda Aisyah", color: "var(--butter)", emoji: "💛", date: "8 Mei", time: "5 mnt", readingTime: 5, reads: 760, claps: 64, tag: "", tags: ["relationship"], featured: false, size: "sm", coverImage: null },
  { slug: "dzikir-pagi-singkat", title: "Dzikir pagi singkat buat yang sering buru-buru", excerpt: "Mulai dari tiga bacaan pendek dulu. Yang penting konsisten dan ngerti maknanya.", body: "Dzikir pagi bisa dimulai pendek, asal hadir dan rutin. Pilih bacaan yang shahih, pahami maknanya, lalu tambah pelan-pelan.", category: "Ibadah harian", author: "Ust. Hasan", color: "var(--sage)", emoji: "🌅", date: "6 Mei", time: "4 mnt", readingTime: 4, reads: 680, claps: 51, tag: "", tags: ["ibadah"], featured: false, size: "sm", coverImage: null },
];

const products = [
  { slug: "jurnal-ramadhan-30-hari", name: "Jurnal Ramadhan 30 Hari", excerpt: "Tracker amal yaumiyyah 30 hari + space refleksi harian.", description: "Printable digital untuk membantu ibadah harian lebih konsisten.", category: "Worksheet", priceCents: 39000, originalPriceCents: 59000, rating: 4.9, sold: 1240, tag: "best seller", tags: ["ramadhan", "tracker"], featured: true, image: null, color: "var(--peach)", emoji: "📓" },
  { slug: "wallpaper-quotes-ayat", name: "Wallpaper Pack: Quotes Ayat", excerpt: "20 wallpaper HD untuk HP & laptop, ayat-ayat pilihan.", description: "", category: "Wallpaper", priceCents: 0, originalPriceCents: 0, rating: 4.8, sold: 3200, tag: "new", tags: ["wallpaper", "quran"], featured: false, image: null, color: "var(--lilac)", emoji: "📱" },
  { slug: "kelas-tahsin-pemula", name: "Kelas Tahsin Pemula (12 sesi)", excerpt: "12 sesi video + grup WA + sertifikat. Mulai dari nol.", description: "", category: "Kelas", priceCents: 249000, originalPriceCents: 0, rating: 5.0, sold: 480, tag: "", tags: ["tahsin", "kelas"], featured: true, image: null, color: "var(--sage)", emoji: "🎙" },
  { slug: "ebook-anak-tenang", name: "E-book: Anak Tenang, Bunda Senang", excerpt: "Tips parenting santun dari sudut pandang islami.", description: "", category: "E-book", priceCents: 59000, originalPriceCents: 0, rating: 4.7, sold: 890, tag: "", tags: ["parenting", "ebook"], featured: false, image: null, color: "var(--butter)", emoji: "📖" },
  { slug: "template-doa-notion", name: "Template Doa Harian (Notion)", excerpt: "Database doa lengkap, siap di-duplicate ke Notion kamu.", description: "", category: "Template", priceCents: 19000, originalPriceCents: 0, rating: 4.8, sold: 620, tag: "", tags: ["notion", "doa"], featured: false, image: null, color: "var(--coral)", emoji: "🗒" },
  { slug: "planner-hijriah-1447", name: "Planner Hijriah 1447", excerpt: "PDF printable A5/A4, kalender hijriah & masehi paralel.", description: "", category: "Worksheet", priceCents: 79000, originalPriceCents: 0, rating: 4.9, sold: 740, tag: "new", tags: ["planner", "hijriah"], featured: true, image: null, color: "var(--sage)", emoji: "📅" },
  { slug: "ebook-bismillah-berbisnis", name: "E-book: Bismillah Berbisnis", excerpt: "Panduan praktis muamalah & etika bisnis muslim modern.", description: "", category: "E-book", priceCents: 49000, originalPriceCents: 0, rating: 4.6, sold: 560, tag: "", tags: ["bisnis", "ebook"], featured: false, image: null, color: "var(--lilac)", emoji: "💼" },
  { slug: "kelas-tahfidz-1-juz", name: "Kelas Tahfidz 1 Juz", excerpt: "30 hari intensif menghafal juz 30, mentor 1-on-1.", description: "", category: "Kelas", priceCents: 399000, originalPriceCents: 0, rating: 5.0, sold: 220, tag: "", tags: ["tahfidz", "kelas"], featured: true, image: null, color: "var(--peach)", emoji: "🎧" },
  { slug: "wallpaper-dzikir-pagi", name: "Wallpaper Pack: Dzikir Pagi", excerpt: "12 wallpaper minimalis berisi dzikir pagi & petang.", description: "", category: "Wallpaper", priceCents: 0, originalPriceCents: 0, rating: 4.9, sold: 2100, tag: "free", tags: ["wallpaper", "dzikir"], featured: false, image: null, color: "var(--butter)", emoji: "🌅" },
];

const kajian = [
  { slug: "tafsir-surat-al-kahfi", title: "Tafsir Surat Al-Kahfi", excerpt: "Kajian rutin pekanan untuk tadabbur surat Al-Kahfi.", description: "Kajian mendalam tentang Surat Al-Kahfi, kisah empat pemuda, dan hikmah-hikmah untuk kehidupan modern.", speaker: "Ust. Adi Hidayat", location: "Masjid Istiqlal · Jakarta", eventType: "Offline", startsAt: "2026-05-22T11:10:00.000Z", date: 22, month: "Mei", day: "Jum'at", time: "Ba'da Maghrib · 18.10 WIB", attendees: 240, priceCents: 0, free: true, tags: ["tafsir", "offline"], featured: true, coverImage: null, color: "var(--sage)" },
  { slug: "parenting-ngomong-remaja", title: "Parenting in Islam: Ngomong sama Remaja", excerpt: "Diskusi praktis komunikasi dengan remaja di era digital.", description: "Cara berdialog dengan remaja, memahami perubahan emosi, dan memberi bimbingan tanpa memutus hubungan.", speaker: "dr. Aisyah Dahlan", location: "Zoom + YouTube live", eventType: "Online", startsAt: "2026-05-24T03:00:00.000Z", date: 24, month: "Mei", day: "Ahad", time: "10.00 WIB", attendees: 1820, priceCents: 0, free: true, tags: ["parenting", "online"], featured: true, coverImage: null, color: "var(--lilac)" },
  { slug: "kelas-tahsin-makhraj", title: "Kelas Tahsin: Makhraj huruf", excerpt: "Belajar makhraj huruf hijaiyah dari dasar.", description: "Praktik makhraj huruf, sifat-sifat huruf, dan latihan bacaan agar lafaz Qur'an lebih tepat.", speaker: "Ust. Hasan Bashri", location: "Google Meet", eventType: "Online", startsAt: "2026-05-27T12:30:00.000Z", date: 27, month: "Mei", day: "Rabu", time: "19.30 WIB", attendees: 86, priceCents: 5000, free: false, tags: ["tahsin", "online"], featured: false, coverImage: null, color: "var(--peach)" },
  { slug: "khusyu-dalam-sholat", title: "Khusyu' dalam sholat: tips praktis", excerpt: "Tips menjaga khusyu' saat sholat di tengah kesibukan.", description: "Memahami khushu', latihan fokus dalam sholat, dan tips praktis di tengah distraksi digital.", speaker: "Ust. Hanan Attaki", location: "Masjid Agung Sunda Kelapa", eventType: "Offline", startsAt: "2026-05-29T12:45:00.000Z", date: 29, month: "Mei", day: "Jum'at", time: "Ba'da Isya · 19.45 WIB", attendees: 410, priceCents: 0, free: true, tags: ["sholat", "offline"], featured: false, coverImage: null, color: "var(--butter)" },
  { slug: "muslimah-self-worth", title: "Muslimah Talk: self-worth dari sudut Islam", excerpt: "Pemahaman self-worth dalam Islam untuk muslimah.", description: "Membangun harga diri dari perspektif Islam, menghadapi standar sosial, dan menemukan identitas sejati.", speaker: "Ust. Oki Setiana Dewi", location: "Zoom · Khusus perempuan", eventType: "Online", startsAt: "2026-06-01T07:00:00.000Z", date: 1, month: "Jun", day: "Ahad", time: "14.00 WIB", attendees: 980, priceCents: 0, free: true, tags: ["muslimah", "online"], featured: true, coverImage: null, color: "var(--coral)" },
  { slug: "tadabbur-juz-30", title: "Tadabbur Juz 30 — bagian 1", excerpt: "Tadabbur bersama Juz 30 dengan terjemahan.", description: "Merefleksikan ayat-ayat Juz 30, memahami kisah, dan menemukan aplikasi harian.", speaker: "Ust. Nouman Ali Khan (Sub-id)", location: "YouTube live", eventType: "Online", startsAt: "2026-06-03T13:00:00.000Z", date: 3, month: "Jun", day: "Selasa", time: "20.00 WIB", attendees: 2400, priceCents: 0, free: true, tags: ["tadabbur", "online"], featured: true, coverImage: null, color: "var(--sage)" },
];

const homePageValue = {
  hero: {
    pill: "komunitas hangat sejak 2024",
    stat: "+ 12,400 muslim",
    headline: ["Belajar Islam", "tanpa drama", "santai & konsisten."],
    sub: "Bacaan ringan, produk bermanfaat, dan jadwal ngaji bareng yang bikin kamu makin semangat — semua di satu tempat.",
    ctaPrimary: "Lihat produk",
    ctaSecondary: "Baca bacaan terbaru"
  },
  prayer: {
    nextName: "Ashar",
    nextTime: "15:24",
    nextLabel: "· 1 jam 12 menit lagi",
    schedule: [
      { name: "Subuh", time: "04:38", done: true },
      { name: "Dzuhur", time: "11:52", done: true },
      { name: "Ashar", time: "15:24", active: true },
      { name: "Maghrib", time: "17:58" },
      { name: "Isya", time: "19:08" }
    ]
  },
  daily: {
    label: "hari ini",
    date: "Rabu, 20 Mei",
    stats: [
      { big: "14", sub: "hijriah", tag: "11 Dzul-Q" },
      { big: "3/5", sub: "sholat selesai" },
      { big: "2", sub: "ngaji besok" }
    ]
  },
  quote: {
    label: "quote of the day",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation: "“Siapa pun yang bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar.”",
    source: "QS. Ath-Thalaq: 2"
  },
  bentoHeader: {
    kicker: "ngalir santai",
    title: "Bekal harian buat hati",
    sub: "Beberapa hal kecil yang bisa kamu lakuin hari ini biar makin dekat sama Allah."
  },
  dzikir: {
    label: "Dzikir pagi",
    title: "Mulai pagi dengan dzikir ✿",
    items: [
      { txt: "Astaghfirullāh", n: "100×", done: true },
      { txt: "Subhānallāh wa bihamdihi", n: "33×", done: true },
      { txt: "Lā ilāha illallāh wahdahu lā syarīka lah…", n: "10×", done: false },
      { txt: "Allāhumma anta rabbī lā ilāha illā anta…", n: "1×", done: false }
    ]
  },
  community: {
    label: "komunitas",
    title: "12,400+ teman seperjalanan",
    sub: "Diskusi santai, sharing pengalaman, saling ingetin di Telegram & Discord.",
    colors: ["#FFD6A5", "#A8D8B9", "#FFADAD", "#D8CCEF", "#F7E4A0"],
    cta: "Gabung sekarang"
  },
  reminder: {
    sticker: "jangan lupa!",
    label: "reminder",
    title: "Sudah baca Al-Mulk hari ini?",
    sub: "30 ayat, ± 8 menit. Sunnah sebelum tidur biar dijauhkan dari azab kubur.",
    ctaPrimary: "Baca sekarang",
    ctaSecondary: "Ingetin nanti"
  },
  miniQuote: {
    text: "Yang penting jalan terus, gak perlu sempurna — cukup konsisten satu langkah tiap hari.",
    author: "Ustadz Hanan Attaki"
  },
  intention: {
    label: "niat hari ini",
    placeholder: "Hari ini aku mau…",
    suggestions: ["sholat tepat waktu", "baca 1 lembar Qur'an", "senyum ke ortu", "sedekah 5rb"]
  }
};

const courses = [
  { slug: "tahsin-pemula", title: "Tahsin Pemula: Baca Qur'an dari Nol", excerpt: "Belajar makhraj huruf, tajwid dasar, sampai bisa baca 1 ayat dengan benar — pelan-pelan dari nol.", description: "", category: "Tahsin", level: "Pemula", format: "Live Zoom", instructor: "Ust. Hasan Bashri", lessons: 12, duration: "4 minggu", students: 480, rating: 5.0, reviews: 124, priceCents: 249000, originalPriceCents: 399000, tag: "best seller", tags: ["tahsin", "pemula"], featured: true, image: null, batch: "Batch #7", startDate: "5 Juni 2026", startDay: "Senin", schedule: "Senin & Rabu, 19:30–21:00 WIB", platform: "Zoom + grup WA", slots: 50, slotsTaken: 32, statusDetail: "open", color: "var(--sage)", emoji: "🎙" },
  { slug: "tahfidz-juz-30", title: "Tahfidz 30 Hari: Juz 30", excerpt: "Daily check-in + mentor 1-on-1. Selesaikan hafalan juz 30 dalam sebulan, target 1 halaman per hari.", description: "", category: "Tahfidz", level: "Menengah", format: "Live Zoom", instructor: "Ust. Ahmad Faiz", lessons: 30, duration: "30 hari", students: 220, rating: 5.0, reviews: 68, priceCents: 399000, originalPriceCents: 0, tag: "almost full", tags: ["tahfidz", "almost-full"], featured: true, image: null, batch: "Batch #3", startDate: "10 Juni 2026", startDay: "Sabtu", schedule: "Setiap hari, 05:00–06:00 WIB", platform: "Zoom + mentor 1-on-1", slots: 25, slotsTaken: 22, statusDetail: "almost-full", color: "var(--peach)", emoji: "🎧" },
  { slug: "parenting-islami", title: "Mendidik Anak Cara Nabi", excerpt: "Workshop video + studi kasus parenting muslim modern. Dari balita sampai remaja. Belajar kapan aja.", description: "", category: "Parenting Islami", level: "Semua level", format: "On-demand", instructor: "dr. Aisyah Dahlan", lessons: 8, duration: "Akses seumur hidup", students: 1240, rating: 4.9, reviews: 312, priceCents: 199000, originalPriceCents: 0, tag: "populer", tags: ["parenting", "populer"], featured: true, image: null, batch: "", startDate: "", startDay: "", schedule: "", platform: "", slots: 0, slotsTaken: 0, statusDetail: "", color: "var(--lilac)", emoji: "👨‍👩‍👧" },
  { slug: "tafsir-juz-amma", title: "Tafsir Juz 'Amma: Cerita di Balik Ayat", excerpt: "8 sesi live Zoom + 7 sesi video on-demand. Bisa diulang kapan aja kalau ketinggalan.", description: "", category: "Tafsir", level: "Semua level", format: "Hybrid", instructor: "Ust. Adi Hidayat", lessons: 15, duration: "6 minggu", students: 890, rating: 4.9, reviews: 198, priceCents: 299000, originalPriceCents: 0, tag: "", tags: ["tafsir", "hybrid"], featured: false, image: null, batch: "Batch #2", startDate: "15 Juni 2026", startDay: "Kamis", schedule: "Kamis 19:30 WIB (live) + video on-demand", platform: "Zoom + akses rekaman", slots: 80, slotsTaken: 41, statusDetail: "open", color: "var(--butter)", emoji: "📖" },
  { slug: "bahasa-arab-pemula", title: "Bahasa Arab buat yang Gak Punya Background", excerpt: "Mulai dari huruf, kosakata sehari-hari, sampai paham 70% kata di Qur'an.", description: "", category: "Bahasa Arab", level: "Pemula", format: "Live Zoom", instructor: "Ustadzah Mariam Salim", lessons: 20, duration: "8 minggu", students: 620, rating: 4.8, reviews: 156, priceCents: 349000, originalPriceCents: 449000, tag: "", tags: ["bahasa-arab", "pemula"], featured: false, image: null, batch: "Batch #4", startDate: "22 Juni 2026", startDay: "Ahad", schedule: "Ahad, 09:00–11:00 WIB", platform: "Zoom + worksheet PDF", slots: 40, slotsTaken: 12, statusDetail: "open", color: "var(--coral)", emoji: "🔤" },
  { slug: "bisnis-muslim", title: "Bisnis Muamalah: Halal, Berkah, Cuan", excerpt: "Bangun bisnis tanpa riba, tanpa gharar. Studi kasus real dari pengusaha muslim Indonesia.", description: "", category: "Bisnis Muslim", level: "Menengah", format: "Live Zoom", instructor: "Erick Yusuf", lessons: 10, duration: "3 minggu", students: 540, rating: 4.7, reviews: 102, priceCents: 449000, originalPriceCents: 0, tag: "baru", tags: ["bisnis", "early-bird"], featured: true, image: null, batch: "Batch #1", startDate: "1 Juli 2026", startDay: "Selasa", schedule: "Selasa & Jum'at, 20:00–21:30 WIB", platform: "Zoom + studi kasus real", slots: 60, slotsTaken: 8, statusDetail: "early-bird", color: "var(--sage)", emoji: "💼" },
  { slug: "sholat-khusyu", title: "Sholat Khusyu' untuk yang Sibuk", excerpt: "Workshop 6 sesi video: persiapan, fokus, dan after-sholat. Cocok untuk pekerja & mahasiswa.", description: "", category: "Ibadah Harian", level: "Semua level", format: "On-demand", instructor: "Ust. Hanan Attaki", lessons: 6, duration: "Akses seumur hidup", students: 2100, rating: 4.9, reviews: 487, priceCents: 0, originalPriceCents: 0, tag: "gratis", tags: ["sholat", "gratis"], featured: true, image: null, batch: "", startDate: "", startDay: "", schedule: "", platform: "", slots: 0, slotsTaken: 0, statusDetail: "", color: "var(--lilac)", emoji: "🕌" },
  { slug: "muslimah-confident", title: "Muslimah Strong & Tenang", excerpt: "Khusus perempuan — soal self-worth, hijab, hubungan, dan tanggung jawab di era sekarang.", description: "", category: "Muslimah", level: "Semua level", format: "Hybrid", instructor: "Ust. Oki Setiana Dewi", lessons: 12, duration: "4 minggu", students: 1820, rating: 4.9, reviews: 401, priceCents: 279000, originalPriceCents: 0, tag: "", tags: ["muslimah", "live"], featured: false, image: null, batch: "Batch #5", startDate: "28 Juni 2026", startDay: "Sabtu", schedule: "Sabtu 14:00 WIB (live) + video on-demand", platform: "Zoom · khusus perempuan", slots: 100, slotsTaken: 67, statusDetail: "open", color: "var(--peach)", emoji: "🌸" },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@muslimhebat.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Admin Muslim Hebat", passwordHash }
  });

  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: { value: { palette: "cool", density: "cozy", font: "grotesk", illustrations: true } },
    create: { key: "theme", value: { palette: "cool", density: "cozy", font: "grotesk", illustrations: true } }
  });

  await prisma.siteSetting.upsert({
    where: { key: "home" },
    update: { value: homePageValue },
    create: { key: "home", value: homePageValue }
  });


  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: a,
      create: { ...a, status: "PUBLISHED", publishedAt: new Date() }
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, status: "PUBLISHED" }
    });
  }

  for (const k of kajian) {
    await prisma.kajianEvent.upsert({
      where: { slug: k.slug },
      update: k,
      create: { ...k, status: "PUBLISHED" }
    });
  }

  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: { ...c, status: "PUBLISHED" }
    });
  }

  // Seed Testimonials
  const testimonials = [
    { name: "Rina, 27", role: "Mahasiswa S2", text: "Awalnya cuma bisa baca alif-ba-ta. Sekarang udah hampir hatam juz 30. Pak Ustadnya sabar banget.", color: "var(--peach)", targetType: "class" },
    { name: "Faiz, 34", role: "Bapak 2 anak", text: "Workshop parentingnya bener-bener bantu pas anak pertama mulai sholat. Gak melulu teori, banyak studi kasus real.", color: "var(--sage)", targetType: "class" },
    { name: "Bunda Sari", role: "IRT", text: "Suka bgt kelas khusyu' sholatnya — singkat tapi praktis. Bisa diulang-ulang kapan aja. Worth it!", color: "var(--lilac)", targetType: "class" },
    { name: "Sarah, 24", role: "Mahasiswi", text: "Jurnal Ramadhannya bener-bener nempel banget sama anak muda. Gak menggurui, dan layoutnya cantik!", color: "var(--peach)", targetType: "product" },
    { name: "Faiz, 31", role: "Karyawan", text: "Beli template Notion-nya, sekarang doa harian gampang dibuka pas jeda kerja. Worth it banget.", color: "var(--sage)", targetType: "product" },
    { name: "Bunda Lia", role: "Ibu rumah tangga", text: "E-book parentingnya santai, gak bikin guilty. Suka banget gaya bahasa muslim hebat.", color: "var(--lilac)", targetType: "product" },
  ];

  await prisma.testimonial.deleteMany(); // Clear first
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // Seed Comments
  const mainArticle = await prisma.article.findUnique({ where: { slug: "hal-kecil-bikin-tenang" } });
  if (mainArticle) {
    await prisma.comment.deleteMany({ where: { articleId: mainArticle.id } }); // Clear comments on this article
    const comments = [
      { name: "Rina", text: "Yang nomor 2 ngena banget. Sering banget ngerasa berat sholat, padahal pas wudhu aja, mood udah lumayan.", articleId: mainArticle.id },
      { name: "Faiz", text: "Suka banget gaya nulisnya — santai tapi nendang. Lanjut bikin yang serupa dong!", articleId: mainArticle.id },
      { name: "Bunda Lia", text: "Aku praktekin yang nomor 3 minggu lalu — beneran works. Kerjaan rumah jadi gak overwhelming.", articleId: mainArticle.id },
    ];
    for (const cm of comments) {
      await prisma.comment.create({ data: cm });
    }
  }

  console.log(`Seeded admin: ${email}, ${articles.length} articles, ${products.length} products, ${kajian.length} kajian, ${courses.length} courses, ${testimonials.length} testimonials`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
