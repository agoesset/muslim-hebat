const STORAGE_KEY = "muslim-hebat:saved-articles";
const VERSION = 1;

function readPayload(storage = localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
    if (parsed?.version === VERSION && Array.isArray(parsed.articles)) return parsed;
  } catch { return { version: VERSION, articles: [] }; }
  return { version: VERSION, articles: [] };
}

export function getSavedArticles(storage) {
  return readPayload(storage).articles;
}

export function isArticleSaved(slug, storage) {
  return getSavedArticles(storage).some((article) => article.slug === slug);
}

export function toggleSavedArticle(article, storage = localStorage) {
  const payload = readPayload(storage);
  const exists = payload.articles.some((item) => item.slug === article.slug);
  payload.articles = exists
    ? payload.articles.filter((item) => item.slug !== article.slug)
    : [{ id: article.id, slug: article.slug, title: article.title, excerpt: article.excerpt, category: article.category || article.cat, coverImage: article.coverImage, savedAt: new Date().toISOString() }, ...payload.articles];
  try { storage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch { /* storage unavailable */ }
  return !exists;
}

export const savedArticlesStorageKey = STORAGE_KEY;
