import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  organizationName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(120),
  workEmail: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  website: z.union([z.string().trim().url().max(300), z.literal("")]).optional().default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2),
  relationship: z.string().trim().min(2).max(100),
  notes: z.string().trim().max(2000).optional().default(""),
  companyFax: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  const client = createAdminClient();
  if (!client) return NextResponse.json({ message: "Applications are temporarily unavailable. Please email hello@treatmentlane.com." }, { status: 503 });
  if (parsed.data.companyFax) return NextResponse.json({ ok: true }, { status: 201 });
  const data = parsed.data;
  const { error } = await client.from("provider_submissions").insert({
    organization_name: data.organizationName,
    contact_name: data.contactName,
    work_email: data.workEmail,
    phone: data.phone || null,
    website: data.website || null,
    city: data.city,
    state: data.state.toUpperCase(),
    relationship: data.relationship,
    notes: data.notes || null,
  });
  if (error) return NextResponse.json({ message: "We could not save the application. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
