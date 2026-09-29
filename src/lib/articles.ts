import "server-only";

import { timingSafeEqual } from "node:crypto";
import { getDatabase } from "@/lib/db";

export type ArticleBlock = {
  type: "heading" | "paragraph" | "list" | "callout";
  text?: string;
  items?: string[];
  level?: 2 | 3;
};

export type ArticleFaq = { question: string; answer: string };
export type ArticleSource = { title?: string; label?: string; url: string; publisher?: string };

export type PublishedArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  authorName: string;
  reviewerName: string;
  reviewerCredentials: string;
  reviewedAt: string;
  publishedAt: string;
  updatedAt: string;
  thumbnailMimeType: string;
  hasThumbnail: boolean;
  imageAlt: string;
  blocks: ArticleBlock[];
  faq: ArticleFaq[];
  sources: ArticleSource[];
  internalLinks: string[];
};

type ArticleRow = Record<string, unknown>;

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapPublishedArticle(row: ArticleRow): PublishedArticle {
  const payload = row.payload && typeof row.payload === "object" ? row.payload as Record<string, unknown> : {};
  return {
    id: text(row.id),
    slug: text(row.slug),
    title: text(row.title),
    excerpt: text(row.excerpt),
    seoTitle: text(row.seo_title),
    metaDescription: text(row.meta_description),
    primaryKeyword: text(row.primary_keyword),
    secondaryKeywords: stringList(row.secondary_keywords),
    category: text(row.category),
    authorName: text(row.author_name, "TreatmentLane Editorial Team"),
    reviewerName: text(row.reviewer_name),
    reviewerCredentials: text(row.reviewer_credentials),
    reviewedAt: new Date(text(row.reviewed_at)).toISOString(),
    publishedAt: new Date(text(row.published_at)).toISOString(),
    updatedAt: new Date(text(row.updated_at)).toISOString(),
    thumbnailMimeType: text(row.thumbnail_mime_type, "image/webp"),
    hasThumbnail: Boolean(row.has_thumbnail),
    imageAlt: text(payload.image_alt, text(row.title)),
    blocks: Array.isArray(payload.article_blocks) ? payload.article_blocks as ArticleBlock[] : [],
    faq: Array.isArray(payload.faq) ? payload.faq as ArticleFaq[] : [],
    sources: Array.isArray(payload.sources) ? payload.sources as ArticleSource[] : [],
    internalLinks: stringList(payload.internal_links),
  };
}

export function isContentApiAuthorized(request: Request) {
  const expected = process.env.TREATMENTLANE_CONTENT_API_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function getPublishedArticleBySlug(slug: string) {
  const sql = getDatabase();
  if (!sql) return null;
  const rows = await sql`select *, thumbnail_base64 is not null as has_thumbnail
    from content_articles where slug = ${slug} and status = 'published' limit 1`;
  return rows[0] ? mapPublishedArticle(rows[0] as ArticleRow) : null;
}

export async function getPublishedArticleSummaries() {
  const sql = getDatabase();
  if (!sql) return [];
  const rows = await sql`select id, slug, title, excerpt, seo_title, meta_description,
    primary_keyword, secondary_keywords, category, author_name, reviewer_name,
    reviewer_credentials, reviewed_at, published_at, updated_at,
    thumbnail_mime_type, thumbnail_base64 is not null as has_thumbnail,
    '{}'::jsonb as payload
    from content_articles where status = 'published' order by published_at desc`;
  return rows.map((row) => mapPublishedArticle(row as ArticleRow));
}

export async function getPublishedArticleThumbnail(id: string) {
  const sql = getDatabase();
  if (!sql) return null;
  const rows = await sql`select thumbnail_base64, thumbnail_mime_type
    from content_articles where id = ${id} and status = 'published' limit 1`;
  if (!rows[0]?.thumbnail_base64) return null;
  return { data: String(rows[0].thumbnail_base64), mimeType: String(rows[0].thumbnail_mime_type || "image/webp") };
}
