import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { removeEmDashes } from "@/lib/text";

let client: NeonQueryFunction<false, false> | null | undefined;

export function getDatabase() {
  if (client !== undefined) return client;
  const url = process.env.DATABASE_URL;
  client = url ? neon(url) : null;
  return client;
}

export async function createProviderSubmission(input: {
  organizationName: string;
  contactName: string;
  workEmail: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  relationship: string;
  requestType: "claim-existing" | "update-profile" | "update-availability" | "list-new";
  providerPath: string;
  availabilityStatus: "accepting" | "waitlist" | "not-accepting" | "unknown" | "";
  estimatedWait: string;
  admissionsHours: string;
  insuranceUpdates: string;
  costUpdates: string;
  profileUpdates: string;
  attested: boolean;
  notes: string;
}) {
  const sql = getDatabase();
  if (!sql) return false;
  const clean = removeEmDashes;
  await sql`insert into provider_submissions
    (organization_name, contact_name, work_email, phone, website, city, state, relationship, request_type,
     provider_path, availability_status, estimated_wait, admissions_hours, insurance_updates, cost_updates,
     profile_updates, attested, notes)
    values (${clean(input.organizationName)}, ${clean(input.contactName)}, ${clean(input.workEmail)}, ${clean(input.phone) || null},
      ${clean(input.website) || null}, ${clean(input.city)}, ${clean(input.state).toUpperCase()}, ${clean(input.relationship)},
      ${input.requestType}, ${clean(input.providerPath) || null}, ${input.availabilityStatus || null}, ${clean(input.estimatedWait) || null},
      ${clean(input.admissionsHours) || null}, ${clean(input.insuranceUpdates) || null}, ${clean(input.costUpdates) || null},
      ${clean(input.profileUpdates) || null}, ${input.attested}, ${clean(input.notes) || null})`;
  return true;
}

export async function createCorrectionRequest(input: {
  providerSlug: string;
  requesterName: string;
  requesterEmail: string;
  details: string;
  sourceUrl: string;
}) {
  const sql = getDatabase();
  if (!sql) return false;
  const clean = removeEmDashes;
  await sql`insert into correction_requests
    (provider_slug, requester_name, requester_email, details, source_url)
    values (${clean(input.providerSlug) || null}, ${clean(input.requesterName)}, ${clean(input.requesterEmail)}, ${clean(input.details)}, ${clean(input.sourceUrl) || null})`;
  return true;
}

export async function createContactInquiry(input: { name: string; email: string; topic: string; message: string }) {
  const sql = getDatabase();
  if (!sql) return false;
  const clean = removeEmDashes;
  await sql`insert into contact_inquiries (name, email, topic, message)
    values (${clean(input.name)}, ${clean(input.email)}, ${clean(input.topic)}, ${clean(input.message)})`;
  return true;
}

export async function recordProviderInteraction(providerId: string, eventType: "call" | "email" | "website" | "directions" | "google-maps") {
  const sql = getDatabase();
  if (!sql) return false;
  await sql`insert into provider_interactions (provider_id, event_type) values (${providerId}, ${eventType})`;
  return true;
}
