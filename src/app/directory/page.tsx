import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { careCategories, states } from "@/lib/content";
import { searchProviders } from "@/lib/providers";

function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] || "" : value || ""; }

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const filtered = ["keyword", "location", "category", "state", "page"].some((key) => Boolean(single(params[key])));
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
  const requestedPage = Math.max(Number.parseInt(single(params.page), 10) || 1, 1);
  const result = await searchProviders({ keyword, location, category, state, page: requestedPage });
  const paginationParams = Object.fromEntries(Object.entries({ keyword, location, category, state }).filter(([, value]) => value));

  return (
    <>
      <section className="page-hero"><div className="shell"><span className="kicker plain">Directory</span><h1>Find treatment and recovery resources</h1><p>Use these listings as a starting point. Confirm licensing, services, availability, insurance, and cost directly before making a decision.</p></div></section>
      <div className="shell directory-layout">
        <form className="filter-card" method="get">
          <h2>Filter listings</h2>
          <label>Keyword<input name="keyword" defaultValue={single(params.keyword)} placeholder="Service or provider" /></label>
          <label>Location<input name="location" defaultValue={single(params.location)} placeholder="City, state, or ZIP" /></label>
          <label>Type of care<select name="category" defaultValue={category}><option value="">All care types</option>{careCategories.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></label>
          <label>State<select name="state" defaultValue={state}><option value="">All states</option>{states.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
          <button className="button" type="submit">Apply filters</button>
        </form>
        <section>
          <div className="results-heading"><div><h1>{result.total ? `${result.total.toLocaleString()} published ${result.total === 1 ? "listing" : "listings"}` : "Published listings"}</h1><p>Listings are sourced from public directory data and clearly labeled until independently confirmed.</p></div></div>
          {result.providers.length ? <><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname="/directory" params={paginationParams} page={result.page} totalPages={result.totalPages} /></> : <div className="empty-state"><SearchX size={36} /><h2>No matching listings</h2><p>Try another search or suggest an organization for review.</p><Link className="button" href="/providers/apply">Suggest an organization</Link></div>}
        </section>
      </div>
    </>
  );
}
