import Link from "next/link";
import { BadgeCheck, Building2, MapPin } from "lucide-react";
import type { Provider } from "@/lib/types";

const labels = {
  listed: "Directory listing",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <article className="provider-card">
      {provider.isSponsored && <span className="sponsored-label">Sponsored</span>}
      <div className="provider-card-icon" aria-hidden="true"><Building2 /></div>
      <div className="provider-card-body">
        <div className="eyebrow"><MapPin size={15} /> {provider.city}, {provider.state}</div>
        <h2><Link href={`/providers/${provider.slug}`}>{provider.name}</Link></h2>
        <p>{provider.description || "View the listing for services, contact information, and verification details."}</p>
        <div className="tag-row">
          {provider.categories.slice(0, 3).map((category) => <span className="tag" key={category}>{category}</span>)}
        </div>
        <div className="verification-line"><BadgeCheck size={16} /> {labels[provider.verificationStatus]}</div>
      </div>
    </article>
  );
}
