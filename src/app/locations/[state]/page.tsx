import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { states } from "@/lib/content";
import { hasPublishedProviders, searchProviders } from "@/lib/providers";

export function generateStaticParams() { return states.map((state) => ({ state: state.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) return {};
  const hasListings = await hasPublishedProviders({ state: state.code });
  return { title: `Treatment and recovery resources in ${state.name}`, description: `Browse reviewed addiction treatment and recovery resources in ${state.name}.`, alternates: { canonical: `/locations/${state.slug}` }, robots: { index: hasListings, follow: true } };
}

export default async function StatePage({ params, searchParams }: { params: Promise<{ state: string }>; searchParams: Promise<{ page?: string }> }) {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) notFound();
  const query = await searchParams;
  const result = await searchProviders({ state: state.code, page: Math.max(Number.parseInt(query.page || "1", 10) || 1, 1) });
  return <><section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/locations">Locations</Link><span>/</span><span>{state.name}</span></div><h1>Treatment and recovery resources in {state.name}</h1><p>Compare published listings and confirm licensing, services, insurance, and availability directly.</p></div></section><section className="section"><div className="shell">{result.providers.length ? <><div className="results-heading"><div><h2>{result.total.toLocaleString()} listings in {state.name}</h2><p>Showing {result.providers.length} listings on this page.</p></div></div><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname={`/locations/${state.slug}`} page={result.page} totalPages={result.totalPages} /></> : <div className="empty-state"><SearchX size={36} /><h2>No listings published for {state.name} yet</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply">Suggest an organization</Link></div>}</div></section></>;
}
