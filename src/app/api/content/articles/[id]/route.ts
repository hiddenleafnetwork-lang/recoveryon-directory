import { NextResponse } from "next/server";
import { z } from "zod";
import { isContentApiAuthorized } from "@/lib/articles";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";

const reviewSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("approved"),
    reviewer_name: z.string().trim().min(2).max(120),
    reviewer_credentials: z.string().trim().min(2).max(180),
  }),
  z.object({ status: z.literal("rejected") }),
  z.object({ status: z.literal("published") }),
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isContentApiAuthorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid status update", issues: parsed.error.issues }, { status: 400 });
  const { id } = await params;
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database unavailable" }, { status: 503 });

  if (parsed.data.status === "approved") {
    const rows = await sql`update content_articles set status = 'approved',
      reviewer_name = ${parsed.data.reviewer_name},
      reviewer_credentials = ${parsed.data.reviewer_credentials},
      reviewed_at = now(), updated_at = now()
      where id = ${id} and status = 'needs_medical_review'
      returning id, slug, status, reviewer_name, reviewer_credentials, reviewed_at, scheduled_at`;
    if (!rows[0]) return NextResponse.json({ message: "Article is not awaiting medical review" }, { status: 409 });
    return NextResponse.json({ article: rows[0] });
  }

  if (parsed.data.status === "rejected") {
    const rows = await sql`update content_articles set status = 'rejected', updated_at = now()
      where id = ${id} and status = 'needs_medical_review' returning id, slug, status`;
    if (!rows[0]) return NextResponse.json({ message: "Article is not awaiting medical review" }, { status: 409 });
    return NextResponse.json({ article: rows[0] });
  }

  const rows = await sql`update content_articles set status = 'published',
    published_at = coalesce(published_at, now()), updated_at = now()
    where id = ${id} and status = 'approved'
      and reviewer_name is not null and reviewer_credentials is not null and reviewed_at is not null
      and coalesce(scheduled_at, now()) <= now()
    returning id, slug, status, published_at`;
  if (!rows[0]) return NextResponse.json({ message: "Article is not approved, reviewed, or due" }, { status: 409 });
  return NextResponse.json({ article: rows[0] });
}
