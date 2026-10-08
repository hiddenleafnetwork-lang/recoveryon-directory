import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Clock3, DollarSign, ExternalLink, Images, Layers3, Mail, MapPin, Navigation, Phone, Pill, ShieldCheck, Star } from "lucide-react";
import { CompareButton } from "@/components/compare-button";
import { JsonLd } from "@/components/json-ld";
import { ProviderLocationMap } from "@/components/provider-location-map";
import { ProviderActionLink } from "@/components/provider-action-link";
import { providerPath } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import type { Provider, ProviderProfileDetails, ReviewSignal, ReviewTheme } from "@/lib/types";

export const verificationLabels = {
  listed: "Directory listing",
  "data-verified": "TreatmentLane data verified",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

function unique(values: string[]) {
  return values.filter((item, index) => values.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index);
}

function InformationTags({ items }: { items: string[] }) {
  return <div className="information-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

function importedSourceRatingSignal(provider: Provider): ReviewSignal | null {
  if (provider.sourceRatingValue === null || provider.sourceRatingCount === null || !provider.sourceUrl) return null;
  let sourceType: ReviewSignal["sourceType"] = "other";
  let sourceName = "Public source";
  try {
    const hostname = new URL(provider.sourceUrl).hostname.replace(/^www\./, "");
    if (hostname === "recovery.com" || hostname.endsWith(".recovery.com")) {
      sourceType = "recovery.com";
      sourceName = "Recovery.com";
    } else if (hostname === "rehab.com" || hostname.endsWith(".rehab.com")) {
      sourceType = "rehab.com";
      sourceName = "Rehab.com";
    } else if (hostname === "rehabs.com" || hostname.endsWith(".rehabs.com")) {
      sourceType = "rehabs.com";
      sourceName = "Rehabs.com";
    }
  } catch { /* Keep the generic source label for a malformed legacy URL. */ }
  return {
    sourceType, sourceName, sourceUrl: provider.sourceUrl, externalPlaceId: null,
    averageRating: provider.sourceRatingValue, reviewCount: provider.sourceRatingCount,
    sampledReviewCount: 0, textReviewCount: 0, ratingDistribution: {}, reviewSummary: null,
    positiveThemes: [], concernThemes: [], summaryLimitations: null, reviewDateStart: null, reviewDateEnd: null,
    matchConfidence: null,
    sourceNotes: `Rating and displayed review count imported from the linked ${sourceName} record. A separate Google review sample has not yet been collected for this listing.`,
    collectionMethod: "Imported source record", fetchedAt: provider.updatedAt,
  };
}

function ReviewThemes({ title, themes, tone }: { title: string; themes: ReviewTheme[]; tone: "positive" | "critical" }) {
  return <div className={`review-theme-group ${tone}`}><h3>{title}</h3>{themes.length
    ? <ul>{themes.map((theme) => <li key={theme.label}><span>{theme.label}</span><small>{theme.reviewCount} sampled reviews</small></li>)}</ul>
    : <p>No repeated {tone === "positive" ? "positive" : "critical"} theme met our two-review threshold in this sample.</p>}</div>;
}

function GoogleReviewSignal({ signal }: { signal: ReviewSignal }) {
  const total = Math.max(signal.sampledReviewCount, 1);
  const hasThemeAnalysis = Boolean(signal.reviewSummary || signal.positiveThemes.length || signal.concernThemes.length);
  return <div className="review-source-card google-review-card">
    <div className="review-source-heading"><div><span className="review-source-name">Google Maps</span><h3>{signal.averageRating?.toFixed(1) || "No rating"} {signal.reviewCount !== null && <small>from {signal.reviewCount.toLocaleString()} public ratings</small>}</h3></div><a href={signal.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">View on Google Maps <ExternalLink size={14} /></a></div>
    <p className="review-sample-meta">Sample of {signal.sampledReviewCount.toLocaleString()} newest ratings collected {new Date(signal.fetchedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}. {signal.textReviewCount.toLocaleString()} included written feedback{hasThemeAnalysis ? " used for the theme summary" : "; theme analysis has not yet been generated for this sample"}. The full rating and count come from Google Maps.</p>
    {signal.sampledReviewCount > 0 && <div className="rating-distribution" aria-label={`Star distribution in the ${signal.sampledReviewCount} review sample`}>{[5, 4, 3, 2, 1].map((stars) => {
      const count = Number(signal.ratingDistribution[String(stars)] || 0);
      return <div className="rating-row" key={stars}><span>{stars} star</span><div><i style={{ width: `${Math.round((count / total) * 100)}%` }} /></div><strong>{count}</strong></div>;
    })}</div>}
    {signal.reviewSummary && <div className="review-summary"><h3>What recent reviewers report</h3><p>{signal.reviewSummary}</p></div>}
    {hasThemeAnalysis && <div className="review-theme-grid"><ReviewThemes title="Positive themes" themes={signal.positiveThemes} tone="positive" /><ReviewThemes title="Critical themes" themes={signal.concernThemes} tone="critical" /></div>}
    {signal.summaryLimitations && <p className="review-limitations"><strong>Limits:</strong> {signal.summaryLimitations}</p>}
  </div>;
}

function DirectoryReviewSignal({ signal }: { signal: ReviewSignal }) {
  return <div className="review-source-card directory-review-card"><div><span className="review-source-name">{signal.sourceName}</span><h3>{signal.averageRating?.toFixed(1) || "No rating"} {signal.reviewCount !== null && <small>from {signal.reviewCount.toLocaleString()} displayed reviews</small>}</h3></div><p>{signal.sourceNotes || "Rating displayed on the linked third-party directory source."}</p><a href={signal.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">View source record <ExternalLink size={14} /></a></div>;
}

export function ProviderDetailPage({ provider, organizationProviders = [provider], reviewSignals = [], profileDetails }: {
  provider: Provider; organizationProviders?: Provider[]; reviewSignals?: ReviewSignal[]; profileDetails: ProviderProfileDetails;
}) {
  const gallery = provider.imageUrls.slice(0, 5);
  const careTypes = unique([...provider.treatmentTypes, ...provider.levelsOfCare, ...provider.categories]);
  const medicationSupport = unique([...profileDetails.medicationServices, ...provider.therapies, ...provider.specialties]).filter((item) => /medication-assisted|buprenorphine|naltrexone|methadone|acamprosate|disulfiram|withdrawal|opioid treatment/i.test(item));
  const counselingApproaches = unique(provider.therapies).filter((item) => !medicationSupport.some((medication) => medication.toLowerCase() === item.toLowerCase()));
  const practicalSupport = unique([...profileDetails.supportServices, ...profileDetails.accessServices]);
  const path = providerPath(provider);
  const fullAddress = provider.address && provider.address.toLowerCase().includes(provider.city.toLowerCase())
    ? provider.address : [provider.address, provider.city, provider.state, provider.postalCode].filter(Boolean).join(", ");
  const officialWebsite = provider.website || profileDetails.officialWebsite;
  const importedSourceSignal = importedSourceRatingSignal(provider);
  const hasImportedSourceSignal = importedSourceSignal && reviewSignals.some((signal) => signal.sourceType === importedSourceSignal.sourceType || signal.sourceUrl === importedSourceSignal.sourceUrl);
  const displayedReviewSignals = importedSourceSignal && !hasImportedSourceSignal ? [...reviewSignals, importedSourceSignal] : reviewSignals;
  const hasGoogleReviewSignal = displayedReviewSignals.some((signal) => signal.sourceType === "google");
  const directionsQuery = fullAddress;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(directionsQuery)}`;
  const hasMultipleLocations = organizationProviders.length > 1;
  const missingDetails = [
    !provider.licenseSummary && "Current state license number and standing",
    provider.accreditation.length === 0 && "Current accreditation details",
    !provider.priceRange && "Published self-pay price or cost range",
    !provider.insuranceDetails && "Plan-specific network status and prior authorization rules",
    provider.amenities.length === 0 && "Room, accessibility, transportation, meal, and visitor details",
    !provider.treatmentDuration && "Expected program length and step-down schedule",
  ].filter(Boolean) as string[];
  const admissionsQuestions = [
    `Does the ${provider.city} location currently have availability for the needed level of care?`,
    "Who completes the clinical assessment, and what determines admission or referral elsewhere?",
    provider.insurance.length ? "Is this exact location in network for the member's plan, and what is the written cost estimate?" : "Which insurance plans are accepted here, and what is the written cost estimate?",
    medicationSupport.length ? "Which listed medications are available here, and who manages them?" : "Is medication for withdrawal or substance use treatment available when clinically appropriate?",
    "What does a typical weekday and weekend schedule include?",
    "How are family participation, discharge planning, and follow-up care handled?",
    "What happens if a person needs a higher or lower level of care?",
  ];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "MedicalBusiness", name: provider.name,
    url: absoluteUrl(path), telephone: provider.phone || undefined, image: provider.featuredImageUrl || undefined,
    address: { "@type": "PostalAddress", streetAddress: provider.address || undefined, addressLocality: provider.city, addressRegion: provider.state, postalCode: provider.postalCode || undefined, addressCountry: "US" },
  };

  return <>
    <JsonLd data={jsonLd} />
    <section className="provider-hero"><div className="shell"><div className="breadcrumb"><Link href="/directory">Directory</Link><span>/</span>{hasMultipleLocations ? <><Link href={`/providers/${provider.organizationSlug}`}>{provider.name} locations</Link><span>/</span><span>{provider.city}</span></> : <span>{provider.name}</span>}</div><div className="provider-hero-copy"><div>{provider.isSponsored && <span className="kicker plain">Sponsored placement</span>}<h1>{provider.name}</h1><p><MapPin size={18} /> {provider.city}, {provider.state}</p></div><div className="provider-hero-status"><BadgeCheck size={18} /> {verificationLabels[provider.verificationStatus]}</div></div></div></section>

    {gallery.length > 0 && <section className="shell provider-gallery-wrap"><div className={`provider-gallery gallery-count-${Math.min(gallery.length, 5)}`}>{gallery.map((image, index) => <div className="provider-gallery-image" key={image}><Image src={image} alt={`${provider.name} facility${index ? ` photo ${index + 1}` : ""}`} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 65vw" : "(max-width: 760px) 50vw, 25vw"} priority={index === 0} unoptimized /></div>)}</div><p className="image-attribution"><Images size={14} /> Photos supplied by the public source listing. Confirm that photos are current with the organization.</p></section>}

    <div className="shell provider-detail-grid">
      <main className="provider-content">
        <div className="notice"><strong>{verificationLabels[provider.verificationStatus]}.</strong> Information below comes from public source data and has not necessarily been confirmed by the provider. <Link href="/how-we-verify">Read our verification standards</Link>.</div>
        <nav className="profile-jump-links" aria-label="On this page"><span>On this page</span><a href="#overview">Overview</a><a href="#map">Map</a><a href="#access">Availability</a>{displayedReviewSignals.length > 0 && <a href="#reviews">Reviews</a>}<a href="#care">Care</a><a href="#approaches">Approaches</a><a href="#payment">Payment</a><a href="#admissions">Admissions</a><a href="#safety">Safety</a><a href="#questions">Questions</a></nav>

        {hasMultipleLocations && <section className="listing-section provider-location-section"><span className="section-label">Multiple locations</span><h2>{provider.name} has {organizationProviders.length.toLocaleString()} published locations</h2><p>You are viewing the {provider.city}, {provider.state} location. Choose another location to compare its address, services, contact details, and verification information.</p><div className="provider-location-grid">{organizationProviders.map((location) => {
          const isCurrent = location.id === provider.id; const label = `${location.city}, ${location.state}`;
          return isCurrent ? <div className="provider-location-link is-current" key={location.id}><MapPin size={18} /><span><strong>{label}</strong><small>Current location</small></span></div> : <Link className="provider-location-link" href={providerPath(location)} key={location.id}><MapPin size={18} /><span><strong>{label}</strong><small>View location details</small></span></Link>;
        })}</div><Link className="text-link provider-all-locations-link" href={`/providers/${provider.organizationSlug}`}>View all {provider.name} locations</Link></section>}

        <section className="listing-section" id="overview"><span className="section-label">Overview</span><h2>About {provider.name}</h2><p className="listing-lead">{provider.description || "Detailed information for this organization has not yet been published."}</p><div className="quick-facts">
          {careTypes.length > 0 && <div><Layers3 /><span>Care information</span><strong>{provider.levelsOfCare.length || careTypes.length} listed options</strong></div>}
          {provider.treatmentDuration && <div><Clock3 /><span>Typical duration</span><strong>{provider.treatmentDuration}</strong></div>}
          {provider.priceRange && <div><DollarSign /><span>Source price information</span><strong>{provider.priceRange}</strong></div>}
          {profileDetails.operatingDays.length > 0 && <div><CalendarDays /><span>Operating days listed</span><strong>{profileDetails.operatingDays.length === 7 ? "Monday through Sunday" : profileDetails.operatingDays.join(", ")}</strong></div>}
          {profileDetails.evidenceSourceCount && <div><ShieldCheck /><span>Matched source coverage</span><strong>{profileDetails.evidenceSourceCount} public sources</strong></div>}
          {reviewSignals[0]?.averageRating !== null && reviewSignals[0]?.averageRating !== undefined && <div><Star /><span>{reviewSignals[0].sourceName} rating</span><strong>{reviewSignals[0].averageRating.toFixed(1)} from {reviewSignals[0].reviewCount?.toLocaleString() || "an unlisted number of"} ratings</strong></div>}
          {reviewSignals.length === 0 && provider.sourceRatingValue !== null && provider.sourceRatingCount !== null && <div><Star /><span>Source rating</span><strong>{provider.sourceRatingValue.toFixed(1)} from {provider.sourceRatingCount.toLocaleString()} ratings</strong></div>}
        </div></section>

        <section className="listing-section provider-map-section" id="map"><span className="section-label">Location map</span><h2>Where to find {provider.name}</h2><p>{fullAddress}. Confirm the destination and intake instructions with the organization before traveling.</p><ProviderLocationMap name={provider.name} address={fullAddress} latitude={provider.latitude} longitude={provider.longitude} /><div className="provider-map-actions"><ProviderActionLink className="button button-secondary button-small" eventType="directions" external href={directionsHref} providerId={provider.id}><Navigation size={16} /> Get directions</ProviderActionLink><ProviderActionLink eventType="google-maps" external href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directionsQuery)}`} providerId={provider.id}>Open in Google Maps <ExternalLink size={14} /></ProviderActionLink></div></section>

        <section className="listing-section provider-access-section" id="access"><span className="section-label">Availability and next step</span><h2>Confirm access directly with this location</h2><div className="availability-status-card"><Clock3 size={22} /><div><strong>Live availability has not been independently confirmed</strong><p>Ask about the needed level of care, the earliest assessment, admissions hours, medication continuity, and what records are required before traveling.</p></div></div><div className="provider-access-actions">{provider.phone && <ProviderActionLink className="button" eventType="call" href={`tel:${provider.phone}`} providerId={provider.id}><Phone size={17} /> Call admissions</ProviderActionLink>}{profileDetails.email && <ProviderActionLink className="button button-secondary" eventType="email" href={`mailto:${profileDetails.email}?subject=${encodeURIComponent(`Availability and insurance question for ${provider.name}`)}`} providerId={provider.id}><Mail size={17} /> Email this location</ProviderActionLink>}{officialWebsite && <ProviderActionLink className="button button-secondary" eventType="website" external href={officialWebsite} providerId={provider.id}><ExternalLink size={17} /> Visit official website</ProviderActionLink>}</div><p className="section-caution">TreatmentLane does not route calls to another provider. Contact links use the public details shown for this organization.</p></section>

        {displayedReviewSignals.length > 0 && <section className="listing-section review-signals-section" id="reviews"><span className="section-label">Third-party review signals</span><h2>What public reviews can and cannot tell you</h2><p className="listing-lead">We show recent patterns and critical feedback alongside the source, sample size, and collection date. Reviews are personal opinions, not TreatmentLane findings, and they do not prove safety, treatment quality, or clinical outcomes.</p><div className="review-source-list">{displayedReviewSignals.map((signal) => signal.sourceType === "google" ? <GoogleReviewSignal signal={signal} key={signal.sourceType} /> : <DirectoryReviewSignal signal={signal} key={signal.sourceType} />)}</div>{!hasGoogleReviewSignal && <p className="review-overlap-note"><strong>Google review sample pending:</strong> <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${provider.name}, ${fullAddress}`)}`} rel="noopener noreferrer nofollow" target="_blank">View this location on Google Maps</a> to check its current public rating and reviews.</p>}{displayedReviewSignals.length > 1 && <p className="review-overlap-note"><strong>Why we do not combine totals:</strong> directories can display reviews syndicated from Google or another platform. Adding the counts together could count the same review more than once.</p>}<p className="review-method-link"><Link href="/review-methodology">Read our review sourcing and summary methodology</Link>.</p></section>}

        <section className="listing-section" id="care"><span className="section-label">Care options</span><h2>Treatment types and levels of care</h2><p>These are the care settings and program categories named in available public records. Confirm that the program is active, appropriate for the person&apos;s needs, and delivered at this location.</p>{careTypes.length ? <InformationTags items={careTypes} /> : <p>No treatment types are listed in the available source data.</p>}</section>

        {provider.specialties.length > 0 && <section className="listing-section"><span className="section-label">Program focus</span><h2>Needs and conditions mentioned in source data</h2><p>These labels describe areas public sources associate with this location. They do not establish that the program is suitable for any individual.</p><InformationTags items={provider.specialties} /></section>}

        <section className="listing-section" id="approaches"><span className="section-label">Clinical approaches</span><h2>Therapies and services</h2><p>Ask how often each service is offered, whether it is individual or group based, and which licensed professionals provide it.</p>{counselingApproaches.length ? <InformationTags items={counselingApproaches} /> : <p>No specific counseling approaches are listed.</p>}{medicationSupport.length > 0 && <div className="subsection-panel medication-panel"><Pill size={22} /><div><h3>Medication support mentioned</h3><p>Source data mentions {medicationSupport.join(", ")}. Availability, eligibility, prescribing, and continuation policies should be confirmed directly.</p></div></div>}</section>

        {practicalSupport.length > 0 && <section className="listing-section"><span className="section-label">Practical support</span><h2>Services that may support daily stability</h2><p>These public-record fields can matter for transportation, work, housing, education, family needs, and continued recovery. Confirm frequency, eligibility, and whether each service is provided on site or by referral.</p><InformationTags items={practicalSupport} /></section>}

        {profileDetails.coordinatedServices.length > 0 && <section className="listing-section"><span className="section-label">Coordinated care</span><h2>Health and recovery services listed</h2><p>Public records mention services that may connect behavioral health treatment with medical, social, or longer-term recovery needs.</p><InformationTags items={profileDetails.coordinatedServices} /></section>}

        {profileDetails.languages.length > 0 && <section className="listing-section"><span className="section-label">Language access</span><h2>Languages mentioned in public records</h2><InformationTags items={profileDetails.languages} /><p className="section-caution">Confirm interpreter availability, staff fluency, and whether written materials are available in the preferred language.</p></section>}

        <section className="listing-section" id="payment"><span className="section-label">Payment</span><h2>Accepted insurance and payment options</h2>{provider.insurance.length ? <InformationTags items={provider.insurance} /> : <p>No accepted insurance partners are named in the available source data.</p>}{provider.insuranceDetails && <p className="source-detail">Source information: {provider.insuranceDetails}</p>}<p className="section-caution">Insurance participation changes. Verify network status, authorization requirements, and expected out-of-pocket cost with both the provider and insurer.</p><div className="decision-checklist"><h3>Before agreeing to admission</h3><ul><li>Ask for benefits verification for this exact facility and level of care.</li><li>Request a written estimate covering deductible, coinsurance, copays, and non-covered services.</li><li>Ask what happens financially if insurance shortens or denies authorization.</li><li>Confirm refund, cancellation, transportation, and medication charges.</li></ul></div></section>

        <section className="listing-section"><span className="section-label">Environment</span><h2>Amenities and facility features</h2>{provider.amenities.length ? <InformationTags items={provider.amenities} /> : <p>No specific amenities are published. Ask about rooms, meals, accessibility, recreation, technology policies, visitors, and transportation.</p>}</section>

        <section className="listing-section" id="admissions"><span className="section-label">Admissions</span><h2>Questions to ask this location</h2><p>Use these during the first call. Write down who answered, the date, and any promises about coverage, availability, or services.</p><ol className="admissions-question-list">{admissionsQuestions.map((question) => <li key={question}>{question}</li>)}</ol><div className="admissions-contact-strip">{provider.phone && <a href={`tel:${provider.phone}`}><Phone size={17} /><span><small>Public phone</small>{provider.phone}</span></a>}{profileDetails.email && <a href={`mailto:${profileDetails.email}`}><Mail size={17} /><span><small>Public email</small>{profileDetails.email}</span></a>}{officialWebsite && <a href={officialWebsite} rel="noopener noreferrer nofollow" target="_blank"><ExternalLink size={17} /><span><small>Official website</small>Open provider site</span></a>}</div></section>

        <section className="listing-section"><span className="section-label">Use this profile</span><h2>What different readers should confirm</h2><div className="audience-guidance-grid">
          <div><h3>For a person seeking care</h3><p>Confirm clinical fit, immediate availability, what to bring, medication rules, daily schedule, phone access, and total expected cost.</p></div>
          <div><h3>For family or supporters</h3><p>Ask about consent, family sessions, communication rules, visiting, crisis updates, transportation, discharge planning, and how concerns are reported.</p></div>
          <div><h3>For referral professionals</h3><p>Confirm admission criteria, exclusion criteria, medical capability, records required, payer authorization, prescribing continuity, and handoff after discharge.</p></div>
        </div></section>

        <section className="listing-section" id="safety"><span className="section-label">Safety checks</span><h2>Licensing and accreditation</h2><p>{provider.licenseSummary || "Licensing details have not yet been independently summarized by TreatmentLane. Ask which state agency licenses this exact location and verify the license directly."}</p>{provider.accreditation.length > 0 && <InformationTags items={provider.accreditation} />}<div className="decision-checklist"><h3>Verify before choosing</h3><ul><li>Request the current state license number for this address.</li><li>Confirm accreditation directly in the accreditor&apos;s directory.</li><li>Ask who is on site overnight and how medical emergencies are handled.</li><li>Ask how medications, belongings, privacy, grievances, and discharge are managed.</li></ul></div></section>

        <section className="listing-section missing-information-section"><span className="section-label">Known gaps</span><h2>Information not yet confirmed</h2><p>We show missing information instead of filling it with assumptions. Confirm these items with the provider or an official regulator.</p>{missingDetails.length ? <ul className="gap-list">{missingDetails.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No major structured fields are missing, but details can still change and should be reconfirmed.</p>}</section>

        <section className="listing-section" id="questions"><span className="section-label">Quick answers</span><h2>Common questions about this listing</h2><div className="profile-faq"><details><summary>What levels of care are listed?</summary><p>{provider.levelsOfCare.length ? provider.levelsOfCare.join(", ") : "No specific level of care is confirmed in the current source data."}</p></details><details><summary>How long is the program?</summary><p>{provider.treatmentDuration ? `The public source lists a typical duration of ${provider.treatmentDuration}. Actual length can vary by assessment, progress, and coverage.` : "A typical program duration is not published in the current source data."}</p></details><details><summary>Does this location accept insurance?</summary><p>{provider.insurance.length ? `The source data mentions ${provider.insurance.join(", ")}. This does not confirm in-network status for a particular plan.` : "Specific insurance information is not published in the current source data."}</p></details><details><summary>Is this location open every day?</summary><p>{profileDetails.operatingDays.length === 7 ? "Public source data lists operations Monday through Sunday. This does not confirm that admissions or every service are available 24 hours a day." : profileDetails.operatingDays.length ? `The source lists ${profileDetails.operatingDays.join(", ")}. Confirm current intake and program hours.` : "Operating days and intake hours are not confirmed."}</p></details><details><summary>Does TreatmentLane recommend this provider?</summary><p>No. TreatmentLane organizes public information and review signals. It does not determine clinical fit, safety, or treatment quality.</p></details></div></section>

        <section className="listing-section" id="sources"><span className="section-label">Accuracy</span><h2>Sources and corrections</h2><p>This profile was assembled from structured public records{profileDetails.evidenceSources.length ? ` including ${profileDetails.evidenceSources.join(", ")}` : ""}. It was last updated in our database on {new Date(provider.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}.</p><p>Represent this organization or see inaccurate information? <Link href={`/corrections?provider=${encodeURIComponent(path)}`}>Request a correction</Link>. TreatmentLane keeps source-derived information clearly separated from provider-confirmed facts.</p></section>

        <section className="listing-section owner-profile-callout"><span className="section-label">For center representatives</span><h2>Claim or update this profile</h2><p>Authorized representatives can submit current availability, admissions hours, insurance context, costs, programs, credentials, photos, and contact information. Changes remain pending until reviewed.</p><Link className="button button-secondary" href={`/providers/apply?provider=${encodeURIComponent(path)}&name=${encodeURIComponent(provider.name)}`}>Claim or update this listing</Link></section>
      </main>

      <aside className="detail-sidebar provider-contact-card"><h2>Contact information</h2><dl><dt>Location</dt><dd>{fullAddress}</dd>{provider.phone && <><dt>Phone</dt><dd><ProviderActionLink eventType="call" href={`tel:${provider.phone}`} providerId={provider.id}><Phone size={15} /> {provider.phone}</ProviderActionLink></dd></>}{profileDetails.intakePhone && profileDetails.intakePhone !== provider.phone && <><dt>Intake phone</dt><dd><ProviderActionLink eventType="call" href={`tel:${profileDetails.intakePhone}`} providerId={provider.id}><Phone size={15} /> {profileDetails.intakePhone}</ProviderActionLink></dd></>}{profileDetails.email && <><dt>Public email</dt><dd><ProviderActionLink eventType="email" href={`mailto:${profileDetails.email}`} providerId={provider.id}><Mail size={15} /> {profileDetails.email}</ProviderActionLink></dd></>}{profileDetails.operatingDays.length > 0 && <><dt>Operating days listed</dt><dd><CalendarDays size={15} /> {profileDetails.operatingDays.length === 7 ? "Monday through Sunday" : profileDetails.operatingDays.join(", ")}</dd></>}{officialWebsite && <><dt>Official website</dt><dd><ProviderActionLink eventType="website" external href={officialWebsite} providerId={provider.id}>Visit website <ExternalLink size={14} /></ProviderActionLink></dd></>}{provider.sourceUrl && <><dt>Public source</dt><dd><a href={provider.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">View source record <ExternalLink size={14} /></a></dd></>}<dt>Listing status</dt><dd><BadgeCheck size={15} /> {verificationLabels[provider.verificationStatus]}</dd><dt>Last independently reviewed</dt><dd>{provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Not independently reviewed"}</dd></dl><div className="provider-contact-actions">{provider.phone && <ProviderActionLink className="button provider-call-button" eventType="call" href={`tel:${provider.phone}`} providerId={provider.id}><Phone size={17} /> Call organization</ProviderActionLink>}<ProviderActionLink className="button button-secondary" eventType="directions" external href={directionsHref} providerId={provider.id}><Navigation size={17} /> Get directions</ProviderActionLink><CompareButton provider={{ id: provider.id, name: provider.name, href: path }} /></div><p className="form-disclaimer">TreatmentLane does not recommend or guarantee any provider. In an emergency, call 911 or 988.</p></aside>
    </div>
  </>;
}
