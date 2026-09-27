import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ExternalLink, MapPin, Phone } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getProviderBySlug } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

const verificationLabels = {
  listed: "Directory listing",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};
  return {
    title: `${provider.name} in ${provider.city}, ${provider.state}`,
    description: provider.description || `Review services, contact details, and verification information for ${provider.name}.`,
    alternates: { canonical: `/providers/${provider.slug}` },
    robots: { index: provider.verificationStatus !== "listed", follow: true },
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: provider.name,
    url: absoluteUrl(`/providers/${provider.slug}`),
    telephone: provider.phone || undefined,
    address: {
      "@type": "PostalAddress", streetAddress: provider.address || undefined, addressLocality: provider.city,
      addressRegion: provider.state, postalCode: provider.postalCode || undefined, addressCountry: "US",
    },
  };

  return <>
    <JsonLd data={jsonLd} />
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/directory">Directory</Link><span>/</span><span>{provider.name}</span></div>
      {provider.isSponsored && <span className="kicker plain">Sponsored placement</span>}
      <h1>{provider.name}</h1><p><MapPin size={17} /> {provider.city}, {provider.state}</p>
    </div></section>
    <div className="shell detail-grid">
      <article className="prose">
        <div className="notice"><strong>{verificationLabels[provider.verificationStatus]}.</strong> Review <Link href="/how-we-verify">what this label means</Link> and confirm important details directly.</div>
        <h2>About this listing</h2><p>{provider.description || "TreatmentLane has not yet received a complete description for this organization."}</p>
        <h2>Services and levels of care</h2>
        {provider.levelsOfCare.length ? <ul>{provider.levelsOfCare.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Detailed levels of care have not been published yet. Contact the organization directly.</p>}
        <h2>Insurance and payment</h2>
        {provider.insurance.length ? <ul>{provider.insurance.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Insurance participation has not been confirmed. Verify network status and benefits with the provider and insurer.</p>}
        <h2>Licensing and accreditation</h2>
        <p>{provider.licenseSummary || "Licensing information has not been summarized on this listing. Ask for the licensing agency and verify the record directly."}</p>
        {provider.accreditation.length > 0 && <ul>{provider.accreditation.map((item) => <li key={item}>{item}</li>)}</ul>}
        <h2>Corrections</h2><p>Represent this organization or see inaccurate information? <Link href={`/corrections?provider=${provider.slug}`}>Request a correction</Link>.</p>
      </article>
      <aside className="detail-sidebar">
        <h2>Contact information</h2><dl>
          <dt>Location</dt><dd>{provider.address && <>{provider.address}<br /></>}{provider.city}, {provider.state} {provider.postalCode}</dd>
          {provider.phone && <><dt>Phone</dt><dd><a href={`tel:${provider.phone}`}><Phone size={15} /> {provider.phone}</a></dd></>}
          {provider.website && <><dt>Official website</dt><dd><a href={provider.website} rel="noopener noreferrer nofollow" target="_blank">Visit website <ExternalLink size={14} /></a></dd></>}
          {provider.sourceUrl && <><dt>Public source</dt><dd><a href={provider.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">View source record <ExternalLink size={14} /></a></dd></>}
          <dt>Listing status</dt><dd><BadgeCheck size={15} /> {verificationLabels[provider.verificationStatus]}</dd>
          <dt>Last reviewed</dt><dd>{provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Not yet recorded"}</dd>
        </dl>
        <p className="form-disclaimer">TreatmentLane does not recommend or guarantee any provider. In an emergency, call 911 or 988.</p>
      </aside>
    </div>
  </>;
}
