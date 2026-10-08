"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { LocationAutocompleteInput } from "@/components/location-autocomplete-input";
import { insuranceOptions } from "@/lib/insurance";

const careChoices = [
  { label: "Help with withdrawal or detox", parameter: "level", value: "Withdrawal management / detox" },
  { label: "A place to stay during treatment", parameter: "level", value: "Residential treatment" },
  { label: "Treatment while living at home", parameter: "level", value: "Outpatient treatment" },
  { label: "Mental health and substance use support", parameter: "specialty", value: "Co-occurring mental health and substance use" },
  { label: "Medication for opioid use disorder", parameter: "level", value: "Prescribes Medications For Opioid Use Disorder" },
  { label: "A sober or recovery residence", parameter: "level", value: "Sober living" },
] as const;

export function GuidedFinder() {
  const router = useRouter();
  const [careIndex, setCareIndex] = useState("0");
  const [insurance, setInsurance] = useState("");
  const [location, setLocation] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const care = careChoices[Number(careIndex)];
    const query = new URLSearchParams();
    query.set(care.parameter, care.value);
    if (insurance) query.set("insurance", insurance);
    if (location.trim()) query.set("location", location.trim());
    query.set("complete", "1");
    router.push(`/directory?${query.toString()}`);
  }

  return (
    <form className="finder-card" onSubmit={submit}>
      <div className="finder-step">
        <span><strong>1</strong> What kind of support are you looking for?</span>
        <select aria-label="Support needed" value={careIndex} onChange={(event) => setCareIndex(event.target.value)}>
          {careChoices.map((choice, index) => <option key={choice.value} value={index}>{choice.label}</option>)}
        </select>
      </div>
      <div className="finder-step">
        <span><strong>2</strong> Is there an insurance or payment preference?</span>
        <select aria-label="Insurance or payment preference" value={insurance} onChange={(event) => setInsurance(event.target.value)}>
          <option value="">No preference</option>
          {insuranceOptions.map((option) => <option key={option.slug} value={option.name}>{option.name}</option>)}
        </select>
        <small>Insurance information is based on public source data and must be confirmed.</small>
      </div>
      <div className="finder-step">
        <span><strong>3</strong> Where should we look?</span>
        <label className="finder-location"><span className="sr-only">City, state, or ZIP code</span><MapPin size={18} aria-hidden="true" /><LocationAutocompleteInput onValueChange={setLocation} /></label>
      </div>
      <div className="finder-assurance"><ShieldCheck size={19} /><span>This tool does not diagnose or recommend care. It narrows public listings so you can ask better questions.</span></div>
      <button className="button finder-submit" type="submit">See matching listings <ArrowRight size={18} /></button>
      <p className="finder-note"><CheckCircle2 size={16} /> Results start with more complete source records. You can remove that filter at any time.</p>
    </form>
  );
}
