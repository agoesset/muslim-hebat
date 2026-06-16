import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

const publishedWhere = { status: "PUBLISHED" as const };

@Controller()
export class HomeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("public/home")
  async home() {
    const [articles, products, events, classes, settings] = await Promise.all([
      this.prisma.article.findMany({ where: publishedWhere, orderBy: { updatedAt: "desc" }, take: 5 }),
      this.prisma.product.findMany({ where: publishedWhere, orderBy: { updatedAt: "desc" }, take: 5 }),
      this.prisma.kajianEvent.findMany({ where: publishedWhere, orderBy: { startsAt: "asc" }, take: 3 }),
      this.prisma.course.findMany({ where: publishedWhere, orderBy: { updatedAt: "desc" }, take: 6 }),
      this.prisma.siteSetting.findMany()
    ]);

    const toObject = (arr: { key: string; value: any }[]) => {
      const obj: Record<string, any> = {};
      for (const item of arr) {
        try {
          obj[item.key] = typeof item.value === "object" ? item.value : JSON.parse(item.value as string);
        } catch {
          obj[item.key] = item.value;
        }
      }
      return obj;
    };

    return {
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
      },
      articles,
      products,
      events,
      classes,
      settings: toObject(settings)
    };
  }
}
