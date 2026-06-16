import { api } from "../api.js";

// ─── Articles ─────────────────────────────────────────────────────────
export async function getArticles(params = {}) {
  const query = new URLSearchParams();
  if (params.featured) query.set("featured", "true");
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.offset) query.set("offset", String(params.offset));
  const data = await api(`/public/articles?${query}`);
  return data.map(mapArticle);
}

export async function getArticle(slug) {
  const data = await api(`/public/articles/${slug}`);
  return mapArticle(data);
}

export async function getArticleComments(slug) {
  return api(`/public/articles/${slug}/comments`);
}

export async function createComment(slug, { name, text }) {
  return api(`/public/articles/${slug}/comments`, {
    method: "POST",
    body: JSON.stringify({ name, text })
  });
}

export async function clapArticle(slug) {
  return api(`/public/articles/${slug}/clap`, { method: "POST" });
}

// ─── Products ─────────────────────────────────────────────────────────
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.featured) query.set("featured", "true");
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  const data = await api(`/public/products?${query}`);
  return data.map(mapProduct);
}

export async function getProduct(slug) {
  const data = await api(`/public/products/${slug}`);
  return mapProduct(data);
}

// ─── Kajian ───────────────────────────────────────────────────────────
export async function getKajian(params = {}) {
  const query = new URLSearchParams();
  if (params.featured) query.set("featured", "true");
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  const data = await api(`/public/kajian?${query}`);
  return data.map(mapKajian);
}

export async function getKajianBySlug(slug) {
  const data = await api(`/public/kajian/${slug}`);
  return mapKajian(data);
}

// ─── Classes ──────────────────────────────────────────────────────────
export async function getClasses(params = {}) {
  const query = new URLSearchParams();
  if (params.featured) query.set("featured", "true");
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  const data = await api(`/public/classes?${query}`);
  return data.map(mapClass);
}

export async function getClass(slug) {
  const data = await api(`/public/classes/${slug}`);
  return mapClass(data);
}

// ─── Testimonials ─────────────────────────────────────────────────────
export async function getTestimonials(params = {}) {
  const query = new URLSearchParams();
  if (params.targetType) query.set("targetType", params.targetType);
  if (params.targetId) query.set("targetId", params.targetId);
  return api(`/public/testimonials?${query}`);
}

// ─── Subscribe ──────────────────────────────────────────────────────────
export async function subscribe({ email, name, source }) {
  return api("/public/subscribers", {
    method: "POST",
    body: JSON.stringify({ email, name, source })
  });
}

// ─── Contact ────────────────────────────────────────────────────────────
export async function submitContact({ name, email, subject, message }) {
  return api("/public/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, subject, message })
  });
}

// ─── Mappers ──────────────────────────────────────────────────────────
function mapArticle(a) {
  const date = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    cat: a.category || "Umum",
    author: a.author || "Muslim Hebat",
    date: `${date.getDate()} ${monthNames[date.getMonth()]}`,
    time: `${a.readingTime || 5} mnt`,
    reads: a.reads || 0,
    claps: a.claps || 0,
    tag: a.tags?.[0] || "",
    emoji: a.emoji || "📝",
    color: a.color || "var(--peach)",
    featured: a.featured || false,
    size: a.featured ? "lg" : "md",
    tags: a.tags || [],
    coverImage: a.coverImage,
    publishedAt: a.publishedAt,
    createdAt: a.createdAt,
    status: a.status
  };
}

function mapProduct(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    excerpt: p.excerpt,
    desc: p.description || p.excerpt,
    cat: p.category || "Umum",
    price: p.priceCents || 0,
    original: p.originalPriceCents || null,
    color: p.color || "var(--peach)",
    emoji: p.emoji || "📦",
    rating: p.rating || 0,
    sold: p.sold || 0,
    tag: p.tags?.[0] || "",
    tags: p.tags || [],
    featured: p.featured || false,
    image: p.image,
    status: p.status
  };
}

function mapKajian(k) {
  const startsAt = k.startsAt ? new Date(k.startsAt) : null;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dayNames = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
  const timeStr = startsAt
    ? `${String(startsAt.getHours()).padStart(2, "0")}.${String(startsAt.getMinutes()).padStart(2, "0")} WIB`
    : "";
  return {
    id: k.id,
    slug: k.slug,
    title: k.title,
    excerpt: k.excerpt,
    description: k.description,
    date: startsAt ? String(startsAt.getDate()) : "",
    month: startsAt ? monthNames[startsAt.getMonth()] : "",
    day: startsAt ? dayNames[startsAt.getDay()] : "",
    speaker: k.speaker || "",
    time: timeStr,
    loc: k.location || "",
    type: k.eventType || "Online",
    cat: k.tags?.[0] || "Umum",
    color: k.color || "var(--sage)",
    tags: k.tags || [],
    featured: k.featured || false,
    attendees: Math.floor(Math.random() * 2000) + 100, // placeholder
    free: true, // placeholder — no price field in kajian yet
    price: "",
    startsAt: k.startsAt,
    status: k.status
  };
}

function mapClass(c) {
  // Map course data to frontend Kelas format with reasonable defaults for missing fields
  const defaultBatch = "Batch #1";
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 14);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dayNames = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
  const startDateStr = `${defaultStart.getDate()} ${monthNames[defaultStart.getMonth()]} ${defaultStart.getFullYear()}`;
  const startDayStr = dayNames[defaultStart.getDay()];

  const isLive = c.format === "Live Zoom" || c.format === "Hybrid";
  const isFree = (c.priceCents || 0) === 0;

  let status = "open";
  if (isFree && c.tags?.includes("gratis")) status = "open";
  else if (c.tags?.includes("baru")) status = "early-bird";
  else if (c.tags?.includes("almost-full")) status = "almost-full";

  return {
    id: c.id,
    slug: c.slug,
    cat: c.category || "Umum",
    color: c.color || "var(--sage)",
    emoji: c.emoji || "📚",
    title: c.title,
    instructor: c.instructor || "Muslim Hebat",
    instructorAvatar: c.color || "var(--peach)",
    lessons: 12, // default
    duration: c.duration || "4 minggu",
    level: c.level || "Semua level",
    students: c.students || 0,
    rating: c.rating || 0,
    reviews: c.reviews || 0,
    price: c.priceCents || 0,
    originalPrice: c.originalPriceCents || null,
    tag: c.tags?.[0] || "",
    format: c.format || "On-demand",
    batch: isLive ? defaultBatch : null,
    startDate: isLive ? startDateStr : null,
    startDay: isLive ? startDayStr : null,
    schedule: isLive ? "Senin & Rabu, 19:30–21:00 WIB" : null,
    platform: isLive ? "Zoom + grup WA" : "Akses seumur hidup",
    slots: isLive ? 50 : null,
    slotsTaken: isLive ? Math.floor(Math.random() * 40) + 5 : null,
    status: status,
    desc: c.description || c.excerpt,
    featured: c.featured || false,
    tags: c.tags || [],
    image: c.image,
    statusDb: c.status
  };
}
