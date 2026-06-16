import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

const publishedWhere = { status: "PUBLISHED" as const };

interface CacheData {
  timings: Record<string, string>;
  hijri: {
    day: string;
    month: string;
    year: string;
  };
  fetchedAt: number;
}

@Controller()
export class HomeController {
  private prayerCache: CacheData | null = null;
  private readonly cacheTTL = 12 * 60 * 60 * 1000; // 12 hours

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

    const settingsObj = toObject(settings);
    const dbHome = settingsObj.home || {};

    // Get live prayer and Hijri data
    const prayerData = await this.getLivePrayerData();

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const { nextName, nextTime, nextLabel } = this.calculateNextPrayer(prayerData.timings, currentMinutes);

    const prayerNames = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
    const apiNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    const schedule = prayerNames.map((name, i) => {
      const time = prayerData.timings[apiNames[i]] || "00:00";
      const [h, m] = time.split(":").map(Number);
      const prayMin = h * 60 + m;
      const done = currentMinutes > prayMin;
      const active = name === nextName;
      return { name, time, done, active };
    });

    const formattedGregorianDate = this.getIndonesianDate();
    const hijriDay = prayerData.hijri.day;
    const hijriMonth = this.mapHijriMonth(prayerData.hijri.month);

    return {
      hero: dbHome.hero || {
        pill: "komunitas hangat sejak 2024",
        stat: "+ 12,400 muslim",
        headline: ["Belajar Islam", "tanpa drama", "santai & konsisten."],
        sub: "Bacaan ringan, produk bermanfaat, dan jadwal ngaji bareng yang bikin kamu makin semangat — semua di satu tempat.",
        ctaPrimary: "Lihat produk",
        ctaSecondary: "Baca bacaan terbaru"
      },
      prayer: {
        nextName,
        nextTime,
        nextLabel,
        schedule
      },
      daily: {
        label: dbHome.daily?.label || "hari ini",
        date: formattedGregorianDate,
        stats: [
          { big: hijriDay, sub: "hijriah", tag: `${hijriDay} ${hijriMonth}` },
          { big: `${schedule.filter(s => s.done).length}/5`, sub: "sholat selesai" },
          { big: String(events.length), sub: "ngaji terdekat" }
        ]
      },
      quote: dbHome.quote || {
        label: "quote of the day",
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل Lَّهُ مَخْرَجًا",
        translation: "“Siapa pun yang bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar.”",
        source: "QS. Ath-Thalaq: 2"
      },
      bentoHeader: dbHome.bentoHeader || {
        kicker: "ngalir santai",
        title: "Bekal harian buat hati",
        sub: "Beberapa hal kecil yang bisa kamu lakuin hari ini biar makin dekat sama Allah."
      },
      dzikir: dbHome.dzikir || {
        label: "Dzikir pagi",
        title: "Mulai pagi dengan dzikir ✿",
        items: [
          { txt: "Astaghfirullāh", n: "100×", done: true },
          { txt: "Subhānallāh wa bihamdihi", n: "33×", done: true },
          { txt: "Lā ilāha illallāh wahdahu lā syarīka lah…", n: "10×", done: false },
          { txt: "Allāhumma anta rabbī lā ilāha illā anta…", n: "1×", done: false }
        ]
      },
      community: dbHome.community || {
        label: "komunitas",
        title: "12,400+ teman seperjalanan",
        sub: "Diskusi santai, sharing pengalaman, saling ingetin di Telegram & Discord.",
        colors: ["#FFD6A5", "#A8D8B9", "#FFADAD", "#D8CCEF", "#F7E4A0"],
        cta: "Gabung sekarang"
      },
      reminder: dbHome.reminder || {
        sticker: "jangan lupa!",
        label: "reminder",
        title: "Sudah baca Al-Mulk hari ini?",
        sub: "30 ayat, ± 8 menit. Sunnah sebelum tidur biar dijauhkan dari azab kubur.",
        ctaPrimary: "Baca sekarang",
        ctaSecondary: "Ingetin nanti"
      },
      miniQuote: dbHome.miniQuote || {
        text: "Yang penting jalan terus, gak perlu sempurna — cukup konsisten satu langkah tiap hari.",
        author: "Ustadz Hanan Attaki"
      },
      intention: dbHome.intention || {
        label: "niat hari ini",
        placeholder: "Hari ini aku mau…",
        suggestions: ["sholat tepat waktu", "baca 1 lembar Qur'an", "senyum ke ortu", "sedekah 5rb"]
      },
      articles,
      products,
      events,
      classes,
      settings: settingsObj
    };
  }

  private async getLivePrayerData(): Promise<{ timings: Record<string, string>; hijri: { day: string; month: string; year: string } }> {
    const now = Date.now();
    if (this.prayerCache && now - this.prayerCache.fetchedAt < this.cacheTTL) {
      return this.prayerCache;
    }

    try {
      const response = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=2", {
        signal: AbortSignal.timeout(3000) // 3 seconds timeout
      });

      if (!response.ok) throw new Error(`API returned status ${response.status}`);
      const json = await response.json();

      if (json && json.code === 200 && json.data) {
        const timings = json.data.timings;
        const hijri = {
          day: json.data.date.hijri.day,
          month: json.data.date.hijri.month.en,
          year: json.data.date.hijri.year
        };

        this.prayerCache = { timings, hijri, fetchedAt: now };
        return { timings, hijri };
      }
      throw new Error("Invalid response format");
    } catch (err) {
      console.warn("Failed to fetch live prayer/Hijri data, using fallback", err);
      if (this.prayerCache) {
        return this.prayerCache;
      }
      // Return hardcoded seeded defaults as absolute fallback
      return {
        timings: {
          Fajr: "04:38",
          Dhuhr: "11:52",
          Asr: "15:24",
          Maghrib: "17:58",
          Isha: "19:08"
        },
        hijri: {
          day: "11",
          month: "Dhu al-Qi'dah",
          year: "1447"
        }
      };
    }
  }

  private calculateNextPrayer(timings: Record<string, string>, currentMinutes: number) {
    const prayerNames = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
    const apiNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    let nextIndex = -1;
    let nextMinutes = 1440;

    for (let i = 0; i < apiNames.length; i++) {
      const timeStr = timings[apiNames[i]];
      if (!timeStr) continue;
      const [h, m] = timeStr.split(":").map(Number);
      const prayMin = h * 60 + m;
      if (prayMin > currentMinutes && prayMin < nextMinutes) {
        nextMinutes = prayMin;
        nextIndex = i;
      }
    }

    let nextName = "Subuh";
    let nextTime = timings["Fajr"] || "04:38";
    let diffLabel = "";

    if (nextIndex !== -1) {
      nextName = prayerNames[nextIndex];
      nextTime = timings[apiNames[nextIndex]];
      const diff = nextMinutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      diffLabel = `· ${hours > 0 ? `${hours} jam ` : ""}${mins} menit lagi`;
    } else {
      nextName = "Subuh";
      nextTime = timings["Fajr"] || "04:38";
      const [h, m] = nextTime.split(":").map(Number);
      const subuhMin = h * 60 + m;
      const diff = (1440 - currentMinutes) + subuhMin;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      diffLabel = `· ${hours > 0 ? `${hours} jam ` : ""}${mins} menit lagi`;
    }

    return { nextName, nextTime, nextLabel: diffLabel };
  }

  private getIndonesianDate(): string {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const now = new Date();
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];

    return `${dayName}, ${dateNum} ${monthName}`;
  }

  private mapHijriMonth(monthEn: string): string {
    const mapping: Record<string, string> = {
      "Muharram": "Muharram",
      "Safar": "Safar",
      "Rabi' al-awwal": "Rabi'ul Awwal",
      "Rabi' al-thani": "Rabi'ul Akhir",
      "Jumada al-ula": "Jumadil Awwal",
      "Jumada al-akhirah": "Jumadil Akhir",
      "Rajab": "Rajab",
      "Sha'ban": "Sya'ban",
      "Ramadan": "Ramadhan",
      "Shawwal": "Syawwal",
      "Dhu al-Qi'dah": "Dzul-Q",
      "Dhu al-Hijjah": "Dzul-H",
      "Dhul-Hijjah": "Dzul-H",
      "Dhul-Qa'dah": "Dzul-Q",
      "Dhu al-Qa'dah": "Dzul-Q"
    };
    return mapping[monthEn] || monthEn;
  }
}
