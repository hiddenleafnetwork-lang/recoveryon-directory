import type { Metadata } from "next";
import Link from "next/link";
import { GuidedFinder } from "@/components/guided-finder";

export const metadata: Metadata = {
  title: "Find treatment options",
  description: "Answer a few private questions to narrow TreatmentLane listings by care needs, population, medication support, payment, and location.",
  alternates: { canonical: "/find-options" },
};

export default function FindOptionsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="kicker plain">Guided search</span>
          <h1>Find a useful place to start.</h1>
          <p>Answer a few private questions about care needs, practical fit, payment, and location. Your answers stay in your browser and become transparent directory filters.</p>
        </div>
      </section>
      <section className="section section-tint">
        <div className="shell finder-shell">
          <GuidedFinder />
          <aside className="finder-help">
            <h2>Before you decide</h2>
            <p>A directory result is only a starting point. Confirm the level of care, licensing, availability, insurance network status, and complete cost directly.</p>
            <Link className="text-link" href="/guides/how-to-verify-a-treatment-provider">Use the provider verification checklist</Link>
            <Link className="text-link" href="/emergency-help">Need immediate or crisis help?</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
