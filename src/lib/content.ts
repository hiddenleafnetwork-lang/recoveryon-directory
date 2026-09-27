export type CareCategory = {
  name: string;
  slug: string;
  shortName: string;
  description: string;
  guidance: string;
};

export const careCategories: CareCategory[] = [
  {
    name: "Treatment Centers",
    shortName: "Treatment centers",
    slug: "treatment-centers",
    description: "Residential and inpatient programs offering structured support for substance use recovery.",
    guidance: "Compare the level of care, licensing, clinical services, admission criteria, and aftercare plan before choosing a program.",
  },
  {
    name: "Medical Detox",
    shortName: "Detox",
    slug: "medical-detox",
    description: "Clinically supervised withdrawal management and stabilization services.",
    guidance: "Withdrawal can be medically serious. Ask who provides clinical oversight, which substances are treated, and how care transitions after detox.",
  },
  {
    name: "Outpatient Programs",
    shortName: "Outpatient care",
    slug: "outpatient-programs",
    description: "Flexible outpatient, intensive outpatient, and partial hospitalization programs.",
    guidance: "Confirm weekly time requirements, clinical services, drug-testing policies, family involvement, and whether the program fits your daily responsibilities.",
  },
  {
    name: "Counseling & Therapy",
    shortName: "Therapy",
    slug: "counseling-therapy",
    description: "Individual, family, and group counseling for addiction, recovery, and co-occurring needs.",
    guidance: "Verify professional credentials, treatment approach, areas of experience, session format, and insurance participation directly with the clinician.",
  },
  {
    name: "Sober Living",
    shortName: "Sober living",
    slug: "sober-living",
    description: "Structured recovery residences that support the transition to independent living.",
    guidance: "Ask about house rules, staffing, drug testing, resident rights, fees, certifications, and the relationship with outside clinical care.",
  },
  {
    name: "Support Groups",
    shortName: "Support groups",
    slug: "support-groups",
    description: "Peer-led recovery meetings and family support communities.",
    guidance: "Support groups can complement professional care but do not replace medical advice, diagnosis, detoxification, or emergency services.",
  },
  {
    name: "Mental Health Services",
    shortName: "Mental health",
    slug: "mental-health-services",
    description: "Psychiatry, therapy, and integrated support for mental health and substance use needs.",
    guidance: "For co-occurring conditions, look for coordinated treatment that addresses mental health and substance use together.",
  },
  {
    name: "Recovery Support",
    shortName: "Recovery support",
    slug: "recovery-support",
    description: "Case management, peer coaching, employment help, and other practical recovery services.",
    guidance: "Check the provider's role, training, boundaries, privacy practices, fees, and how the service coordinates with licensed clinical care.",
  },
];

const stateRows = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
  ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
] as const;

export type State = { code: string; name: string; slug: string };

export const states: State[] = stateRows.map(([code, name]) => ({
  code,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
}));

export const featuredStateCodes = ["CA", "FL", "TX", "NY", "PA", "OH", "IL", "WA"];

export type Guide = {
  slug: string;
  title: string;
  description: string;
  reviewedOn: string;
  sections: Array<{ heading: string; body: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const guides: Guide[] = [
  {
    slug: "how-to-verify-a-treatment-provider",
    title: "How to verify a treatment provider",
    description: "A practical checklist for reviewing licensing, accreditation, services, costs, and fit before making a decision.",
    reviewedOn: "2026-09-28",
    sections: [
      { heading: "Start with the official identity", body: "Confirm the program's legal name, physical address, phone number, and website. Make sure the person you speak with represents the facility you intend to contact." },
      { heading: "Check licensing and accreditation", body: "Ask which state agency licenses the program and verify the license with that agency. Accreditation can add useful information, but it does not replace state licensing or your own review." },
      { heading: "Match the level of care", body: "A professional assessment can help determine whether detox, residential, partial hospitalization, intensive outpatient, outpatient, or another level of support is appropriate." },
      { heading: "Verify costs and insurance", body: "Ask for written information about network status, estimated patient responsibility, deposits, refunds, transportation, and any services billed separately. Confirm benefits with the insurer directly." },
      { heading: "Watch for pressure", body: "Be cautious when someone guarantees results, discourages questions, refuses to explain fees, or pressures you to travel immediately without a clear clinical reason." },
    ],
    sources: [
      { label: "SAMHSA FindTreatment.gov", href: "https://findtreatment.gov/" },
      { label: "SAMHSA National Helpline", href: "https://www.samhsa.gov/find-help/helplines/national-helpline" },
    ],
  },
  {
    slug: "understanding-levels-of-care",
    title: "Understanding levels of addiction care",
    description: "A plain-language overview of detox, residential, PHP, IOP, outpatient, and recovery support services.",
    reviewedOn: "2026-09-28",
    sections: [
      { heading: "Withdrawal management", body: "Medical detox or withdrawal management focuses on safely stabilizing a person as substances leave the body. It is not a complete treatment plan by itself." },
      { heading: "Residential treatment", body: "Residential programs provide a structured living environment with scheduled clinical and recovery activities. Program intensity, staffing, and duration vary." },
      { heading: "PHP and IOP", body: "Partial hospitalization and intensive outpatient programs provide multiple hours of care while allowing a person to live outside the facility. Requirements vary by program." },
      { heading: "Standard outpatient care", body: "Outpatient services may include individual therapy, group counseling, medication management, and recovery planning at a lower weekly intensity." },
      { heading: "Ongoing recovery support", body: "Peer groups, recovery coaching, sober living, primary care, employment support, and family services can help sustain progress after or alongside clinical care." },
    ],
    sources: [
      { label: "SAMHSA Find Help", href: "https://www.samhsa.gov/find-help" },
      { label: "FindTreatment.gov", href: "https://findtreatment.gov/" },
    ],
  },
  {
    slug: "questions-to-ask-about-treatment-costs",
    title: "Questions to ask about treatment costs",
    description: "Use this checklist to understand insurance, private-pay charges, deposits, refunds, and possible additional fees.",
    reviewedOn: "2026-09-28",
    sections: [
      { heading: "Ask what is included", body: "Request a written estimate and ask whether assessments, medications, laboratory work, physician services, transportation, and aftercare are included." },
      { heading: "Confirm insurance independently", body: "Ask the provider for its network status, then contact the insurer using the number on the insurance card. Verify deductibles, coinsurance, prior authorization, and out-of-network rules." },
      { heading: "Understand deposits and refunds", body: "Ask when deposits become non-refundable, what happens if the recommended level of care changes, and how unused funds are returned." },
      { heading: "Avoid financial pressure", body: "Take time to understand written terms. A legitimate provider should be able to explain charges without guaranteeing insurance payment or demanding an immediate decision." },
    ],
    sources: [
      { label: "CMS consumer resources", href: "https://www.cms.gov/medical-bill-rights" },
      { label: "SAMHSA National Helpline", href: "https://www.samhsa.gov/find-help/helplines/national-helpline" },
    ],
  },
];
