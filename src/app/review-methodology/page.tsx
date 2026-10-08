import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Review sourcing and summary methodology",
  description: "How TreatmentLane sources, matches, summarizes, and displays third-party review signals.",
  alternates: { canonical: "/review-methodology" },
};

export default function ReviewMethodologyPage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Review methodology</span><h1>How we use public reviews responsibly</h1><p>Reviews can reveal useful patterns, but they are subjective, easy to misunderstand, and not proof of clinical quality.</p></div></section><article className="content-shell prose">
    <h2>What we collect</h2><p>We collect a limited sample of the newest public Google Maps reviews for a matched provider location. We record the source rating, total public rating count, sampled star distribution, collection date, and recurring themes. We do not store full review text or reviewer names, profile links, or photos.</p>
    <h2>How we match a location</h2><p>Our importer checks the address, ZIP code, city, state, and organization name before accepting a Google Maps result. Results below our matching threshold are rejected instead of published. A match confirms the source record belongs to the same location. It does not verify claims made by reviewers.</p>
    <h2>How summaries are made</h2><p>A structured AI process summarizes only the supplied review sample. It must present positive and critical feedback fairly, avoid quoting or identifying reviewers, and include only themes supported by at least two sampled reviews. It cannot call a provider safe, effective, or clinically superior. The page shows the sample size, collection date, star distribution, and limitations so readers can judge the summary in context.</p>
    <h2>Why source totals stay separate</h2><p>Some treatment directories display reviews syndicated from Google or another platform. We show each source separately and never add their review counts together because that could count the same review more than once. A directory rating is not treated as independent evidence unless its origin is clear.</p>
    <h2>Ordering and freshness</h2><p>Samples are collected in newest-first order and normally refreshed no more than once every 30 days. Newest-first sampling helps readers see recent experiences, but it may not represent the full history of a provider. Review volume, ratings, and source pages can change between refreshes.</p>
    <h2>What reviews cannot establish</h2><p>Reviews may be incomplete, biased, mistaken, incentivized, or posted by people whose relationship to the organization cannot be confirmed. They cannot establish licensing, safety, treatment effectiveness, clinical outcomes, or whether a provider is suitable for a particular person. Verify important facts through official records and direct questions.</p>
    <h2>Independence and corrections</h2><p>Sponsorship cannot change a summary, remove repeated criticism, or alter our source-overlap warning. Providers and readers may <Link href="/corrections">request a correction</Link>. We review requests against the public source and our collection record.</p>
    <h2>Standards we follow</h2><p>Our display follows <a href="https://developers.google.com/maps/documentation/places/web-service/policies" rel="noopener noreferrer" target="_blank">Google Maps attribution and content policies</a>. Our review practices are informed by the <a href="https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers" rel="noopener noreferrer" target="_blank">FTC guidance on reviews and testimonials</a>. Read our separate <Link href="/how-we-verify">listing verification standards</Link> and <Link href="/privacy">privacy policy</Link>.</p>
  </article></>;
}
