import type { Metadata } from "next";
import { ProviderApplicationForm } from "@/components/provider-application-form";

export const metadata: Metadata = { title: "List or claim your organization", description: "Submit a treatment, recovery, or behavioral health organization for TreatmentLane review.", alternates: { canonical: "/providers/apply" } };

function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] || "" : value || ""; }

export default async function ApplyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const providerPath = single(params.provider).slice(0, 300);
  const organizationName = single(params.name).slice(0, 160);
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Center owner hub</span><h1>Claim, correct, and strengthen your profile</h1><p>Claiming and correcting a listing is free. Submit current admissions, availability, insurance, cost, program, and verification information for moderated review.</p></div></section><section className="section owner-benefits-section"><div className="content-shell"><div className="owner-benefits-grid"><div><strong>Control accuracy</strong><span>Correct every location without changing independent public-source history.</span></div><div><strong>Build trust</strong><span>Provide current licenses, accreditation, contacts, costs, and program details.</span></div><div><strong>Help patients act</strong><span>Share admissions hours, availability, insurance context, and realistic next steps.</span></div></div></div></section><section className="form-section"><div className="content-shell"><div className="notice"><strong>Before you start:</strong> You must be authorized to represent the organization. Submissions do not instantly change public clinical information. We verify identity and evidence first.</div><div style={{height: 24}} /><ProviderApplicationForm defaultProviderPath={providerPath} defaultOrganizationName={organizationName} /></div></section></>;
}
