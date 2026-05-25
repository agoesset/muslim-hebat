export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type UserRole = "ADMIN";

export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category?: string;
  author?: string;
  status: ContentStatus;
  publishedAt?: string | null;
}

export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  excerpt: string;
  priceCents: number;
  status: ContentStatus;
}
