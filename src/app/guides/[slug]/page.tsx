import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { type: "article", title: guide.title, description: guide.description } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, dateModified: guide.reviewedOn, author: { "@type": "Organization", name: "TreatmentLane" }, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) };
  return <><JsonLd data={jsonLd} /><section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/guides">Guides</Link><span>/</span><span>{guide.title}</span></div><span className="kicker plain">Reviewed {new Date(guide.reviewedOn).toLocaleDateString("en-US", { dateStyle: "long" })}</span><h1>{guide.title}</h1><p>{guide.description}</p></div></section><article className="content-shell prose"><div className="notice">Educational information only. Individual circumstances differ, and this guide does not provide medical, legal, or insurance advice.</div>{guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<h2>Sources and further help</h2><ul>{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></article></>;
}
