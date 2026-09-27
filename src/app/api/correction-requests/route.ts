import { NextResponse } from "next/server";
import { z } from "zod";
import { createCorrectionRequest } from "@/lib/db";

const schema = z.object({
  requesterName: z.string().trim().min(2).max(120),
  requesterEmail: z.string().trim().email().max(200),
  providerSlug: z.string().trim().max(300).optional().default(""),
  details: z.string().trim().min(10).max(3000),
  sourceUrl: z.union([z.string().trim().url().max(500), z.literal("")]).optional().default(""),
  companyFax: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  if (parsed.data.companyFax) return NextResponse.json({ ok: true }, { status: 201 });
  try {
    const saved = await createCorrectionRequest(parsed.data);
    if (!saved) return NextResponse.json({ message: "Corrections are temporarily unavailable. Please email hello@treatmentlane.com." }, { status: 503 });
  } catch {
    return NextResponse.json({ message: "We could not save the correction. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
