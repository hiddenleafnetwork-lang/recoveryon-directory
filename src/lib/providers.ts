import "server-only";

import { cache } from "react";
import { getDatabase } from "@/lib/db";
import type { Provider, ProviderProfileDetails, ReviewSignal, ReviewTheme } from "@/lib/types";

type ProviderRow = {
  id: string; name: string; slug: string; organization_slug: string; location_slug: string;
  description: string | null; address: string | null;
  city: string; state: string; postal_code: string | null; latitude: number | string | null; longitude: number | string | null;
  phone: string | null; website: string | null;
  categories: string[] | null; levels_of_care: string[] | null; insurance: string[] | null;
  insurance_details: string | null; treatment_types: string[] | null; therapies: string[] | null;
  amenities: string[] | null; specialties: string[] | null; featured_image_url: string | null; image_urls: string[] | null;
  price_range: string | null; treatment_duration: string | null; source_rating_value: number | string | null; source_rating_count: number | null;
  public_review_rating_value: number | string | null; public_review_rating_count: number | null; public_review_source_name: string | null;
  license_summary: string | null; accreditation: string[] | null; last_verified_at: string | null;
  source_url: string | null; updated_at: string; evidence_score: number;
  verification_status: Provider["verificationStatus"]; is_sponsored: boolean;
  organization_location_count: number | string;
};

const providerColumns = `id, name, slug, organization_slug, location_slug, description, address, city, state, postal_code, latitude, longitude, phone, website,
  categories, levels_of_care, insurance, license_summary, accreditation, last_verified_at,
  verification_status, is_sponsored, source_url, updated_at, featured_image_url, image_urls, treatment_types,
  therapies, amenities, specialties, insurance_details, price_range, treatment_duration, source_rating_value, source_rating_count,
  evidence_score,
  (select average_rating from provider_review_sources review_source
    where review_source.provider_id = providers.id and review_source.source_type = 'google'
      and review_source.match_status = 'accepted' limit 1) as public_review_rating_value,
  (select review_count from provider_review_sources review_source
    where review_source.provider_id = providers.id and review_source.source_type = 'google'
      and review_source.match_status = 'accepted' limit 1) as public_review_rating_count,
  (select source_name from provider_review_sources review_source
    where review_source.provider_id = providers.id and review_source.source_type = 'google'
      and review_source.match_status = 'accepted' limit 1) as public_review_source_name,
  (select count(*) from providers organization_locations
    where organization_locations.organization_slug = providers.organization_slug
      and organization_locations.publication_status = 'published')::int as organization_location_count`;

function toProvider(row: ProviderRow): Provider {
  return {
    id: row.id, name: row.name, slug: row.slug, organizationSlug: row.organization_slug, locationSlug: row.location_slug,
    organizationLocationCount: Number(row.organization_location_count || 1),
    description: row.description, address: row.address,
    city: row.city, state: row.state, postalCode: row.postal_code,
    latitude: row.latitude === null ? null : Number(row.latitude), longitude: row.longitude === null ? null : Number(row.longitude),
    phone: row.phone, website: row.website,
    categories: row.categories || [], levelsOfCare: row.levels_of_care || [], insurance: row.insurance || [],
    insuranceDetails: row.insurance_details, treatmentTypes: row.treatment_types || [], therapies: row.therapies || [],
    amenities: row.amenities || [], specialties: row.specialties || [], featuredImageUrl: row.featured_image_url,
    imageUrls: row.image_urls || [], priceRange: row.price_range, treatmentDuration: row.treatment_duration,
    sourceRatingValue: row.source_rating_value === null ? null : Number(row.source_rating_value), sourceRatingCount: row.source_rating_count,
    publicReviewRatingValue: row.public_review_rating_value === null ? null : Number(row.public_review_rating_value),
    publicReviewRatingCount: row.public_review_rating_count, publicReviewSourceName: row.public_review_source_name,
    licenseSummary: row.license_summary, accreditation: row.accreditation || [], sourceUrl: row.source_url, lastVerifiedAt: row.last_verified_at,
    updatedAt: row.updated_at, evidenceScore: row.evidence_score, verificationStatus: row.verification_status,
    isSponsored: row.is_sponsored,
  };
}

export type ProviderSort = "recommended" | "recently-verified" | "most-reviewed" | "highest-rated" | "alphabetical";

export type ProviderSearch = {
  keyword?: string; location?: string; category?: string; state?: string; levelOfCare?: string; insurance?: string;
  specialty?: string; completeOnly?: boolean; sort?: ProviderSort; page?: number; pageSize?: number;
};
export type ProviderSearchResult = { providers: Provider[]; total: number; page: number; totalPages: number };

const orderBy: Record<ProviderSort, string> = {
  recommended: `case verification_status
      when 'independently-reviewed' then 3
      when 'provider-confirmed' then 2
      when 'data-verified' then 1
      else 0 end desc,
    evidence_score desc, source_rating_count desc nulls last, name, city, id`,
  "recently-verified": "last_verified_at desc nulls last, evidence_score desc, name, city, id",
  "most-reviewed": "source_rating_count desc nulls last, source_rating_value desc nulls last, evidence_score desc, name, city, id",
  "highest-rated": "source_rating_value desc nulls last, source_rating_count desc nulls last, evidence_score desc, name, city, id",
  alphabetical: "name, city, id",
};

export function providerPath(provider: Pick<Provider, "organizationSlug" | "locationSlug" | "organizationLocationCount">) {
  return provider.organizationLocationCount > 1
    ? `/providers/${provider.organizationSlug}/${provider.locationSlug}`
    : `/providers/${provider.organizationSlug}`;
}

export async function searchProviders(input: ProviderSearch = {}): Promise<ProviderSearchResult> {
  const sql = getDatabase();
  const pageSize = Math.min(Math.max(input.pageSize || 24, 1), 100);
  const requestedPage = Math.max(input.page || 1, 1);
  const sort = input.sort && input.sort in orderBy ? input.sort : "recommended";
  if (!sql) return { providers: [], total: 0, page: 1, totalPages: 0 };
  const clauses = ["publication_status = 'published'"];
  const params: unknown[] = [];
  const add = (value: unknown) => { params.push(value); return `$${params.length}`; };
  if (input.keyword?.trim()) {
    const term = add(`%${input.keyword.trim()}%`);
    clauses.push(`(name ilike ${term} or description ilike ${term} or array_to_string(categories, ' ') ilike ${term} or array_to_string(levels_of_care, ' ') ilike ${term} or array_to_string(treatment_types, ' ') ilike ${term} or array_to_string(therapies, ' ') ilike ${term} or array_to_string(specialties, ' ') ilike ${term})`);
  }
  if (input.location?.trim()) {
    const term = add(`%${input.location.trim()}%`);
    clauses.push(`concat_ws(' ', address, city, state, postal_code) ilike ${term}`);
  }
  if (input.category?.trim()) clauses.push(`${add(input.category.trim())} = any(categories)`);
  if (input.state?.trim()) clauses.push(`state = ${add(input.state.trim().toUpperCase())}`);
  if (input.levelOfCare?.trim()) clauses.push(`${add(input.levelOfCare.trim())} = any(levels_of_care)`);
  if (input.insurance?.trim()) clauses.push(`${add(input.insurance.trim())} = any(insurance)`);
  if (input.specialty?.trim()) clauses.push(`${add(input.specialty.trim())} = any(specialties)`);
  if (input.completeOnly) clauses.push("evidence_score >= 75");
  const where = clauses.join(" and ");
  try {
    const countRows = await sql.query(`select count(*)::int as count from providers where ${where}`, params);
    const total = Number(countRows[0]?.count || 0);
    const totalPages = total ? Math.ceil(total / pageSize) : 0;
    const page = totalPages ? Math.min(requestedPage, totalPages) : 1;
    const rows = await sql.query(
      `select ${providerColumns} from providers where ${where}
       order by ${orderBy[sort]} limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, pageSize, (page - 1) * pageSize],
    );
    return { providers: (rows as ProviderRow[]).map(toProvider), total, page, totalPages };
  } catch {
    return { providers: [], total: 0, page: 1, totalPages: 0 };
  }
}

export const getProviderByLegacySlug = cache(async (slug: string): Promise<Provider | null> => {
  const sql = getDatabase();
  if (!sql) return null;
  try {
    const rows = await sql.query(`select ${providerColumns} from providers where slug = $1 and publication_status = 'published' limit 1`, [slug]);
    return rows[0] ? toProvider(rows[0] as ProviderRow) : null;
  } catch { return null; }
});

export const getProviderByCanonicalPath = cache(async (organizationSlug: string, locationSlug: string): Promise<Provider | null> => {
  const sql = getDatabase();
  if (!sql) return null;
  try {
    const rows = await sql.query(
      `select ${providerColumns} from providers
       where organization_slug = $1 and location_slug = $2 and publication_status = 'published' limit 1`,
      [organizationSlug, locationSlug],
    );
    return rows[0] ? toProvider(rows[0] as ProviderRow) : null;
  } catch { return null; }
});

export const getProvidersByOrganizationSlug = cache(async (organizationSlug: string): Promise<Provider[]> => {
  const sql = getDatabase();
  if (!sql) return [];
  try {
    const rows = await sql.query(
      `select ${providerColumns} from providers
       where organization_slug = $1 and publication_status = 'published'
       order by ${orderBy.recommended}`,
      [organizationSlug],
    );
    return (rows as ProviderRow[]).map(toProvider);
  } catch { return []; }
});

export async function getProvidersByIds(ids: string[]): Promise<Provider[]> {
  const sql = getDatabase();
  const uniqueIds = ids.filter((id, index) => ids.indexOf(id) === index).slice(0, 3);
  if (!sql || !uniqueIds.length) return [];
  try {
    const rows = await sql.query(
      `select ${providerColumns} from providers
       where id = any($1::uuid[]) and publication_status = 'published'`,
      [uniqueIds],
    );
    const providers = (rows as ProviderRow[]).map(toProvider);
    return uniqueIds.flatMap((id) => {
      const provider = providers.find((item) => item.id === id);
      return provider ? [provider] : [];
    });
  } catch { return []; }
}

function reviewThemes(value: unknown): ReviewTheme[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const theme = item as { label?: unknown; reviewCount?: unknown };
    const label = typeof theme.label === "string" ? theme.label : "";
    const reviewCount = Number(theme.reviewCount);
    return label && Number.isInteger(reviewCount) && reviewCount > 0 ? [{ label, reviewCount }] : [];
  });
}

export const getProviderReviewSignals = cache(async (providerId: string): Promise<ReviewSignal[]> => {
  const sql = getDatabase();
  if (!sql) return [];
  try {
    const rows = await sql`select source_type, source_name, source_url, external_place_id, average_rating, review_count,
      sampled_review_count, text_review_count, rating_distribution, review_summary, positive_themes, concern_themes, summary_limitations,
      review_date_start, review_date_end, match_confidence, source_notes, collection_method, fetched_at
      from provider_review_sources where provider_id = ${providerId} and match_status = 'accepted'
      order by case source_type when 'google' then 1 when 'recovery.com' then 2 else 3 end, source_name`;
    return rows.map((row) => ({
      sourceType: String(row.source_type) as ReviewSignal["sourceType"], sourceName: String(row.source_name),
      sourceUrl: String(row.source_url), externalPlaceId: row.external_place_id ? String(row.external_place_id) : null,
      averageRating: row.average_rating === null ? null : Number(row.average_rating),
      reviewCount: row.review_count === null ? null : Number(row.review_count),
      sampledReviewCount: Number(row.sampled_review_count || 0),
      textReviewCount: Number(row.text_review_count || 0),
      ratingDistribution: row.rating_distribution && typeof row.rating_distribution === "object"
        ? row.rating_distribution as Record<string, number> : {},
      reviewSummary: row.review_summary ? String(row.review_summary) : null,
      positiveThemes: reviewThemes(row.positive_themes), concernThemes: reviewThemes(row.concern_themes),
      summaryLimitations: row.summary_limitations ? String(row.summary_limitations) : null,
      reviewDateStart: row.review_date_start ? String(row.review_date_start) : null,
      reviewDateEnd: row.review_date_end ? String(row.review_date_end) : null,
      matchConfidence: row.match_confidence === null ? null : Number(row.match_confidence),
      sourceNotes: row.source_notes ? String(row.source_notes) : null,
      collectionMethod: String(row.collection_method), fetchedAt: String(row.fetched_at),
    }));
  } catch { return []; }
});

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.replaceAll("\u2014", "-").replaceAll("\u2013", "-").trim() : "";
}

export const getProviderProfileDetails = cache(async (providerId: string): Promise<ProviderProfileDetails> => {
  const empty: ProviderProfileDetails = { email: null, intakePhone: null, officialWebsite: null, operatingDays: [], is24Hours: null, evidenceSourceCount: null, evidenceSources: [], supportServices: [] };
  const sql = getDatabase();
  if (!sql) return empty;
  try {
    const rows = await sql`select email, intake_phone, source_data from providers where id = ${providerId} limit 1`;
    if (!rows[0]) return empty;
    const sourceData = objectValue(rows[0].source_data);
    const masterRows = Array.isArray(sourceData.masterRows) ? sourceData.masterRows : [];
    const master = objectValue(masterRows[0]);
    const recovery = objectValue(sourceData.recoveryRow);
    const operatingDaysRaw = cleanString(master["Days Open"] || recovery.days_open);
    const codes = cleanString(master["Samhsa Service Codes Named"]).split("|").map((item) => item.trim());
    const supportedServices = [
      ["Case management", "Case management"], ["Transportation assistance", "Transportation assistance"],
      ["Education services", "Education support"], ["Court-ordered outpatient", "Court-ordered outpatient care"],
      ["Peer support", "Peer support"], ["Social skills development", "Social skills development"],
      ["Suicide prevention", "Suicide prevention services"], ["Family psychoeducation", "Family education"],
    ] as const;
    const evidenceSources = [
      master["Samhsa In Su"] === "Y" || master["Samhsa In Mh"] === "Y" ? "SAMHSA directory data" : "",
      Object.keys(recovery).length ? "Recovery.com source record" : "",
      cleanString(master["Website Real"]) ? "Organization website" : "",
    ].filter(Boolean);
    const sourceCount = Number(master["Source Count"]);
    return {
      email: cleanString(rows[0].email || master.Email || recovery.email) || null,
      intakePhone: cleanString(rows[0].intake_phone || master["Intake Phone"]) || null,
      officialWebsite: cleanString(master["Website Real"]) || null,
      operatingDays: operatingDaysRaw ? operatingDaysRaw.split(",").map((day) => day.trim()).filter(Boolean) : [],
      is24Hours: master["Is 24 7"] === "Y" ? true : master["Is 24 7"] === "N" ? false : null,
      evidenceSourceCount: Number.isFinite(sourceCount) && sourceCount > 0 ? sourceCount : null,
      evidenceSources: [...new Set(evidenceSources)],
      supportServices: supportedServices.flatMap(([needle, label]) => codes.includes(needle) ? [label] : []),
    };
  } catch { return empty; }
});

export async function hasPublishedProviders(filter: { state?: string; category?: string }) {
  return (await searchProviders({ ...filter, pageSize: 1 })).total > 0;
}

export async function getDirectoryFacets() {
  const sql = getDatabase();
  const empty = { states: [] as string[], categories: [] as string[], levelsOfCare: [] as string[], insurance: [] as string[], specialties: [] as string[] };
  if (!sql) return empty;
  try {
    const [stateRows, categoryRows, levelRows, insuranceRows, specialtyRows] = await Promise.all([
      sql`select distinct state from providers where publication_status = 'published' order by state`,
      sql`select distinct unnest(categories) as category from providers where publication_status = 'published' order by category`,
      sql`select item, count(*)::int as count from providers, unnest(levels_of_care) item
        where publication_status = 'published' and nullif(trim(item), '') is not null and item not like '%<%' and char_length(item) <= 80
        group by item order by count desc, item limit 20`,
      sql`select item, count(*)::int as count from providers, unnest(insurance) item
        where publication_status = 'published' and nullif(trim(item), '') is not null
        group by item order by count desc, item limit 60`,
      sql`select item, count(*)::int as count from providers, unnest(specialties) item
        where publication_status = 'published' and nullif(trim(item), '') is not null and item not like '%<%' and char_length(item) <= 80
        group by item order by count desc, item limit 30`,
    ]);
    return {
      states: stateRows.map((row) => String(row.state)),
      categories: categoryRows.map((row) => String(row.category)),
      levelsOfCare: levelRows.map((row) => String(row.item)),
      insurance: insuranceRows.map((row) => String(row.item)),
      specialties: specialtyRows.map((row) => String(row.item)),
    };
  } catch { return empty; }
}

export async function getSitemapProviders() {
  const sql = getDatabase();
  if (!sql) return [] as Array<{ organizationSlug: string; locationSlug: string; locationCount: number; updatedAt: string }>;
  try {
    const rows = await sql`select organization_slug, location_slug, updated_at,
      (select count(*) from providers organization_locations
        where organization_locations.organization_slug = providers.organization_slug
          and organization_locations.publication_status = 'published')::int as organization_location_count
      from providers
      where publication_status = 'published' and verification_status <> 'listed'
        and organization_slug is not null and location_slug is not null
      order by organization_slug, location_slug`;
    return rows.map((row) => ({
      organizationSlug: String(row.organization_slug), locationSlug: String(row.location_slug),
      locationCount: Number(row.organization_location_count || 1), updatedAt: String(row.updated_at),
    }));
  } catch { return [] as Array<{ organizationSlug: string; locationSlug: string; locationCount: number; updatedAt: string }>; }
}
