export function timeAgo(date: string | Date | number): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  if (diffWeek < 4) return `${diffWeek} minggu lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  return `${diffYear} tahun lalu`;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function stringToColor(str: string): string {
  const colors = [
    "var(--sage)", "var(--peach)", "var(--coral)", "var(--lilac)", "var(--butter)",
    "#B8DDC4", "#FFD6A5", "#FFB4A8", "#D8CCEF", "#F7E4A0",
    "#A8D5BA", "#F0C9A0", "#E8A090", "#C8B8E0", "#E8D490",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/**
 * Normalize an article's read-time for display.
 * DB `readingTime` is an int (minutes); legacy seed rows may only have
 * `time` as a preformatted string ("6 mnt"). Always render "N mnt".
 */
export function formatReadTime(article: { readingTime?: number | null; time?: string | null }): string {
  if (typeof article.readingTime === "number" && article.readingTime > 0) {
    return `${article.readingTime} mnt`;
  }
  return article.time || "5 mnt";
}

/**
 * Human-readable publish date for an article card ("20 Mei 2026").
 * Prefers `publishedAt`, falls back to `createdAt`, then to the legacy
 * preformatted `date` string. Returns "" when nothing usable is present.
 */
export function formatArticleDate(
  article: { publishedAt?: string | Date | null; createdAt?: string | Date | null; date?: string | null }
): string {
  const raw = article.publishedAt || article.createdAt;
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
    }
  }
  return article.date || "";
}

/**
 * Derive a kajian's display date parts (date number / month / day name)
 * from `startsAt` when the denormalized columns are missing
 * (e.g. content created via admin form before denorm was synced).
 */
export function kajianDateParts(
  event: { startsAt?: string | Date | null; date?: number | null; month?: string | null; day?: string | null }
): { date: number | string; month: string; day: string } {
  if (event.date && event.month) {
    return { date: event.date, month: event.month, day: event.day || "" };
  }
  if (event.startsAt) {
    const d = new Date(event.startsAt);
    if (!Number.isNaN(d.getTime())) {
      return {
        date: d.getDate(),
        month: MONTHS_ID[d.getMonth()],
        day: DAYS_ID[d.getDay()].replace("Minggu", "Ahad"),
      };
    }
  }
  return { date: "-", month: "", day: "" };
}
