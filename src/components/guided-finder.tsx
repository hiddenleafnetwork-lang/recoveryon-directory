"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
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
  const [focus, setFocus] = useState("");
  const [audience, setAudience] = useState("");
  const [medication, setMedication] = useState("");
  const [access, setAccess] = useState("");
  const [insurance, setInsurance] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const care = careChoices[Number(careIndex)];
    const query = new URLSearchParams();
    query.set(care.parameter, care.value);
    if (focus) query.set("specialty", focus);
    if (audience) query.set("audience", audience);
    if (medication) query.set("medication", medication);
    if (access) query.set("access", access);
    if (insurance) query.set("insurance", insurance);
    if (location.trim()) query.set("location", location.trim());
    if (urgency) query.set("urgency", urgency);
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
        <span><strong>2</strong> Is there an additional clinical focus?</span>
        <select aria-label="Clinical focus" value={focus} onChange={(event) => setFocus(event.target.value)}>
          <option value="">No additional focus</option>
          <option>Co-occurring mental health and substance use</option>
          <option>Trauma Specialized</option>
          <option>Mental health treatment</option>
          <option>Substance use treatment</option>
          <option>Detox-focused</option>
          <option>Low Cost</option>
        </select>
      </div>
      <div className="finder-step">
        <span><strong>3</strong> Who should the program be prepared to serve?</span>
        <select aria-label="Population served" value={audience} onChange={(event) => setAudience(event.target.value)}>
          <option value="">No population preference</option>
          <option>Adolescents</option>
          <option>Young Adult</option>
          <option>Women Only</option>
          <option>Men Only</option>
          <option>Veterans</option>
          <option value="Lgbtq">LGBTQ+ people</option>
        </select>
      </div>
      <div className="finder-step">
        <span><strong>4</strong> Is specific medication support important?</span>
        <select aria-label="Medication support" value={medication} onChange={(event) => setMedication(event.target.value)}>
          <option value="">No medication preference</option>
          <option>Buprenorphine</option>
          <option>Naltrexone</option>
          <option>Methadone Program</option>
          <option>Medication-assisted treatment</option>
        </select>
      </div>
      <div className="finder-step">
        <span><strong>5</strong> Is an access option important?</span>
        <select aria-label="Access option" value={access} onChange={(event) => setAccess(event.target.value)}>
          <option value="">No access preference</option>
          <option value="Virtual / telehealth">Virtual or telehealth</option>
          <option>Transitional Housing</option>
          <option>Spanish Speaking</option>
        </select>
      </div>
      <div className="finder-step">
        <span><strong>6</strong> Is there an insurance or payment preference?</span>
        <select aria-label="Insurance or payment preference" value={insurance} onChange={(event) => setInsurance(event.target.value)}>
          <option value="">No preference</option>
          {insuranceOptions.map((option) => <option key={option.slug} value={option.name}>{option.name}</option>)}
        </select>
        <small>Insurance information is based on public source data and must be confirmed.</small>
      </div>
      <div className="finder-step">
        <span><strong>7</strong> Where should we look?</span>
        <label className="finder-location"><span className="sr-only">City, state, or ZIP code</span><MapPin size={18} aria-hidden="true" /><LocationAutocompleteInput onValueChange={setLocation} /></label>
      </div>
      <div className="finder-step">
        <span><strong>8</strong> How soon is help needed?</span>
        <select aria-label="When help is needed" value={urgency} onChange={(event) => setUrgency(event.target.value)}>
          <option value="">No timing selected</option>
          <option value="today">Today or within 24 hours</option>
          <option value="week">Within one week</option>
          <option value="planning">Planning ahead</option>
        </select>
        {urgency === "today" && <small className="finder-urgent-note"><Clock3 size={15} /> Directory availability is not live. Call each center before traveling. For immediate danger, call 911 or 988.</small>}
      </div>
      <div className="finder-assurance"><ShieldCheck size={19} /><span>This tool does not diagnose or recommend care. It narrows public listings so you can ask better questions.</span></div>
      <button className="button finder-submit" type="submit">See matching listings <ArrowRight size={18} /></button>
      <p className="finder-note"><CheckCircle2 size={16} /> Results start with more complete source records. You can remove that filter at any time.</p>
    </form>
  );
}
