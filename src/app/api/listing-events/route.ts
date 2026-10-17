import { NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";

const listingEventSchema = z.object({
  providerId: z.string().uuid(),
  eventType: z.enum(["impression", "click"]),
});

export async function POST(request: Request) {
  const parsed = listingEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid listing event" }, { status: 400 });

  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Tracking unavailable" }, { status: 503 });

  try {
    const rows = await sql`insert into listing_events (provider_id, event_type)
      select id, ${parsed.data.eventType}
      from providers
      where id = ${parsed.data.providerId} and publication_status = 'published'
      returning provider_id`;
    if (!rows.length) return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ message: "Tracking unavailable" }, { status: 503 });
  }
}
