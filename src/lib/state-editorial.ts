export const stateEditorial: Record<string, { intro: string; sections: { heading: string; body: string }[] }> = {
  california: {
    intro: "California has more addiction treatment options than any other state, which is good news and a challenge. More choice means more chances to find the right fit, but it also means more programs competing for your attention, not all of them legitimate. California runs one of the strictest licensing systems in the country, so understanding it is the fastest way to separate solid providers from risky ones.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Residential addiction treatment in California is licensed by the Department of Health Care Services (DHCS), through its Substance Use Disorder Licensing and Certification Division. Any facility offering 24-hour residential recovery services to adults must hold a DHCS license, which covers detoxification, residential treatment, or both. DHCS also certifies outpatient programs on a voluntary basis, and many counties require that certification before a program can receive public funds. Youth residential programs follow a different path: they are licensed by the Department of Social Services and certified by DHCS. To check a facility, use the DHCS public directory of licensed and certified programs, organized alphabetically by county. If a residential program does not appear there, consider that a serious red flag.",
      },
      {
        heading: "Paying for treatment",
        body: "California's Medicaid program is called Medi-Cal, and addiction treatment is covered through the Drug Medi-Cal Organized Delivery System. It pays for the full continuum of care, including assessment, detox, residential treatment, intensive outpatient and standard outpatient care, medications for opioid use disorder, and recovery services, with no copays for members. One thing that confuses people: substance use treatment usually runs through your county behavioral health department, not your Medi-Cal managed care plan, so the county access line is the fastest first call. Private insurance plans must cover addiction treatment on par with other medical care under state and federal parity laws. If you have no insurance, county programs cannot turn you away for inability to pay, and federal rules give priority admission to pregnant women and people who inject drugs.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's DHCS license or certification number, and check it against the public directory before you visit. Ask which levels of care are provided on site versus referred elsewhere, since some programs advertise services they do not actually deliver. Confirm whether the program bills Medi-Cal or your private insurer directly, or expects payment upfront. Ask which medications for opioid or alcohol use disorder the clinicians prescribe, because access to these medications varies widely. Ask what a typical day looks like and what the staff-to-client ratio is. Finally, ask what happens after discharge, including whether the program offers recovery coaching, alumni groups, or structured aftercare.",
      },
    ],
  },
  texas: {
    intro: "Texas handles addiction treatment licensing through a single state agency, which makes checking a provider simpler than in many states. But Texas is enormous, and the quality and availability of care differ a lot between major cities and rural counties. Here is how oversight works, how to pay for treatment, and what to ask before choosing a program.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "In Texas, chemical dependency treatment facilities are licensed by the Health and Human Services Commission (HHSC), through its Regulatory Services Division, under Health and Safety Code Chapter 464. Any facility offering a structured chemical dependency treatment program must hold this license, with only narrow exemptions such as federal facilities or a private practitioner's own office. HHSC also licenses individual chemical dependency counselors, known as LCDCs. To verify a program, use the HHSC online licensing search or its published lists of licensed chemical dependency treatment facilities. A reputable program will share its license number willingly; reluctance to do so is a warning sign.",
      },
      {
        heading: "Paying for treatment",
        body: "Texas Medicaid is delivered through managed care programs, mainly STAR, STAR+PLUS, and STAR Health. These plans must cover substance use disorder services including assessment, counseling, residential treatment, withdrawal management, and medication-assisted treatment, and care coordinators are required to connect members with the full continuum of care. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules. For the uninsured, many Texas providers receive state and federal grant funding and offer sliding-scale fees, so ask about this early. One important caveat: Texas has not expanded Medicaid under the Affordable Care Act, so eligibility is narrower than in many states and mainly covers children, pregnant women, parents with very low incomes, and people with disabilities. Many working-age adults fall into a coverage gap, and for them the federal marketplace or state-funded providers may be the realistic options.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the facility's HHSC license number and confirm it through the state's online search. Ask whether the counselors are licensed LCDCs and what the counselor-to-client ratio is, since Texas regulates both the facility and the individual counselor. Confirm which Medicaid managed care plans the program accepts, or how it bills private insurance. Ask whether medication-assisted treatment is offered on site and which medications are available. Ask how the program treats co-occurring mental health conditions, because integrated care leads to better outcomes. Finally, ask about discharge planning: what aftercare is arranged, and does anyone follow up after you leave?",
      },
    ],
  },
  florida: {
    intro: "Florida has a large addiction treatment industry, and one of the most detailed licensing frameworks in the country, built partly in response to past abuses. That history is exactly why understanding the rules matters here more than almost anywhere. Here is how Florida licenses providers, how to pay for care, and what to ask.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Florida licenses substance abuse treatment providers through the Department of Children and Families (DCF), under Chapter 397 of Florida Statutes and Rule 65D-30. DCF licenses individual service components, so a provider must hold a license for each type of care it offers: detox, residential, outpatient, and others. Some facilities are also licensed by the Agency for Health Care Administration (AHCA), which regulates health care facilities more broadly, and recovery residences can earn certification through approved credentialing bodies. To verify a provider, check DCF's published lists of licensed providers and cross-reference facilities through AHCA's Florida Health Finder. Ask the program exactly which components it is licensed for, and make sure that matches the services it advertises. Mismatches between advertised and licensed services are a major red flag.",
      },
      {
        heading: "Paying for treatment",
        body: "Florida Medicaid operates through the Statewide Medicaid Managed Care (SMMC) program, where members enroll in a managed medical assistance plan. Substance abuse treatment is among the minimum services these plans must cover, and many plans add expanded benefits such as intensive outpatient programs and medication-assisted treatment. Private insurance must cover addiction treatment under federal parity law. For the uninsured, Florida distributes state and federal funding to community providers, so ask about state-funded openings or sliding-scale fees. Be aware that, like Texas, Florida has not expanded Medicaid under the Affordable Care Act, which leaves many low-income adults without coverage; the federal marketplace may be an option at higher income levels. One Florida-specific point: the state's Marchman Act allows families to seek court-ordered assessment and treatment for a loved one who refuses care. An admissions counselor can explain how that process works.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which DCF-licensed service components the program holds and verify them against the state's published lists. Confirm the program is in-network with your SMMC Medicaid plan or your private insurer, and get the answer in writing before admission. Ask whether medication-assisted treatment is available from day one and which medications are offered. Ask how the program handles a situation where your loved one refuses care, including its experience with the Marchman Act process. Ask how families are involved in treatment planning. Finally, ask what recovery support continues after discharge, such as step-down care, alumni programs, or connections to community recovery resources.",
      },
    ],
  },
};

// SOURCES
// California:
// - DHCS directories of licensed/certified SUD facilities: https://www.dhcs.ca.gov/providers-partners/directories-for-substance-use-disorder-services/
// - DHCS SUD Licensing and Certification Toolkit (licensing vs certification, LOC designation): http://dhcs.ca.gov/provgovpart/Documents/SUD-Toolkit.pdf
// - NBHAP California state laws (DHCS licensing requirements): https://nbhap.org/state-laws-california/
// - Drug Medi-Cal coverage, county access lines, no copay: https://www.drugaddictionnow.com/iehp-murrieta-guide-to-mental-health-and-sud-care/
// Texas:
// - HHSC Chemical Dependency Treatment Facilities (licensing, verification): https://hhs.texas.gov/providers/health-care-facilities-regulation/chemical-dependency-treatment-facilities
// - STAR Health SUD benefits (assessment, residential, MAT): https://www.hhs.texas.gov/sites/default/files/documents/amended-star-health-8.pdf
// - Texas Medicaid non-expansion status: https://www.healthinsurance.org/medicaid/texas/
// Florida:
// - DCF substance abuse treatment and licensing: https://prod.myflfamilies.com/services/samh/treatment
// - DCF licensing under Ch. 397 / HB 807 background: https://lifeskillsbehavioralhealth.com/blog/what-is-house-bill-807-and-why-is-it-a-welcomed-reform-for-florida-substance-use-providers/
// - SMMC covered services incl. substance abuse treatment: https://flahca.ccplatform.net/content/download/27219/file/SMMC_Highlight_ILOS_Chart_08062025.pdf
// - Non-expansion states list (incl. Florida): https://www.stedi.com/blog/how-the-one-big-beautiful-bill-impacts-medicaid-eligibility-checks
