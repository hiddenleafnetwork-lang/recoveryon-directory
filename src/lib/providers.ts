import "server-only";

import { cache } from "react";
import { getDatabase } from "@/lib/db";
import type { Provider } from "@/lib/types";

type ProviderRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  phone: string | null;
  website: string | null;
  categories: string[] | null;
  levels_of_care: string[] | null;
  insurance: string[] | null;
  license_summary: string | null;
  accreditation: string[] | null;
  last_verified_at: string | null;
  updated_at: string;
  verification_status: Provider["verificationStatus"];
  is_sponsored: boolean;
};

function toProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    address: row.address,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    phone: row.phone,
    website: row.website,
    categories: row.categories || [],
    levelsOfCare: row.levels_of_care || [],
    insurance: row.insurance || [],
    licenseSummary: row.license_summary,
    accreditation: row.accreditation || [],
    lastVerifiedAt: row.last_verified_at,
    updatedAt: row.updated_at,
    verificationStatus: row.verification_status,
    isSponsored: row.is_sponsored,
  };
}

export const getProviders = cache(async (): Promise<Provider[]> => {
  const sql = getDatabase();
  if (!sql) return [];
  try {
    const data = await sql`select id, name, slug, description, address, city, state, postal_code, phone, website,
      categories, levels_of_care, insurance, license_summary, accreditation, last_verified_at,
      verification_status, is_sponsored, updated_at
      from providers where publication_status = 'published' order by name`;
    return (data as ProviderRow[]).map(toProvider);
  } catch {
    return [];
  }
});

export const getProviderBySlug = cache(async (slug: string): Promise<Provider | null> => {
  const providers = await getProviders();
  return providers.find((provider) => provider.slug === slug) || null;
});
