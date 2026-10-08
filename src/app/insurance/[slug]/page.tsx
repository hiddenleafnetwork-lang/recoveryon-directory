import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getInsuranceOption, insuranceOptions } from "@/lib/insurance";

export function generateStaticParams() {
  return insuranceOptions.map((option) => ({ slug: option.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const option = getInsuranceOption((await params).slug);
  if (!option) return {};
  return {
    title: `Treatment listings mentioning ${option.name}`,
    description: `Browse TreatmentLane directory listings whose public source data mentions ${option.name}. Confirm coverage directly before choosing care.`,
    alternates: { canonical: `/insurance/${option.slug}` },
  };
}

export default async function InsuranceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const option = getInsuranceOption((await params).slug);
  if (!option) notFound();
  const resultsHref = `/directory?insurance=${encodeURIComponent(option.name)}`;

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="kicker plain">Insurance and payment</span>
          <h1>Listings that mention {option.name}</h1>
          <p>{option.description} This is source-derived information, not a guarantee of current network participation, benefits, authorization, or payment.</p>
          <Link className="button" href={resultsHref}>Browse matching listings <ArrowRight size={18} /></Link>
        </div>
      </section>
      <section className="section">
        <div className="shell narrow-shell">
          <h2>How to verify before admission</h2>
          <ul className="check-list">
            <li><CheckCircle2 /> Ask whether the exact location and service are in network.</li>
            <li><CheckCircle2 /> Ask for a written estimate of your full expected cost.</li>
            <li><CheckCircle2 /> Confirm benefits and prior authorization with {option.name} directly.</li>
            <li><CheckCircle2 /> Ask which services, medications, labs, and transportation are billed separately.</li>
          </ul>
          <p className="lead">TreatmentLane does not verify benefits, determine eligibility, or receive payment for insurance enrollment. Coverage can vary by plan, location, medical necessity, and service.</p>
          <div className="inline-actions">
            <Link className="button" href={resultsHref}>View {option.name} listings</Link>
            <Link className="button button-secondary" href="/insurance">Browse other payment options</Link>
          </div>
        </div>
      </section>
    </>
  );
}
