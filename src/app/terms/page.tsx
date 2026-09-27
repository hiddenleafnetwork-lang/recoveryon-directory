import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of use", description: "Terms that apply when using TreatmentLane and its directory information.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Last updated September 28, 2026</span><h1>Terms of use</h1><p>These terms govern your use of TreatmentLane. By using the site, you agree to them.</p></div></section><article className="content-shell prose">
    <h2>Informational directory only</h2><p>TreatmentLane provides general directory and educational information. We are not a treatment provider, referral service, insurer, emergency service, medical professional, or substitute for professional advice.</p>
    <h2>No endorsement or guarantee</h2><p>A listing, verification label, review date, or link does not guarantee quality, safety, availability, licensing status, treatment outcomes, insurance coverage, or suitability. Information can change. Confirm important details directly with providers, regulators, insurers, and qualified professionals.</p>
    <h2>Emergencies</h2><p>Do not use this site for emergencies. Call 911 when there is immediate danger. In the United States, call or text 988 for crisis support. See <Link href="/emergency-help">emergency help</Link>.</p>
    <h2>Acceptable use</h2><p>You may use the site for lawful personal and professional research. You may not interfere with security, submit knowingly false information, impersonate another person, scrape the service in a way that burdens it, or use directory data for unlawful discrimination, harassment, or spam.</p>
    <h2>Provider submissions</h2><p>By submitting listing information, you confirm that it is accurate to the best of your knowledge and that you are authorized to provide it. We may verify, edit, decline, unpublish, or label information according to our editorial process.</p>
    <h2>Intellectual property</h2><p>The site design, original text, brand, and software are protected by applicable law. Provider names and third-party marks belong to their respective owners. Linking to TreatmentLane does not create a partnership or endorsement.</p>
    <h2>Third-party services</h2><p>The site links to third-party websites that we do not control. Their content, availability, privacy, and terms are their responsibility.</p>
    <h2>Disclaimers and limitation</h2><p>The site is provided on an “as available” basis to the extent permitted by law. We do not promise uninterrupted access or error-free information. To the extent permitted by law, TreatmentLane is not liable for decisions, treatment outcomes, or damages arising from reliance on directory or third-party information.</p>
    <h2>Changes and contact</h2><p>We may update these terms as the service changes. Questions can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
  </article></>;
}
