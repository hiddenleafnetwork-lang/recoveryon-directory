import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getProviderByCanonicalPath, getProviderProfileDetails, getProviderReviewSignals, getProvidersByOrganizationSlug, providerPath } from "@/lib/providers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; location: string }> }): Promise<Metadata> {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) return {};
  return {
    title: `${provider.name} in ${provider.city}, ${provider.state}`,
    description: provider.description || `Review treatment types, services, insurance information, and contact details for ${provider.name}.`,
    alternates: { canonical: providerPath(provider) },
    robots: { index: true, follow: true },
    openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
  };
}

export default async function ProviderLocationPage({ params }: { params: Promise<{ slug: string; location: string }> }) {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) notFound();
  if (provider.organizationLocationCount <= 1) permanentRedirect(providerPath(provider));
  const [organizationProviders, reviewSignals, profileDetails] = await Promise.all([
    getProvidersByOrganizationSlug(slug), getProviderReviewSignals(provider.id), getProviderProfileDetails(provider.id),
  ]);
  return <ProviderDetailPage provider={provider} organizationProviders={organizationProviders} reviewSignals={reviewSignals} profileDetails={profileDetails} />;
}
