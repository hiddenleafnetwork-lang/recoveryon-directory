import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderCard } from "@/components/provider-card";
import { getProviderByLegacySlug, getProvidersByOrganizationSlug, providerPath } from "@/lib/providers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  if (legacy) return { robots: { index: false, follow: true }, alternates: { canonical: providerPath(legacy) } };
  const providers = await getProvidersByOrganizationSlug(slug);
  if (!providers.length) return {};
  const name = providers[0].name;
  return {
    title: `${name} locations`,
    description: `View published ${name} locations, services, source details, and verification status on TreatmentLane.`,
    alternates: { canonical: `/providers/${slug}` },
    robots: { index: providers.some((provider) => provider.verificationStatus !== "listed"), follow: true },
  };
}

export default async function OrganizationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  if (legacy) permanentRedirect(providerPath(legacy));

  const providers = await getProvidersByOrganizationSlug(slug);
  if (!providers.length) notFound();
  if (providers.length === 1) permanentRedirect(providerPath(providers[0]));

  return <>
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/directory">Directory</Link><span>/</span><span>{providers[0].name}</span></div>
      <span className="kicker plain">Provider locations</span>
      <h1>{providers[0].name}</h1>
      <p>Compare {providers.length.toLocaleString()} published locations. Each location has its own services, source evidence, and verification status.</p>
    </div></section>
    <section className="section"><div className="shell">
      <div className="provider-list">{providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
    </div></section>
  </>;
}
