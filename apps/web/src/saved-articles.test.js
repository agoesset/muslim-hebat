import { describe, expect, it, beforeEach } from "vitest";
import { getSavedArticles, isArticleSaved, toggleSavedArticle, savedArticlesStorageKey } from "./saved-articles.js";

function memoryStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
    _store: store,
  };
}

const article = { id: "a1", slug: "satu", title: "Satu", excerpt: "Eks", category: "Ibadah", coverImage: null };

describe("saved-articles", () => {
  let storage;
  beforeEach(() => { storage = memoryStorage(); });

  it("starts empty", () => {
    expect(getSavedArticles(storage)).toEqual([]);
  });

  it("toggles an article on then off", () => {
    expect(toggleSavedArticle(article, storage)).toBe(true);
    expect(isArticleSaved("satu", storage)).toBe(true);
    expect(toggleSavedArticle(article, storage)).toBe(false);
    expect(isArticleSaved("satu", storage)).toBe(false);
  });

  it("stores a versioned payload", () => {
    toggleSavedArticle(article, storage);
    const payload = JSON.parse(storage.getItem(savedArticlesStorageKey));
    expect(payload.version).toBe(1);
    expect(payload.articles).toHaveLength(1);
  });

  it("returns a new inserted article first", () => {
    toggleSavedArticle({ ...article, slug: "dua", title: "Dua" }, storage);
    toggleSavedArticle(article, storage);
    expect(getSavedArticles(storage)[0].slug).toBe("satu");
  });

  it("survives a write to a string-based localStorage", () => {
    toggleSavedArticle(article, storage);
    expect(getSavedArticles(storage)).toHaveLength(1);
  });
});
