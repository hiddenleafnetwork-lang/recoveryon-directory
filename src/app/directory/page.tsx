import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProviderCard } from "@/components/provider-card";
import { careCategories, states } from "@/lib/content";
import { getProviders } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Recovery resource directory",
  description: "Search published treatment, recovery, and mental health resource listings by service and location.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/directory" },
};

function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] || "" : value || ""; }

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const keyword = single(params.keyword).toLowerCase().trim();
  const location = single(params.location).toLowerCase().trim();
  const category = single(params.category).trim();
  const state = single(params.state).trim().toUpperCase();
  const providers = await getProviders();
  const filtered = providers.filter((provider) => {
    const keywordText = [provider.name, provider.description, ...provider.categories, ...provider.levelsOfCare].filter(Boolean).join(" ").toLowerCase();
    const locationText = [provider.city, provider.state, provider.postalCode, provider.address].filter(Boolean).join(" ").toLowerCase();
    return (!keyword || keywordText.includes(keyword)) && (!location || locationText.includes(location)) && (!category || provider.categories.includes(category)) && (!state || provider.state === state);
  });

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
          <div className="results-heading"><div><h1>{filtered.length ? `${filtered.length} published ${filtered.length === 1 ? "listing" : "listings"}` : "Published listings"}</h1><p>Only listings that pass publication review appear here.</p></div></div>
          {filtered.length ? <div className="provider-list">{filtered.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div> : <div className="empty-state"><SearchX size={36} /><h2>No matching reviewed listings yet</h2><p>We are building the directory carefully instead of publishing unverified placeholder records. Try another search or suggest an organization for review.</p><Link className="button" href="/providers/apply">Suggest an organization</Link></div>}
        </section>
      </div>
    </>
  );
}
