import "server-only";

import { cache } from "react";
import { getDatabase } from "@/lib/db";
import type { Provider } from "@/lib/types";

type ProviderRow = {
  id: string; name: string; slug: string; description: string | null; address: string | null;
  city: string; state: string; postal_code: string | null; phone: string | null; website: string | null;
  categories: string[] | null; levels_of_care: string[] | null; insurance: string[] | null;
  license_summary: string | null; accreditation: string[] | null; last_verified_at: string | null;
  source_url: string | null; updated_at: string; verification_status: Provider["verificationStatus"]; is_sponsored: boolean;
};

const providerColumns = `id, name, slug, description, address, city, state, postal_code, phone, website,
  categories, levels_of_care, insurance, license_summary, accreditation, last_verified_at,
  verification_status, is_sponsored, source_url, updated_at`;

function toProvider(row: ProviderRow): Provider {
  return {
    id: row.id, name: row.name, slug: row.slug, description: row.description, address: row.address,
    city: row.city, state: row.state, postalCode: row.postal_code, phone: row.phone, website: row.website,
    categories: row.categories || [], levelsOfCare: row.levels_of_care || [], insurance: row.insurance || [],
    licenseSummary: row.license_summary, accreditation: row.accreditation || [], sourceUrl: row.source_url, lastVerifiedAt: row.last_verified_at,
    updatedAt: row.updated_at, verificationStatus: row.verification_status, isSponsored: row.is_sponsored,
  };
}

export type ProviderSearch = {
  keyword?: string; location?: string; category?: string; state?: string; page?: number; pageSize?: number;
};
export type ProviderSearchResult = { providers: Provider[]; total: number; page: number; totalPages: number };

export async function searchProviders(input: ProviderSearch = {}): Promise<ProviderSearchResult> {
  const sql = getDatabase();
  const pageSize = Math.min(Math.max(input.pageSize || 24, 1), 100);
  const requestedPage = Math.max(input.page || 1, 1);
  if (!sql) return { providers: [], total: 0, page: 1, totalPages: 0 };
  const clauses = ["publication_status = 'published'"];
  const params: unknown[] = [];
  const add = (value: unknown) => { params.push(value); return `$${params.length}`; };
  if (input.keyword?.trim()) {
    const term = add(`%${input.keyword.trim()}%`);
    clauses.push(`(name ilike ${term} or description ilike ${term} or array_to_string(categories, ' ') ilike ${term} or array_to_string(levels_of_care, ' ') ilike ${term})`);
  }
  if (input.location?.trim()) {
    const term = add(`%${input.location.trim()}%`);
    clauses.push(`concat_ws(' ', address, city, state, postal_code) ilike ${term}`);
  }
  if (input.category?.trim()) clauses.push(`${add(input.category.trim())} = any(categories)`);
  if (input.state?.trim()) clauses.push(`state = ${add(input.state.trim().toUpperCase())}`);
  const where = clauses.join(" and ");
  try {
    const countRows = await sql.query(`select count(*)::int as count from providers where ${where}`, params);
    const total = Number(countRows[0]?.count || 0);
    const totalPages = total ? Math.ceil(total / pageSize) : 0;
    const page = totalPages ? Math.min(requestedPage, totalPages) : 1;
    const rows = await sql.query(
      `select ${providerColumns} from providers where ${where}
       order by is_sponsored desc, name, city, id limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, pageSize, (page - 1) * pageSize],
    );
    return { providers: (rows as ProviderRow[]).map(toProvider), total, page, totalPages };
  } catch {
    return { providers: [], total: 0, page: 1, totalPages: 0 };
  }
}

export const getProviderBySlug = cache(async (slug: string): Promise<Provider | null> => {
  const sql = getDatabase();
  if (!sql) return null;
  try {
    const rows = await sql.query(`select ${providerColumns} from providers where slug = $1 and publication_status = 'published' limit 1`, [slug]);
    return rows[0] ? toProvider(rows[0] as ProviderRow) : null;
  } catch { return null; }
});

export async function hasPublishedProviders(filter: { state?: string; category?: string }) {
  return (await searchProviders({ ...filter, pageSize: 1 })).total > 0;
}

export async function getDirectoryFacets() {
  const sql = getDatabase();
  if (!sql) return { states: [] as string[], categories: [] as string[] };
  try {
    const [stateRows, categoryRows] = await Promise.all([
      sql`select distinct state from providers where publication_status = 'published' order by state`,
      sql`select distinct unnest(categories) as category from providers where publication_status = 'published' order by category`,
    ]);
    return { states: stateRows.map((row) => String(row.state)), categories: categoryRows.map((row) => String(row.category)) };
  } catch { return { states: [], categories: [] }; }
}

export async function getSitemapProviders() {
  const sql = getDatabase();
  if (!sql) return [] as Array<{ slug: string; updatedAt: string }>;
  try {
    const rows = await sql`select slug, updated_at from providers
      where publication_status = 'published' and verification_status <> 'listed' order by slug`;
    return rows.map((row) => ({ slug: String(row.slug), updatedAt: String(row.updated_at) }));
  } catch { return [] as Array<{ slug: string; updatedAt: string }>; }
}
