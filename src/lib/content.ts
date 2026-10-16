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
  ["AS", "American Samoa"], ["GU", "Guam"], ["MP", "Northern Mariana Islands"],
  ["PR", "Puerto Rico"], ["VI", "U.S. Virgin Islands"],
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

  {
    slug: "how-much-does-rehab-cost",
    title: "How much does rehab cost?",
    description:
      "Rehab costs range from free community programs to tens of thousands of dollars for residential care. This guide explains typical price ranges, what drives them, and how to get a clear written estimate before you commit. This is educational information only, not medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "There is no single price for rehab",
        body: "The cost of addiction treatment varies enormously, from no-cost community programs to luxury residential centers charging tens of thousands of dollars per month. The price depends on the level of care you need, the length of stay, the location, and whether you use insurance. Because of that range, published averages are only a starting point for planning, so always ask a specific program for a personalized written estimate. This guide is educational only and is not medical advice; a qualified clinician can help you determine which level of care is appropriate.",
      },
      {
        heading: "Typical cost ranges by level of care",
        body: "A 2026 nationwide pricing study that contacted more than 1,000 residential facilities found a 30-day residential stay averaged about $27,500 before insurance. The same study estimated medical detox at about $6,500 for an average six-day stay, partial hospitalization at about $15,000 for 30 days, and intensive outpatient care at about $10,400 for 30 sessions. People using in-network insurance paid roughly one-fifth of those list prices on average, though actual out-of-pocket costs depend on the plan's deductible, coinsurance, and covered services. These are estimates, not guarantees: detox is often bundled into residential pricing, and your cost will depend on your plan, your location, and the facility you choose.",
      },
      {
        heading: "What makes one program cost more than another",
        body: "Length of stay is the biggest cost driver, since a 90-day residential program costs far more than a 30-day one. Location matters too, as programs in high-cost metro areas charge more than comparable programs elsewhere, and medical staffing levels, hours of one-on-one therapy, and amenities like private rooms also push prices up. A higher price does not automatically mean better clinical care, so compare the treatment itself, such as staff credentials and therapy hours, rather than the amenities. When two programs offer similar clinical care, the less expensive one is usually the smarter choice.",
      },
      {
        heading: "Insurance usually lowers the bill substantially",
        body: "Most private insurance plans cover addiction treatment, and in-network care is dramatically cheaper than paying the list price. Before you commit to any program, call the number on your insurance card and ask whether that specific facility and level of care are covered, and whether prior authorization is required. Also ask about your deductible and out-of-pocket maximum, since you may owe little or nothing once those are met. If a program is out-of-network, get the expected total in writing first, because balance bills can be large.",
      },
      {
        heading: "Free and low-cost options exist",
        body: "If you have no insurance or cannot afford private care, SAMHSA's National Helpline at 1-800-662-4357 is free, confidential, and open 24 hours a day, and its specialists can refer you to state-funded programs and facilities with sliding fee scales. Many states fund treatment programs directly, and nonprofit centers often reduce fees based on income, so ask about financial assistance on your first call. You can also dial 211 to reach local United Way services that connect people with treatment, food, and housing resources. Twelve-step programs like Alcoholics Anonymous and Narcotics Anonymous are always free and available in nearly every community.",
      },
      {
        heading: "Get the cost in writing before you commit",
        body: "Ask the admissions team for an itemized written estimate showing the daily or bundled rate, the expected length of stay, and exactly what is included. Then ask what is not included, since drug testing, medications, outside medical visits, and aftercare planning are common surprise charges. Ask how billing works if you leave early or if your insurer stops authorizing care mid-stay, and get the name of the person who gave you the estimate. If a program will not put its prices in writing, treat that as a warning sign and consider other options.",
      },
    ],
    sources: [
      {
        label: "Recovery.com: How much does rehab cost (2026 pricing study)",
        href: "https://Recovery.com/resources/how-much-does-rehab-cost/",
      },
      {
        label: "SAMHSA National Helpline",
        href: "https://www.samhsa.gov/find-help/helplines/national-helpline",
      },
    ],
  },
  {
    slug: "does-insurance-cover-addiction-treatment",
    title: "Does insurance cover addiction treatment?",
    description:
      "In most cases, yes. Federal law requires most health plans to cover addiction treatment comparably to other medical care. This guide explains your rights, how to check your benefits in minutes, and what to do if a claim is denied. This is educational information only, not legal or medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "The short answer: usually yes",
        body: "Most health insurance plans in the United States cover treatment for substance use disorders, including detox, residential care, outpatient programs, and addiction medications. Coverage does not mean care is free: you will typically still owe deductibles, copays, or coinsurance, just as with other medical care. The exact amount depends on your plan's cost-sharing rules and whether the provider is in your plan's network. Because details vary so much between plans, verifying your specific benefits before starting treatment is essential.",
      },
      {
        heading: "Two federal laws protect your coverage",
        body: "The Affordable Care Act lists mental health and substance use disorder services as essential health benefits, which individual and small-group plans must cover. The Mental Health Parity and Addiction Equity Act of 2008 requires most large employer plans to cover addiction treatment on equal terms with medical and surgical care. In practice, that means your plan cannot impose higher copays, stricter visit limits, or tougher authorization rules on addiction treatment than on comparable physical health care. A few plan types, such as some grandfathered and short-term plans, have more limited obligations, so the protections that apply depend on your plan type.",
      },
      {
        heading: "In-network vs out-of-network: the price gap",
        body: "Staying in-network is the single biggest lever on your out-of-pocket cost: a 2026 pricing study found in-network patients paid roughly one-fifth of the list price for residential treatment. Before admission, confirm the facility is in-network for your specific plan and for the specific level of care you need, since a facility can be in-network for outpatient care but not for residential. Do not rely on the admissions team alone; call your insurer directly using the number on your card and get the answer yourself. If you consider out-of-network care, ask for the full expected cost in writing first, because the gap can be enormous.",
      },
      {
        heading: "Medicaid and Medicare cover treatment too",
        body: "Medicaid covers substance use disorder treatment, and federal rules require Medicaid managed care plans to meet the same parity standards as private plans. The exact services covered, such as residential stays or specific medications, vary from state to state, so call your plan or your state's Medicaid office to confirm. Medicare also covers substance use treatment, including inpatient and outpatient care, subject to its own cost-sharing and coverage rules. If you are uninsured, SAMHSA's National Helpline at 1-800-662-4357 can connect you with state-funded programs at no cost.",
      },
      {
        heading: "How to verify your benefits in 15 minutes",
        body: "Call the member services number on your insurance card and ask whether the facility is in-network, whether the level of care is covered, whether prior authorization is required, and what your deductible, copay, and out-of-pocket maximum are. Also ask what clinical criteria the plan uses to decide medical necessity, since that determines whether your stay gets authorized. Write down the answers with the date, the representative's name, and any reference number, and ask the treatment center to confirm the same details in writing. Keep these records until every bill is resolved, because they are your evidence if a dispute arises.",
      },
      {
        heading: "If your claim is denied, appeal it",
        body: "Your insurer must send you a written explanation of any denial, including the specific reason and the policy language behind it. You have the right to an internal appeal, and if that fails, to an external review by an independent organization that does not work for your insurer. If your health is at risk, request an expedited review, which must be decided within 72 hours. Many states offer free consumer assistance programs to help with appeals, and you can file a complaint with your state insurance department if you believe the denial violates parity law.",
      },
    ],
    sources: [
      {
        label: "WA Office of the Insurance Commissioner: appealing a behavioral health denial",
        href: "https://www.insurance.wa.gov/insurance-resources/health-insurance/mental-health-and-substance-use-disorders/appealing-behavioral-health-treatment-or-service-denial",
      },
      {
        label: "WebMD: appealing rejected health insurance claims",
        href: "https://www.webmd.com/health-insurance/how-and-when-to-appeal-insurance-claims",
      },
      {
        label: "SAMHSA National Helpline",
        href: "https://www.samhsa.gov/find-help/helplines/national-helpline",
      },
    ],
  },
  {
    slug: "questions-to-ask-a-treatment-center",
    title: "Questions to ask a treatment center",
    description:
      "Choosing a treatment center is a high-stakes decision. These are the questions that separate quality programs from risky ones, plus the red flags that mean you should walk away. This is educational information only, not medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "Start with licensing, not marketing",
        body: "Ask whether the program is licensed by the state, at its actual address, for the level of care you need, and verify the answer through your state's licensing board or SAMHSA's treatment locator at FindTreatment.gov. Then ask about voluntary accreditation from the Joint Commission or CARF, which signals independent quality standards; both organizations publish directories where you can confirm a program's status. Marketing routinely blurs licensing, accreditation, and insurance network status, so check each one yourself rather than trusting a badge on a website. If a program cannot clearly state its license number and accrediting body, move on.",
      },
      {
        heading: "Ask who will actually treat you",
        body: "Ask whether doctors, psychiatrists, and psychologists are on staff or only outside consultants, and what the staff-to-patient ratio is during treatment hours. Full-time counseling staff should hold professional addiction credentials, which you can verify through state licensing boards, rather than relying on personal recovery experience alone. If you have a co-occurring mental health condition such as depression, anxiety, or trauma, ask how the program integrates that care instead of treating addiction in isolation. Also ask whether the program offers medication-assisted treatment where clinically appropriate and whether its staff can prescribe and manage those medications.",
      },
      {
        heading: "Ask how they measure success",
        body: "Ask what therapies the program uses, whether they are evidence-based, and how the program uses clinical criteria to match you to the right level of care on admission. Then ask the harder question: do you track patient outcomes after discharge, and can you share the results. Programs that follow up with former patients and publish outcomes are demonstrating real accountability. Be skeptical of any advertised success rate that comes without an explanation of how it was measured and over what time period.",
      },
      {
        heading: "Get costs and insurance terms in writing",
        body: "Ask for an itemized written estimate and written confirmation of your insurance coverage, including whether prior authorization has been obtained for your stay. Ask what happens financially if your insurer stops authorizing care mid-stay: will you be billed for the balance, stepped down to a lower level of care, or discharged. Confirm the program is in-network for your specific plan, and verify that answer with your insurer directly rather than relying on admissions staff. Vague or evasive answers about money are a serious warning sign in an industry where surprise bills are common.",
      },
      {
        heading: "Ask what happens after discharge",
        body: "Treatment does not end at discharge, so ask what aftercare planning looks like and when it begins. Quality programs start discharge planning early and help you line up outpatient care, support groups, or sober living before you leave, rather than handing you a list on your last day. Ask whether the program offers an alumni program, follow-up check-ins, or continued counseling after discharge. Also ask whether family can participate in treatment, since family involvement is associated with better outcomes, and beware any program with no structured discharge plan at all.",
      },
      {
        heading: "Red flags: when to walk away",
        body: "Walk away from any program that guarantees a cure or advertises a near-perfect success rate, since no ethical provider promises outcomes. Be wary of high-pressure admissions tactics, demands for large upfront cash payments, or anyone offering gifts, free travel, or cash to choose their program: federal law prohibits kickbacks for patient referrals. Avoid programs that will not disclose their physical address, dodge questions about staff credentials, or advertise amenities far more than clinical care. Check reviews with a critical eye, looking for patterns rather than single complaints, and if it feels like a sales pitch rather than healthcare, trust that instinct.",
      },
    ],
    sources: [
      {
        label: "U.S. House hearing: examining patient brokering and treatment fraud",
        href: "https://www.congress.gov/event/115th-congress/house-event/106716/text",
      },
      {
        label: "PsychReg: how to tell if a treatment programme is properly licensed",
        href: "https://www.psychreg.org/how-tell-mental-health-addiction-treatment-programme-is-properly-licensed/",
      },
      {
        label: "SAMHSA National Helpline",
        href: "https://www.samhsa.gov/find-help/helplines/national-helpline",
      },
    ],
  },
];
