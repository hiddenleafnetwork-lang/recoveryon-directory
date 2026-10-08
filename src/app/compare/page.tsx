import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ExternalLink, Phone, Scale } from "lucide-react";
import { CompareButton } from "@/components/compare-button";
import { getProvidersByIds, providerPath } from "@/lib/providers";
import type { Provider } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare treatment listings",
  description: "Compare public treatment listing details side by side.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" },
};

function list(values: string[]) {
  return values.length ? values.slice(0, 8).join(", ") : "Not listed";
}

function rating(provider: Provider) {
  const value = provider.publicReviewRatingValue ?? provider.sourceRatingValue;
  const count = provider.publicReviewRatingCount ?? provider.sourceRatingCount;
  const source = provider.publicReviewSourceName || "public source";
  if (value === null || count === null) return "Not listed";
  return `${value.toFixed(1)} from ${count.toLocaleString()} ratings on ${source}`;
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawIds = Array.isArray(params.ids) ? params.ids[0] || "" : params.ids || "";
  const ids = rawIds.split(",").map((id) => id.trim()).filter(Boolean).slice(0, 3);
  const providers = await getProvidersByIds(ids);

  if (!providers.length) {
    return <><section className="page-hero"><div className="shell"><span className="kicker plain">Compare listings</span><h1>Build a treatment shortlist</h1><p>Add up to three listings from the directory to compare public information side by side.</p></div></section><section className="section"><div className="content-shell empty-state"><Scale size={38} /><h2>No listings selected</h2><p>Use the Compare button on any directory card or provider profile.</p><Link className="button" href="/directory">Browse the directory</Link></div></section></>;
  }

  const rows: Array<{ label: string; value: (provider: Provider) => React.ReactNode }> = [
    { label: "Location", value: (provider) => `${provider.city}, ${provider.state}` },
    { label: "Listing status", value: (provider) => provider.verificationStatus.replaceAll("-", " ") },
    { label: "Last reviewed", value: (provider) => provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Not independently reviewed" },
    { label: "Care options", value: (provider) => list([...provider.treatmentTypes, ...provider.levelsOfCare].filter((item, index, values) => values.indexOf(item) === index)) },
    { label: "Insurance and payment", value: (provider) => list(provider.insurance) },
    { label: "Program focus", value: (provider) => list(provider.specialties) },
    { label: "Therapies", value: (provider) => list(provider.therapies) },
    { label: "Amenities", value: (provider) => list(provider.amenities) },
    { label: "Accreditation", value: (provider) => list(provider.accreditation) },
    { label: "Typical duration", value: (provider) => provider.treatmentDuration || "Not listed" },
    { label: "Source price information", value: (provider) => provider.priceRange || "Not listed" },
    { label: "Public review rating", value: rating },
  ];

  return <>
    <section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/directory">Directory</Link><span>/</span><span>Compare</span></div><span className="kicker plain">Decision support</span><h1>Compare treatment listings</h1><p>Review public information side by side, then confirm licensing, fit, availability, insurance, and cost directly.</p></div></section>
    <section className="section"><div className="shell">
      <div className="notice comparison-notice"><BadgeCheck size={18} /><span>Comparison does not determine clinical suitability or provider quality. Missing data means it was not available in the current source record.</span></div>
      <div className="comparison-table-wrap"><table className="comparison-table">
        <thead><tr><th scope="col">Compare</th>{providers.map((provider) => {
          const href = providerPath(provider);
          return <th scope="col" key={provider.id}><Link href={href}>{provider.name}</Link><small>{provider.city}, {provider.state}</small><CompareButton compact provider={{ id: provider.id, name: provider.name, href }} /></th>;
        })}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{providers.map((provider) => <td key={provider.id}>{row.value(provider)}</td>)}</tr>)}</tbody>
        <tfoot><tr><th scope="row">Contact</th>{providers.map((provider) => <td key={provider.id}><div className="comparison-contact">{provider.phone && <a href={`tel:${provider.phone}`}><Phone size={15} /> {provider.phone}</a>}{provider.website && <a href={provider.website} rel="noopener noreferrer nofollow" target="_blank">Official website <ExternalLink size={14} /></a>}<Link href={providerPath(provider)}>View full listing</Link></div></td>)}</tr></tfoot>
      </table></div>
      <div className="inline-actions"><Link className="button button-secondary" href="/directory"><ArrowLeft size={17} /> Add another listing</Link></div>
    </div></section>
  </>;
}
