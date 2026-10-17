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
  "new-york": {
    intro: "New York has a large treatment system that includes hospital-based care, community programs, residential services, outpatient clinics, and opioid treatment programs. The state also publishes unusually detailed information about certified programs. That makes it possible to check a provider before sharing personal information or paying a deposit, but only if you know which state tools to use.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The New York State Office of Addiction Services and Supports (OASAS) certifies substance use disorder treatment programs. A provider generally needs OASAS approval and certification before opening an addiction service, and later changes to services also require notice and approval. OASAS rules cover different settings, including withdrawal and stabilization, inpatient rehabilitation, residential services, and outpatient programs. Use the official OASAS Provider and Program Search to confirm the program name, address, and approved service type. New York also credentials addiction professionals, including Credentialed Alcoholism and Substance Abuse Counselors, but a counselor credential does not replace program certification. Confirm both when each is relevant.",
      },
      {
        heading: "Paying for treatment",
        body: "New York Medicaid covers a broad range of substance use disorder care. Depending on eligibility and plan type, benefits can include outpatient treatment, intensive outpatient care, residential services, withdrawal management, opioid treatment, and medications for addiction treatment. Most members receive behavioral health benefits through Medicaid managed care. Adults with significant behavioral health needs may qualify for a Health and Recovery Plan, which adds care management and community-based supports. Private coverage varies by network and authorization rules, so ask the insurer to identify the exact benefit, deductible, and approved level of care. If a program says it accepts insurance, verify that it is in network for your specific plan rather than relying on a general statement.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's OASAS operating certificate number and look it up in the state directory. Confirm that the listed service type matches what is being recommended, especially for residential care or withdrawal management. Ask whether the program will continue an existing medication for opioid or alcohol use disorder when clinically appropriate. Get a written explanation of insurance authorization, expected out-of-pocket costs, and any services billed by a separate medical group. Ask who completes the level-of-care assessment, which credentials the clinical staff hold, and how co-occurring mental health conditions are treated. Before admission, also ask what step-down care will be arranged and who coordinates the transition.",
      },
    ],
  },
  pennsylvania: {
    intro: "Pennsylvania organizes addiction treatment through state licensing and a county-based access system. The Department of Drug and Alcohol Programs oversees treatment facilities, while local Single County Authorities help residents find care and may help with funding. Using both systems can make a search faster and reduce the risk of choosing a program that is not licensed for the service it advertises.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Pennsylvania Department of Drug and Alcohol Programs (DDAP) licenses drug and alcohol treatment facilities and recovery houses. Its public Drug and Alcohol Facility Locator shows licensed programs, service types, license status, and inspection information. Search the exact facility address, not only the parent company's name, because a provider may operate several locations with different approvals. The state license identifies whether a site is approved for outpatient, inpatient, detoxification, or another level of care. Pennsylvania also publishes facility surveys and certificates through the locator. Review those records and ask about any recent corrective actions before committing to a program.",
      },
      {
        heading: "Paying for treatment",
        body: "Pennsylvania's county drug and alcohol offices, called Single County Authorities or SCAs, can assess treatment needs, make referrals, and help people understand possible treatment funding. This is especially useful for someone who is uninsured, underinsured, or unsure where to start. Medicaid members should ask their plan or county behavioral health system which providers and levels of care are covered. Private insurance benefits may depend on medical necessity review, network status, and prior authorization. Get the program's legal name, billing entity, and tax identification information before calling the insurer, since a familiar brand name may not match the name used for claims. Ask for a written estimate that separates clinical treatment, medications, laboratory work, and housing charges.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the DDAP facility license number and verify the exact location in the state locator. Confirm that the license covers the level of care being recommended and review the latest inspection information. Ask whether the provider is contracted with your Medicaid or private plan, who handles prior authorization, and what happens if the insurer approves fewer days than expected. If you need public funding, ask the local SCA whether an assessment or referral is required before admission. Also ask which addiction medications are available, how medical emergencies are handled, what credentials direct-care staff hold, and how the program plans for continuing care after discharge.",
      },
    ],
  },
  ohio: {
    intro: "Ohio regulates addiction services through its behavioral health licensing and certification system, while Ohio Medicaid covers services across outpatient, residential, and withdrawal settings. The terminology can be confusing because a provider may hold a community behavioral health certification plus a separate license for a specialized service. Checking both the agency and the service offered is important.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Ohio's Department of Behavioral Health licenses and certifies more than 2,000 behavioral health providers under the Ohio Administrative Code. Substance use disorder services commonly operate under certification as a Community Behavioral Health Services provider. That certification can include outpatient treatment, substance use disorder residential care, and withdrawal management. Opioid treatment programs require the community behavioral health certification and an additional opioid treatment program license. Use the department's licensure and certification resources to confirm the provider and ask the program to identify every certified service it delivers at the location. A general agency certification does not prove that every advertised level of care is approved.",
      },
      {
        heading: "Paying for treatment",
        body: "Ohio Medicaid behavioral health benefits include counseling, psychotherapy, medications for substance use disorder, intensive outpatient treatment, residential treatment, and withdrawal management when coverage requirements are met. Most Ohio Medicaid members receive coverage through managed care organizations, so network participation and authorization can differ by plan. A provider that is certified by the state must also be properly enrolled with Ohio Medicaid to bill the program. Private insurance can have separate networks for facility care, professional services, pharmacy benefits, and laboratory work. Ask both the program and the plan to confirm coverage for the specific level of care, location, and expected length of stay before admission.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask whether the location is certified as a Community Behavioral Health Services provider and which substance use disorder services appear on its certificate. For an opioid treatment program, ask for the separate state license and federal certification information. Confirm whether the program and each major billing entity are enrolled with your Medicaid managed care plan or private insurer. Ask how the clinical team decides between outpatient, intensive outpatient, residential, and withdrawal management care. Find out which medications for opioid or alcohol use disorder are offered, whether they are started on site, and whether the program will continue medication prescribed elsewhere. Finally, request the discharge plan and follow-up schedule in writing.",
      },
    ],
  },
  illinois: {
    intro: "Illinois addiction treatment is regulated at the program level, with licensed services ranging from outpatient and intensive outpatient care to residential treatment and recovery homes. Medicaid behavioral health care is administered separately, so a state license and Medicaid participation answer different questions. Verify both before assuming that a program is approved and affordable.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Illinois Department of Human Services licenses substance use disorder treatment organizations through its Division of Substance Use Prevention and Recovery. State rules under Part 2060 set standards for treatment and intervention services. A license identifies the services approved at a particular site, such as outpatient care, intensive outpatient care, residential treatment, withdrawal management, or recovery home services. Illinois provides a statewide service database and licensed-provider directories that can be used to check an organization and location. Ask the provider for its Illinois license number and compare the service description with the level of care being offered. Do not treat an individual clinician's professional license as a substitute for the program's required approval.",
      },
      {
        heading: "Paying for treatment",
        body: "Illinois Medicaid covers behavioral health services through enrolled providers, including substance use recovery services. Members may receive care through a Medicaid managed care plan or another Medicaid arrangement, depending on eligibility. The Illinois Department of Healthcare and Family Services directs members to its behavioral health resources and the state's SPIDER service database to find programs. Coverage still depends on the member's plan, the provider's enrollment and network status, medical necessity, and any required authorization. Ask the plan to confirm the program's exact address and billing name. If you are uninsured, ask the provider whether it receives state or federal funding and whether a sliding fee or publicly funded placement is available.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which Part 2060 services the site is licensed to provide and verify the license in the state directory. Confirm whether detoxification or residential care occurs at that location or through a referral partner. Ask whether the organization is enrolled with Illinois Medicaid and contracted with your specific managed care plan. Request a written estimate for services that Medicaid or private insurance may not cover, including housing, transportation, and laboratory testing. Ask which evidence-based therapies and medications are available, how co-occurring mental health conditions are handled, and which clinicians are present after normal business hours. Also ask who will arrange follow-up medication, counseling, and recovery support when the program ends.",
      },
    ],
  },
  washington: {
    intro: "Washington combines state licensing of behavioral health agencies with an integrated Medicaid system called Apple Health. The state's public tools make it possible to verify a treatment location and then check whether it participates in the member's health plan. That two-step review matters because a licensed agency is not automatically in network for every plan.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Washington State Department of Health licenses and regulates inpatient and outpatient Behavioral Health Agencies. A licensed agency may be certified to provide mental health, substance use disorder, problem gambling, or a combination of services. The department publishes a downloadable directory and a real-time facility search. Use the exact address to confirm the agency's license status and certified services. This is particularly important when a company uses one brand across several locations. Washington also licenses individual substance use disorder professionals, but the professional credential and the agency license serve different purposes. Ask which credentialed staff provide assessment, counseling, medication management, and overnight care.",
      },
      {
        heading: "Paying for treatment",
        body: "Washington Medicaid is called Apple Health. Most members receive physical health, mental health, and substance use disorder treatment through one managed care plan. Apple Health funds services such as alcohol treatment, opioid use treatment, and medications for opioid use disorder, subject to coverage and clinical requirements. Members generally need an in-network provider unless the plan authorizes another arrangement. Some crisis and safety-net services are coordinated through regional Behavioral Health Administrative Services Organizations, including help for people who are not enrolled in Apple Health. Before admission, call the plan with the provider's legal name and address, then ask about authorization, copayments, transportation, pharmacy coverage, and any services billed outside the facility fee.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Behavioral Health Agency license number and verify which substance use disorder services are certified at the location. Confirm whether the program is contracted with your Apple Health managed care plan or private insurer, not simply whether it accepts that type of insurance. Ask who performs the assessment and how the recommended level of care is selected. Find out whether medication for opioid or alcohol use disorder is available on site and whether existing prescriptions will be continued. For residential care, ask about medical coverage overnight, emergency transfer procedures, family contact, and discharge planning. Request a written list of costs that are not included in the quoted program rate.",
      },
    ],
  },
  arizona: {
    intro: "Arizona has a large mix of behavioral health clinics, residential facilities, community providers, and tribal health programs. Facility licensing is handled by the state health department, while public coverage is administered through AHCCCS, Arizona's Medicaid program. Checking the facility license and the health plan network separately is the safest way to evaluate a program.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Arizona Department of Health Services licenses health care institutions, including behavioral health facilities. Its Bureau of Behavioral Health Facilities Licensing oversees relevant facility types, and AZ Care Check provides a public search of license status, history, deficiencies, and enforcement actions. Search the exact facility name and address, then review the license subtype and current status. A behavioral health residential facility license does not automatically mean that every clinical service advertised by a company is provided at that site. Ask which services are delivered under the facility license, which are provided by separately licensed professionals, and which are referred to outside organizations. Opioid treatment programs also have federal certification requirements.",
      },
      {
        heading: "Paying for treatment",
        body: "Arizona's Medicaid program is the Arizona Health Care Cost Containment System, usually called AHCCCS. Behavioral health benefits are commonly delivered through managed care plans, and the AHCCCS online directory lists enrolled providers and whether they are accepting new members. Enrollment with AHCCCS does not guarantee participation in every managed care network, so members should confirm the provider with their specific health plan. Ask whether residential, outpatient, medication, laboratory, and transportation services require separate authorization. People who are not eligible for Medicaid may be able to use block-grant or other publicly funded behavioral health services, but availability and eligibility vary. Ask the regional or tribal behavioral health system what funding is open before paying privately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Arizona facility license number and review the location in AZ Care Check. Confirm the license type, current status, and any enforcement history. Ask whether the provider appears in the AHCCCS directory and is contracted with your exact health plan. Get written confirmation of authorization and out-of-pocket costs before admission. Ask which level-of-care criteria are used, who provides medical supervision, and how withdrawal risks are assessed. Find out whether medications for opioid or alcohol use disorder are available without delay and whether the program will continue an existing prescription. For residential programs, ask what clinical staff are physically present overnight and how emergencies are transferred.",
      },
    ],
  },
  "north-carolina": {
    intro: "North Carolina's treatment system combines state facility licensing with regional behavioral health organizations and several Medicaid plan types. The path into care can depend on both the service needed and the member's plan. A facility license, Medicaid enrollment, and a plan contract are separate checks, and all three may matter before treatment begins.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The North Carolina Division of Health Service Regulation licenses mental health and substance use disorder services under state law. Licensure requirements vary by setting and service, including residential and structured outpatient programs. Prospective residential providers generally work with the regional Local Management Entity or Managed Care Organization, often called an LME/MCO, as part of the licensure and public-funding process. Ask the program for the license number tied to the exact address and the rule under which the service operates. Confirm that the licensed service matches the advertised level of care. National accreditation may also be required for some Medicaid behavioral health services, but accreditation does not replace the state license.",
      },
      {
        heading: "Paying for treatment",
        body: "NC Medicaid covers substance use disorder services through managed care arrangements that depend on the member's needs and plan. Behavioral Health and Intellectual or Developmental Disabilities Tailored Plans serve many people with severe substance use disorders and integrate medical, pharmacy, and specialized behavioral health benefits. Regional LME/MCOs and Tailored Plans can provide information and referrals for covered services. North Carolina expanded several substance use disorder benefits effective in 2026, including stand-alone coverage policies for intensive outpatient and residential levels of care. Coverage still depends on clinical criteria, provider enrollment, network status, and authorization. Call the number on the Medicaid card and confirm the exact provider, site, and level of care.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the North Carolina facility or service license number and verify which level of care it covers. Confirm whether the program is enrolled with NC Medicaid and contracted with your Standard Plan, Tailored Plan, LME/MCO, or private insurer. Ask who completes the assessment and whether the recommendation follows the state's current clinical coverage policy. Get written details about authorization, expected length of stay, and non-covered charges. Ask which medications for opioid or alcohol use disorder are offered and whether they are available during residential care. Also ask who manages co-occurring mental health needs, what happens if the plan denies additional days, and how follow-up care is arranged near home.",
      },
    ],
  },
  georgia: {
    intro: "Georgia changed its addiction-treatment licensing structure in 2026, so current verification matters. The state behavioral health department now licenses the main categories of drug treatment programs, while Medicaid reimbursement is administered through a separate state agency and managed care plans. Older provider materials may name the previous licensing office, which is another reason to use current state sources.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Effective January 1, 2026, the Georgia Department of Behavioral Health and Developmental Disabilities (DBHDD) became the licensing authority for Drug Abuse Treatment and Education Programs and Narcotic Treatment Programs. DATEP rules cover residential and nonresidential treatment programs, and a program must hold a license before operating. New branch locations generally require separate licenses under rules effective in 2026. Ask for the license attached to the exact treatment address, not only the parent organization. A recovery residence that provides housing alone may fall under different rules than a residence that delivers treatment. Opioid treatment programs also need federal certification, so ask to verify both the state and federal approvals.",
      },
      {
        heading: "Paying for treatment",
        body: "Georgia Medicaid reimbursement and behavioral health policy are administered by the Department of Community Health in partnership with DBHDD. Many eligible members receive services through one of the state's Care Management Organizations, which authorizes care and maintains its own provider network. DBHDD also contracts with community providers across six regions and supports outpatient, intensive outpatient, residential, withdrawal management, opioid treatment, and peer services. Availability and payment source vary by program. Call the Medicaid plan with the provider's legal billing name and address, and ask whether the proposed level of care requires authorization. If you are uninsured, contact the regional DBHDD system to ask about publicly funded providers before assuming private payment is the only option.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the current DBHDD DATEP or Narcotic Treatment Program license and confirm that it belongs to the location you will attend. Ask whether each service is delivered on site, especially detoxification, residential care, and medication treatment. Confirm that the program is enrolled with Georgia Medicaid and contracted with your exact Care Management Organization or private insurer. Request a written estimate that identifies housing, clinical, medical, pharmacy, and laboratory charges. Ask what clinical criteria determine the level of care, which medications for opioid or alcohol use disorder are offered, and how co-occurring mental health needs are managed. Finally, ask which provider will handle medications and counseling after discharge.",
      },
    ],
  },
  michigan: {
    intro: "Michigan requires state licenses for substance use disorder service programs and routes much of its public specialty behavioral health care through regional plans. A licensed program may offer only the service categories listed on its record, while Medicaid payment depends on a separate contract and authorization process. Check the site, service, and payer before making a decision.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Michigan Department of Licensing and Regulatory Affairs (LARA), through the Bureau of Community and Health Systems, licenses substance use disorder service programs. State law requires a license before a program can operate, and licenses are renewed annually. Michigan's public license search can be filtered for substance use disorder programs and shows categories such as outpatient, residential, withdrawal management, and methadone services. Search the exact address and compare the listed categories with the provider's offer. A company may have several sites with different licensed services. Individual clinicians may also hold professional licenses, but those credentials do not replace the program license required for the facility or service.",
      },
      {
        heading: "Paying for treatment",
        body: "Michigan Medicaid and the Healthy Michigan Plan cover specialty behavioral health and substance use disorder services through regional Prepaid Inpatient Health Plans, known as PIHPs. The PIHP can explain eligibility, complete or arrange an assessment, and identify contracted providers. Michigan also operates a Substance Use Disorder Health Home benefit in participating counties for eligible Medicaid, Healthy Michigan Plan, and MIChild members who need coordinated recovery and health services. Private insurance members should verify the facility, clinicians, pharmacy, and laboratory separately. Ask whether authorization is required for the recommended level of care and what happens if the payer approves a shorter stay than the program initially recommends.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the LARA substance use disorder program license number and verify the approved service categories at that address. Confirm whether the provider is contracted with your regional PIHP, Medicaid plan, Healthy Michigan Plan, or private insurer. Ask who performs the level-of-care assessment and whether the recommendation can be reviewed if your needs change. Find out which medications for opioid or alcohol use disorder are available and whether outside prescriptions will continue. For residential or withdrawal care, ask what medical staff are present, how emergencies are handled, and which hospital receives transfers. Before discharge, request the name of the provider responsible for ongoing medication, counseling, and recovery support.",
      },
    ],
  },
  "new-jersey": {
    intro: "New Jersey has a statewide directory of licensed addiction treatment services and a public insurance program that covers many levels of care. The directory can narrow a search by service type and, for inpatient care, available beds. Still, a listing does not prove that a program is in network for a particular health plan, so licensing and coverage should be confirmed separately.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Substance use disorder treatment facilities in New Jersey are licensed by the state under standards for residential and outpatient programs. The New Jersey Department of Health licenses and inspects regulated health care facilities, while the Department of Human Services publishes the NJSAMS Treatment Directory of licensed substance use disorder services. The directory includes inpatient and outpatient programs, medication treatment, levels of care, and bed information where available. Search the exact facility and compare its listed services with what the admissions team recommends. Hospitals and primary health care facilities that operate substance use disorder treatment programs may need a separate program license, so a general medical facility license is not enough by itself.",
      },
      {
        heading: "Paying for treatment",
        body: "New Jersey's Medicaid program is NJ FamilyCare. The state reports that Medicaid covers substance use disorder treatment for eligible members and can cover most treatment costs, but the payment path depends on the service and member arrangement. Most NJ FamilyCare benefits are delivered through managed care organizations, and a provider usually must participate in the member's plan network. Some people who need care before full enrollment may be able to apply for temporary Presumptive Eligibility with help from a participating provider. Private insurance members should confirm the exact site, level of care, and billing entities. Ask for written authorization and an estimate of any housing, laboratory, pharmacy, or professional fees billed separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the New Jersey substance use disorder facility license and verify the program in the NJSAMS Treatment Directory. Confirm that the approved level of care matches the proposed treatment and ask whether medication treatment is provided on site. Check network status with your specific NJ FamilyCare managed care organization or private plan, using the facility's legal name and address. Ask who obtains authorization, which services may be billed separately, and how financial assistance works if coverage ends. Find out how co-occurring mental health conditions are treated, what licensed staff are present during evenings and weekends, and who will coordinate medications, counseling, and recovery support after discharge.",
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
// New York:
// - OASAS program certification: https://oasas.ny.gov/providers/program-certification
// - OASAS Provider and Program Search: https://webapps.oasas.ny.gov/providerDirectory/index.cfm
// - NY Medicaid behavioral health managed care: https://www.health.ny.gov/health_care/medicaid/redesign/behavioral_health/
// - Medicaid SUD continuum and covered services: https://www.health.ny.gov/health_care/medicaid/redesign/med_waiver_1115/docs/sud_implement_plan.pdf
// Pennsylvania:
// - DDAP treatment and licensed-facility search: https://www.pa.gov/services/ddap/locate-drug-and-alcohol-treatment-services
// - Pennsylvania Drug and Alcohol Facility Locator: https://sais.health.pa.gov/CommonPOC/Content/PublicWeb/DAFind.aspx
// - DDAP licensing overview: https://www.pa.gov/agencies/ddap
// Ohio:
// - Behavioral health license and certificate types: https://dbh.ohio.gov/supporting-providers/licensure-and-certification/types-of-licenses-and-certificates/
// - Ohio Medicaid behavioral health services: https://medicaid.ohio.gov/resources-for-providers/bh/providers
// Illinois:
// - Illinois SUD license application and Part 2060 requirements: https://www.dhs.state.il.us/onenetlibrary/12/documents/Forms/629617-202605-A11Y_REV2_RE.pdf
// - Illinois Medicaid community behavioral health services: https://hfs.illinois.gov/medicalclients/behavioral/medicaidcommunitybehavioralhealthservices.html
// Washington:
// - Washington Behavioral Health Agency licensing: https://doh.wa.gov/licenses-permits-and-certificates/facilities-z/behavioral-health-agencies-bha
// - Apple Health substance use treatment: https://www.hca.wa.gov/billers-providers-partners/program-information-providers/substance-use-treatment
// - Apple Health managed care: https://www.hca.wa.gov/free-or-low-cost-health-care/i-need-medical-dental-or-vision-care/apple-health-managed-care
// Arizona:
// - Arizona public health licensing and facility databases: https://www.azdhs.gov/licensing/
// - AZ Care Check: https://azcarecheck.azdhs.gov/s/
// - AHCCCS provider directory: https://www.azahcccs.gov/Members/ProgramsAndCoveredServices/ProviderListings/
// North Carolina:
// - DHSR substance use service licensure: https://info.ncdhhs.gov/dhsr/mhlcs/establish.html
// - NC Medicaid behavioral health services: https://medicaid.ncdhhs.gov/providers/programs-and-services/behavioral-health-idd/behavioral-health-and-intellectual-developmental-disabilities-services
// - 2026 NC Medicaid SUD coverage updates: https://medicaid.ncdhhs.gov/blog/2026/01/07/behavioral-health-clinical-coverage-policy-updates
// Georgia:
// - DBHDD licensing authority effective in 2026: https://dbhdd.georgia.gov/be-connected/background-policy-gaps-information
// - Georgia DATEP rules: https://rules.sos.ga.gov/gac/82-10-1
// - Georgia Medicaid behavioral health services: https://medicaid.georgia.gov/types-services/behavioral-health-services
// Michigan:
// - LARA substance use disorder program licensing: https://www.michigan.gov/lara/bureau-list/bchs/non-long-term-care
// - Michigan licensed-provider directories: https://www.michigan.gov/lara/bureau-list/bchs/directory
// - Michigan Medicaid SUD Health Home: https://www.michigan.gov/mdhhs/assistance-programs/medicaid/substance-use-disorder-health-home/persons-served
// New Jersey:
// - NJSAMS licensed-treatment directory: https://www.nj.gov/humanservices/dmhas/help/substance/
// - ReachNJ Medicaid and treatment directory resources: https://www.nj.gov/humanservices/reachnj/resources/
// - NJ FamilyCare coverage: https://www.nj.gov/humanservices/dmahs/individuals-families/familycare/
// - NJ Department of Health facility licensing: https://nj.gov/health/healthfacilities/certificate-need/
