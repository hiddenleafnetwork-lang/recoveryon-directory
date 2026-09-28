import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getProviderByCanonicalPath, providerPath } from "@/lib/providers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; location: string }> }): Promise<Metadata> {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) return {};
  return {
    title: `${provider.name} in ${provider.city}, ${provider.state}`,
    description: provider.description || `Review treatment types, services, insurance information, and contact details for ${provider.name}.`,
    alternates: { canonical: providerPath(provider) },
    robots: { index: provider.verificationStatus !== "listed", follow: true },
    openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
  };
}

export default async function ProviderLocationPage({ params }: { params: Promise<{ slug: string; location: string }> }) {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) notFound();
  return <ProviderDetailPage provider={provider} />;
}
