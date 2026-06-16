import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getArticles,
  getArticle,
  getProducts,
  getProduct,
  getKajian,
  getKajianBySlug,
  getClasses,
  getClass,
  subscribe,
  getTestimonials
} from "./public.js";

vi.mock("../api.js", () => ({
  api: vi.fn()
}));

import { api } from "../api.js";

const mockArticle = {
  id: "article-1",
  slug: "test-article",
  title: "Test Article",
  excerpt: "Test excerpt",
  body: "Test body",
  category: "Self-growth",
  author: "Tester",
  color: "var(--peach)",
  emoji: "📝",
  readingTime: 5,
  reads: 100,
  claps: 10,
  tags: ["test", "self-care"],
  featured: true,
  coverImage: null,
  status: "PUBLISHED",
  publishedAt: "2026-05-20T00:00:00Z",
  createdAt: "2026-05-20T00:00:00Z"
};

const mockProduct = {
  id: "product-1",
  slug: "test-product",
  name: "Test Product",
  excerpt: "Test excerpt",
  description: "Test description",
  category: "Worksheet",
  priceCents: 39000,
  originalPriceCents: 59000,
  rating: 4.9,
  sold: 1240,
  tags: ["ramadhan", "tracker"],
  featured: true,
  image: null,
  color: "var(--peach)",
  emoji: "📓",
  status: "PUBLISHED"
};

const mockKajian = {
  id: "kajian-1",
  slug: "test-kajian",
  title: "Test Kajian",
  excerpt: "Test excerpt",
  description: "Test description",
  speaker: "Ust. Test",
  location: "Jakarta",
  eventType: "Offline",
  startsAt: "2026-05-22T11:10:00.000Z",
  color: "var(--sage)",
  tags: ["tafsir", "offline"],
  featured: true,
  coverImage: null,
  status: "PUBLISHED"
};

const mockCourse = {
  id: "course-1",
  slug: "test-course",
  title: "Test Course",
  excerpt: "Test excerpt",
  description: "Test description",
  category: "Tahsin",
  level: "Pemula",
  format: "Live Zoom",
  priceCents: 249000,
  originalPriceCents: 399000,
  duration: "4 minggu",
  instructor: "Ust. Test",
  rating: 5.0,
  students: 480,
  reviews: 124,
  image: null,
  color: "var(--sage)",
  tags: ["tahsin", "pemula"],
  featured: true,
  status: "PUBLISHED"
};

describe("public API helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getArticles", () => {
    it("should fetch and map articles", async () => {
      api.mockResolvedValue([mockArticle]);

      const result = await getArticles();

      expect(api).toHaveBeenCalledWith("/public/articles?");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("test-article");
      expect(result[0].cat).toBe("Self-growth");
      expect(result[0].reads).toBe(100);
      expect(result[0].claps).toBe(10);
      expect(result[0].featured).toBe(true);
    });

    it("should pass featured and limit params", async () => {
      api.mockResolvedValue([]);

      await getArticles({ featured: true, limit: 5 });

      expect(api).toHaveBeenCalledWith("/public/articles?featured=true&limit=5");
    });
  });

  describe("getArticle", () => {
    it("should fetch and map a single article", async () => {
      api.mockResolvedValue(mockArticle);

      const result = await getArticle("test-article");

      expect(api).toHaveBeenCalledWith("/public/articles/test-article");
      expect(result.slug).toBe("test-article");
      expect(result.tags).toEqual(["test", "self-care"]);
    });
  });

  describe("getProducts", () => {
    it("should fetch and map products", async () => {
      api.mockResolvedValue([mockProduct]);

      const result = await getProducts();

      expect(api).toHaveBeenCalledWith("/public/products?");
      expect(result[0].name).toBe("Test Product");
      expect(result[0].price).toBe(39000);
      expect(result[0].rating).toBe(4.9);
    });
  });

  describe("getProduct", () => {
    it("should fetch a single product by slug", async () => {
      api.mockResolvedValue(mockProduct);

      const result = await getProduct("test-product");

      expect(api).toHaveBeenCalledWith("/public/products/test-product");
      expect(result.slug).toBe("test-product");
    });
  });

  describe("getKajian", () => {
    it("should fetch and map kajian events", async () => {
      api.mockResolvedValue([mockKajian]);

      const result = await getKajian();

      expect(api).toHaveBeenCalledWith("/public/kajian?");
      expect(result[0].title).toBe("Test Kajian");
      expect(result[0].speaker).toBe("Ust. Test");
      expect(result[0].type).toBe("Offline");
    });
  });

  describe("getKajianBySlug", () => {
    it("should fetch a single kajian by slug", async () => {
      api.mockResolvedValue(mockKajian);

      const result = await getKajianBySlug("test-kajian");

      expect(api).toHaveBeenCalledWith("/public/kajian/test-kajian");
      expect(result.slug).toBe("test-kajian");
    });
  });

  describe("getClasses", () => {
    it("should fetch and map courses", async () => {
      api.mockResolvedValue([mockCourse]);

      const result = await getClasses();

      expect(api).toHaveBeenCalledWith("/public/classes?");
      expect(result[0].title).toBe("Test Course");
      expect(result[0].instructor).toBe("Ust. Test");
      expect(result[0].level).toBe("Pemula");
    });
  });

  describe("getClass", () => {
    it("should fetch a single class by slug", async () => {
      api.mockResolvedValue(mockCourse);

      const result = await getClass("test-course");

      expect(api).toHaveBeenCalledWith("/public/classes/test-course");
      expect(result.slug).toBe("test-course");
    });
  });

  describe("subscribe", () => {
    it("should POST subscriber data", async () => {
      api.mockResolvedValue({ email: "test@test.com" });

      const result = await subscribe({ email: "test@test.com", name: "Test", source: "newsletter" });

      expect(api).toHaveBeenCalledWith("/public/subscribers", {
        method: "POST",
        body: JSON.stringify({ email: "test@test.com", name: "Test", source: "newsletter" })
      });
      expect(result).toEqual({ email: "test@test.com" });
    });
  });

  describe("getTestimonials", () => {
    it("should fetch testimonials with params", async () => {
      api.mockResolvedValue([]);

      await getTestimonials({ targetType: "course", targetId: "course-1" });

      expect(api).toHaveBeenCalledWith("/public/testimonials?targetType=course&targetId=course-1");
    });
  });
});
