import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AdminAuthGuard } from "../auth/auth.guard";
import { ContentDto, CourseDto, KajianEventDto, ProductDto } from "./content.dto";

const publishedWhere = { status: "PUBLISHED" as const };
const orderBy = { updatedAt: "desc" as const };

@Controller()
export class ContentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("public/articles")
  articles() {
    return this.prisma.article.findMany({ where: publishedWhere, orderBy });
  }

  @Get("public/articles/:slug")
  async article(@Param("slug") slug: string) {
    const article = await this.prisma.article.findFirst({ where: { slug, ...publishedWhere } });
    if (!article) throw new NotFoundException("Article not found");
    return article;
  }

  @Get("public/products")
  products() {
    return this.prisma.product.findMany({ where: publishedWhere, orderBy });
  }

  @Get("public/kajian")
  kajian() {
    return this.prisma.kajianEvent.findMany({ where: publishedWhere, orderBy: { startsAt: "asc" } });
  }

  @Get("public/classes")
  classes() {
    return this.prisma.course.findMany({ where: publishedWhere, orderBy });
  }

  @Get("admin/articles")
  @UseGuards(AdminAuthGuard)
  adminArticles() {
    return this.prisma.article.findMany({ orderBy });
  }

  @Post("admin/articles")
  @UseGuards(AdminAuthGuard)
  createArticle(@Body() dto: ContentDto) {
    return this.prisma.article.create({ data: normalizeArticle(dto) as any });
  }

  @Patch("admin/articles/:id")
  @UseGuards(AdminAuthGuard)
  updateArticle(@Param("id") id: string, @Body() dto: Partial<ContentDto>) {
    return this.prisma.article.update({ where: { id }, data: normalizeArticle(dto) as any });
  }

  @Delete("admin/articles/:id")
  @UseGuards(AdminAuthGuard)
  deleteArticle(@Param("id") id: string) {
    return this.prisma.article.delete({ where: { id } });
  }

  @Get("admin/products")
  @UseGuards(AdminAuthGuard)
  adminProducts() {
    return this.prisma.product.findMany({ orderBy });
  }

  @Post("admin/products")
  @UseGuards(AdminAuthGuard)
  createProduct(@Body() dto: ProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  @Patch("admin/products/:id")
  @UseGuards(AdminAuthGuard)
  updateProduct(@Param("id") id: string, @Body() dto: Partial<ProductDto>) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  @Delete("admin/products/:id")
  @UseGuards(AdminAuthGuard)
  deleteProduct(@Param("id") id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  @Get("admin/kajian")
  @UseGuards(AdminAuthGuard)
  adminKajian() {
    return this.prisma.kajianEvent.findMany({ orderBy });
  }

  @Post("admin/kajian")
  @UseGuards(AdminAuthGuard)
  createKajian(@Body() dto: KajianEventDto) {
    return this.prisma.kajianEvent.create({ data: normalizeKajian(dto) as any });
  }

  @Patch("admin/kajian/:id")
  @UseGuards(AdminAuthGuard)
  updateKajian(@Param("id") id: string, @Body() dto: Partial<KajianEventDto>) {
    return this.prisma.kajianEvent.update({ where: { id }, data: normalizeKajian(dto) as any });
  }

  @Delete("admin/kajian/:id")
  @UseGuards(AdminAuthGuard)
  deleteKajian(@Param("id") id: string) {
    return this.prisma.kajianEvent.delete({ where: { id } });
  }

  @Get("admin/classes")
  @UseGuards(AdminAuthGuard)
  adminClasses() {
    return this.prisma.course.findMany({ orderBy });
  }

  @Post("admin/classes")
  @UseGuards(AdminAuthGuard)
  createClass(@Body() dto: CourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  @Patch("admin/classes/:id")
  @UseGuards(AdminAuthGuard)
  updateClass(@Param("id") id: string, @Body() dto: Partial<CourseDto>) {
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  @Delete("admin/classes/:id")
  @UseGuards(AdminAuthGuard)
  deleteClass(@Param("id") id: string) {
    return this.prisma.course.delete({ where: { id } });
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
