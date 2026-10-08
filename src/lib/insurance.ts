export type InsuranceOption = {
  name: string;
  slug: string;
  description: string;
};

export const insuranceOptions: InsuranceOption[] = [
  { name: "Medicaid", slug: "medicaid", description: "State Medicaid coverage and managed Medicaid plans." },
  { name: "Medicare", slug: "medicare", description: "Federal health coverage for eligible adults and people with certain disabilities." },
  { name: "TRICARE", slug: "tricare", description: "Health coverage for eligible service members, retirees, and families." },
  { name: "Aetna", slug: "aetna", description: "Public listings that mention Aetna among their payment options." },
  { name: "Blue Cross Blue Shield", slug: "blue-cross-blue-shield", description: "Public listings that mention a Blue Cross Blue Shield plan." },
  { name: "Cigna", slug: "cigna", description: "Public listings that mention Cigna among their payment options." },
  { name: "UnitedHealthcare", slug: "unitedhealthcare", description: "Public listings that mention UnitedHealthcare among their payment options." },
  { name: "Optum", slug: "optum", description: "Public listings that mention Optum among their payment options." },
  { name: "Humana", slug: "humana", description: "Public listings that mention Humana among their payment options." },
  { name: "Kaiser Permanente", slug: "kaiser-permanente", description: "Public listings that mention Kaiser Permanente among their payment options." },
  { name: "Private insurance", slug: "private-insurance", description: "Programs whose public source data mentions private insurance generally." },
  { name: "Cash or self-pay", slug: "cash-self-pay", description: "Programs whose public source data mentions direct payment or self-pay." },
];

export function getInsuranceOption(slug: string) {
  return insuranceOptions.find((option) => option.slug === slug);
}
