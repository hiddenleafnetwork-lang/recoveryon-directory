import type { Provider } from "@/lib/types";

type ProviderMetadataCopy = {
  title: string;
  description: string;
};

const lifeStanceCtrLocationSlugs = new Set([
  "lifestance-health-friendswood",
  "lifestance-health-lansing",
  "lifestance-health-millsboro",
  "lifestance-health-moore",
  "lifestance-health-newark-chapel-street",
]);

export function getLifeStanceLocationMetadata(provider: Provider): ProviderMetadataCopy | null {
  if (!lifeStanceCtrLocationSlugs.has(provider.organizationSlug)) return null;
  if (provider.sourceRatingValue === null || provider.sourceRatingCount === null) return null;

  const rating = provider.sourceRatingValue.toFixed(1);
  const reviews = provider.sourceRatingCount.toLocaleString("en-US");

  return {
    title: `LifeStance ${provider.city}: ${rating} from ${reviews} Reviews`,
    description: `See ${provider.name} in ${provider.city}, ${provider.state}, rated ${rating} from ${reviews} reviews. Compare services, insurance details, and contact information.`,
  };
}

export function getLifeStanceOrganizationMetadata(organizationSlug: string, locationCount: number): ProviderMetadataCopy | null {
  if (organizationSlug !== "lifestance-health") return null;

  return {
    title: `LifeStance Health: ${locationCount.toLocaleString("en-US")} Locations and Insurance`,
    description: `Compare ${locationCount.toLocaleString("en-US")} LifeStance Health locations, services, insurance information, source details, and contact options on TreatmentLane.`,
  };
}
