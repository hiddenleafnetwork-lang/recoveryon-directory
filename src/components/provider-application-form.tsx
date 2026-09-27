"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { states } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

export function ProviderApplicationForm() {
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
    return <div className="success-panel"><CheckCircle2 size={32} /><h2>Application received</h2><p>We will review the organization and contact you if we need additional information.</p></div>;
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <label>Organization name<input name="organizationName" required maxLength={160} /></label>
        <label>Your name<input name="contactName" required maxLength={120} /></label>
        <label>Work email<input name="workEmail" type="email" required maxLength={200} /></label>
        <label>Phone<input name="phone" type="tel" maxLength={40} /></label>
        <label>Website<input name="website" type="url" placeholder="https://" maxLength={300} /></label>
        <label>Relationship to organization<select name="relationship" required defaultValue=""><option value="" disabled>Select one</option><option>Owner or executive</option><option>Employee</option><option>Authorized marketing partner</option><option>Other authorized representative</option></select></label>
        <label>City<input name="city" required maxLength={100} /></label>
        <label>State<select name="state" required defaultValue=""><option value="" disabled>Select state</option>{states.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}</select></label>
        <label className="full-field">Notes<textarea name="notes" rows={5} maxLength={2000} placeholder="Tell us what services you provide and whether this is a new listing or a claim." /></label>
        <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {status === "error" && <p className="form-error" role="alert">{message}</p>}
      <button className="button" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Submitting…" : "Submit for review"}</button>
      <p className="form-disclaimer">Submitting does not guarantee publication or a verification label. We may contact the organization and review public records.</p>
    </form>
  );
}
