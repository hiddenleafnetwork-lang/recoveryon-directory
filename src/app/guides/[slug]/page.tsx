import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getPublishedArticleBySlug, type ArticleBlock, type ArticleSource } from "@/lib/articles";
import { guides } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { type: "article", title: guide.title, description: guide.description } };
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};
  const image = article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined;
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical: `/guides/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.publishedAt, modifiedTime: article.updatedAt, images: image ? [image] : undefined },
  };
}

function safeSource(source: ArticleSource) {
  try {
    const url = new URL(source.url);
    return url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

const inlineTokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https:\/\/[^\s)]+\)|https:\/\/[^\s)]+)/g;

function sourceLinkLabel(value: string) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    const knownSources: Record<string, string> = {
      "alcoholtreatment.niaaa.nih.gov": "NIAAA source",
      "cms.gov": "CMS source",
      "consumerfinance.gov": "CFPB source",
      "dhcs.ca.gov": "California DHCS source",
      "findtreatment.gov": "FindTreatment.gov source",
      "healthcare.gov": "HealthCare.gov source",
      "medlineplus.gov": "MedlinePlus source",
      "naatp.org": "NAATP source",
    };
    return knownSources[hostname] || `${hostname} source`;
  } catch { return "View source"; }
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(inlineTokenPattern)) {
    const index = match.index ?? 0;
    const token = match[0];
    if (index > cursor) nodes.push(text.slice(cursor, index));
    const key = `${index}-${token.slice(0, 24)}`;
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={key}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={key}>{renderInline(token.slice(1, -1))}</em>);
    } else {
      const markdownLink = token.match(/^\[([^\]]+)]\((https:\/\/[^\s)]+)\)$/);
      const rawHref = markdownLink?.[2] || token;
      const href = markdownLink ? rawHref : rawHref.replace(/[.,;:!?]+$/, "");
      const trailingPunctuation = rawHref.slice(href.length);
      const label = markdownLink?.[1] || sourceLinkLabel(href);
      nodes.push(<a className="article-inline-source" href={href} key={key} rel="noopener noreferrer" target="_blank">{label}</a>);
      if (trailingPunctuation) nodes.push(trailingPunctuation);
    }
    cursor = index + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function numberedListItem(item: string) {
  return item.replace(/^\*\*\d+[.)]\s*/, "**").replace(/^\d+[.)]\s*/, "");
}

function renderBlock(block: ArticleBlock, index: number) {
  if (block.type === "heading" && block.text) return block.level === 3 ? <h3 key={index}>{renderInline(block.text)}</h3> : <h2 key={index}>{renderInline(block.text)}</h2>;
  if (block.type === "paragraph" && block.text) return <p key={index}>{renderInline(block.text)}</p>;
  if (block.type === "callout" && block.text) return <div className="notice" key={index}>{renderInline(block.text)}</div>;
  if (block.type === "list" && block.items?.length) {
    const isNumbered = block.items.every((item) => /^(?:\*\*)?\d+[.)]\s/.test(item));
    const List = isNumbered ? "ol" : "ul";
    return <List className="article-list" key={index}>{block.items.map((item, itemIndex) => <li key={`${itemIndex}-${item.slice(0, 40)}`}>{renderInline(isNumbered ? numberedListItem(item) : item)}</li>)}</List>;
  }
  return null;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) {
    const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, dateModified: guide.reviewedOn, author: { "@type": "Organization", name: "TreatmentLane" }, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) };
    return <><JsonLd data={jsonLd} /><section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/guides">Guides</Link><span>/</span><span>{guide.title}</span></div><span className="kicker plain">Reviewed {new Date(guide.reviewedOn).toLocaleDateString("en-US", { dateStyle: "long" })}</span><h1>{guide.title}</h1><p>{guide.description}</p></div></section><article className="content-shell prose"><div className="notice">Educational information only. Individual circumstances differ, and this guide does not provide medical, legal, or insurance advice.</div>{guide.sections.map((section) => <section key={section.heading}><h2>{renderInline(section.heading)}</h2><p>{renderInline(section.body)}</p></section>)}<h2>Sources and further help</h2><ul>{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></article></>;
  }

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    ...(article.reviewerName ? { reviewedBy: { "@type": "Person", name: article.reviewerName, honorificSuffix: article.reviewerCredentials || undefined } } : {}),
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    image: article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined,
  };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Guides", item: absoluteUrl("/guides") }, { "@type": "ListItem", position: 2, name: article.title, item: absoluteUrl(`/guides/${article.slug}`) }] };
  const faqSchema = article.faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
  const publicationDate = new Date(article.reviewerName ? article.reviewedAt : article.publishedAt).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" });
  const reviewLabel = article.reviewerName ? `Clinically reviewed ${publicationDate}` : `Editorially checked ${publicationDate}`;
  const byline = article.reviewerName
    ? `Written by ${article.authorName}. Reviewed by ${article.reviewerName}${article.reviewerCredentials ? `, ${article.reviewerCredentials}` : ""}.`
    : `Written and source-checked by ${article.authorName}.`;
  return <><JsonLd data={articleSchema} /><JsonLd data={breadcrumbSchema} />{faqSchema ? <JsonLd data={faqSchema} /> : null}<section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/guides">Guides</Link><span>/</span><span>{article.title}</span></div><span className="kicker plain">{reviewLabel}</span><h1>{article.title}</h1><p>{article.excerpt}</p><p className="article-byline">{byline}</p></div></section><article className="content-shell prose">{article.hasThumbnail ? <Image className="article-thumbnail" src={`/api/content/articles/${article.id}/thumbnail`} alt={article.imageAlt} width={1200} height={800} priority /> : null}<div className="notice">Educational information only. This article does not provide a diagnosis or replace advice from a qualified healthcare professional.</div>{article.blocks.map(renderBlock)}{article.faq.length ? <section><h2>Frequently asked questions</h2>{article.faq.map((item) => <div className="article-faq" key={item.question}><h3>{renderInline(item.question)}</h3><p>{renderInline(item.answer)}</p></div>)}</section> : null}<h2>Sources</h2><ul>{article.sources.map((source) => { const href = safeSource(source); return href ? <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{source.title || source.label || source.publisher || href}</a></li> : null; })}</ul></article></>;
}
