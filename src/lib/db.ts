import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

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
  notes: string;
}) {
  const sql = getDatabase();
  if (!sql) return false;
  await sql`insert into provider_submissions
    (organization_name, contact_name, work_email, phone, website, city, state, relationship, notes)
    values (${input.organizationName}, ${input.contactName}, ${input.workEmail}, ${input.phone || null}, ${input.website || null}, ${input.city}, ${input.state.toUpperCase()}, ${input.relationship}, ${input.notes || null})`;
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
  await sql`insert into correction_requests
    (provider_slug, requester_name, requester_email, details, source_url)
    values (${input.providerSlug || null}, ${input.requesterName}, ${input.requesterEmail}, ${input.details}, ${input.sourceUrl || null})`;
  return true;
}

export async function createContactInquiry(input: { name: string; email: string; topic: string; message: string }) {
  const sql = getDatabase();
  if (!sql) return false;
  await sql`insert into contact_inquiries (name, email, topic, message)
    values (${input.name}, ${input.email}, ${input.topic}, ${input.message})`;
  return true;
}
