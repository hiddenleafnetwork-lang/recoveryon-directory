import { NextResponse } from "next/server";
import { z } from "zod";
import { recordProviderInteraction } from "@/lib/db";

const schema = z.object({
  providerId: z.string().uuid(),
  eventType: z.enum(["call", "email", "website", "directions", "google-maps"]),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const saved = await recordProviderInteraction(parsed.data.providerId, parsed.data.eventType);
    return NextResponse.json({ ok: saved }, { status: saved ? 201 : 503 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
