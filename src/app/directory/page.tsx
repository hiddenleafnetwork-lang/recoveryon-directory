import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, SearchX } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { DirectoryMap, type DirectoryMapProvider } from "@/components/directory-map";
import { DirectoryTools } from "@/components/directory-tools";
import { LocationAutocompleteInput } from "@/components/location-autocomplete-input";
import { ProviderCard } from "@/components/provider-card";
import { careCategories, states } from "@/lib/content";
import { getDirectoryFacets, providerPath, searchProviders, type ProviderSort } from "@/lib/providers";

function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] || "" : value || ""; }

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const filtered = ["keyword", "location", "category", "state", "level", "insurance", "specialty", "audience", "medication", "access", "urgency", "complete", "sort", "page"].some((key) => Boolean(single(params[key])));
  return {
    title: "Recovery resource directory",
    description: "Search treatment, recovery, and mental health resource listings by service and location.",
    robots: { index: !filtered, follow: true },
    alternates: { canonical: "/directory" },
  };
}

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const keyword = single(params.keyword).trim();
  const location = single(params.location).trim();
  const category = single(params.category).trim();
  const state = single(params.state).trim().toUpperCase();
  const levelOfCare = single(params.level).trim();
  const insurance = single(params.insurance).trim();
  const specialty = single(params.specialty).trim();
  const audience = single(params.audience).trim();
  const medication = single(params.medication).trim();
  const access = single(params.access).trim();
  const urgency = single(params.urgency).trim();
  const completeOnly = single(params.complete) === "1";
  const requestedSort = single(params.sort);
  const sort: ProviderSort = ["recently-verified", "most-reviewed", "highest-rated", "alphabetical"].includes(requestedSort)
    ? requestedSort as ProviderSort : "recommended";
  const requestedPage = Math.max(Number.parseInt(single(params.page), 10) || 1, 1);
  const [result, facets] = await Promise.all([
    searchProviders({ keyword, location, category, state, levelOfCare, insurance, specialty, audience, medication, access, completeOnly, sort, page: requestedPage }),
    getDirectoryFacets(),
  ]);
  const paginationParams = Object.fromEntries(Object.entries({
    keyword, location, category, state, level: levelOfCare, insurance, specialty, audience, medication, access, urgency,
    complete: completeOnly ? "1" : "", sort: sort === "recommended" ? "" : sort,
  }).filter(([, value]) => value));
  const activeFilterCount = [keyword, location, category, state, levelOfCare, insurance, specialty, audience, medication, access, completeOnly ? "1" : ""].filter(Boolean).length;
  const advancedFilterCount = [levelOfCare, insurance, specialty, audience, medication, access, completeOnly ? "1" : ""].filter(Boolean).length;
  const mapProviders = result.providers.flatMap((provider): DirectoryMapProvider[] => {
    if (provider.latitude === null || provider.longitude === null) return [];
    if (!Number.isFinite(provider.latitude) || !Number.isFinite(provider.longitude)) return [];
    if (provider.latitude < -90 || provider.latitude > 90 || provider.longitude < -180 || provider.longitude > 180) return [];
    return [{
      id: provider.id,
      name: provider.name,
      city: provider.city,
      state: provider.state,
      href: providerPath(provider),
      latitude: provider.latitude,
      longitude: provider.longitude,
    }];
  });

  return (
    <>
      <section className="page-hero"><div className="shell"><span className="kicker plain">Directory</span><h1>Find treatment and recovery resources</h1><p>Use these listings as a starting point. Confirm licensing, services, availability, insurance, and cost directly before making a decision.</p></div></section>
      <div className="shell directory-layout">
        <form className="filter-card" method="get">
          <h2>Filter listings</h2>
          <label>Keyword<input name="keyword" defaultValue={single(params.keyword)} placeholder="Service or provider" /></label>
          <label>Location<LocationAutocompleteInput key={single(params.location)} defaultValue={single(params.location)} /></label>
          <label>Type of care<select name="category" defaultValue={category}><option value="">All care types</option>{careCategories.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></label>
          <label>State<select name="state" defaultValue={state}><option value="">All states</option>{states.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
          <details className="filter-more" open={Boolean(levelOfCare || insurance || specialty || audience || medication || access || completeOnly)}>
            <summary>More filters{advancedFilterCount > 0 && <span>{advancedFilterCount}</span>}</summary>
            <label>Level of care<select name="level" defaultValue={levelOfCare}><option value="">Any level of care</option>{facets.levelsOfCare.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label>Insurance or payment<select name="insurance" defaultValue={insurance}><option value="">Any insurance or payment</option>{facets.insurance.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <p className="filter-help">Insurance information comes from public source data. Confirm current network status directly.</p>
            <label>Program focus<select name="specialty" defaultValue={specialty}><option value="">Any program focus</option>{facets.specialties.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label>Population served<select name="audience" defaultValue={audience}><option value="">Any population</option><option>Adolescents</option><option>Young Adult</option><option>Women Only</option><option>Men Only</option><option>Veterans</option><option value="Lgbtq">LGBTQ+ people</option></select></label>
            <label>Medication support<select name="medication" defaultValue={medication}><option value="">Any medication support</option><option>Buprenorphine</option><option>Naltrexone</option><option>Methadone Program</option><option>Medication-assisted treatment</option></select></label>
            <label>Access option<select name="access" defaultValue={access}><option value="">Any access option</option><option value="Virtual / telehealth">Virtual or telehealth</option><option>Transitional Housing</option><option>Spanish Speaking</option></select></label>
            <label className="checkbox-field"><input type="checkbox" name="complete" value="1" defaultChecked={completeOnly} /> Show more complete source records</label>
            {urgency && <input type="hidden" name="urgency" value={urgency} />}
          </details>
          <label>Sort by<select name="sort" defaultValue={sort}><option value="recommended">Recommended</option><option value="recently-verified">Recently verified</option><option value="most-reviewed">Most reviewed</option><option value="highest-rated">Highest source rating</option><option value="alphabetical">Alphabetical</option></select></label>
          <button className="button" type="submit">Apply filters</button>
          {activeFilterCount > 0 && <Link className="filter-clear" href="/directory">Clear all filters</Link>}
        </form>
        <section>
          {urgency === "today" && <div className="notice urgent-directory-notice"><Clock3 size={19} /><span><strong>Need care today?</strong> Availability is not yet confirmed live. Call centers directly before traveling. If there is immediate danger, call 911 or 988.</span></div>}
          <div className="results-heading"><div><h1>{result.total ? `${result.total.toLocaleString()} published ${result.total === 1 ? "listing" : "listings"}` : "Published listings"}</h1><p>Recommended order uses verification, source evidence, profile completeness, and review confidence. Sponsored labels do not change organic order.</p></div><DirectoryTools providers={result.providers.map((provider) => ({ name: provider.name, city: provider.city, state: provider.state, phone: provider.phone, website: provider.website, verificationStatus: provider.verificationStatus, href: providerPath(provider) }))} /></div>
          <DirectoryMap providers={mapProviders} resultCount={result.providers.length} />
          {result.providers.length ? <><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname="/directory" params={paginationParams} page={result.page} totalPages={result.totalPages} /></> : <div className="empty-state"><SearchX size={36} /><h2>No matching listings</h2><p>Try another search or suggest an organization for review.</p><Link className="button" href="/providers/apply">Suggest an organization</Link></div>}
        </section>
      </div>
    </>
  );
}
