import { Controller, Get, Header } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

const SITE_URL = "https://muslimhebat.com";

@Controller()
export class SitemapController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("sitemap.xml")
  @Header("content-type", "application/xml")
  async sitemap() {
    const [articles, products, kajian, courses] = await Promise.all([
      this.prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      this.prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      this.prisma.kajianEvent.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      this.prisma.course.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);

    const staticPages = [
      { loc: "", priority: "1.0", changefreq: "daily" },
      { loc: "/bacaan", priority: "0.9", changefreq: "daily" },
      { loc: "/kelas", priority: "0.8", changefreq: "weekly" },
      { loc: "/produk", priority: "0.8", changefreq: "weekly" },
      { loc: "/kajian", priority: "0.9", changefreq: "weekly" },
      { loc: "/kontak", priority: "0.4", changefreq: "monthly" },
    ];

    const urlTags = [
      ...staticPages.map(p => url(p.loc, undefined, p.changefreq, p.priority)),
      ...articles.map(a => url(`/bacaan/${a.slug}`, a.updatedAt, "weekly", "0.6")),
      ...products.map(p => url(`/produk/${p.slug}`, p.updatedAt, "weekly", "0.6")),
      ...kajian.map(k => url(`/kajian/${k.slug}`, k.updatedAt, "weekly", "0.6")),
      ...courses.map(c => url(`/kelas/${c.slug}`, c.updatedAt, "weekly", "0.6")),
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags.join("\n")}
</urlset>`;
  }

  @Get("rss.xml")
  @Header("content-type", "application/xml")
  async rss() {
    const articles = await this.prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    const items = articles.map(a => {
      const link = `${SITE_URL}/bacaan/${a.slug}`;
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date(a.createdAt).toUTCString();
      const desc = (a.excerpt || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const title = (a.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const author = (a.author || "").replace(/&/g, "&amp;");
      const cat = (a.category || "").replace(/&/g, "&amp;");
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
      <author>${author}</author>
      <category>${cat}</category>
    </item>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Muslim Hebat</title>
    <link>${SITE_URL}</link>
    <description>Bacaan ringan tentang Islam, self-growth, parenting, dan ibadah harian. Tumbuh bareng, yuk!</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon.svg</url>
      <title>Muslim Hebat</title>
      <link>${SITE_URL}</link>
      <width>64</width>
      <height>64</height>
    </image>
${items.join("\n")}
  </channel>
</rss>`;
  }

  @Get("robots.txt")
  @Header("content-type", "text/plain")
  robots() {
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  }
}

function url(loc: string, lastmod?: Date, changefreq = "weekly", priority = "0.5") {
  const parts = [`  <url>\n    <loc>${SITE_URL}${loc}</loc>`];
  if (lastmod) parts.push(`\n    <lastmod>${lastmod.toISOString()}</lastmod>`);
  parts.push(`\n    <changefreq>${changefreq}</changefreq>`);
  parts.push(`\n    <priority>${priority}</priority>`);
  parts.push("\n  </url>");
  return parts.join("");
}
