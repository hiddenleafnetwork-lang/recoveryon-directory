"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { states } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

export function ProviderApplicationForm({ defaultProviderPath = "", defaultOrganizationName = "" }: { defaultProviderPath?: string; defaultOrganizationName?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/provider-submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    if (!response) {
      setStatus("error");
      setMessage("We could not connect. Please try again or email hello@treatmentlane.com.");
      return;
    }
    const result = await response.json().catch(() => ({ message: "Something went wrong." }));
    if (!response.ok) {
      setStatus("error");
      setMessage(result.message || "We could not submit the form. Please try again.");
      return;
    }
    form.reset();
    setStatus("success");
  }

  if (status === "success") {
    return <div className="success-panel" role="status"><CheckCircle2 size={32} /><h2>Application received</h2><p>We will review the organization and contact you if we need additional information.</p></div>;
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <p className="form-required-note"><span className="required-mark" aria-hidden="true">*</span> Required fields</p>
      <div className="form-grid">
        <label><span className="field-label">Request type <span className="required-mark" aria-hidden="true">*</span></span><select name="requestType" required defaultValue={defaultProviderPath ? "claim-existing" : "list-new"}><option value="claim-existing">Claim an existing listing</option><option value="update-profile">Update an existing profile</option><option value="update-availability">Update availability or admissions information</option><option value="list-new">Add a new organization</option></select></label>
        <label><span className="field-label">Existing TreatmentLane profile <span className="optional-label">(if applicable)</span></span><input name="providerPath" defaultValue={defaultProviderPath} maxLength={300} placeholder="/providers/organization-name" /></label>
        <label><span className="field-label">Organization name <span className="required-mark" aria-hidden="true">*</span></span><input name="organizationName" defaultValue={defaultOrganizationName} required maxLength={160} /></label>
        <label><span className="field-label">Your name <span className="required-mark" aria-hidden="true">*</span></span><input name="contactName" required maxLength={120} /></label>
        <label><span className="field-label">Work email <span className="required-mark" aria-hidden="true">*</span></span><input name="workEmail" type="email" required maxLength={200} /></label>
        <label><span className="field-label">Phone <span className="optional-label">(optional)</span></span><input name="phone" type="tel" maxLength={40} /></label>
        <label><span className="field-label">Website <span className="optional-label">(optional)</span></span><input name="website" type="url" placeholder="https://" maxLength={300} /></label>
        <label><span className="field-label">Relationship to organization <span className="required-mark" aria-hidden="true">*</span></span><select name="relationship" required defaultValue=""><option value="" disabled>Select one</option><option>Owner or executive</option><option>Employee</option><option>Authorized marketing partner</option><option>Other authorized representative</option></select></label>
        <label><span className="field-label">City <span className="required-mark" aria-hidden="true">*</span></span><input name="city" required maxLength={100} /></label>
        <label><span className="field-label">State <span className="required-mark" aria-hidden="true">*</span></span><select name="state" required defaultValue=""><option value="" disabled>Select state</option>{states.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}</select></label>
        <label><span className="field-label">Current availability <span className="optional-label">(moderated before publication)</span></span><select name="availabilityStatus" defaultValue=""><option value="">Not submitting availability</option><option value="accepting">Accepting assessments or admissions</option><option value="waitlist">Waitlist or limited availability</option><option value="not-accepting">Not currently accepting</option><option value="unknown">Availability changes, call to confirm</option></select></label>
        <label><span className="field-label">Estimated wait <span className="optional-label">(optional)</span></span><input name="estimatedWait" maxLength={160} placeholder="Example: same-day assessment or 3 to 5 days" /></label>
        <label className="full-field"><span className="field-label">Admissions hours <span className="optional-label">(optional)</span></span><input name="admissionsHours" maxLength={300} placeholder="Include time zone and whether phone assessments are available after hours" /></label>
        <label className="full-field"><span className="field-label">Insurance updates <span className="optional-label">(optional)</span></span><textarea name="insuranceUpdates" rows={3} maxLength={1500} placeholder="List plans, in-network status if known, prior authorization, and what patients must verify." /></label>
        <label className="full-field"><span className="field-label">Cost updates <span className="optional-label">(optional)</span></span><textarea name="costUpdates" rows={3} maxLength={1500} placeholder="Self-pay range, deposits, payment assistance, and what the estimate includes." /></label>
        <label className="full-field"><span className="field-label">Profile changes <span className="optional-label">(optional)</span></span><textarea name="profileUpdates" rows={5} maxLength={3000} placeholder="Programs, medications, populations served, accessibility, languages, staff, photos, licenses, or other changes." /></label>
        <label className="full-field"><span className="field-label">Notes <span className="optional-label">(optional)</span></span><textarea name="notes" rows={5} maxLength={2000} placeholder="Tell us what services you provide and whether this is a new listing or a claim." /></label>
        <label className="full-field checkbox-field owner-attestation"><input name="attested" type="checkbox" value="true" required /><span>I am authorized to represent this organization and understand that TreatmentLane may verify submitted information before publication.</span></label>
        <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {status === "error" && <p className="form-error" role="alert">{message}</p>}
      <button className="button" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Submitting…" : "Submit for review"}</button>
      <p className="form-disclaimer">Changes remain pending until reviewed. Availability is not presented as live unless TreatmentLane can verify the organization and timestamp the update.</p>
    </form>
  );
}
