import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import { ProviderCard } from "@/components/provider-card";
import { states } from "@/lib/content";
import { getProviders } from "@/lib/providers";

export function generateStaticParams() { return states.map((state) => ({ state: state.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) return {};
  const hasListings = (await getProviders()).some((provider) => provider.state === state.code);
  return { title: `Treatment and recovery resources in ${state.name}`, description: `Browse reviewed addiction treatment and recovery resources in ${state.name}.`, alternates: { canonical: `/locations/${state.slug}` }, robots: { index: hasListings, follow: true } };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) notFound();
  const providers = (await getProviders()).filter((provider) => provider.state === state.code);
  return <><section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/locations">Locations</Link><span>/</span><span>{state.name}</span></div><h1>Treatment and recovery resources in {state.name}</h1><p>Compare published listings and confirm licensing, services, insurance, and availability directly.</p></div></section><section className="section"><div className="shell">{providers.length ? <div className="provider-list">{providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div> : <div className="empty-state"><SearchX size={36} /><h2>No reviewed listings published for {state.name} yet</h2><p>This page is intentionally not indexed while the directory team reviews organizations and sources.</p><Link className="button" href="/providers/apply">Suggest an organization</Link></div>}</div></section></>;
}
