import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, MapPin, Star } from "lucide-react";
import type { Provider } from "@/lib/types";

const labels = {
  listed: "Directory listing",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

export function ProviderCard({ provider }: { provider: Provider }) {
  const tags = [...provider.treatmentTypes, ...provider.categories].filter((item, index, items) => items.indexOf(item) === index).slice(0, 4);
  return (
    <article className="provider-card">
      {provider.isSponsored && <span className="sponsored-label">Sponsored</span>}
      <Link className="provider-card-media" href={`/providers/${provider.slug}`} aria-label={`View ${provider.name}`}>
        {provider.featuredImageUrl
          ? <Image src={provider.featuredImageUrl} alt={`${provider.name} facility`} fill sizes="(max-width: 760px) 100vw, 190px" unoptimized />
          : <span className="provider-card-placeholder" aria-hidden="true"><Building2 /></span>}
      </Link>
      <div className="provider-card-body">
        <div className="eyebrow"><MapPin size={15} /> {provider.city}, {provider.state}</div>
        <h2><Link href={`/providers/${provider.slug}`}>{provider.name}</Link></h2>
        <p>{provider.description || "View treatment types, services, contact information, and source details."}</p>
        <div className="tag-row">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="provider-card-meta">
          <span className="verification-line"><BadgeCheck size={16} /> {labels[provider.verificationStatus]}</span>
          {provider.sourceRatingValue !== null && provider.sourceRatingCount !== null && <span className="source-rating"><Star size={15} /> {provider.sourceRatingValue.toFixed(1)} source rating</span>}
        </div>
      </div>
    </article>
  );
}
