import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactInquiry } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  topic: z.enum(["general", "provider", "partnership", "privacy", "other"]),
  message: z.string().trim().min(10).max(3000),
  companyFax: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  if (parsed.data.companyFax) return NextResponse.json({ ok: true }, { status: 201 });
  try {
    const saved = await createContactInquiry(parsed.data);
    if (!saved) return NextResponse.json({ message: "The form is temporarily unavailable. Please email hello@treatmentlane.com." }, { status: 503 });
  } catch {
    return NextResponse.json({ message: "We could not save your message. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
