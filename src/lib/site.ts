export const SITE_NAME = "TreatmentLane";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://treatmentlane.com";
export const SITE_DESCRIPTION =
  "A transparent directory for finding and comparing addiction treatment, recovery, and mental health resources across the United States.";
export const CONTACT_EMAIL = "hello@treatmentlane.com";
export const LISTING_PLACEHOLDER_PATH = "/images/treatmentlane-listing-placeholder.webp";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function isListingPlaceholder(url: string | null | undefined) {
  if (!url) return false;
  try {
    return new URL(url, SITE_URL).pathname === LISTING_PLACEHOLDER_PATH;
  } catch {
    return false;
  }
}
