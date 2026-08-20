import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { PrismaService } from "../prisma.service";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";
import {
  ApproveCommentDto,
  CommentDto,
  ContentDto,
  CourseDto,
  KajianEventDto,
  ProductDto,
  TestimonialDto,
  UpdateContentDto,
  UpdateCourseDto,
  UpdateKajianEventDto,
  UpdateProductDto,
  UpdateTestimonialDto
} from "./content.dto";

const publishedWhere = { status: "PUBLISHED" as const };
const orderByUpdated = { updatedAt: "desc" as const };
const MAX_TAKE = 50;

function parseNumber(value?: string) {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function parseTake(value?: string) {
  const n = parseNumber(value);
  if (n === undefined) return MAX_TAKE;
  return Math.min(Math.max(n, 0), MAX_TAKE);
}

function parseSkip(value?: string) {
  const n = parseNumber(value);
  if (n === undefined) return 0;
  return Math.max(n, 0);
}

function buildSearchWhere(search?: string, fields: string[] = ["title", "excerpt"]) {
  if (!search) return undefined;
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" as const }
    }))
  };
}

@Controller()
@UseInterceptors(AuditInterceptor)
export class ContentController {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Public Articles ─────────────────────────────────────────────────

  @Get("public/articles")
  articles(
    @Query("featured") featured?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
    @Query("offset") offset?: string
  ) {
    const where: any = { ...publishedWhere };
    if (featured === "true") where.featured = true;
    const searchWhere = buildSearchWhere(search, ["title", "excerpt"]);
    if (searchWhere) where.OR = searchWhere.OR;

    return this.prisma.article.findMany({
      where,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("public/articles/:slug")
  async article(@Param("slug") slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, ...publishedWhere }
    });
    if (!article) throw new NotFoundException("Article not found");

    await this.prisma.article.update({
      where: { id: article.id },
      data: { reads: { increment: 1 } }
    });

    return article;
  }

  @Post("public/articles/:slug/clap")
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async clapArticle(@Param("slug") slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, ...publishedWhere }
    });
    if (!article) throw new NotFoundException("Article not found");

    return this.prisma.article.update({
      where: { id: article.id },
      data: { claps: { increment: 1 } }
    });
  }

  @Get("public/articles/:slug/comments")
  async articleComments(@Param("slug") slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, ...publishedWhere },
      select: { id: true }
    });
    if (!article) throw new NotFoundException("Article not found");

    return this.prisma.comment.findMany({
      where: { articleId: article.id, parentId: null, approved: true },
      orderBy: { createdAt: "desc" }
    });
  }

  @Post("public/articles/:slug/comments")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async createComment(@Param("slug") slug: string, @Body() dto: CommentDto) {
    const article = await this.prisma.article.findFirst({
      where: { slug, ...publishedWhere },
      select: { id: true }
    });
    if (!article) throw new NotFoundException("Article not found");

    return this.prisma.comment.create({
      data: {
        articleId: article.id,
        name: dto.name,
        text: dto.text,
        parentId: dto.parentId ?? null,
        approved: false
      }
    });
  }

  @Get("public/search")
  async search(@Query("q") q?: string) {
    const query = (q || "").trim();
    if (query.length < 2) {
      return { articles: [], products: [], kajian: [], courses: [] };
    }

    const selectCard = { id: true, slug: true, excerpt: true, emoji: true };
    const [articles, products, kajian, courses] = await Promise.all([
      this.prisma.article.findMany({
        where: { ...publishedWhere, ...buildSearchWhere(query, ["title", "excerpt"]) },
        take: 5,
        orderBy: orderByUpdated,
        select: { ...selectCard, title: true }
      }),
      this.prisma.product.findMany({
        where: { ...publishedWhere, ...buildSearchWhere(query, ["name", "excerpt"]) },
        take: 5,
        orderBy: orderByUpdated,
        select: { ...selectCard, name: true }
      }),
      this.prisma.kajianEvent.findMany({
        where: { ...publishedWhere, ...buildSearchWhere(query, ["title", "excerpt"]) },
        take: 5,
        orderBy: { startsAt: "asc" },
        select: { id: true, slug: true, title: true, excerpt: true, speaker: true, location: true }
      }),
      this.prisma.course.findMany({
        where: { ...publishedWhere, ...buildSearchWhere(query, ["title", "excerpt"]) },
        take: 5,
        orderBy: orderByUpdated,
        select: { ...selectCard, title: true, instructor: true, category: true }
      })
    ]);

    return { articles, products, kajian, courses };
  }

  // ─── Public Products ─────────────────────────────────────────────────

  @Get("public/products")
  products(
    @Query("featured") featured?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
    @Query("offset") offset?: string
  ) {
    const where: any = { ...publishedWhere };
    if (featured === "true") where.featured = true;
    const searchWhere = buildSearchWhere(search, ["name", "excerpt"]);
    if (searchWhere) where.OR = searchWhere.OR;

    return this.prisma.product.findMany({
      where,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("public/products/:slug")
  async product(@Param("slug") slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, ...publishedWhere }
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  // ─── Public Kajian ───────────────────────────────────────────────────

  @Get("public/kajian")
  kajian(
    @Query("featured") featured?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
    @Query("offset") offset?: string
  ) {
    const where: any = { ...publishedWhere };
    if (featured === "true") where.featured = true;
    const searchWhere = buildSearchWhere(search, ["title", "excerpt"]);
    if (searchWhere) where.OR = searchWhere.OR;

    return this.prisma.kajianEvent.findMany({
      where,
      orderBy: { startsAt: "asc" },
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("public/kajian/:slug")
  async kajianBySlug(@Param("slug") slug: string) {
    const event = await this.prisma.kajianEvent.findFirst({
      where: { slug, ...publishedWhere }
    });
    if (!event) throw new NotFoundException("Kajian not found");
    return event;
  }

  // ─── Public Classes ──────────────────────────────────────────────────

  @Get("public/classes")
  classes(
    @Query("featured") featured?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
    @Query("offset") offset?: string
  ) {
    const where: any = { ...publishedWhere };
    if (featured === "true") where.featured = true;
    const searchWhere = buildSearchWhere(search, ["title", "excerpt"]);
    if (searchWhere) where.OR = searchWhere.OR;

    return this.prisma.course.findMany({
      where,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("public/classes/:slug")
  async classBySlug(@Param("slug") slug: string) {
    const course = await this.prisma.course.findFirst({
      where: { slug, ...publishedWhere }
    });
    if (!course) throw new NotFoundException("Class not found");
    return course;
  }

  // ─── Public Testimonials ─────────────────────────────────────────────

  @Get("public/testimonials")
  testimonials(
    @Query("targetType") targetType?: string,
    @Query("targetId") targetId?: string
  ) {
    const where: any = {};
    if (targetType) where.targetType = targetType;
    if (targetId) where.targetId = targetId;

    return this.prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
  }

  // ─── Admin Articles ────────────────────────────────────────────────────

  @Get("admin/articles")
  @UseGuards(AdminAuthGuard)
  adminArticles(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("q") q?: string
  ) {
    return this.prisma.article.findMany({
      where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] } : undefined,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("admin/articles/:id")
  @UseGuards(AdminAuthGuard)
  async getArticle(@Param("id") id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException("Article not found");
    return article;
  }

  @Post("admin/articles")
  @UseGuards(AdminAuthGuard)
  createArticle(@Body() dto: ContentDto) {
    return this.prisma.article.create({ data: normalizeArticle(dto) as any });
  }

  @Patch("admin/articles/:id")
  @UseGuards(AdminAuthGuard)
  updateArticle(@Param("id") id: string, @Body() dto: UpdateContentDto) {
    return this.prisma.article.update({ where: { id }, data: normalizeArticle(dto) as any });
  }

  @Delete("admin/articles/:id")
  @UseGuards(AdminAuthGuard)
  deleteArticle(@Param("id") id: string) {
    return this.prisma.article.delete({ where: { id } });
  }

  // ─── Admin Products ──────────────────────────────────────────────────

  @Get("admin/products")
  @UseGuards(AdminAuthGuard)
  adminProducts(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("q") q?: string
  ) {
    return this.prisma.product.findMany({
      where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] } : undefined,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("admin/products/:id")
  @UseGuards(AdminAuthGuard)
  async getProduct(@Param("id") id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  @Post("admin/products")
  @UseGuards(AdminAuthGuard)
  createProduct(@Body() dto: ProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  @Patch("admin/products/:id")
  @UseGuards(AdminAuthGuard)
  updateProduct(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  @Delete("admin/products/:id")
  @UseGuards(AdminAuthGuard)
  deleteProduct(@Param("id") id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  // ─── Admin Kajian ────────────────────────────────────────────────────

  @Get("admin/kajian")
  @UseGuards(AdminAuthGuard)
  adminKajian(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("q") q?: string
  ) {
    return this.prisma.kajianEvent.findMany({
      where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }, { speaker: { contains: q, mode: "insensitive" } }] } : undefined,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("admin/kajian/:id")
  @UseGuards(AdminAuthGuard)
  async getKajian(@Param("id") id: string) {
    const event = await this.prisma.kajianEvent.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Kajian not found");
    return event;
  }

  @Post("admin/kajian")
  @UseGuards(AdminAuthGuard)
  createKajian(@Body() dto: KajianEventDto) {
    return this.prisma.kajianEvent.create({ data: normalizeKajian(dto) as any });
  }

  @Patch("admin/kajian/:id")
  @UseGuards(AdminAuthGuard)
  updateKajian(@Param("id") id: string, @Body() dto: UpdateKajianEventDto) {
    return this.prisma.kajianEvent.update({ where: { id }, data: normalizeKajian(dto) as any });
  }

  @Delete("admin/kajian/:id")
  @UseGuards(AdminAuthGuard)
  deleteKajian(@Param("id") id: string) {
    return this.prisma.kajianEvent.delete({ where: { id } });
  }

  // ─── Admin Classes ───────────────────────────────────────────────────

  @Get("admin/classes")
  @UseGuards(AdminAuthGuard)
  adminClasses(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("q") q?: string
  ) {
    return this.prisma.course.findMany({
      where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }, { instructor: { contains: q, mode: "insensitive" } }] } : undefined,
      orderBy: orderByUpdated,
      take: parseTake(limit),
      skip: parseSkip(offset)
    });
  }

  @Get("admin/classes/:id")
  @UseGuards(AdminAuthGuard)
  async getClass(@Param("id") id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException("Class not found");
    return course;
  }

  @Post("admin/classes")
  @UseGuards(AdminAuthGuard)
  createClass(@Body() dto: CourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  @Patch("admin/classes/:id")
  @UseGuards(AdminAuthGuard)
  updateClass(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  @Delete("admin/classes/:id")
  @UseGuards(AdminAuthGuard)
  deleteClass(@Param("id") id: string) {
    return this.prisma.course.delete({ where: { id } });
  }

  // ─── Admin Comments ──────────────────────────────────────────────────

  @Get("admin/comments")
  @UseGuards(AdminAuthGuard)
  adminComments() {
    return this.prisma.comment.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Patch("admin/comments/:id")
  @UseGuards(AdminAuthGuard)
  updateComment(@Param("id") id: string, @Body() dto: ApproveCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: { approved: dto.approved ?? true }
    });
  }

  @Delete("admin/comments/:id")
  @UseGuards(AdminAuthGuard)
  deleteComment(@Param("id") id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }

  @Get("admin/stats")
  @UseGuards(AdminAuthGuard)
  async adminStats() {
    const [articles, products, kajian, classes, subscribers, unreadMessages, comments] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.product.count(),
      this.prisma.kajianEvent.count(),
      this.prisma.course.count(),
      this.prisma.subscriber.count(),
      this.prisma.contactMessage.count({ where: { read: false } }),
      this.prisma.comment.count()
    ]);
    return { articles, products, kajian, classes, subscribers, unreadMessages, comments };
  }

  // ─── Admin Testimonials ──────────────────────────────────────────────

  @Get("admin/testimonials")
  @UseGuards(AdminAuthGuard)
  adminTestimonials() {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post("admin/testimonials")
  @UseGuards(AdminAuthGuard)
  createTestimonial(@Body() dto: TestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  @Patch("admin/testimonials/:id")
  @UseGuards(AdminAuthGuard)
  updateTestimonial(@Param("id") id: string, @Body() dto: UpdateTestimonialDto) {
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  @Delete("admin/testimonials/:id")
  @UseGuards(AdminAuthGuard)
  deleteTestimonial(@Param("id") id: string) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}

function normalizeArticle(dto: Partial<ContentDto>) {
  return {
    ...dto,
    publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined
  };
}

function normalizeKajian(dto: Partial<KajianEventDto>) {
  return {
    ...dto,
    startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined
  };
}
