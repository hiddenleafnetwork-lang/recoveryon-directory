import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, MapPin, MapPinned, Star } from "lucide-react";
import { CompareButton } from "@/components/compare-button";
import { providerPath } from "@/lib/providers";
import type { Provider } from "@/lib/types";

const labels = {
  listed: "Directory listing",
  "data-verified": "TreatmentLane data verified",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

export function ProviderCard({ provider }: { provider: Provider }) {
  const tags = [...provider.treatmentTypes, ...provider.categories].filter((item, index, items) => items.indexOf(item) === index).slice(0, 4);
  const href = providerPath(provider);
  const locationCountLabel = `${provider.organizationLocationCount.toLocaleString()} ${provider.organizationLocationCount === 1 ? "location" : "locations"}`;
  const ratingValue = provider.publicReviewRatingValue ?? provider.sourceRatingValue;
  const ratingCount = provider.publicReviewRatingCount ?? provider.sourceRatingCount;
  const ratingSource = provider.publicReviewSourceName || "Source";
  return (
    <article className="provider-card">
      {provider.isSponsored && <span className="sponsored-label">Sponsored</span>}
      <Link className="provider-card-media" href={href} aria-label={`View ${provider.name}`}>
        {provider.featuredImageUrl
          ? <Image src={provider.featuredImageUrl} alt={`${provider.name} facility`} fill sizes="(max-width: 760px) 100vw, 190px" unoptimized />
          : <span className="provider-card-placeholder" aria-hidden="true"><Building2 /></span>}
      </Link>
      <div className="provider-card-body">
        <div className="provider-card-heading">
          <div className="eyebrow"><MapPin size={15} /> {provider.city}, {provider.state}</div>
          {provider.organizationLocationCount > 1
            ? <Link className="location-count-badge" href={`/providers/${provider.organizationSlug}`} aria-label={`View all ${locationCountLabel} for ${provider.name}`}><MapPinned size={14} /> {locationCountLabel}</Link>
            : <span className="location-count-badge"><MapPinned size={14} /> {locationCountLabel}</span>}
        </div>
        <h2><Link href={href}>{provider.name}</Link></h2>
        <p>{provider.description || "View treatment types, services, contact information, and source details."}</p>
        <div className="tag-row">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="provider-card-meta">
          <span className="verification-line"><BadgeCheck size={16} /> {labels[provider.verificationStatus]}</span>
          {ratingValue !== null && ratingCount !== null && <span className="source-rating"><Star size={15} /> {ratingValue.toFixed(1)} from {ratingCount.toLocaleString()} on {ratingSource}</span>}
        </div>
        <div className="provider-card-actions"><Link className="card-action" href={href}>View details</Link><CompareButton compact provider={{ id: provider.id, name: provider.name, href }} /></div>
      </div>
    </article>
  );
}
