import { NextResponse } from "next/server";
import { z } from "zod";
import { createProviderSubmission } from "@/lib/db";

const schema = z.object({
  organizationName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(120),
  workEmail: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  website: z.union([z.string().trim().url().max(300), z.literal("")]).optional().default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2),
  relationship: z.string().trim().min(2).max(100),
  requestType: z.enum(["claim-existing", "update-profile", "update-availability", "list-new"]),
  providerPath: z.string().trim().max(300).optional().default(""),
  availabilityStatus: z.enum(["accepting", "waitlist", "not-accepting", "unknown", ""]).optional().default(""),
  estimatedWait: z.string().trim().max(160).optional().default(""),
  admissionsHours: z.string().trim().max(300).optional().default(""),
  insuranceUpdates: z.string().trim().max(1500).optional().default(""),
  costUpdates: z.string().trim().max(1500).optional().default(""),
  profileUpdates: z.string().trim().max(3000).optional().default(""),
  attested: z.preprocess((value) => value === true || value === "true", z.literal(true)),
  notes: z.string().trim().max(2000).optional().default(""),
  companyFax: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  if (parsed.data.companyFax) return NextResponse.json({ ok: true }, { status: 201 });
  const data = parsed.data;
  try {
    const saved = await createProviderSubmission(data);
    if (!saved) return NextResponse.json({ message: "Applications are temporarily unavailable. Please email hello@treatmentlane.com." }, { status: 503 });
  } catch {
    return NextResponse.json({ message: "We could not save the application. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
