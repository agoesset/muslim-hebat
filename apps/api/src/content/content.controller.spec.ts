import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ContentController } from "./content.controller";
import { PrismaService } from "../prisma.service";

const now = new Date();

const mockArticle = {
  id: "article-1",
  slug: "test-article",
  title: "Test Article",
  excerpt: "Test excerpt",
  body: "Test body",
  category: "Test",
  author: "Tester",
  color: "var(--peach)",
  emoji: "📝",
  readingTime: 5,
  reads: 100,
  claps: 10,
  tags: ["test"],
  featured: true,
  coverImage: null,
  status: "PUBLISHED",
  publishedAt: now,
  createdAt: now,
  updatedAt: now
};

const mockProduct = {
  id: "product-1",
  slug: "test-product",
  name: "Test Product",
  excerpt: "Test excerpt",
  description: "Test description",
  category: "Test",
  priceCents: 10000,
  originalPriceCents: 15000,
  rating: 4.5,
  sold: 50,
  tags: ["test"],
  featured: true,
  image: null,
  color: "var(--sage)",
  emoji: "📦",
  status: "PUBLISHED",
  createdAt: now,
  updatedAt: now
};

const mockKajian = {
  id: "kajian-1",
  slug: "test-kajian",
  title: "Test Kajian",
  excerpt: "Test excerpt",
  description: "Test description",
  speaker: "Ust. Test",
  location: "Jakarta",
  eventType: "Online",
  startsAt: now,
  color: "var(--lilac)",
  tags: ["test"],
  featured: true,
  coverImage: null,
  status: "PUBLISHED",
  createdAt: now,
  updatedAt: now
};

const mockCourse = {
  id: "course-1",
  slug: "test-course",
  title: "Test Course",
  excerpt: "Test excerpt",
  description: "Test description",
  category: "Test",
  level: "Pemula",
  format: "Live Zoom",
  priceCents: 249000,
  originalPriceCents: 399000,
  duration: "4 minggu",
  instructor: "Ust. Test",
  rating: 5.0,
  students: 100,
  reviews: 20,
  image: null,
  color: "var(--peach)",
  tags: ["test"],
  featured: true,
  status: "PUBLISHED",
  createdAt: now,
  updatedAt: now
};

const mockComment = {
  id: "comment-1",
  articleId: "article-1",
  name: "Rina",
  text: "Great article!",
  createdAt: now
};

const mockPrisma = {
  article: {
    findMany: jest.fn().mockResolvedValue([mockArticle]),
    findFirst: jest.fn().mockResolvedValue(mockArticle),
    findUnique: jest.fn().mockResolvedValue(mockArticle),
    create: jest.fn().mockResolvedValue(mockArticle),
    update: jest.fn().mockResolvedValue(mockArticle),
    delete: jest.fn().mockResolvedValue(mockArticle),
    count: jest.fn().mockResolvedValue(1)
  },
  product: {
    findMany: jest.fn().mockResolvedValue([mockProduct]),
    findFirst: jest.fn().mockResolvedValue(mockProduct),
    findUnique: jest.fn().mockResolvedValue(mockProduct),
    create: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    delete: jest.fn().mockResolvedValue(mockProduct),
    count: jest.fn().mockResolvedValue(1)
  },
  kajianEvent: {
    findMany: jest.fn().mockResolvedValue([mockKajian]),
    findFirst: jest.fn().mockResolvedValue(mockKajian),
    findUnique: jest.fn().mockResolvedValue(mockKajian),
    create: jest.fn().mockResolvedValue(mockKajian),
    update: jest.fn().mockResolvedValue(mockKajian),
    delete: jest.fn().mockResolvedValue(mockKajian),
    count: jest.fn().mockResolvedValue(1)
  },
  course: {
    findMany: jest.fn().mockResolvedValue([mockCourse]),
    findFirst: jest.fn().mockResolvedValue(mockCourse),
    findUnique: jest.fn().mockResolvedValue(mockCourse),
    create: jest.fn().mockResolvedValue(mockCourse),
    update: jest.fn().mockResolvedValue(mockCourse),
    delete: jest.fn().mockResolvedValue(mockCourse),
    count: jest.fn().mockResolvedValue(1)
  },
  comment: {
    findMany: jest.fn().mockResolvedValue([mockComment]),
    create: jest.fn().mockResolvedValue(mockComment),
    delete: jest.fn().mockResolvedValue(mockComment),
    update: jest.fn().mockResolvedValue({ ...mockComment, approved: true }),
    count: jest.fn().mockResolvedValue(1)
  },
  subscriber: {
    count: jest.fn().mockResolvedValue(3)
  },
  contactMessage: {
    count: jest.fn().mockResolvedValue(2)
  },
  testimonial: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({})
  }
};

describe("ContentController", () => {
  let controller: ContentController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile();

    controller = module.get<ContentController>(ContentController);
  });

  // ─── Public Articles ─────────────────────────────────────────────

  describe("articles (public)", () => {
    it("should return published articles", async () => {
      const result = await controller.articles();

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "PUBLISHED" } })
      );
      expect(result).toEqual([mockArticle]);
    });

    it("should filter featured articles", async () => {
      await controller.articles("true");

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "PUBLISHED", featured: true } })
      );
    });

    it("should limit results", async () => {
      await controller.articles(undefined, "5");

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 })
      );
    });
  });

  describe("article (public by slug)", () => {
    it("should return a published article and increment reads", async () => {
      const result = await controller.article("test-article");

      expect(mockPrisma.article.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: "test-article", status: "PUBLISHED" } })
      );
      expect(mockPrisma.article.update).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ slug: "test-article" }));
    });

    it("should throw NotFoundException when article not found", async () => {
      mockPrisma.article.findFirst.mockResolvedValueOnce(null);

      await expect(controller.article("missing")).rejects.toThrow(NotFoundException);
    });
  });

  describe("relatedArticles", () => {
    const candidate = (id: string, overrides: Record<string, unknown> = {}) => ({
      ...mockArticle,
      id,
      slug: id,
      featured: false,
      ...overrides
    });

    it("returns an array of related articles", async () => {
      const related = { ...mockArticle, id: "article-2", slug: "related" };
      mockPrisma.article.findMany.mockResolvedValueOnce([related]);

      const result = await controller.relatedArticles("test-article");

      expect(result).toEqual([related]);
    });

    it("excludes the source article", async () => {
      await controller.relatedArticles("test-article");

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ id: { not: "article-1" } }) })
      );
    });

    it("queries only published source and candidates", async () => {
      await controller.relatedArticles("test-article");

      expect(mockPrisma.article.findFirst).toHaveBeenCalledWith({
        where: { slug: "test-article", status: "PUBLISHED" }
      });
      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: "PUBLISHED" }) })
      );
    });

    it("prioritizes shared tags before same category", async () => {
      const tagMatch = candidate("tag-match", { category: "Other", tags: ["test"], updatedAt: new Date("2024-01-01") });
      const categoryMatch = candidate("category-match", { category: "Test", tags: [], updatedAt: new Date("2025-01-01") });
      mockPrisma.article.findMany.mockResolvedValueOnce([categoryMatch, tagMatch]);

      const result = await controller.relatedArticles("test-article");

      expect(result).toEqual([tagMatch, categoryMatch]);
    });

    it("fills remaining slots with the newest other articles", async () => {
      const relevant = candidate("relevant", { tags: ["test"], updatedAt: new Date("2023-01-01") });
      const older = candidate("older", { category: "Other", tags: [], updatedAt: new Date("2024-01-01") });
      const newest = candidate("newest", { category: "Other", tags: [], updatedAt: new Date("2025-01-01") });
      mockPrisma.article.findMany.mockResolvedValueOnce([newest, older, relevant]);

      const result = await controller.relatedArticles("test-article");

      expect(result).toEqual([relevant, newest, older]);
    });

    it("does not return duplicate articles", async () => {
      const related = candidate("duplicate");
      mockPrisma.article.findMany.mockResolvedValueOnce([related, related]);

      const result = await controller.relatedArticles("test-article");

      expect(result).toEqual([related]);
    });

    it("returns at most the requested limit", async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce(Array.from({ length: 8 }, (_, index) => candidate(`article-${index + 2}`)));

      const result = await controller.relatedArticles("test-article", "5");

      expect(result).toHaveLength(5);
    });

    it("bounds every candidate query with take", async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce([
        candidate("relevant", { tags: ["test"] })
      ]);

      await controller.relatedArticles("test-article", "5");

      expect(mockPrisma.article.findMany).toHaveBeenCalledTimes(2);
      for (const [query] of mockPrisma.article.findMany.mock.calls) {
        expect(query.take).toEqual(expect.any(Number));
        expect(query.take).toBeGreaterThan(0);
        expect(query.take).toBeLessThanOrEqual(5);
      }
    });

    it.each([["99", 10], ["0", 1]])("clamps limit %s to %d", async (limit, expected) => {
      mockPrisma.article.findMany.mockResolvedValueOnce(Array.from({ length: 12 }, (_, index) => candidate(`article-${index + 2}`)));

      const result = await controller.relatedArticles("test-article", limit);

      expect(result).toHaveLength(expected);
    });

    it("uses the default limit for a non-numeric value", async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce(Array.from({ length: 5 }, (_, index) => candidate(`article-${index + 2}`)));

      const result = await controller.relatedArticles("test-article", "abc");

      expect(result).toHaveLength(3);
    });

    it("throws the exact not-found error for an unknown or draft source", async () => {
      mockPrisma.article.findFirst.mockResolvedValueOnce(null);

      await expect(controller.relatedArticles("missing")).rejects.toMatchObject({
        response: { statusCode: 404, message: "Article not found", error: "Not Found" }
      });
      expect(mockPrisma.article.findMany).not.toHaveBeenCalled();
    });

    it("fills from newest articles when the source has no tags or category", async () => {
      const source = candidate("source", { tags: [], category: null });
      const older = candidate("older", { updatedAt: new Date("2024-01-01") });
      const newer = candidate("newer", { updatedAt: new Date("2025-01-01") });
      mockPrisma.article.findFirst.mockResolvedValueOnce(source);
      mockPrisma.article.findMany.mockResolvedValueOnce([newer, older]);

      const result = await controller.relatedArticles("source");

      expect(result).toEqual([newer, older]);
      expect(mockPrisma.article.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(expect.objectContaining({
        take: 3,
        where: expect.not.objectContaining({ OR: expect.anything() })
      }));
    });

    it("returns an empty array when no other article exists", async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce([]);

      await expect(controller.relatedArticles("test-article")).resolves.toEqual([]);
    });

    it("uses no more than two candidate reads and performs no writes", async () => {
      await controller.relatedArticles("test-article");

      expect(mockPrisma.article.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.article.findMany.mock.calls.length).toBeLessThanOrEqual(2);
      expect(mockPrisma.article.update).not.toHaveBeenCalled();
    });
  });

  describe("clapArticle", () => {
    it("should increment claps for a published article", async () => {
      await controller.clapArticle("test-article");

      expect(mockPrisma.article.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { claps: { increment: 1 } } })
      );
    });

    it("should throw NotFoundException for missing article", async () => {
      mockPrisma.article.findFirst.mockResolvedValueOnce(null);

      await expect(controller.clapArticle("missing")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Public Products ─────────────────────────────────────────────

  describe("products (public)", () => {
    it("should return published products", async () => {
      const result = await controller.products();

      expect(mockPrisma.product.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe("product (public by slug)", () => {
    it("should return a published product", async () => {
      const result = await controller.product("test-product");

      expect(result).toEqual(mockProduct);
    });

    it("should throw NotFoundException when product not found", async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce(null);

      await expect(controller.product("missing")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Public Kajian ───────────────────────────────────────────────

  describe("kajian (public)", () => {
    it("should return published kajian events ordered by startsAt", async () => {
      const result = await controller.kajian();

      expect(mockPrisma.kajianEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { startsAt: "asc" } })
      );
      expect(result).toEqual([mockKajian]);
    });
  });

  describe("kajianBySlug", () => {
    it("should return a published kajian by slug", async () => {
      const result = await controller.kajianBySlug("test-kajian");

      expect(result).toEqual(mockKajian);
    });

    it("should throw NotFoundException when kajian not found", async () => {
      mockPrisma.kajianEvent.findFirst.mockResolvedValueOnce(null);

      await expect(controller.kajianBySlug("missing")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Public Classes ──────────────────────────────────────────────

  describe("classes (public)", () => {
    it("should return published courses", async () => {
      const result = await controller.classes();

      expect(mockPrisma.course.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockCourse]);
    });
  });

  describe("classBySlug", () => {
    it("should return a published course by slug", async () => {
      const result = await controller.classBySlug("test-course");

      expect(result).toEqual(mockCourse);
    });

    it("should throw NotFoundException when course not found", async () => {
      mockPrisma.course.findFirst.mockResolvedValueOnce(null);

      await expect(controller.classBySlug("missing")).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Public Comments ─────────────────────────────────────────────

  describe("articleComments", () => {
    it("should return comments for an article", async () => {
      const result = await controller.articleComments("test-article");

      expect(mockPrisma.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { articleId: "article-1", parentId: null, approved: true } })
      );
      expect(result).toEqual([mockComment]);
    });
  });

  describe("createComment", () => {
    it("should create a comment for an article", async () => {
      const dto = { articleId: "article-1", name: "Budi", text: "Mantap!" };
      const result = await controller.createComment("test-article", dto);

      expect(mockPrisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { articleId: "article-1", name: "Budi", text: "Mantap!", parentId: null, approved: false } })
      );
      expect(result).toEqual(mockComment);
    });
  });

  // ─── Admin Articles ──────────────────────────────────────────────

  describe("adminArticles", () => {
    it("should return all articles (any status)", async () => {
      const result = await controller.adminArticles();

      expect(mockPrisma.article.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockArticle]);
    });
  });

  describe("createArticle (admin)", () => {
    it("should create an article", async () => {
      const dto = {
        slug: "new-article",
        title: "New Article",
        excerpt: "New excerpt",
        body: "Body",
        status: "PUBLISHED" as const,
        publishedAt: now.toISOString()
      };
      await controller.createArticle(dto as any);

      expect(mockPrisma.article.create).toHaveBeenCalled();
    });
  });

  describe("updateArticle (admin)", () => {
    it("should update an article", async () => {
      await controller.updateArticle("article-1", { title: "Updated" } as any);

      expect(mockPrisma.article.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "article-1" } })
      );
    });
  });

  describe("deleteArticle (admin)", () => {
    it("should delete an article", async () => {
      await controller.deleteArticle("article-1");

      expect(mockPrisma.article.delete).toHaveBeenCalledWith({ where: { id: "article-1" } });
    });
  });

  // ─── Admin Products ────────────────────────────────────────────────

  describe("adminProducts", () => {
    it("should return all products", async () => {
      const result = await controller.adminProducts();

      expect(result).toEqual([mockProduct]);
    });
  });

  describe("createProduct (admin)", () => {
    it("should create a product", async () => {
      const dto = { slug: "new-product", name: "New Product", excerpt: "New excerpt" };
      await controller.createProduct(dto as any);

      expect(mockPrisma.product.create).toHaveBeenCalled();
    });
  });

  // ─── Admin Kajian ────────────────────────────────────────────────

  describe("adminKajian", () => {
    it("should return all kajian events", async () => {
      const result = await controller.adminKajian();

      expect(result).toEqual([mockKajian]);
    });
  });

  // ─── Admin Classes ───────────────────────────────────────────────

  describe("adminClasses", () => {
    it("should return all courses", async () => {
      const result = await controller.adminClasses();

      expect(result).toEqual([mockCourse]);
    });
  });

  // ─── Admin Comments ──────────────────────────────────────────────

  describe("adminComments", () => {
    it("should return all comments", async () => {
      const result = await controller.adminComments();

      expect(mockPrisma.comment.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockComment]);
    });
  });

  describe("deleteComment (admin)", () => {
    it("should delete a comment", async () => {
      await controller.deleteComment("comment-1");

      expect(mockPrisma.comment.delete).toHaveBeenCalledWith({ where: { id: "comment-1" } });
    });
  });

  // ─── Admin Testimonials ──────────────────────────────────────────

  describe("search", () => {
    it("returns empty groups when query is too short", async () => {
      const result = await controller.search("a");
      expect(result).toEqual({ articles: [], products: [], kajian: [], courses: [] });
    });

    it("searches products by name instead of title", async () => {
      await controller.search("islam");
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.anything() })
            ])
          })
        })
      );
    });
  });

  describe("publicStats", () => {
    it("returns published counts for every public content type without side effects", async () => {
      mockPrisma.article.count.mockResolvedValueOnce(9);
      mockPrisma.product.count.mockResolvedValueOnce(4);
      mockPrisma.kajianEvent.count.mockResolvedValueOnce(3);

      const result = await controller.publicStats();

      expect(mockPrisma.article.count).toHaveBeenCalledWith({ where: { status: "PUBLISHED" } });
      expect(mockPrisma.product.count).toHaveBeenCalledWith({ where: { status: "PUBLISHED" } });
      expect(mockPrisma.kajianEvent.count).toHaveBeenCalledWith({ where: { status: "PUBLISHED" } });
      expect(result).toEqual({ articles: 9, products: 4, kajian: 3 });
      expect(mockPrisma.article.update).not.toHaveBeenCalled();
      expect(mockPrisma.product.update).not.toHaveBeenCalled();
      expect(mockPrisma.kajianEvent.update).not.toHaveBeenCalled();
    });

    it("returns zero for every content type when no published content exists", async () => {
      mockPrisma.article.count.mockResolvedValueOnce(0);
      mockPrisma.product.count.mockResolvedValueOnce(0);
      mockPrisma.kajianEvent.count.mockResolvedValueOnce(0);

      await expect(controller.publicStats()).resolves.toEqual({
        articles: 0,
        products: 0,
        kajian: 0
      });
    });
  });

  describe("adminStats", () => {
    it("returns aggregate counts", async () => {
      const result = await controller.adminStats();
      expect(result).toEqual({
        articles: 1,
        products: 1,
        kajian: 1,
        classes: 1,
        subscribers: 3,
        unreadMessages: 2,
        comments: 1
      });
    });
  });

  describe("adminTestimonials", () => {
    it("should return all testimonials", async () => {
      await controller.adminTestimonials();

      expect(mockPrisma.testimonial.findMany).toHaveBeenCalled();
    });
  });
});
