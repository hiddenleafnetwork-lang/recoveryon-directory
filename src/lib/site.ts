export const SITE_NAME = "TreatmentLane";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://treatmentlane.com";
export const SITE_DESCRIPTION =
  "A transparent directory for finding and comparing addiction treatment, recovery, and mental health resources across the United States.";
export const CONTACT_EMAIL = "hello@treatmentlane.com";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
