"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/contact-inquiries", {
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
      setMessage(result.message || "We could not submit your message.");
      return;
    }
    form.reset();
    setStatus("success");
  }

  if (status === "success") return <div className="success-panel"><CheckCircle2 size={32} /><h2>Message received</h2><p>Thank you. We will review your message and respond when a reply is needed.</p></div>;

  return <form className="form-card" onSubmit={submit}>
    <div className="form-grid">
      <label>Your name<input name="name" required maxLength={120} /></label>
      <label>Email<input name="email" type="email" required maxLength={200} /></label>
      <label className="full-field">Topic<select name="topic" required defaultValue=""><option value="" disabled>Select one</option><option value="general">General question</option><option value="provider">Provider listing</option><option value="partnership">Partnership or media</option><option value="privacy">Privacy request</option><option value="other">Other</option></select></label>
      <label className="full-field">Message<textarea name="message" required rows={6} maxLength={3000} /></label>
      <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
    </div>
    {status === "error" && <p className="form-error" role="alert">{message}</p>}
    <button className="button" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Sending…" : "Send message"}</button>
    <p className="form-disclaimer">Do not use this form for emergencies or confidential medical information.</p>
  </form>;
}
