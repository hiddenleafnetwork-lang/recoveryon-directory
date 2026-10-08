import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { insuranceOptions } from "@/lib/insurance";

export const metadata: Metadata = {
  title: "Browse treatment listings by insurance",
  description: "Browse TreatmentLane directory listings by insurance or payment information found in public source data.",
  alternates: { canonical: "/insurance" },
};

export default function InsurancePage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="kicker plain"><ShieldCheck size={16} /> Insurance and payment</span>
          <h1>Browse listings by insurance or payment option.</h1>
          <p>These pages organize public source information. A listing does not prove that a provider is currently in network or that a specific service will be covered.</p>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="insurance-grid">
            {insuranceOptions.map((option) => (
              <Link className="insurance-card" key={option.slug} href={`/insurance/${option.slug}`}>
                <h2>{option.name}</h2><p>{option.description}</p><span>Browse listings <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
          <div className="notice-card insurance-notice">
            <h2>Confirm coverage twice</h2>
            <p>Ask the provider for its current network status and a written cost estimate. Then call the insurer using the number on the insurance card to confirm benefits, authorization requirements, deductibles, coinsurance, and out-of-network rules.</p>
            <Link className="text-link" href="/guides/questions-to-ask-about-treatment-costs">Read the treatment cost checklist</Link>
          </div>
        </div>
      </section>
    </>
  );
}
