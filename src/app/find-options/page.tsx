import type { Metadata } from "next";
import Link from "next/link";
import { GuidedFinder } from "@/components/guided-finder";

export const metadata: Metadata = {
  title: "Find treatment options",
  description: "Answer three simple questions to narrow TreatmentLane directory listings by support, payment preference, and location.",
  alternates: { canonical: "/find-options" },
};

export default function FindOptionsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="kicker plain">Guided search</span>
          <h1>Find a useful place to start.</h1>
          <p>Answer three simple questions. We will turn your choices into directory filters, without collecting your answers or choosing a provider for you.</p>
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
