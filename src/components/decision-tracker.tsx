"use client";

import { Printer, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type TrackerProvider = { id: string; name: string };
type ProviderProgress = { checks: Record<string, boolean>; notes: string };
type TrackerState = Record<string, ProviderProgress>;

const TRACKER_KEY = "treatmentlane-private-decision-tracker";
const checks = [
  ["contacted", "Contacted the center directly"],
  ["availability", "Confirmed current availability"],
  ["clinicalFit", "Confirmed clinical and medication fit"],
  ["insurance", "Confirmed this location with the insurance plan"],
  ["estimate", "Received a written cost estimate"],
  ["license", "Checked license and accreditation"],
] as const;

function readTracker(): TrackerState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TRACKER_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as TrackerState : {};
  } catch { return {}; }
}

export function DecisionTracker({ providers }: { providers: TrackerProvider[] }) {
  const [state, setState] = useState<TrackerState>({});
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setState(readTracker()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function update(providerId: string, next: ProviderProgress) {
    const updated = { ...state, [providerId]: next };
    setState(updated);
    window.localStorage.setItem(TRACKER_KEY, JSON.stringify(updated));
  }

  function clear() {
    const updated = { ...state };
    providers.forEach((provider) => delete updated[provider.id]);
    setState(updated);
    window.localStorage.setItem(TRACKER_KEY, JSON.stringify(updated));
  }

  return <section className="decision-tracker">
    <div className="decision-tracker-heading"><div><span className="section-label">Private decision tracker</span><h2>Record what you have confirmed</h2><p>These notes stay only in this browser. TreatmentLane does not receive or store them.</p></div><div className="decision-tracker-actions"><button className="button button-secondary button-small" type="button" onClick={() => window.print()}><Printer size={16} /> Print comparison</button><button className="text-button" type="button" onClick={clear}><Trash2 size={15} /> Clear private notes</button></div></div>
    <div className="decision-tracker-grid">{providers.map((provider) => {
      const progress = state[provider.id] || { checks: {}, notes: "" };
      return <article key={provider.id}><h3>{provider.name}</h3><div className="tracker-checks">{checks.map(([key, label]) => <label key={key}><input type="checkbox" checked={Boolean(progress.checks[key])} onChange={(event) => update(provider.id, { ...progress, checks: { ...progress.checks, [key]: event.target.checked } })} /><span>{label}</span></label>)}</div><label className="tracker-notes"><span>Private notes</span><textarea rows={4} maxLength={1200} value={progress.notes} onChange={(event) => update(provider.id, { ...progress, notes: event.target.value })} placeholder="Questions, names, dates, coverage details, or next steps" /></label></article>;
    })}</div>
    <p className="decision-tracker-safety"><ShieldCheck size={16} /> Do not save highly sensitive medical details on a shared device.</p>
  </section>;
}
