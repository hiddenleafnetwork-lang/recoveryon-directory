import type { Metadata } from "next";
import { ProviderApplicationForm } from "@/components/provider-application-form";

export const metadata: Metadata = { title: "List or claim your organization", description: "Submit a treatment, recovery, or behavioral health organization for TreatmentLane review.", alternates: { canonical: "/providers/apply" } };

export default function ApplyPage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Provider applications</span><h1>List or claim your organization</h1><p>Submit accurate information for editorial review. Payment does not determine verification status or whether a listing is published.</p></div></section><section className="form-section"><div className="content-shell"><div className="notice"><strong>Before you start:</strong> You must be authorized to represent the organization. We may verify the request using official contact information or public records.</div><div style={{height: 24}} /><ProviderApplicationForm /></div></section></>;
}
