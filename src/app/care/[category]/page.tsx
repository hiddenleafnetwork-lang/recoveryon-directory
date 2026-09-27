import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import { ProviderCard } from "@/components/provider-card";
import { careCategories } from "@/lib/content";
import { getProviders } from "@/lib/providers";

export function generateStaticParams() { return careCategories.map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = careCategories.find((item) => item.slug === slug);
  if (!category) return {};
  const providers = await getProviders();
  const hasListings = providers.some((provider) => provider.categories.includes(category.name));
  return {
    title: `${category.name}: what to know and how to compare options`,
    description: category.description,
    alternates: { canonical: `/care/${category.slug}` },
    robots: { index: hasListings, follow: true },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = careCategories.find((item) => item.slug === slug);
  if (!category) notFound();
  const providers = (await getProviders()).filter((provider) => provider.categories.includes(category.name));
  return <><section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/care">Types of care</Link><span>/</span><span>{category.name}</span></div><h1>{category.name}</h1><p>{category.description}</p></div></section><div className="shell detail-grid"><article className="prose"><h2>What to know</h2><p>{category.guidance}</p><h2>Questions worth asking</h2><ul><li>Who provides clinical oversight, and what credentials do they hold?</li><li>Which services are included, and which are billed separately?</li><li>How are emergencies, transfers, and aftercare handled?</li><li>How can licensing, accreditation, and insurance status be confirmed?</li></ul><div className="notice">TreatmentLane does not determine clinical suitability. Confirm important details directly and seek a professional assessment when appropriate.</div></article><aside className="detail-sidebar"><h2>Explore this category</h2><p>{providers.length} published {providers.length === 1 ? "listing" : "listings"}</p><Link className="button" href={`/directory?category=${encodeURIComponent(category.name)}`}>Search directory</Link></aside></div><section className="section section-tint"><div className="shell">{providers.length ? <div className="provider-list">{providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div> : <div className="empty-state"><SearchX size={36} /><h2>Reviewed listings are being added</h2><p>We will index this page after it contains useful, reviewed organizations.</p><Link className="button" href="/providers/apply">Suggest an organization</Link></div>}</div></section></>;
}
