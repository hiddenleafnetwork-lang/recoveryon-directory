import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderCard } from "@/components/provider-card";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getProviderByLegacySlug, getProviderReviewSignals, getProvidersByOrganizationSlug, providerPath } from "@/lib/providers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  const providers = await getProvidersByOrganizationSlug(slug);
  if (legacy && legacy.organizationSlug !== slug) return { robots: { index: false, follow: true }, alternates: { canonical: providerPath(legacy) } };
  if (!providers.length) return {};
  if (providers.length === 1) {
    const provider = providers[0];
    return {
      title: `${provider.name} in ${provider.city}, ${provider.state}`,
      description: provider.description || `Review treatment types, services, insurance information, and contact details for ${provider.name}.`,
      alternates: { canonical: providerPath(provider) },
      robots: { index: provider.verificationStatus !== "listed", follow: true },
      openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
    };
  }
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
  if (legacy && legacy.organizationSlug !== slug) permanentRedirect(providerPath(legacy));

  const providers = await getProvidersByOrganizationSlug(slug);
  if (!providers.length) notFound();
  if (providers.length === 1) {
    const reviewSignals = await getProviderReviewSignals(providers[0].id);
    return <ProviderDetailPage provider={providers[0]} organizationProviders={providers} reviewSignals={reviewSignals} />;
  }

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
